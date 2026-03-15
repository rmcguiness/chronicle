"""
Wars router — serves curated data on history's most significant wars and conflicts.

GET /api/wars          → list all wars (with optional filters)
GET /api/wars/:slug    → single war detail
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/wars", tags=["wars"])


# ── Data model ────────────────────────────────────────────────────────────────

class WarItem(BaseModel):
    slug: str
    name: str
    year_start: int
    year_end: int
    year_display: str
    duration_years: int
    combatants: list[list[str]]  # 2-3 sides, each a list of faction names
    cause: str
    outcome: str
    winner: str
    casualties_estimate: str
    casualties_number: int
    key_battles: list[str]
    turning_point: str
    legacy: str
    era: str  # Ancient / Medieval / Early Modern / Modern / Contemporary
    scale: str  # Skirmish / Regional / Continental / World
    regions: list[str]
    outcome_type: str  # Decisive / Stalemate / Pyrrhic / Inconclusive
    chronicle_query: str
    db_event_count: int = 0
    db_event_slugs: list[str] = []


class WarsResponse(BaseModel):
    wars: list[WarItem]
    total: int
    total_db_events: int = 0


# ── Hardcoded dataset ─────────────────────────────────────────────────────────

WARS: list[WarItem] = [
    WarItem(
        slug="greco-persian-wars",
        name="Greco-Persian Wars",
        year_start=-499,
        year_end=-449,
        year_display="499–449 BCE",
        duration_years=50,
        combatants=[["Greek city-states (Athens, Sparta)"], ["Achaemenid Persian Empire"]],
        cause="Ionian Greek cities revolted against Persian rule, drawing mainland Greece into conflict. Persia sought to punish Athens for supporting the revolt and to conquer all of Greece.",
        outcome="Greek victory; Persian expansion into Europe halted permanently.",
        winner="Greek city-states",
        casualties_estimate="~300,000+",
        casualties_number=300000,
        key_battles=["Marathon (490 BCE)", "Thermopylae (480 BCE)", "Salamis (480 BCE)"],
        turning_point="The naval Battle of Salamis, where Themistocles' strategy destroyed the Persian fleet and ended Xerxes' invasion.",
        legacy="Preserved Greek independence and democracy, enabling the Golden Age of Athens. The battles became foundational myths of Western civilization — Marathon gave us the long-distance race, Thermopylae the legend of the 300 Spartans.",
        era="Ancient",
        scale="Continental",
        regions=["Greece", "Persia", "Mediterranean"],
        outcome_type="Decisive",
        chronicle_query="Greco-Persian Wars",
    ),
    WarItem(
        slug="peloponnesian-war",
        name="Peloponnesian War",
        year_start=-431,
        year_end=-404,
        year_display="431–404 BCE",
        duration_years=27,
        combatants=[["Athens & Delian League"], ["Sparta & Peloponnesian League"]],
        cause="Rising tension between Athens and Sparta over dominance in Greece. Athens' imperial ambitions through the Delian League threatened Spartan hegemony.",
        outcome="Spartan victory; Athens stripped of empire, walls, and fleet.",
        winner="Sparta",
        casualties_estimate="~50,000–80,000 military",
        casualties_number=65000,
        key_battles=["Siege of Syracuse (415–413 BCE)", "Aegospotami (405 BCE)", "Pylos (425 BCE)"],
        turning_point="The disastrous Sicilian Expedition (415–413 BCE), where Athens lost its fleet and best troops trying to conquer Syracuse.",
        legacy="Ended the Golden Age of Athens and weakened all Greek city-states, leaving them vulnerable to Macedon. Thucydides' history of the war became the founding text of political realism and international relations.",
        era="Ancient",
        scale="Regional",
        regions=["Greece", "Sicily", "Mediterranean"],
        outcome_type="Decisive",
        chronicle_query="Peloponnesian War",
    ),
    WarItem(
        slug="punic-wars",
        name="Punic Wars",
        year_start=-264,
        year_end=-146,
        year_display="264–146 BCE",
        duration_years=118,
        combatants=[["Roman Republic"], ["Carthage"]],
        cause="Rome and Carthage clashed over control of Sicily and western Mediterranean trade routes. Neither power could tolerate the other's expansion.",
        outcome="Total Roman victory; Carthage destroyed, salted, and absorbed.",
        winner="Rome",
        casualties_estimate="~1.5 million+",
        casualties_number=1500000,
        key_battles=["Cannae (216 BCE)", "Zama (202 BCE)", "Siege of Carthage (149–146 BCE)"],
        turning_point="Scipio Africanus' victory at Zama (202 BCE), defeating Hannibal on African soil and ending the Second Punic War.",
        legacy="Established Rome as the dominant Mediterranean power. Hannibal's crossing of the Alps remains one of history's greatest military feats. The destruction of Carthage eliminated Rome's only rival and opened the path to empire.",
        era="Ancient",
        scale="Continental",
        regions=["Mediterranean", "North Africa", "Iberia", "Italy"],
        outcome_type="Decisive",
        chronicle_query="Punic Wars",
    ),
    WarItem(
        slug="gallic-wars",
        name="Julius Caesar's Gallic Wars",
        year_start=-58,
        year_end=-50,
        year_display="58–50 BCE",
        duration_years=8,
        combatants=[["Roman Republic (Caesar)"], ["Gallic tribes", "Germanic tribes"]],
        cause="Caesar sought military glory and wealth to advance his political career in Rome. Gallic tribal migrations provided the pretext for intervention.",
        outcome="Roman conquest of all Gaul (modern France, Belgium, parts of Germany).",
        winner="Rome (Caesar)",
        casualties_estimate="~1 million Gauls killed, 1 million enslaved",
        casualties_number=1000000,
        key_battles=["Alesia (52 BCE)", "Bibracte (58 BCE)", "Gergovia (52 BCE)"],
        turning_point="The Siege of Alesia (52 BCE), where Caesar simultaneously besieged Vercingetorix inside and repelled a massive Gallic relief army outside.",
        legacy="Brought Gaul permanently into the Roman world, Romanizing Western Europe. Made Caesar fabulously wealthy and popular, setting the stage for his crossing of the Rubicon and the end of the Roman Republic.",
        era="Ancient",
        scale="Continental",
        regions=["Gaul", "Western Europe", "Germany"],
        outcome_type="Decisive",
        chronicle_query="Gallic Wars Caesar",
    ),
    WarItem(
        slug="roman-civil-wars",
        name="Roman Civil Wars",
        year_start=-49,
        year_end=-31,
        year_display="49–31 BCE",
        duration_years=18,
        combatants=[["Caesar, then Octavian & Mark Antony"], ["Pompey, then Brutus & Cassius"], ["Mark Antony & Cleopatra (later phase)"]],
        cause="The Roman Republic's political system could not contain the ambitions of its most powerful generals. Caesar's crossing of the Rubicon triggered cascading civil wars.",
        outcome="Octavian (Augustus) defeated all rivals and established the Roman Empire.",
        winner="Octavian (Augustus)",
        casualties_estimate="~200,000–500,000",
        casualties_number=350000,
        key_battles=["Pharsalus (48 BCE)", "Philippi (42 BCE)", "Actium (31 BCE)"],
        turning_point="The Battle of Actium (31 BCE), where Octavian's fleet under Agrippa destroyed Antony and Cleopatra's combined forces.",
        legacy="Ended the 500-year Roman Republic and created the Roman Empire under Augustus. Established the template for imperial government that lasted centuries and influenced all subsequent European monarchies.",
        era="Ancient",
        scale="Continental",
        regions=["Roman Republic", "Egypt", "Mediterranean"],
        outcome_type="Decisive",
        chronicle_query="Roman Civil War Caesar",
    ),
    WarItem(
        slug="crusades",
        name="Crusades",
        year_start=1095,
        year_end=1291,
        year_display="1095–1291 CE",
        duration_years=196,
        combatants=[["Christian European kingdoms", "Crusader states"], ["Muslim dynasties (Seljuks, Ayyubids, Mamluks)"]],
        cause="Pope Urban II called for Christian warriors to recapture Jerusalem and the Holy Land from Muslim control. Religious fervor, political ambition, and economic opportunity drove participation.",
        outcome="Ultimately Muslim victory; Crusader states eliminated by 1291.",
        winner="Muslim states",
        casualties_estimate="~1–3 million (all sides)",
        casualties_number=2000000,
        key_battles=["Siege of Jerusalem (1099)", "Hattin (1187)", "Siege of Acre (1189–1191)"],
        turning_point="Saladin's victory at Hattin (1187) and recapture of Jerusalem shattered Crusader military power in the Levant.",
        legacy="Deepened Christian-Muslim tensions that persist today. Introduced Europeans to Arab science, medicine, and trade goods, catalyzing the Renaissance. Created lasting cultural exchange between East and West despite the violence.",
        era="Medieval",
        scale="Continental",
        regions=["Middle East", "Europe", "North Africa"],
        outcome_type="Decisive",
        chronicle_query="Crusades",
    ),
    WarItem(
        slug="mongol-conquests",
        name="Mongol Conquests",
        year_start=1206,
        year_end=1368,
        year_display="1206–1368 CE",
        duration_years=162,
        combatants=[["Mongol Empire (Genghis Khan and successors)"], ["China (Jin, Song)", "Khwarezmia", "Russia", "Persia", "Eastern Europe"]],
        cause="Genghis Khan unified the Mongol tribes and launched campaigns of conquest. Diplomatic insults from the Khwarezmian Empire triggered the devastating western campaigns.",
        outcome="Largest contiguous land empire in history, stretching from Korea to Hungary.",
        winner="Mongol Empire",
        casualties_estimate="~40 million",
        casualties_number=40000000,
        key_battles=["Siege of Baghdad (1258)", "Battle of Mohi (1241)", "Battle of Ain Jalut (1260)"],
        turning_point="The Battle of Ain Jalut (1260), where the Mamluks halted Mongol expansion into Africa — the first major Mongol defeat.",
        legacy="Killed approximately 5% of the world's population. Created the Pax Mongolica that reopened the Silk Road, enabling Marco Polo's journey and East-West exchange. Destroyed the Abbasid Caliphate and reshaped the political map of Eurasia.",
        era="Medieval",
        scale="World",
        regions=["Central Asia", "China", "Middle East", "Eastern Europe", "Persia"],
        outcome_type="Decisive",
        chronicle_query="Mongol Conquests",
    ),
    WarItem(
        slug="hundred-years-war",
        name="Hundred Years' War",
        year_start=1337,
        year_end=1453,
        year_display="1337–1453 CE",
        duration_years=116,
        combatants=[["Kingdom of England"], ["Kingdom of France"]],
        cause="English kings claimed the French throne through dynastic ties. Control of wealthy Aquitaine and Flanders added economic motivation to the dynastic dispute.",
        outcome="French victory; England lost all continental possessions except Calais.",
        winner="France",
        casualties_estimate="~2.5–3.5 million (including famine and plague)",
        casualties_number=3000000,
        key_battles=["Crecy (1346)", "Agincourt (1415)", "Siege of Orleans (1429)"],
        turning_point="Joan of Arc's lifting of the Siege of Orleans (1429), which reversed the war's momentum and revived French morale.",
        legacy="Created distinct English and French national identities. Ended the age of armored knights as longbows and cannon proved decisive. Joan of Arc became France's greatest national hero and a Catholic saint.",
        era="Medieval",
        scale="Continental",
        regions=["France", "England"],
        outcome_type="Decisive",
        chronicle_query="Hundred Years War",
    ),
    WarItem(
        slug="wars-of-the-roses",
        name="Wars of the Roses",
        year_start=1455,
        year_end=1485,
        year_display="1455–1485 CE",
        duration_years=30,
        combatants=[["House of Lancaster (red rose)"], ["House of York (white rose)"]],
        cause="Rival branches of the Plantagenet dynasty competed for the English throne after Henry VI's weak rule. Feudal lords chose sides based on land and power calculations.",
        outcome="Henry Tudor (Lancaster) won and founded the Tudor dynasty.",
        winner="House of Tudor (Lancaster)",
        casualties_estimate="~50,000–100,000",
        casualties_number=75000,
        key_battles=["Towton (1461)", "Bosworth Field (1485)", "Tewkesbury (1471)"],
        turning_point="The Battle of Bosworth Field (1485), where Henry Tudor defeated Richard III — the last English king to die in battle.",
        legacy="Ended the Plantagenet dynasty and established the Tudors, leading to Henry VIII and Elizabeth I. Destroyed the old feudal nobility and strengthened the English monarchy. Shakespeare immortalized the conflict in his history plays.",
        era="Medieval",
        scale="Regional",
        regions=["England"],
        outcome_type="Decisive",
        chronicle_query="Wars of the Roses",
    ),
    WarItem(
        slug="thirty-years-war",
        name="Thirty Years' War",
        year_start=1618,
        year_end=1648,
        year_display="1618–1648 CE",
        duration_years=30,
        combatants=[["Catholic League, Habsburg Empire"], ["Protestant states, Sweden, France"]],
        cause="Religious conflict between Catholics and Protestants in the Holy Roman Empire. The Defenestration of Prague (1618) triggered a war that drew in every major European power.",
        outcome="Peace of Westphalia; redrew the map of Europe and established state sovereignty.",
        winner="No clear winner; France and Sweden gained territory",
        casualties_estimate="~4–8 million (up to 40% of central European population)",
        casualties_number=6000000,
        key_battles=["Battle of White Mountain (1620)", "Battle of Breitenfeld (1631)", "Battle of Rocroi (1643)"],
        turning_point="Sweden's entry under Gustavus Adolphus and his victory at Breitenfeld (1631) turned a Catholic rout into a prolonged continental war.",
        legacy="The Peace of Westphalia (1648) created the modern concept of state sovereignty and non-interference — the foundation of international law. Devastated Germany so severely that recovery took over a century.",
        era="Early Modern",
        scale="Continental",
        regions=["Central Europe", "Germany", "France", "Sweden"],
        outcome_type="Stalemate",
        chronicle_query="Thirty Years War",
    ),
    WarItem(
        slug="english-civil-war",
        name="English Civil War",
        year_start=1642,
        year_end=1651,
        year_display="1642–1651 CE",
        duration_years=9,
        combatants=[["Parliamentarians (Roundheads)"], ["Royalists (Cavaliers)"]],
        cause="King Charles I's attempts to rule without Parliament and impose religious conformity provoked armed resistance. Fundamental disagreements over the limits of royal power could not be resolved peacefully.",
        outcome="Parliamentary victory; Charles I executed, republic established under Cromwell.",
        winner="Parliament / Oliver Cromwell",
        casualties_estimate="~200,000 (England, Scotland, Ireland combined)",
        casualties_number=200000,
        key_battles=["Marston Moor (1644)", "Naseby (1645)", "Battle of Worcester (1651)"],
        turning_point="The Battle of Naseby (1645), where Cromwell's New Model Army decisively defeated the Royalist main force.",
        legacy="Established the principle that monarchs rule by consent, not divine right. The execution of Charles I shocked Europe. Led to constitutional monarchy and influenced the American and French revolutions.",
        era="Early Modern",
        scale="Regional",
        regions=["England", "Scotland", "Ireland"],
        outcome_type="Decisive",
        chronicle_query="English Civil War",
    ),
    WarItem(
        slug="war-of-spanish-succession",
        name="War of Spanish Succession",
        year_start=1701,
        year_end=1714,
        year_display="1701–1714 CE",
        duration_years=13,
        combatants=[["France, Spain (Bourbon)"], ["Grand Alliance (England, Dutch Republic, Austria, HRE)"]],
        cause="Charles II of Spain died without an heir, and both the French Bourbons and Austrian Habsburgs claimed the throne. Europe feared French-Spanish unification would destroy the balance of power.",
        outcome="Treaty of Utrecht; Philip V kept Spain but renounced claim to France.",
        winner="Compromise (Grand Alliance strategic victory)",
        casualties_estimate="~400,000–700,000",
        casualties_number=550000,
        key_battles=["Blenheim (1704)", "Ramillies (1706)", "Malplaquet (1709)"],
        turning_point="Marlborough's crushing victory at Blenheim (1704) saved Vienna and shattered the myth of French military invincibility.",
        legacy="Established the principle of balance of power in European diplomacy. Britain gained Gibraltar, Minorca, and asiento (slave trade rights). Marked France's decline and Britain's rise as a great power.",
        era="Early Modern",
        scale="Continental",
        regions=["Europe", "Spain", "Netherlands", "Americas"],
        outcome_type="Decisive",
        chronicle_query="War of Spanish Succession",
    ),
    WarItem(
        slug="seven-years-war",
        name="Seven Years' War",
        year_start=1756,
        year_end=1763,
        year_display="1756–1763 CE",
        duration_years=7,
        combatants=[["Britain, Prussia, Hanover"], ["France, Austria, Russia, Spain, Sweden"]],
        cause="Colonial rivalry between Britain and France combined with Prussian-Austrian competition for Silesia. Often called the 'first world war' because fighting spanned five continents.",
        outcome="British victory globally; France lost Canada and India.",
        winner="Britain and Prussia",
        casualties_estimate="~900,000–1.4 million",
        casualties_number=1150000,
        key_battles=["Plains of Abraham (1759)", "Rossbach (1757)", "Battle of Plassey (1757)"],
        turning_point="The Battle of the Plains of Abraham (1759), where Wolfe's victory at Quebec decided the fate of North America.",
        legacy="Reshaped the colonial world — Britain became the dominant global power. France's financial ruin from the war contributed directly to the French Revolution. Britain's war debts led to taxes that provoked the American Revolution.",
        era="Early Modern",
        scale="World",
        regions=["Europe", "North America", "India", "Caribbean", "Philippines"],
        outcome_type="Decisive",
        chronicle_query="Seven Years War",
    ),
    WarItem(
        slug="american-revolutionary-war",
        name="American Revolutionary War",
        year_start=1775,
        year_end=1783,
        year_display="1775–1783 CE",
        duration_years=8,
        combatants=[["American colonies, France, Spain"], ["Great Britain"]],
        cause="American colonists resisted British taxation without representation and restrictions on self-governance. Enlightenment ideals of liberty and natural rights provided philosophical justification.",
        outcome="American independence recognized by Treaty of Paris (1783).",
        winner="United States of America",
        casualties_estimate="~37,000 Americans, ~10,000 British killed",
        casualties_number=47000,
        key_battles=["Saratoga (1777)", "Yorktown (1781)", "Bunker Hill (1775)"],
        turning_point="The Battle of Saratoga (1777), which convinced France to enter the war as an American ally, transforming a colonial rebellion into a global conflict.",
        legacy="Created the first modern democratic republic and inspired revolutions worldwide — especially the French Revolution. The Constitution and Bill of Rights became models for democratic governance globally.",
        era="Early Modern",
        scale="Continental",
        regions=["North America", "Atlantic"],
        outcome_type="Decisive",
        chronicle_query="American Revolution",
    ),
    WarItem(
        slug="napoleonic-wars",
        name="Napoleonic Wars",
        year_start=1803,
        year_end=1815,
        year_display="1803–1815 CE",
        duration_years=12,
        combatants=[["French Empire (Napoleon)"], ["Various coalitions (Britain, Russia, Prussia, Austria, Spain)"]],
        cause="Revolutionary France's expansion under Napoleon threatened the European monarchical order. Britain's refusal to accept French dominance and Napoleon's continental ambitions drove continuous warfare.",
        outcome="Napoleon defeated and exiled; Congress of Vienna restored European order.",
        winner="Seventh Coalition (Britain, Prussia, Russia, Austria)",
        casualties_estimate="~3.5–6 million",
        casualties_number=5000000,
        key_battles=["Austerlitz (1805)", "Borodino (1812)", "Waterloo (1815)"],
        turning_point="Napoleon's disastrous invasion of Russia (1812), where the Grande Armee of 600,000 was reduced to fewer than 100,000 by winter, scorched earth, and Russian resistance.",
        legacy="Spread Napoleonic Code, nationalism, and revolutionary ideals across Europe. The Congress of Vienna created a century of relative peace. Napoleon's legacy shaped modern warfare, civil law, and the concept of meritocracy.",
        era="Modern",
        scale="World",
        regions=["Europe", "Russia", "Egypt", "Caribbean"],
        outcome_type="Decisive",
        chronicle_query="Napoleonic Wars",
    ),
    WarItem(
        slug="american-civil-war",
        name="American Civil War",
        year_start=1861,
        year_end=1865,
        year_display="1861–1865 CE",
        duration_years=4,
        combatants=[["Union (Northern states)"], ["Confederacy (Southern states)"]],
        cause="Slavery was the central cause — Southern states seceded to protect the institution after Lincoln's election. Fundamental disagreements over states' rights and the nature of the federal union had festered for decades.",
        outcome="Union victory; slavery abolished, secession denied.",
        winner="United States (Union)",
        casualties_estimate="~620,000–750,000 military dead",
        casualties_number=700000,
        key_battles=["Gettysburg (1863)", "Antietam (1862)", "Vicksburg (1863)"],
        turning_point="The Battle of Gettysburg (July 1863), Lee's failed invasion of the North, combined with the fall of Vicksburg, which split the Confederacy in two.",
        legacy="Ended slavery in the United States and established federal supremacy over states. The 13th, 14th, and 15th Amendments redefined American citizenship. The deadliest conflict in American history, its wounds shaped race relations for generations.",
        era="Modern",
        scale="Regional",
        regions=["United States"],
        outcome_type="Decisive",
        chronicle_query="American Civil War",
    ),
    WarItem(
        slug="franco-prussian-war",
        name="Franco-Prussian War",
        year_start=1870,
        year_end=1871,
        year_display="1870–1871 CE",
        duration_years=1,
        combatants=[["Prussia & German states"], ["French Empire (Napoleon III)"]],
        cause="Bismarck manipulated the Ems Dispatch to provoke France into declaring war, providing the catalyst for German unification. French fears of Prussian power and the Spanish succession crisis heightened tensions.",
        outcome="Prussian victory; German Empire proclaimed, France lost Alsace-Lorraine.",
        winner="Prussia / German Empire",
        casualties_estimate="~180,000–250,000",
        casualties_number=215000,
        key_battles=["Sedan (1870)", "Siege of Paris (1870–1871)", "Metz (1870)"],
        turning_point="The Battle of Sedan (1870), where Napoleon III and 100,000 French soldiers were captured, ending the Second French Empire.",
        legacy="Created a unified German Empire, fundamentally altering Europe's balance of power. French humiliation and the loss of Alsace-Lorraine created a desire for revenge that directly contributed to World War I.",
        era="Modern",
        scale="Regional",
        regions=["France", "Germany"],
        outcome_type="Decisive",
        chronicle_query="Franco-Prussian War",
    ),
    WarItem(
        slug="spanish-american-war",
        name="Spanish-American War",
        year_start=1898,
        year_end=1898,
        year_display="1898 CE",
        duration_years=1,
        combatants=[["United States"], ["Spanish Empire"]],
        cause="American sympathy for Cuban independence and the mysterious explosion of USS Maine in Havana harbor. Yellow journalism by Hearst and Pulitzer inflamed public opinion for war.",
        outcome="American victory; Spain ceded Cuba, Puerto Rico, Guam, and the Philippines.",
        winner="United States",
        casualties_estimate="~60,000 (mostly disease)",
        casualties_number=60000,
        key_battles=["Manila Bay (1898)", "San Juan Hill (1898)", "Santiago de Cuba (1898)"],
        turning_point="Dewey's destruction of the Spanish fleet at Manila Bay in a single morning demonstrated American naval power and determined the Philippines' fate.",
        legacy="Ended the Spanish Empire and established the United States as a global colonial power. Launched Theodore Roosevelt's political career. Raised lasting questions about American imperialism, particularly in the Philippines.",
        era="Modern",
        scale="Continental",
        regions=["Caribbean", "Philippines", "Pacific"],
        outcome_type="Decisive",
        chronicle_query="Spanish-American War",
    ),
    WarItem(
        slug="world-war-i",
        name="World War I",
        year_start=1914,
        year_end=1918,
        year_display="1914–1918 CE",
        duration_years=4,
        combatants=[["Allied Powers (France, Britain, Russia, US)"], ["Central Powers (Germany, Austria-Hungary, Ottoman Empire)"]],
        cause="A web of alliances, militarism, imperialism, and nationalism turned the assassination of Archduke Franz Ferdinand into a continental war. Germany's Schlieffen Plan and the arms race made escalation nearly automatic.",
        outcome="Allied victory; Germany, Austria-Hungary, and Ottoman Empire collapsed.",
        winner="Allied Powers",
        casualties_estimate="~20 million dead (9.7M military, 10M civilian)",
        casualties_number=20000000,
        key_battles=["Somme (1916)", "Verdun (1916)", "Gallipoli (1915–1916)"],
        turning_point="American entry in 1917 tipped the balance, providing fresh troops and resources when both sides were exhausted after three years of trench warfare.",
        legacy="Destroyed four empires (German, Austro-Hungarian, Ottoman, Russian). Created the conditions for WWII, the Russian Revolution, and the modern Middle East. Introduced total war, poison gas, tanks, and aerial bombing.",
        era="Modern",
        scale="World",
        regions=["Europe", "Middle East", "Africa", "Atlantic", "Pacific"],
        outcome_type="Decisive",
        chronicle_query="World War I",
    ),
    WarItem(
        slug="russian-civil-war",
        name="Russian Civil War",
        year_start=1917,
        year_end=1922,
        year_display="1917–1922 CE",
        duration_years=5,
        combatants=[["Bolsheviks (Red Army)"], ["White Army (monarchists, democrats, nationalists)"], ["Foreign interventionists (UK, France, US, Japan)"]],
        cause="The Bolshevik Revolution overthrew the Provisional Government, sparking armed resistance from monarchists, democrats, and foreign powers who feared communist expansion.",
        outcome="Bolshevik victory; USSR established in 1922.",
        winner="Bolsheviks (Red Army)",
        casualties_estimate="~7–12 million (including famine and disease)",
        casualties_number=9000000,
        key_battles=["Battle of Tsaritsyn (1918)", "Siege of Perekop (1920)", "Kronstadt Rebellion (1921)"],
        turning_point="Trotsky's reorganization of the Red Army and the failure of White forces to coordinate, combined with Allied withdrawal, sealed the Bolshevik victory.",
        legacy="Created the Soviet Union, establishing the first communist state and setting the stage for the Cold War. The brutality of the war normalized political violence and one-party rule that characterized the USSR for seven decades.",
        era="Modern",
        scale="Continental",
        regions=["Russia", "Ukraine", "Central Asia", "Siberia"],
        outcome_type="Decisive",
        chronicle_query="Russian Civil War",
    ),
    WarItem(
        slug="world-war-ii",
        name="World War II",
        year_start=1939,
        year_end=1945,
        year_display="1939–1945 CE",
        duration_years=6,
        combatants=[["Allies (US, UK, USSR, China, France)"], ["Axis Powers (Germany, Japan, Italy)"]],
        cause="Nazi Germany's territorial expansion and Japan's imperial ambitions in Asia. The failure of appeasement at Munich (1938) and Hitler's invasion of Poland triggered the war in Europe.",
        outcome="Allied victory; Germany and Japan unconditionally surrendered.",
        winner="Allied Powers",
        casualties_estimate="~70–85 million dead (deadliest conflict in history)",
        casualties_number=75000000,
        key_battles=["Stalingrad (1942–1943)", "D-Day / Normandy (1944)", "Midway (1942)"],
        turning_point="The Battle of Stalingrad (1942–43), where the destruction of the German 6th Army marked the turning of the tide on the Eastern Front, which decided the war in Europe.",
        legacy="Created the modern world order: United Nations, NATO, the Cold War, decolonization. The Holocaust murdered 6 million Jews and millions of others, leading to the creation of Israel and international human rights law. Nuclear weapons changed warfare forever.",
        era="Contemporary",
        scale="World",
        regions=["Europe", "Pacific", "North Africa", "Southeast Asia", "Atlantic"],
        outcome_type="Decisive",
        chronicle_query="World War II",
    ),
    WarItem(
        slug="korean-war",
        name="Korean War",
        year_start=1950,
        year_end=1953,
        year_display="1950–1953 CE",
        duration_years=3,
        combatants=[["South Korea, United States, UN forces"], ["North Korea, China, USSR support"]],
        cause="North Korea invaded South Korea to reunify the peninsula under communism. The Cold War context made it a proxy war between the US-led Western bloc and the Soviet-Chinese communist bloc.",
        outcome="Armistice (no peace treaty); Korea remains divided at the 38th parallel.",
        winner="Stalemate",
        casualties_estimate="~2.5–3 million (including civilians)",
        casualties_number=2750000,
        key_battles=["Inchon Landing (1950)", "Chosin Reservoir (1950)", "Battle of Pusan Perimeter (1950)"],
        turning_point="China's massive intervention in November 1950 pushed UN forces back from the Yalu River and transformed a near-victory into a grueling stalemate.",
        legacy="Established the pattern for Cold War proxy conflicts. The Korean DMZ remains the most heavily fortified border on Earth. South Korea's subsequent economic miracle contrasts sharply with North Korea's isolation.",
        era="Contemporary",
        scale="Regional",
        regions=["Korean Peninsula", "East Asia"],
        outcome_type="Stalemate",
        chronicle_query="Korean War",
    ),
    WarItem(
        slug="vietnam-war",
        name="Vietnam War",
        year_start=1955,
        year_end=1975,
        year_display="1955–1975 CE",
        duration_years=20,
        combatants=[["North Vietnam, Viet Cong"], ["South Vietnam, United States"]],
        cause="Cold War containment doctrine drove American involvement in preventing communist unification of Vietnam. Ho Chi Minh's nationalist movement sought independence and reunification under communist rule.",
        outcome="North Vietnamese victory; Vietnam reunified under communist rule.",
        winner="North Vietnam",
        casualties_estimate="~1.3–3.4 million (including civilians)",
        casualties_number=2400000,
        key_battles=["Tet Offensive (1968)", "Siege of Khe Sanh (1968)", "Fall of Saigon (1975)"],
        turning_point="The Tet Offensive (January 1968), which was a military defeat for North Vietnam but a political turning point that shattered American public support for the war.",
        legacy="Divided American society and shattered confidence in government ('credibility gap'). Demonstrated the limits of conventional military power against guerrilla warfare. Influenced US foreign policy for decades ('Vietnam Syndrome').",
        era="Contemporary",
        scale="Regional",
        regions=["Vietnam", "Southeast Asia", "Laos", "Cambodia"],
        outcome_type="Decisive",
        chronicle_query="Vietnam War",
    ),
    WarItem(
        slug="gulf-war",
        name="Gulf War",
        year_start=1990,
        year_end=1991,
        year_display="1990–1991 CE",
        duration_years=1,
        combatants=[["US-led coalition (34 nations)"], ["Iraq (Saddam Hussein)"]],
        cause="Iraq invaded and annexed Kuwait for its oil wealth and to resolve debt disputes. The international community, led by the US, assembled the largest coalition since WWII to reverse the invasion.",
        outcome="Coalition victory; Kuwait liberated, Iraq expelled.",
        winner="US-led Coalition",
        casualties_estimate="~25,000–50,000 Iraqi military; ~292 coalition dead",
        casualties_number=35000,
        key_battles=["Battle of 73 Easting (1991)", "Battle of Khafji (1991)", "Highway of Death (1991)"],
        turning_point="The 100-hour ground offensive that routed the Iraqi army in four days, demonstrating overwhelming technological superiority.",
        legacy="Demonstrated the effectiveness of precision-guided weapons and coalition warfare. Established US military dominance in the post-Cold War era. Left Saddam Hussein in power, leading to continued tensions and the 2003 Iraq War.",
        era="Contemporary",
        scale="Regional",
        regions=["Middle East", "Kuwait", "Iraq"],
        outcome_type="Decisive",
        chronicle_query="Gulf War",
    ),
    WarItem(
        slug="war-in-afghanistan",
        name="War in Afghanistan",
        year_start=2001,
        year_end=2021,
        year_display="2001–2021 CE",
        duration_years=20,
        combatants=[["United States, NATO, Afghan government"], ["Taliban, al-Qaeda"]],
        cause="The 9/11 attacks on the United States prompted the invasion to destroy al-Qaeda and overthrow the Taliban government that harbored them. The mission expanded into nation-building.",
        outcome="Taliban returned to power after US withdrawal in August 2021.",
        winner="Taliban",
        casualties_estimate="~176,000+ (including 47,000+ civilians)",
        casualties_number=176000,
        key_battles=["Battle of Tora Bora (2001)", "Operation Anaconda (2002)", "Battle of Marjah (2010)"],
        turning_point="The killing of Osama bin Laden (2011) achieved the original mission objective but did not end the war, revealing the disconnect between the counterterrorism and nation-building goals.",
        legacy="America's longest war ended with the Taliban's return to power, raising profound questions about military intervention and nation-building. The chaotic withdrawal from Kabul in August 2021 marked the end of the post-9/11 era.",
        era="Contemporary",
        scale="Regional",
        regions=["Afghanistan", "Pakistan", "Central Asia"],
        outcome_type="Decisive",
        chronicle_query="War in Afghanistan",
    ),
]


# ── DB event matching ────────────────────────────────────────────────────────

WAR_SEARCH_TERMS: dict[str, list[str]] = {
    "greco-persian-wars": ["persian wars", "greco-persian", "thermopylae", "marathon 490", "salamis 480"],
    "peloponnesian-war": ["peloponnesian war", "peloponnesian"],
    "punic-wars": ["punic war", "hannibal", "carthage"],
    "gallic-wars": ["gallic war", "caesar gaul"],
    "roman-civil-wars": ["roman civil war", "caesar rubicon", "battle of actium"],
    "crusades": ["crusade", "crusades"],
    "mongol-conquests": ["mongol conquest", "genghis khan", "mongol invasion"],
    "hundred-years-war": ["hundred years war", "agincourt", "joan of arc"],
    "wars-of-the-roses": ["wars of the roses", "bosworth field"],
    "thirty-years-war": ["thirty years war", "peace of westphalia"],
    "english-civil-war": ["english civil war", "cromwell"],
    "war-of-spanish-succession": ["spanish succession", "blenheim"],
    "seven-years-war": ["seven years war", "plains of abraham"],
    "american-revolutionary-war": ["american revolution", "revolutionary war"],
    "napoleonic-wars": ["napoleonic", "waterloo", "napoleon"],
    "american-civil-war": ["american civil war", "gettysburg", "civil war 186"],
    "franco-prussian-war": ["franco-prussian", "sedan 1870"],
    "spanish-american-war": ["spanish-american war", "uss maine"],
    "world-war-i": ["world war i", "wwi", "world war one", "great war"],
    "russian-civil-war": ["russian civil war", "bolshevik"],
    "world-war-ii": ["world war ii", "wwii", "world war two"],
    "korean-war": ["korean war"],
    "vietnam-war": ["vietnam war"],
    "gulf-war": ["gulf war", "desert storm"],
    "war-in-afghanistan": ["war in afghanistan", "afghanistan war"],
}


async def _match_db_events(db: AsyncSession) -> dict[str, list[str]]:
    """Query DB for war-related events and match to hardcoded wars."""
    conditions = []
    for terms in WAR_SEARCH_TERMS.values():
        for term in terms:
            conditions.append(Event.title.ilike(f"%{term}%"))

    q = (
        select(Event.slug, Event.title, Event.year_approx)
        .where(Event.review_status == "approved")
        .where(or_(*conditions))
        .order_by(Event.year_approx.asc().nullsfirst())
    )
    rows = (await db.execute(q)).all()

    war_to_slugs: dict[str, list[str]] = {}
    war_items_by_slug = {w.slug: w for w in WARS}

    for wid, terms in WAR_SEARCH_TERMS.items():
        matched = []
        w_data = war_items_by_slug.get(wid)
        for row in rows:
            title_lower = row.title.lower()
            if any(term in title_lower for term in terms):
                matched.append(row.slug)
            elif (
                w_data
                and row.year_approx is not None
                and w_data.year_start <= row.year_approx <= w_data.year_end
                and any(
                    kw in title_lower
                    for kw in [
                        "war", "battle", "siege", "invasion", "campaign",
                        "treaty", "armistice", "offensive",
                    ]
                )
            ):
                matched.append(row.slug)
        war_to_slugs[wid] = list(set(matched))

    return war_to_slugs


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("", response_model=WarsResponse)
async def list_wars(
    db: AsyncSession = Depends(get_db),
    era: Optional[str] = Query(None, description="Filter by era (Ancient, Medieval, etc.)"),
    scale: Optional[str] = Query(None, description="Filter by scale (Skirmish, Regional, Continental, World)"),
    region: Optional[str] = Query(None, description="Filter by region"),
    outcome_type: Optional[str] = Query(None, description="Filter by outcome type (Decisive, Stalemate)"),
    sort: Optional[str] = Query("chronological", description="Sort: chronological, casualties, duration"),
):
    try:
        db_matches = await _match_db_events(db)
    except Exception:
        db_matches = {}

    total_db = len(set(s for slugs in db_matches.values() for s in slugs))

    enriched = []
    for w in WARS:
        slugs = db_matches.get(w.slug, [])
        item = w.model_copy(update={"db_event_count": len(slugs), "db_event_slugs": slugs})
        enriched.append(item)

    filtered = enriched

    if era:
        filtered = [w for w in filtered if w.era.lower() == era.lower()]
    if scale:
        filtered = [w for w in filtered if w.scale.lower() == scale.lower()]
    if region:
        region_lower = region.lower()
        filtered = [w for w in filtered if any(region_lower in r.lower() for r in w.regions)]
    if outcome_type:
        filtered = [w for w in filtered if w.outcome_type.lower() == outcome_type.lower()]

    if sort == "casualties":
        filtered = sorted(filtered, key=lambda w: w.casualties_number, reverse=True)
    elif sort == "duration":
        filtered = sorted(filtered, key=lambda w: w.duration_years, reverse=True)
    elif sort == "chronological":
        filtered = sorted(filtered, key=lambda w: w.year_start)

    return WarsResponse(wars=filtered, total=len(filtered), total_db_events=total_db)


@router.get("/{slug}")
async def get_war(slug: str, db: AsyncSession = Depends(get_db)):
    try:
        db_matches = await _match_db_events(db)
    except Exception:
        db_matches = {}

    for w in WARS:
        if w.slug == slug:
            slugs = db_matches.get(w.slug, [])
            return w.model_copy(update={"db_event_count": len(slugs), "db_event_slugs": slugs})
    return {"error": "War not found"}
