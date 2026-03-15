/**
 * ClimatePage — When Nature Changed History.
 *
 * Route: /climate
 *
 * Sections:
 *  1. Hero — title and intro
 *  2. Temperature timeline — rough global temp SVG
 *  3. Filters — by event type and era
 *  4. Climate event cards — 25+ major events
 *  5. Climate & Collapse — civilizations that fell to climate
 *  6. Quote / framing section
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ClimateType = 'drought' | 'volcanic' | 'cooling' | 'warming' | 'storm' | 'disease_vector' | 'multi';
type Severity = 'local' | 'regional' | 'global';
type Era = 'prehistoric' | 'ancient' | 'medieval' | 'early modern' | 'modern';

interface ClimateEvent {
  id: number;
  name: string;
  datePeriod: string;
  startYear: number;
  endYear: number;
  type: ClimateType;
  severity: Severity;
  civilizationsAffected: string[];
  estimatedImpact: string;
  consequence: string;
  description: string;
  era: Era;
  searchQuery: string;
}

interface CollapseCase {
  civilization: string;
  period: string;
  climateDriver: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — 27 climate/environmental events
// ─────────────────────────────────────────────────────────────────────────────

const CLIMATE_EVENTS: ClimateEvent[] = [
  {
    id: 1,
    name: 'Younger Dryas',
    datePeriod: '10,900–9,700 BCE',
    startYear: -10900,
    endYear: -9700,
    type: 'cooling',
    severity: 'global',
    civilizationsAffected: ['Natufian culture', 'Clovis people', 'Late Paleolithic societies'],
    estimatedImpact: 'Global cooling of ~7\u00b0C in decades; mass extinction of megafauna',
    consequence: 'Forced transition from hunter-gathering to agriculture in the Fertile Crescent — the birth of civilization itself.',
    description:
      'A sudden return to glacial conditions lasting 1,200 years, possibly triggered by a meltwater pulse disrupting Atlantic circulation. Global temperatures plummeted, forests retreated, and megafauna went extinct. The survivors who adapted by cultivating wild grains invented farming.',
    era: 'prehistoric',
    searchQuery: 'Younger Dryas',
  },
  {
    id: 2,
    name: '8.2 Kiloyear Event',
    datePeriod: '~6,200 BCE',
    startYear: -6200,
    endYear: -6050,
    type: 'cooling',
    severity: 'global',
    civilizationsAffected: ['Early Neolithic communities', 'Mesopotamian settlers'],
    estimatedImpact: 'Global cooling of ~3\u00b0C for ~150 years',
    consequence: 'May have accelerated adoption of agriculture and permanent settlements in the Near East.',
    description:
      'A rapid cold snap caused by the catastrophic drainage of glacial Lakes Agassiz and Ojibway into the North Atlantic, disrupting thermohaline circulation. Drought struck the Middle East while cold gripped Europe.',
    era: 'prehistoric',
    searchQuery: '8.2 kiloyear event',
  },
  {
    id: 3,
    name: '5.9 Kiloyear Event',
    datePeriod: '~3,900 BCE',
    startYear: -3900,
    endYear: -3500,
    type: 'drought',
    severity: 'regional',
    civilizationsAffected: ['Saharan pastoralists', 'Early Egyptians', 'Mesopotamians'],
    estimatedImpact: 'Desertification of the Sahara; mass migration to river valleys',
    consequence: 'Populations concentrated along the Nile and Tigris-Euphrates, catalyzing the rise of Egyptian and Sumerian civilizations.',
    description:
      'Intense aridification turned the once-green Sahara into desert. Pastoralists who had thrived in a lush savanna were forced to migrate to river valleys, concentrating populations and resources in ways that demanded organized governance.',
    era: 'ancient',
    searchQuery: 'Sahara desertification',
  },
  {
    id: 4,
    name: '4.2 Kiloyear Event',
    datePeriod: '~2,200 BCE',
    startYear: -2200,
    endYear: -1900,
    type: 'drought',
    severity: 'global',
    civilizationsAffected: ['Akkadian Empire', 'Old Kingdom Egypt', 'Indus Valley (Harappan)', 'Early Chinese dynasties'],
    estimatedImpact: 'Collapse of multiple Bronze Age civilizations simultaneously',
    consequence: 'Toppled the Akkadian Empire and ended Old Kingdom Egypt. First documented simultaneous multi-civilization collapse.',
    description:
      'A global megadrought lasting ~300 years devastated agriculture across an arc from Egypt to India. The Akkadian Empire — the world\'s first empire — collapsed as its grain belt turned to dust. Egypt fractured into the chaotic First Intermediate Period.',
    era: 'ancient',
    searchQuery: '4.2 kiloyear event Akkadian collapse',
  },
  {
    id: 5,
    name: 'Minoan Eruption of Thera',
    datePeriod: '~1,600 BCE',
    startYear: -1628,
    endYear: -1600,
    type: 'volcanic',
    severity: 'regional',
    civilizationsAffected: ['Minoan civilization', 'Egyptian New Kingdom', 'Aegean Bronze Age cultures'],
    estimatedImpact: 'VEI 7 eruption; tsunami devastated Crete; volcanic winter affected crops globally',
    consequence: 'Weakened Minoan civilization fatally, enabling Mycenaean takeover of the Aegean. May have inspired the Atlantis legend.',
    description:
      'One of the largest volcanic eruptions in recorded history destroyed the island of Thera (Santorini) and generated massive tsunamis. The volcanic winter disrupted agriculture across the Eastern Mediterranean, and the Minoan civilization on Crete — Europe\'s first great civilization — never recovered.',
    era: 'ancient',
    searchQuery: 'Thera eruption Minoan',
  },
  {
    id: 6,
    name: 'Late Bronze Age Drought',
    datePeriod: '1,200–1,150 BCE',
    startYear: -1200,
    endYear: -1150,
    type: 'drought',
    severity: 'global',
    civilizationsAffected: ['Mycenaean Greece', 'Hittite Empire', 'Egyptian New Kingdom', 'Ugarit', 'Kassite Babylonia', 'Assyria', 'Cyprus', 'Canaan'],
    estimatedImpact: 'Collapse of 8+ civilizations simultaneously; centuries of dark age',
    consequence: 'The Bronze Age Collapse — the most catastrophic societal failure in ancient history. Ended the interconnected palace economies.',
    description:
      'A megadrought spanning the Eastern Mediterranean coincided with the mysterious "Sea Peoples" invasions. Trade networks collapsed, cities burned, and writing systems were lost. The interconnected Bronze Age world fell into a dark age lasting centuries.',
    era: 'ancient',
    searchQuery: 'Bronze Age collapse',
  },
  {
    id: 7,
    name: 'Roman Climatic Optimum',
    datePeriod: '250 BCE – 400 CE',
    startYear: -250,
    endYear: 400,
    type: 'warming',
    severity: 'regional',
    civilizationsAffected: ['Roman Republic/Empire', 'Han Dynasty', 'Parthian Empire'],
    estimatedImpact: 'Warm, stable climate enabled agricultural surplus across Mediterranean',
    consequence: 'Enabled Rome\'s expansion and sustained its enormous population. When it ended, the empire\'s agricultural base weakened.',
    description:
      'A period of unusually warm, stable climate across the Mediterranean and Europe. Higher temperatures extended growing seasons, boosted grain yields in North Africa and Gaul, and made Alpine passes more traversable. This climatic sweet spot undergirded Rome\'s demographic and military expansion.',
    era: 'ancient',
    searchQuery: 'Roman Warm Period',
  },
  {
    id: 8,
    name: 'Han Dynasty Droughts',
    datePeriod: '~180–220 CE',
    startYear: 180,
    endYear: 220,
    type: 'drought',
    severity: 'regional',
    civilizationsAffected: ['Han Dynasty China'],
    estimatedImpact: 'Widespread famine; millions displaced; massive peasant uprisings',
    consequence: 'Famines fueled the Yellow Turban Rebellion (184 CE), which fatally weakened the Han Dynasty and led to the Three Kingdoms period.',
    description:
      'Severe droughts and floods devastated Chinese agriculture in the late 2nd century CE. Starving peasants flocked to millenarian Daoist movements, culminating in the Yellow Turban Rebellion — a massive uprising that the Han government could suppress only by empowering regional warlords who then tore the empire apart.',
    era: 'ancient',
    searchQuery: 'Yellow Turban Rebellion Han Dynasty',
  },
  {
    id: 9,
    name: 'Late Antique Little Ice Age',
    datePeriod: '536–660 CE',
    startYear: 536,
    endYear: 660,
    type: 'volcanic',
    severity: 'global',
    civilizationsAffected: ['Byzantine Empire', 'Sasanian Persia', 'Mesoamerican civilizations', 'European kingdoms'],
    estimatedImpact: '536 CE: coldest decade in 2,000 years; crop failures across Eurasia; plague killed ~25–50 million',
    consequence: 'Triggered the Plague of Justinian (541 CE), ended Justinian\'s dream of restoring Rome, and weakened both Byzantium and Persia for the Arab conquests.',
    description:
      'In 536 CE, a massive volcanic eruption (possibly in Iceland or El Salvador) cast a dust veil across the Northern Hemisphere. "The sun gave no more light than the moon," wrote Procopius. Temperatures dropped, crops failed, and the weakened populations were devastated by the Plague of Justinian — the first recorded bubonic plague pandemic.',
    era: 'medieval',
    searchQuery: 'year 536 volcanic winter',
  },
  {
    id: 10,
    name: 'Medieval Warm Period',
    datePeriod: '950–1250 CE',
    startYear: 950,
    endYear: 1250,
    type: 'warming',
    severity: 'global',
    civilizationsAffected: ['Norse/Viking', 'Medieval Europe', 'Song Dynasty China', 'Ancestral Puebloans'],
    estimatedImpact: 'Warmer temperatures; longer growing seasons; expanded arable land',
    consequence: 'Enabled Norse colonization of Greenland and Vinland, European population boom, and cathedral-building age.',
    description:
      'A period of unusually warm climate, especially in the North Atlantic region. Vikings established colonies in Greenland and reached North America. European agriculture expanded northward, population doubled, and the great cathedrals were funded by agricultural surplus. In the American Southwest, the Ancestral Puebloans built elaborate cliff dwellings.',
    era: 'medieval',
    searchQuery: 'Medieval Warm Period',
  },
  {
    id: 11,
    name: 'Great Famine of 1315–1317',
    datePeriod: '1315–1317 CE',
    startYear: 1315,
    endYear: 1317,
    type: 'storm',
    severity: 'regional',
    civilizationsAffected: ['Medieval Europe'],
    estimatedImpact: '~10–25% of population in affected areas died; millions of deaths',
    consequence: 'Weakened European populations and set the stage for the catastrophic Black Death 30 years later.',
    description:
      'Torrential rains across Europe for two consecutive years destroyed harvests and drowned livestock. Grain prices rose 800%. Desperate populations ate dogs, cats, and reportedly resorted to cannibalism. The famine ended centuries of population growth and exposed the fragility of medieval agriculture.',
    era: 'medieval',
    searchQuery: 'Great Famine 1315',
  },
  {
    id: 12,
    name: 'Black Death Weather Connection',
    datePeriod: '1340s',
    startYear: 1340,
    endYear: 1353,
    type: 'disease_vector',
    severity: 'global',
    civilizationsAffected: ['Medieval Europe', 'Islamic world', 'Central Asia', 'China'],
    estimatedImpact: '~75–200 million deaths worldwide; killed 30–60% of European population',
    consequence: 'Reshaped European society: labor shortages ended serfdom, wages rose, and the seeds of the Renaissance were planted.',
    description:
      'Climate anomalies in Central Asia — wet conditions that boosted rodent populations followed by drought that drove them into human settlements — likely amplified the spread of Yersinia pestis. The preceding Great Famine had already weakened European immune systems, making the plague\'s devastation even worse.',
    era: 'medieval',
    searchQuery: 'Black Death plague',
  },
  {
    id: 13,
    name: 'Little Ice Age',
    datePeriod: '1300–1850 CE',
    startYear: 1300,
    endYear: 1850,
    type: 'cooling',
    severity: 'global',
    civilizationsAffected: ['Global — Europe, Asia, Americas'],
    estimatedImpact: 'Global cooling of ~1\u00b0C; repeated crop failures; glacial advance',
    consequence: 'Crop failures fueled witch trials, peasant revolts, and the French Revolution. Norse Greenland colonies perished.',
    description:
      'A prolonged cold period marked by advancing glaciers, harsh winters, and shortened growing seasons. The Thames and canals of the Netherlands froze regularly. Crop failures triggered famines, social unrest, and scapegoating — thousands were burned as "witches" blamed for bad harvests. The Norse colonies in Greenland starved and vanished.',
    era: 'early modern',
    searchQuery: 'Little Ice Age',
  },
  {
    id: 14,
    name: 'Drought & Fall of the Maya',
    datePeriod: '800–1000 CE',
    startYear: 800,
    endYear: 1000,
    type: 'drought',
    severity: 'regional',
    civilizationsAffected: ['Classic Maya civilization'],
    estimatedImpact: '90–95% population decline in southern lowlands',
    consequence: 'Collapse of Classic Maya civilization. Cities like Tikal, Copan, and Palenque were abandoned to the jungle.',
    description:
      'A series of intense, multi-decade droughts struck the Yucat\u00e1n Peninsula at the worst possible time — when Maya cities were at peak population and had deforested surrounding lands. Without tree cover, rainfall declined further in a vicious feedback loop. The great cities emptied over a century.',
    era: 'medieval',
    searchQuery: 'Maya collapse drought',
  },
  {
    id: 15,
    name: 'Mongol Invasions & Reforestation',
    datePeriod: '1206–1380 CE',
    startYear: 1206,
    endYear: 1380,
    type: 'multi',
    severity: 'global',
    civilizationsAffected: ['Song Dynasty China', 'Khwarezmian Empire', 'Abbasid Caliphate', 'Kievan Rus', 'Eastern Europe'],
    estimatedImpact: '~40 million killed; ~700 million tons CO2 removed from atmosphere',
    consequence: 'So many people died that farmland reverted to forest, measurably cooling the global climate — possibly the only time war reversed climate change.',
    description:
      'The Mongol conquests killed roughly 10% of the world\'s population. Vast swaths of cultivated land in China, Persia, and Eastern Europe were abandoned and reforested. Recent studies suggest this removed enough CO2 from the atmosphere to contribute to the onset of the Little Ice Age.',
    era: 'medieval',
    searchQuery: 'Mongol Empire',
  },
  {
    id: 16,
    name: 'Columbian Exchange & Disease',
    datePeriod: '1492–1600 CE',
    startYear: 1492,
    endYear: 1600,
    type: 'disease_vector',
    severity: 'global',
    civilizationsAffected: ['Aztec Empire', 'Inca Empire', 'Indigenous peoples of the Americas'],
    estimatedImpact: '~56 million deaths (90% of Indigenous American population)',
    consequence: 'Population collapse caused massive reforestation, pulling CO2 from atmosphere and contributing to Little Ice Age cooling ("Orbis hypothesis").',
    description:
      'European diseases — smallpox, measles, influenza — devastated Indigenous American populations with no immunity. The resulting population collapse was so vast that abandoned farmland regrew into forests across the Americas, absorbing enough CO2 to measurably cool the planet.',
    era: 'early modern',
    searchQuery: 'Columbian Exchange disease',
  },
  {
    id: 17,
    name: 'Huaynaputina Eruption',
    datePeriod: '1600 CE',
    startYear: 1600,
    endYear: 1603,
    type: 'volcanic',
    severity: 'global',
    civilizationsAffected: ['Spanish Peru', 'Russia', 'Europe', 'Japan'],
    estimatedImpact: 'VEI 6 eruption; coldest year in 500 years globally',
    consequence: 'Triggered the Russian famine of 1601–1603, killing ~2 million and destabilizing the Tsardom, contributing to the Time of Troubles.',
    description:
      'The largest volcanic eruption in South America in recorded history sent ash high into the stratosphere. The resulting volcanic winter caused the coldest year in 500 years across the Northern Hemisphere. Russia suffered its worst famine in history, toppling Tsar Boris Godunov.',
    era: 'early modern',
    searchQuery: 'Huaynaputina eruption 1600',
  },
  {
    id: 18,
    name: 'Laki Eruption',
    datePeriod: '1783–1784 CE',
    startYear: 1783,
    endYear: 1784,
    type: 'volcanic',
    severity: 'global',
    civilizationsAffected: ['Iceland', 'France', 'Britain', 'Egypt', 'Japan'],
    estimatedImpact: '~6 million deaths globally from famine and toxic haze; 25% of Iceland\'s population died',
    consequence: 'Crop failures in France heightened the economic crisis preceding the French Revolution (1789).',
    description:
      'An 8-month eruption in Iceland produced a toxic haze that spread across Europe, killing livestock and poisoning crops. The resulting agricultural collapse contributed to economic hardship in France, adding fuel to the revolutionary tinderbox.',
    era: 'early modern',
    searchQuery: 'Laki eruption 1783',
  },
  {
    id: 19,
    name: 'El Ni\u00f1o of 1789–1793',
    datePeriod: '1789–1793 CE',
    startYear: 1789,
    endYear: 1793,
    type: 'drought',
    severity: 'global',
    civilizationsAffected: ['France', 'Ottoman Egypt', 'Mughal India', 'Qing China'],
    estimatedImpact: 'Simultaneous famines across three continents',
    consequence: 'Grain prices spiked across France — hungry Parisians stormed the Bastille. Climate helped ignite the French Revolution.',
    description:
      'A powerful El Ni\u00f1o disrupted monsoons in India and Egypt while drought and extreme weather ruined European harvests. In France, bread prices hit record highs just as political tensions peaked. The convergence of hunger and politics exploded into revolution.',
    era: 'early modern',
    searchQuery: 'French Revolution famine',
  },
  {
    id: 20,
    name: 'Year Without a Summer',
    datePeriod: '1816 CE',
    startYear: 1816,
    endYear: 1817,
    type: 'volcanic',
    severity: 'global',
    civilizationsAffected: ['Europe', 'North America', 'China', 'India'],
    estimatedImpact: 'Snow in June in New England; crop failures across Northern Hemisphere; ~100,000+ deaths from famine',
    consequence: 'Food shortages spurred westward migration in America. Mary Shelley wrote Frankenstein while trapped indoors by endless rain.',
    description:
      'The eruption of Mt. Tambora in Indonesia (1815) — the largest in recorded history (VEI 7) — ejected so much sulfur into the stratosphere that global temperatures dropped ~3\u00b0C. Crops failed across the Northern Hemisphere. In the gloomy summer of 1816, a group of writers in Switzerland created Gothic literature, including Frankenstein and The Vampyre.',
    era: 'modern',
    searchQuery: 'Year Without a Summer Tambora',
  },
  {
    id: 21,
    name: 'Irish Potato Famine',
    datePeriod: '1845–1852',
    startYear: 1845,
    endYear: 1852,
    type: 'disease_vector',
    severity: 'regional',
    civilizationsAffected: ['Ireland', 'Britain', 'United States (immigration)'],
    estimatedImpact: '~1 million deaths; 1+ million emigrated; Ireland\'s population fell 25%',
    consequence: 'Transformed Irish diaspora worldwide. Fueled Irish nationalism and shaped American politics for generations.',
    description:
      'Phytophthora infestans (potato blight) destroyed Ireland\'s staple crop for consecutive years. But the famine was as much political as natural — British colonial policies continued food exports from Ireland even as millions starved. The catastrophe halved Ireland\'s population through death and emigration.',
    era: 'modern',
    searchQuery: 'Irish Potato Famine',
  },
  {
    id: 22,
    name: 'Indian Famines (El Ni\u00f1o)',
    datePeriod: '1876–1878',
    startYear: 1876,
    endYear: 1878,
    type: 'drought',
    severity: 'regional',
    civilizationsAffected: ['British India', 'Qing China', 'Brazil', 'Africa'],
    estimatedImpact: '~30–50 million deaths globally across the "Late Victorian Holocausts"',
    consequence: 'Exposed the deadly intersection of El Ni\u00f1o climate patterns with colonial economic policies. Seeds of anti-colonial movements.',
    description:
      'A massive El Ni\u00f1o caused monsoon failures across the tropics while colonial powers continued extracting grain for export. In India alone, millions died while British administrators debated the morality of relief. These "Late Victorian Holocausts" devastated populations across three continents.',
    era: 'modern',
    searchQuery: 'Indian famine 1876 El Nino',
  },
  {
    id: 23,
    name: 'Dust Bowl',
    datePeriod: '1930–1940',
    startYear: 1930,
    endYear: 1940,
    type: 'drought',
    severity: 'regional',
    civilizationsAffected: ['United States Great Plains', 'Canada'],
    estimatedImpact: '~2.5 million people displaced; millions of acres of topsoil lost',
    consequence: 'Triggered the Great Migration westward, reshaped US agriculture policy, inspired The Grapes of Wrath.',
    description:
      'Severe drought combined with decades of aggressive plowing that had stripped native prairie grasses created apocalyptic dust storms across the American Great Plains. "Black blizzards" buried farms and darkened skies as far as Washington, D.C. Hundreds of thousands of "Okies" fled west to California.',
    era: 'modern',
    searchQuery: 'Dust Bowl 1930s',
  },
  {
    id: 24,
    name: 'China\'s Great Famine',
    datePeriod: '1959–1961',
    startYear: 1959,
    endYear: 1961,
    type: 'drought',
    severity: 'regional',
    civilizationsAffected: ['People\'s Republic of China'],
    estimatedImpact: '~15–55 million deaths — the deadliest famine in human history',
    consequence: 'Discredited the Great Leap Forward and weakened Mao\'s authority, contributing to the power struggles that led to the Cultural Revolution.',
    description:
      'A combination of drought, floods, and the catastrophic agricultural policies of the Great Leap Forward produced the worst famine in recorded history. While natural disasters played a role, the human-made policies of forced collectivization and grain requisition transformed bad weather into mass death on an unprecedented scale.',
    era: 'modern',
    searchQuery: 'Great Chinese Famine',
  },
  {
    id: 25,
    name: 'Sahel Drought',
    datePeriod: '1968–1985',
    startYear: 1968,
    endYear: 1985,
    type: 'drought',
    severity: 'regional',
    civilizationsAffected: ['West African nations', 'Chad', 'Niger', 'Mali', 'Mauritania', 'Senegal'],
    estimatedImpact: '~100,000+ deaths; millions displaced; Lake Chad shrank 90%',
    consequence: 'Sparked international humanitarian response movement and drew attention to desertification as a global crisis.',
    description:
      'The Sahel region south of the Sahara experienced a prolonged drought that devastated pastoral and agricultural communities. Lake Chad — once one of Africa\'s largest lakes — shrank to a fraction of its former size. The crisis helped birth the modern international disaster relief system.',
    era: 'modern',
    searchQuery: 'Sahel drought Africa',
  },
  {
    id: 26,
    name: '2010 Russian Heat Wave \u2192 Arab Spring',
    datePeriod: '2010–2011',
    startYear: 2010,
    endYear: 2011,
    type: 'warming',
    severity: 'global',
    civilizationsAffected: ['Russia', 'Tunisia', 'Egypt', 'Libya', 'Syria', 'Middle East'],
    estimatedImpact: '~56,000 deaths in Russia; global wheat prices doubled; regional instability',
    consequence: 'Russia banned grain exports, spiking global food prices. Bread riots contributed to the Arab Spring uprisings across the Middle East.',
    description:
      'Record-breaking heat in Russia destroyed a third of the wheat crop. Russia — the world\'s third-largest wheat exporter — banned exports, sending global grain prices soaring. In the Middle East and North Africa, where governments subsidized bread, the price shock added economic fury to political grievances, helping trigger the Arab Spring.',
    era: 'modern',
    searchQuery: 'Arab Spring food prices 2010',
  },
  {
    id: 27,
    name: 'Anthropogenic Climate Change',
    datePeriod: '1850–present',
    startYear: 1850,
    endYear: 2026,
    type: 'warming',
    severity: 'global',
    civilizationsAffected: ['Global — all civilizations'],
    estimatedImpact: '+1.2\u00b0C warming (and accelerating); rising seas; mass extinction event underway',
    consequence: 'The defining challenge of the 21st century. Already driving migration, conflict, and extreme weather at unprecedented scale.',
    description:
      'The burning of fossil fuels since the Industrial Revolution has increased atmospheric CO2 from ~280 ppm to over 420 ppm — levels not seen in 3 million years. The resulting warming is melting ice caps, raising sea levels, bleaching coral reefs, intensifying storms, and threatening food security worldwide. Unlike past climate events, this one is human-caused and accelerating.',
    era: 'modern',
    searchQuery: 'climate change history',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Collapse cases
// ─────────────────────────────────────────────────────────────────────────────

const COLLAPSE_CASES: CollapseCase[] = [
  {
    civilization: 'Akkadian Empire',
    period: '~2,200 BCE',
    climateDriver: 'Megadrought (4.2 kiloyear event)',
    description:
      'The world\'s first empire collapsed within a generation when a 300-year drought turned its northern grain belt into desert. Archaeological evidence shows dust layers blanketing abandoned cities. Refugees fled south, overwhelming Ur and other cities with climate migrants.',
  },
  {
    civilization: 'Old Kingdom Egypt',
    period: '~2,150 BCE',
    climateDriver: 'Nile flood failures (4.2 kiloyear event)',
    description:
      'When the Nile\'s annual floods failed for decades, the pharaoh\'s claim to divine power crumbled along with the harvests. Egypt fractured into warring provinces during the First Intermediate Period. Texts record cannibalism and social chaos: "The land spins like a potter\'s wheel."',
  },
  {
    civilization: 'Classic Maya',
    period: '800–1000 CE',
    climateDriver: 'Recurring multi-decade droughts',
    description:
      'Speleothem and lake sediment data confirm severe droughts coinciding with the abandonment of major Maya cities. Deforestation for agriculture had reduced local rainfall in a devastating feedback loop. Population declined 90–95% in the southern lowlands.',
  },
  {
    civilization: 'Norse Greenland',
    period: '~1350–1450 CE',
    climateDriver: 'Little Ice Age cooling',
    description:
      'Vikings had colonized Greenland during the Medieval Warm Period when conditions allowed cattle farming. As temperatures dropped, sea ice expanded, trade routes closed, and harvests failed. The last Norse Greenlanders vanished around 1450, likely starving while neighboring Inuit thrived with climate-adapted lifestyles.',
  },
  {
    civilization: 'Ancestral Puebloans (Anasazi)',
    period: '~1275–1300 CE',
    climateDriver: 'Great Drought (1276–1299)',
    description:
      'After building sophisticated cliff dwellings at Mesa Verde and Chaco Canyon, the Ancestral Puebloans abandoned their homeland during a 23-year megadrought. Tree-ring data shows almost no rainfall for an entire generation. The population migrated to better-watered areas along the Rio Grande.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Temperature timeline data (rough global temp anomaly, ~4 points per millennium)
// ─────────────────────────────────────────────────────────────────────────────

const TEMP_DATA: { year: number; anomaly: number; label?: string }[] = [
  { year: -10900, anomaly: -4.0, label: 'Younger Dryas' },
  { year: -9700, anomaly: -1.5 },
  { year: -8000, anomaly: 0.2 },
  { year: -6200, anomaly: -1.0, label: '8.2ky Event' },
  { year: -5500, anomaly: 0.5 },
  { year: -4000, anomaly: 0.8, label: 'Holocene Optimum' },
  { year: -3000, anomaly: 0.3 },
  { year: -2200, anomaly: -0.5, label: '4.2ky Drought' },
  { year: -1500, anomaly: 0.2 },
  { year: -500, anomaly: 0.0 },
  { year: 0, anomaly: 0.2 },
  { year: 200, anomaly: 0.3, label: 'Roman Optimum' },
  { year: 536, anomaly: -1.5, label: '536 CE' },
  { year: 700, anomaly: -0.3 },
  { year: 1000, anomaly: 0.4, label: 'Medieval Warm' },
  { year: 1300, anomaly: -0.2 },
  { year: 1600, anomaly: -0.8, label: 'Little Ice Age' },
  { year: 1816, anomaly: -1.0, label: '1816' },
  { year: 1900, anomaly: -0.2 },
  { year: 1950, anomaly: 0.0 },
  { year: 2000, anomaly: 0.6 },
  { year: 2025, anomaly: 1.3, label: 'Now' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<ClimateType, string> = {
  drought: '#f59e0b',
  volcanic: '#ef4444',
  cooling: '#3b82f6',
  warming: '#f97316',
  storm: '#8b5cf6',
  disease_vector: '#22c55e',
  multi: '#ec4899',
};

const TYPE_LABELS: Record<ClimateType, string> = {
  drought: 'Drought',
  volcanic: 'Volcanic',
  cooling: 'Cooling',
  warming: 'Warming',
  storm: 'Storm',
  disease_vector: 'Disease Vector',
  multi: 'Multi-factor',
};

const SEVERITY_COLORS: Record<Severity, string> = {
  local: '#64748b',
  regional: '#f59e0b',
  global: '#ef4444',
};

const ERA_RANGES: Record<Era, string> = {
  prehistoric: 'Before 3000 BCE',
  ancient: '3000 BCE – 500 CE',
  medieval: '500 – 1500 CE',
  'early modern': '1500 – 1800 CE',
  modern: '1800 CE – present',
};

const CARD_STAGGER = 0.06;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TypeBadge({ type }: { type: ClimateType }) {
  const color = TYPE_COLORS[type];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 4,
        backgroundColor: `${color}22`,
        color,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const color = SEVERITY_COLORS[severity];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 4,
        backgroundColor: `${color}22`,
        color,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {severity}
    </span>
  );
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: '5px 14px',
        borderRadius: 20,
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.12)'}`,
        backgroundColor: active ? `${color}22` : 'rgba(255,255,255,0.04)',
        color: active ? color : '#94a3b8',
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Temperature Timeline (SVG)
// ─────────────────────────────────────────────────────────────────────────────

function TemperatureTimeline() {
  const width = 1036;
  const height = 220;
  const padX = 50;
  const padTop = 30;
  const padBottom = 40;
  const chartW = width - padX * 2;
  const chartH = height - padTop - padBottom;

  const minYear = -11000;
  const maxYear = 2025;
  const minAnomaly = -4.5;
  const maxAnomaly = 1.8;

  function xPos(year: number): number {
    // Use log-ish scale for prehistoric period
    const logBreak = -3000;
    if (year < logBreak) {
      const ratio = (year - minYear) / (logBreak - minYear);
      return padX + ratio * chartW * 0.25;
    }
    const ratio = (year - logBreak) / (maxYear - logBreak);
    return padX + chartW * 0.25 + ratio * chartW * 0.75;
  }

  function yPos(anomaly: number): number {
    const ratio = (anomaly - minAnomaly) / (maxAnomaly - minAnomaly);
    return padTop + chartH - ratio * chartH;
  }

  const pathD = TEMP_DATA.map((d, i) => {
    const x = xPos(d.year);
    const y = yPos(d.anomaly);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  // Area fill
  const areaD =
    pathD +
    ` L${xPos(TEMP_DATA[TEMP_DATA.length - 1].year)},${yPos(0)}` +
    ` L${xPos(TEMP_DATA[0].year)},${yPos(0)} Z`;

  const zeroY = yPos(0);

  const axisTicks = [-10000, -5000, -3000, -1000, 0, 500, 1000, 1500, 1800, 2025];

  function formatYear(year: number): string {
    if (year <= -1000) return `${Math.abs(Math.round(year / 1000))}k BCE`;
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year}`;
  }

  return (
    <SectionWrapper title="Global Temperature Anomaly (Approximate)" icon="🌡️">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        {/* Zero line */}
        <line
          x1={padX}
          y1={zeroY}
          x2={padX + chartW}
          y2={zeroY}
          stroke="rgba(255,255,255,0.15)"
          strokeDasharray="4 4"
        />
        <text x={padX - 8} y={zeroY + 4} fill="#64748b" fontSize="9" textAnchor="end">
          0°C
        </text>

        {/* Warm/cold labels */}
        <text x={padX - 8} y={padTop + 12} fill="#f9731666" fontSize="8" textAnchor="end">
          Warmer
        </text>
        <text x={padX - 8} y={padTop + chartH - 4} fill="#3b82f666" fontSize="8" textAnchor="end">
          Colder
        </text>

        {/* Area fill — warm above zero, cold below */}
        <defs>
          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#tempGrad)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round" />

        {/* Data points */}
        {TEMP_DATA.map((d, i) => (
          <g key={i}>
            <circle
              cx={xPos(d.year)}
              cy={yPos(d.anomaly)}
              r={d.label ? 4 : 2.5}
              fill={d.anomaly >= 0 ? '#f97316' : '#3b82f6'}
              stroke="#070e22"
              strokeWidth="1.5"
            />
            {d.label && (
              <text
                x={xPos(d.year)}
                y={yPos(d.anomaly) - 10}
                fill="#94a3b8"
                fontSize="8"
                textAnchor="middle"
                fontWeight="600"
              >
                {d.label}
              </text>
            )}
          </g>
        ))}

        {/* X axis ticks */}
        {axisTicks.map((year) => (
          <g key={year}>
            <line
              x1={xPos(year)}
              y1={padTop + chartH}
              x2={xPos(year)}
              y2={padTop + chartH + 6}
              stroke="rgba(255,255,255,0.2)"
            />
            <text
              x={xPos(year)}
              y={padTop + chartH + 18}
              fill="#475569"
              fontSize="8"
              textAnchor="middle"
            >
              {formatYear(year)}
            </text>
          </g>
        ))}
      </svg>
      <p style={{ fontSize: 11, color: '#475569', marginTop: 8, fontStyle: 'italic' }}>
        Based on ice core, tree ring, and instrumental records. Anomalies relative to pre-industrial baseline. Not to precise scale.
      </p>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Climate Event Card
// ─────────────────────────────────────────────────────────────────────────────

function ClimateCard({ event, index }: { event: ClimateEvent; index: number }) {
  const typeColor = TYPE_COLORS[event.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * CARD_STAGGER, duration: 0.35, ease: 'easeOut' }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${typeColor}33`,
        borderRadius: 12,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
          {event.name}
        </h3>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <TypeBadge type={event.type} />
          <SeverityBadge severity={event.severity} />
        </div>
      </div>

      {/* Date & duration */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: '#94a3b8' }}>
        <span>
          <span style={{ color: '#64748b' }}>Period:</span> {event.datePeriod}
        </span>
      </div>

      {/* Civilizations affected */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {event.civilizationsAffected.map((civ) => (
          <span
            key={civ}
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#94a3b8',
            }}
          >
            {civ}
          </span>
        ))}
      </div>

      {/* Impact */}
      <div style={{ fontSize: 13, color: '#94a3b8' }}>
        <span style={{ color: '#64748b' }}>Impact:</span> {event.estimatedImpact}
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{event.description}</p>

      {/* Consequence */}
      <div
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          backgroundColor: `${typeColor}08`,
          borderLeft: `3px solid ${typeColor}44`,
          fontSize: 13,
          color: '#94a3b8',
          lineHeight: 1.6,
        }}
      >
        <span style={{ fontWeight: 700, color: typeColor, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Historical consequence:
        </span>{' '}
        {event.consequence}
      </div>

      {/* Find in Chronicle link */}
      <Link
        to={`/search?q=${encodeURIComponent(event.searchQuery)}`}
        style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          fontWeight: 600,
          color: '#60a5fa',
          textDecoration: 'none',
          padding: '6px 14px',
          borderRadius: 6,
          border: '1px solid rgba(96,165,250,0.3)',
          backgroundColor: 'rgba(96,165,250,0.08)',
          transition: 'background 0.15s',
          marginTop: 'auto',
        }}
      >
        Find in Chronicle →
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Climate & Collapse Section
// ─────────────────────────────────────────────────────────────────────────────

function ClimateCollapse() {
  return (
    <SectionWrapper title="Climate & Collapse — Civilizations Felled by Nature" icon="💀">
      <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
        These civilizations didn't fall to invaders alone — climate change pulled the rug from under them.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {COLLAPSE_CASES.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            style={{
              padding: '18px 20px',
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                {c.civilization}
              </h4>
              <span style={{ fontSize: 12, color: '#64748b' }}>{c.period}</span>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#ef4444',
                padding: '3px 10px',
                borderRadius: 4,
                backgroundColor: 'rgba(239,68,68,0.1)',
                alignSelf: 'flex-start',
              }}
            >
              {c.climateDriver}
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
              {c.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ClimatePage() {
  // Enable scrolling (overriding root overflow:hidden)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, []);

  const [typeFilter, setTypeFilter] = useState<ClimateType | null>(null);
  const [eraFilter, setEraFilter] = useState<Era | null>(null);

  const filtered = useMemo(() => {
    return CLIMATE_EVENTS.filter((e) => {
      if (typeFilter && e.type !== typeFilter) return false;
      if (eraFilter && e.era !== eraFilter) return false;
      return true;
    });
  }, [typeFilter, eraFilter]);

  const activeFilterCount = [typeFilter, eraFilter].filter(Boolean).length;

  return (
    <PageShell>
      {/* Hero */}
      <div
        style={{
          padding: '48px 32px 36px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(239,68,68,0.06) 50%, rgba(59,130,246,0.06) 100%)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: '#64748b',
            textDecoration: 'none',
            marginBottom: 28,
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          ← Back to Timeline
        </Link>

        <h1
          style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          When Nature Changed History
        </h1>
        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#94a3b8',
            lineHeight: 1.6,
            maxWidth: 700,
            margin: 0,
          }}
        >
          Climate events that toppled civilizations, sparked revolutions, and redirected the course of
          human history — from ice ages to the Dust Bowl to the unfolding crisis of today.
        </p>

        {/* Quick stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
          {[
            { label: 'Events Tracked', value: `${CLIMATE_EVENTS.length}+` },
            { label: 'Time Span', value: '13,000 years' },
            { label: 'Civilizations Fallen', value: '5+' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div
        style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <blockquote
          style={{
            margin: 0,
            padding: '0 0 0 20px',
            borderLeft: '3px solid rgba(96,165,250,0.3)',
            fontSize: 15,
            color: '#94a3b8',
            fontStyle: 'italic',
            lineHeight: 1.7,
          }}
        >
          "Civilizations are built on climatic niches. When the niche shifts, the civilization must adapt, migrate, or perish.
          Most perish."
        </blockquote>
      </div>

      {/* Temperature Timeline */}
      <TemperatureTimeline />

      {/* Filters */}
      <SectionWrapper title={`Filters${activeFilterCount ? ` (${activeFilterCount} active)` : ''}`} icon="🔍">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Type filter */}
          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Event Type
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(Object.keys(TYPE_COLORS) as ClimateType[]).map((type) => (
                <FilterPill
                  key={type}
                  label={TYPE_LABELS[type]}
                  active={typeFilter === type}
                  color={TYPE_COLORS[type]}
                  onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                />
              ))}
            </div>
          </div>

          {/* Era filter */}
          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Era
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(Object.keys(ERA_RANGES) as Era[]).map((era) => (
                <FilterPill
                  key={era}
                  label={`${era.charAt(0).toUpperCase() + era.slice(1)} (${ERA_RANGES[era]})`}
                  active={eraFilter === era}
                  color="#60a5fa"
                  onClick={() => setEraFilter(eraFilter === era ? null : era)}
                />
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setTypeFilter(null);
                setEraFilter(null);
              }}
              style={{
                alignSelf: 'flex-start',
                fontSize: 12,
                fontWeight: 600,
                padding: '5px 14px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      </SectionWrapper>

      {/* Event cards */}
      <SectionWrapper title={`Climate Events (${filtered.length})`} icon="🌍">
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748b',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            No climate events match the current filters.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
              gap: 16,
            }}
          >
            {filtered.map((e, i) => (
              <ClimateCard key={e.id} event={e} index={i} />
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* Climate & Collapse */}
      <ClimateCollapse />

      {/* Bottom nav */}
      <div style={{ padding: '28px 32px', display: 'flex', gap: 12 }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid rgba(96,165,250,0.3)',
            backgroundColor: 'rgba(96,165,250,0.08)',
          }}
        >
          ← Back to Timeline
        </Link>
      </div>
    </PageShell>
  );
}
