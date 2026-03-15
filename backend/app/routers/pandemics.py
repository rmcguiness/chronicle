"""
Pandemics router — serves curated data on history's most devastating pandemics.

GET /api/pandemics          → list all pandemics (with optional filters)
GET /api/pandemics/:slug    → single pandemic detail
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/pandemics", tags=["pandemics"])


# ── Data model ────────────────────────────────────────────────────────────────

class PandemicItem(BaseModel):
    slug: str
    name: str
    year_start: int
    year_end: int
    year_display: str
    pathogen: str
    pathogen_type: str  # virus / bacterium / unknown / retrovirus / protozoan
    death_toll: str
    death_toll_number: int  # estimated deaths for chart comparison
    geographic_spread: str  # Local / Regional / Continental / Global
    impact_rating: str  # Local / Significant / Devastating / Catastrophic
    regions: list[str]
    cause_of_death: str
    how_it_spread: str
    how_it_ended: str
    historical_impact: str
    key_facts: list[str]
    era: str  # Ancient / Medieval / Early Modern / Modern / Contemporary
    chronicle_query: str
    db_event_count: int = 0
    db_event_slugs: list[str] = []


class PandemicsResponse(BaseModel):
    pandemics: list[PandemicItem]
    total: int
    total_db_events: int = 0


# ── Hardcoded dataset ─────────────────────────────────────────────────────────

PANDEMICS: list[PandemicItem] = [
    PandemicItem(
        slug="plague-of-athens",
        name="Plague of Athens",
        year_start=-430,
        year_end=-426,
        year_display="430–426 BCE",
        pathogen="Unknown (possibly typhoid or viral hemorrhagic fever)",
        pathogen_type="unknown",
        death_toll="75,000–100,000",
        death_toll_number=100000,
        geographic_spread="Local",
        impact_rating="Significant",
        regions=["Greece"],
        cause_of_death="Fever, hemorrhaging, organ failure",
        how_it_spread="Crowded conditions during Peloponnesian War siege",
        how_it_ended="Burned through susceptible population; war continued",
        historical_impact="Killed Pericles and devastated Athenian leadership, weakening Athens in the Peloponnesian War. Thucydides' account became the first clinical description of an epidemic in Western literature.",
        key_facts=[
            "Killed the great statesman Pericles in 429 BCE",
            "Thucydides survived and wrote the first medical account of plague",
            "Struck during the Peloponnesian War, contributing to Athens' eventual defeat",
        ],
        era="Ancient",
        chronicle_query="Plague of Athens",
    ),
    PandemicItem(
        slug="antonine-plague",
        name="Antonine Plague",
        year_start=165,
        year_end=180,
        year_display="165–180 CE",
        pathogen="Smallpox (Variola major)",
        pathogen_type="virus",
        death_toll="5–10 million",
        death_toll_number=5000000,
        geographic_spread="Continental",
        impact_rating="Devastating",
        regions=["Roman Empire", "Middle East"],
        cause_of_death="Smallpox — fever, rash, organ failure",
        how_it_spread="Roman soldiers returning from Mesopotamia spread it across the empire",
        how_it_ended="Gradually subsided as survivors gained immunity; recurred in waves",
        historical_impact="Weakened the Roman military and economy at the height of the empire. Killed Emperor Lucius Verus and possibly Marcus Aurelius. Began Rome's long decline.",
        key_facts=[
            "Named after the Antonine dynasty of Roman emperors",
            "Galen documented symptoms, giving us one of the earliest descriptions of smallpox",
            "Killed up to 2,000 people per day in Rome at its peak",
        ],
        era="Ancient",
        chronicle_query="Antonine Plague",
    ),
    PandemicItem(
        slug="plague-of-cyprian",
        name="Plague of Cyprian",
        year_start=249,
        year_end=262,
        year_display="249–262 CE",
        pathogen="Unknown (possibly viral hemorrhagic fever or smallpox)",
        pathogen_type="unknown",
        death_toll="Millions (5,000/day in Rome at peak)",
        death_toll_number=1000000,
        geographic_spread="Continental",
        impact_rating="Devastating",
        regions=["Roman Empire", "North Africa"],
        cause_of_death="Fever, diarrhea, vomiting, gangrenous extremities",
        how_it_spread="Person-to-person contact across Roman trade networks",
        how_it_ended="Subsided after 13 years; contributed to Crisis of the Third Century",
        historical_impact="Accelerated the Crisis of the Third Century in Rome. Fueled the rise of Christianity as pagan temples failed to provide answers while Christians cared for the sick.",
        key_facts=[
            "Named after St. Cyprian, Bishop of Carthage, who documented it",
            "At peak, killed 5,000 people per day in Rome alone",
            "Contributed to Roman military manpower shortages",
        ],
        era="Ancient",
        chronicle_query="Plague of Cyprian",
    ),
    PandemicItem(
        slug="plague-of-justinian",
        name="Plague of Justinian",
        year_start=541,
        year_end=549,
        year_display="541–549 CE",
        pathogen="Yersinia pestis (bubonic plague)",
        pathogen_type="bacterium",
        death_toll="25–50 million",
        death_toll_number=30000000,
        geographic_spread="Continental",
        impact_rating="Catastrophic",
        regions=["Byzantine Empire", "Mediterranean", "Middle East", "Europe"],
        cause_of_death="Bubonic plague — swollen lymph nodes (buboes), sepsis, organ failure",
        how_it_spread="Rats and fleas on grain ships from Egypt; spread along trade routes",
        how_it_ended="Recurred in waves for 200 years; eventually died out by ~750 CE",
        historical_impact="Destroyed Emperor Justinian's dream of reuniting the Roman Empire. Killed up to half the population of the Mediterranean world and reshaped the balance of power between Byzantium, Persia, and the emerging Islamic caliphate.",
        key_facts=[
            "First recorded bubonic plague pandemic in history",
            "Emperor Justinian himself contracted the plague but survived",
            "Killed an estimated 40% of Constantinople's population",
            "Recurred in waves for over 200 years",
        ],
        era="Medieval",
        chronicle_query="Plague of Justinian",
    ),
    PandemicItem(
        slug="black-death",
        name="Black Death",
        year_start=1347,
        year_end=1351,
        year_display="1347–1351 CE",
        pathogen="Yersinia pestis (bubonic plague)",
        pathogen_type="bacterium",
        death_toll="50–200 million (30–60% of Europe)",
        death_toll_number=75000000,
        geographic_spread="Global",
        impact_rating="Catastrophic",
        regions=["Europe", "Asia", "Middle East", "North Africa"],
        cause_of_death="Bubonic, pneumonic, and septicemic plague",
        how_it_spread="Rat fleas (Xenopsylla cheopis); also pneumonic transmission person-to-person",
        how_it_ended="Quarantine measures, population die-off; plague remained endemic for centuries",
        historical_impact="The most devastating pandemic in human history. Ended feudalism by creating labor shortages that empowered peasants. Triggered the Renaissance, transformed European art and religion, and led to the first public health systems (quarantine in Ragusa/Dubrovnik, 1377).",
        key_facts=[
            "Arrived in Europe via Genoese trading ships from Crimea",
            "Killed 30–60% of Europe's entire population in just 4 years",
            "The word 'quarantine' comes from the 40-day isolation period (quarantina) invented during this pandemic",
            "Led to widespread persecution of Jewish communities as scapegoats",
            "Peasant revolts followed as surviving workers demanded higher wages",
        ],
        era="Medieval",
        chronicle_query="Black Death",
    ),
    PandemicItem(
        slug="sweating-sickness",
        name="Sweating Sickness",
        year_start=1485,
        year_end=1551,
        year_display="1485–1551 CE",
        pathogen="Unknown (possibly hantavirus)",
        pathogen_type="unknown",
        death_toll="Tens of thousands",
        death_toll_number=50000,
        geographic_spread="Regional",
        impact_rating="Significant",
        regions=["England", "Northern Europe"],
        cause_of_death="Profuse sweating, high fever, rapid death (sometimes within hours)",
        how_it_spread="Unknown; appeared suddenly in 5 outbreaks over 66 years",
        how_it_ended="Disappeared completely after 1551 — never identified",
        historical_impact="Terrorized Tudor England and influenced Henry VIII's court politics. Anne Boleyn survived a bout in 1528. The disease struck rich and poor alike, unlike most plagues that hit the poor hardest.",
        key_facts=[
            "Could kill within hours of first symptoms",
            "First appeared with Henry VII's army at the Battle of Bosworth Field",
            "Uniquely targeted healthy young adults, not the elderly",
            "Vanished completely after 1551 and has never been conclusively identified",
        ],
        era="Early Modern",
        chronicle_query="Sweating Sickness",
    ),
    PandemicItem(
        slug="cocoliztli-epidemic",
        name="Cocoliztli Epidemic",
        year_start=1545,
        year_end=1548,
        year_display="1545–1548 CE",
        pathogen="Possibly Salmonella enterica (enteric fever) or viral hemorrhagic fever",
        pathogen_type="unknown",
        death_toll="5–15 million",
        death_toll_number=12000000,
        geographic_spread="Regional",
        impact_rating="Catastrophic",
        regions=["Mexico", "Central America"],
        cause_of_death="High fever, severe bleeding from eyes, nose, and mouth",
        how_it_spread="Likely exacerbated by drought; possibly introduced by Europeans",
        how_it_ended="Population devastation reduced transmission; recurring outbreaks until 1576",
        historical_impact="One of the deadliest epidemics in the Americas. Destroyed the remaining Aztec population after Spanish conquest, reducing Mexico's indigenous population from 25 million to 1 million. Facilitated Spanish colonial consolidation.",
        key_facts=[
            "Nahuatl word 'cocoliztli' means 'pestilence'",
            "Killed up to 80% of Mexico's native population",
            "2018 DNA analysis suggested Salmonella enterica as the pathogen",
            "Combined with earlier smallpox epidemics, caused one of the greatest demographic collapses in history",
        ],
        era="Early Modern",
        chronicle_query="Cocoliztli Epidemic",
    ),
    PandemicItem(
        slug="great-plague-of-london",
        name="Great Plague of London",
        year_start=1665,
        year_end=1666,
        year_display="1665–1666 CE",
        pathogen="Yersinia pestis (bubonic plague)",
        pathogen_type="bacterium",
        death_toll="~100,000 (25% of London's population)",
        death_toll_number=100000,
        geographic_spread="Local",
        impact_rating="Devastating",
        regions=["England"],
        cause_of_death="Bubonic plague — buboes, fever, sepsis",
        how_it_spread="Rat fleas; worsened by overcrowded, unsanitary conditions",
        how_it_ended="Great Fire of London (1666) may have helped; also quarantine measures",
        historical_impact="The last major plague outbreak in England. Led directly to improved sanitation and urban planning. Isaac Newton fled Cambridge to his country home, where he developed calculus and his theory of gravity during the plague years.",
        key_facts=[
            "Red crosses were painted on doors of infected houses with 'Lord have mercy upon us'",
            "Samuel Pepys' diary provides vivid first-hand accounts",
            "Newton's 'annus mirabilis' of scientific discovery happened while fleeing the plague",
            "The Great Fire of London in 1666 may have helped end the outbreak by destroying rat habitats",
        ],
        era="Early Modern",
        chronicle_query="Great Plague of London",
    ),
    PandemicItem(
        slug="plague-of-marseille",
        name="Plague of Marseille",
        year_start=1720,
        year_end=1722,
        year_display="1720–1722 CE",
        pathogen="Yersinia pestis (bubonic plague)",
        pathogen_type="bacterium",
        death_toll="~100,000",
        death_toll_number=100000,
        geographic_spread="Regional",
        impact_rating="Devastating",
        regions=["France", "Mediterranean"],
        cause_of_death="Bubonic plague — buboes, fever, organ failure",
        how_it_spread="Arrived on the merchant ship Grand Saint Antoine from the Levant",
        how_it_ended="Strict quarantine (Mur de la Peste — a plague wall built across Provence) and military cordons",
        historical_impact="The last major outbreak of bubonic plague in Western Europe. Led to the construction of a physical plague wall and demonstrated that quarantine and public health measures could contain epidemics.",
        key_facts=[
            "The ship Grand Saint Antoine brought the plague despite quarantine protocols",
            "France built a physical stone wall (Mur de la Peste) to contain the outbreak",
            "Last major bubonic plague epidemic in Western Europe",
            "Captain of the ship was imprisoned for violating quarantine",
        ],
        era="Early Modern",
        chronicle_query="Plague of Marseille",
    ),
    PandemicItem(
        slug="russian-plague",
        name="Russian Plague",
        year_start=1770,
        year_end=1772,
        year_display="1770–1772 CE",
        pathogen="Yersinia pestis (bubonic plague)",
        pathogen_type="bacterium",
        death_toll="~100,000",
        death_toll_number=100000,
        geographic_spread="Regional",
        impact_rating="Devastating",
        regions=["Russia"],
        cause_of_death="Bubonic plague — buboes, fever, sepsis",
        how_it_spread="Arrived via soldiers returning from the Russo-Turkish War",
        how_it_ended="Military cordons, burning of contaminated property, improved sanitation",
        historical_impact="Triggered the Moscow Plague Riot of 1771, one of Russia's largest urban uprisings. Citizens attacked quarantine facilities and killed Archbishop Ambrose. Catherine the Great sent troops and implemented sweeping public health reforms.",
        key_facts=[
            "Caused the Moscow Plague Riot of 1771",
            "Rioters murdered Archbishop Ambrose for removing a 'miracle-working' icon",
            "Catherine the Great imposed strict quarantine and burned infected districts",
            "Led to major urban planning reforms in Moscow",
        ],
        era="Early Modern",
        chronicle_query="Russian Plague Moscow",
    ),
    PandemicItem(
        slug="yellow-fever-philadelphia",
        name="Yellow Fever (Philadelphia)",
        year_start=1793,
        year_end=1793,
        year_display="1793",
        pathogen="Yellow fever virus (Flavivirus)",
        pathogen_type="virus",
        death_toll="~5,000 (10% of Philadelphia's population)",
        death_toll_number=5000,
        geographic_spread="Local",
        impact_rating="Significant",
        regions=["United States"],
        cause_of_death="Liver failure, hemorrhaging, jaundice (yellow skin)",
        how_it_spread="Aedes aegypti mosquitoes; arrived via refugees from Saint-Domingue revolution",
        how_it_ended="First frost killed the mosquitoes",
        historical_impact="Congress, President Washington, and most federal officials fled the capital. Free Black community (led by Richard Allen and Absalom Jones) provided critical nursing care, demonstrating civic leadership. Led to the first major public health infrastructure in the United States.",
        key_facts=[
            "Philadelphia was the U.S. capital at the time",
            "President Washington, Congress, and most officials fled the city",
            "The Free African Society organized relief when white citizens fled",
            "Dr. Benjamin Rush's controversial 'bleeding and purging' treatment likely killed more patients",
        ],
        era="Early Modern",
        chronicle_query="Yellow Fever Philadelphia",
    ),
    PandemicItem(
        slug="cholera-pandemics",
        name="Cholera Pandemics",
        year_start=1817,
        year_end=1923,
        year_display="1817–1923 (7 waves)",
        pathogen="Vibrio cholerae (bacterium)",
        pathogen_type="bacterium",
        death_toll="Millions worldwide",
        death_toll_number=2000000,
        geographic_spread="Global",
        impact_rating="Catastrophic",
        regions=["India", "Asia", "Europe", "Americas", "Africa"],
        cause_of_death="Severe dehydration from watery diarrhea; death within hours if untreated",
        how_it_spread="Contaminated water supplies; thrived in unsanitary urban conditions",
        how_it_ended="Clean water infrastructure, sanitation reforms, John Snow's epidemiology",
        historical_impact="Revolutionized public health. John Snow's 1854 Broad Street pump investigation founded modern epidemiology. Cholera drove the construction of modern water and sewage systems in every major city worldwide.",
        key_facts=[
            "Seven distinct pandemic waves over 106 years",
            "John Snow traced the 1854 London outbreak to a single water pump, founding epidemiology",
            "Drove the construction of modern sewage systems worldwide",
            "Still causes 1–4 million cases per year in developing nations",
            "Robert Koch identified the bacterium in 1883",
        ],
        era="Modern",
        chronicle_query="Cholera Pandemic",
    ),
    PandemicItem(
        slug="spanish-flu",
        name="Spanish Flu",
        year_start=1918,
        year_end=1920,
        year_display="1918–1920",
        pathogen="Influenza A virus (H1N1)",
        pathogen_type="virus",
        death_toll="50–100 million",
        death_toll_number=50000000,
        geographic_spread="Global",
        impact_rating="Catastrophic",
        regions=["Worldwide"],
        cause_of_death="Cytokine storm — immune system overreaction, pneumonia, secondary bacterial infection",
        how_it_spread="Airborne respiratory droplets; troop movements in WWI accelerated global spread",
        how_it_ended="Virus mutated to less lethal form; population gained immunity",
        historical_impact="The deadliest pandemic in modern history. Infected one-third of the world's population (500 million). Killed more people than WWI. Disproportionately killed healthy young adults (ages 20–40) due to cytokine storms. Led to the creation of national public health systems worldwide.",
        key_facts=[
            "Infected ~500 million people — one-third of the world's population",
            "Killed more people than World War I in a fraction of the time",
            "Uniquely lethal to healthy young adults (ages 20–40)",
            "Misnamed 'Spanish' because Spain, as a neutral country, freely reported cases",
            "Wartime censorship in other countries suppressed news of the pandemic",
        ],
        era="Modern",
        chronicle_query="Spanish Flu",
    ),
    PandemicItem(
        slug="asian-flu",
        name="Asian Flu",
        year_start=1957,
        year_end=1958,
        year_display="1957–1958",
        pathogen="Influenza A virus (H2N2)",
        pathogen_type="virus",
        death_toll="1–2 million",
        death_toll_number=1500000,
        geographic_spread="Global",
        impact_rating="Devastating",
        regions=["Worldwide"],
        cause_of_death="Pneumonia, respiratory failure",
        how_it_spread="Airborne respiratory droplets; rapid global spread via air travel",
        how_it_ended="Vaccine development (Maurice Hilleman) and natural immunity",
        historical_impact="First pandemic where a vaccine was rapidly developed. Maurice Hilleman at Walter Reed identified the virus and pushed for emergency vaccine production, saving millions. Demonstrated the value of global disease surveillance.",
        key_facts=[
            "Originated in Guizhou, China in early 1957",
            "Maurice Hilleman's rapid vaccine development saved millions",
            "First pandemic responded to with modern virology tools",
            "The H2N2 virus later evolved into H3N2 (Hong Kong Flu, 1968)",
        ],
        era="Contemporary",
        chronicle_query="Asian Flu 1957",
    ),
    PandemicItem(
        slug="hiv-aids",
        name="HIV/AIDS",
        year_start=1981,
        year_end=2026,
        year_display="1981–present",
        pathogen="Human Immunodeficiency Virus (HIV)",
        pathogen_type="retrovirus",
        death_toll="~40 million dead; 39 million living with HIV",
        death_toll_number=40000000,
        geographic_spread="Global",
        impact_rating="Catastrophic",
        regions=["Worldwide", "Sub-Saharan Africa (most affected)"],
        cause_of_death="Immune system destruction leading to opportunistic infections and cancers",
        how_it_spread="Sexual contact, blood transfusion, shared needles, mother-to-child transmission",
        how_it_ended="Ongoing — antiretroviral therapy (ART) transformed HIV from death sentence to manageable condition",
        historical_impact="Reshaped global public health, sexual health education, and LGBTQ+ rights movements. Drove unprecedented investment in virology research. Sub-Saharan Africa lost a generation. ART development revolutionized antiviral medicine and informed COVID-19 vaccine research.",
        key_facts=[
            "First recognized in 1981 among gay men in Los Angeles and New York",
            "Originated from simian immunodeficiency virus (SIV) in chimpanzees, crossing to humans around 1920",
            "36+ million deaths since the start of the epidemic",
            "Antiretroviral therapy (1996) transformed HIV from death sentence to chronic condition",
            "Sub-Saharan Africa accounts for ~70% of all people living with HIV",
        ],
        era="Contemporary",
        chronicle_query="AIDS Epidemic",
    ),
    PandemicItem(
        slug="sars",
        name="SARS",
        year_start=2002,
        year_end=2004,
        year_display="2002–2004",
        pathogen="SARS-CoV (Severe Acute Respiratory Syndrome coronavirus)",
        pathogen_type="virus",
        death_toll="~774",
        death_toll_number=774,
        geographic_spread="Regional",
        impact_rating="Significant",
        regions=["China", "Hong Kong", "Southeast Asia", "Canada"],
        cause_of_death="Severe pneumonia, respiratory failure",
        how_it_spread="Respiratory droplets; superspreader events in hospitals and hotels",
        how_it_ended="Aggressive quarantine, contact tracing, and public health measures contained it",
        historical_impact="First modern coronavirus pandemic scare. Though contained quickly, it exposed weaknesses in global disease surveillance and hospital infection control. Directly motivated the research infrastructure that enabled rapid COVID-19 response.",
        key_facts=[
            "Originated in Guangdong, China in November 2002",
            "The Metropole Hotel superspreader event in Hong Kong infected guests who spread it to 4 countries",
            "Dr. Carlo Urbani identified the disease and died from it",
            "SARS research laid the groundwork for COVID-19 vaccine development",
        ],
        era="Contemporary",
        chronicle_query="SARS",
    ),
    PandemicItem(
        slug="h1n1-swine-flu",
        name="H1N1 Swine Flu",
        year_start=2009,
        year_end=2010,
        year_display="2009–2010",
        pathogen="Influenza A virus (H1N1)pdm09",
        pathogen_type="virus",
        death_toll="~284,000",
        death_toll_number=284000,
        geographic_spread="Global",
        impact_rating="Significant",
        regions=["Worldwide"],
        cause_of_death="Pneumonia, respiratory failure",
        how_it_spread="Airborne respiratory droplets; rapid global spread via air travel",
        how_it_ended="Vaccine deployment and natural immunity; virus became seasonal",
        historical_impact="First pandemic of the 21st century. Tested the global pandemic response system created after SARS. The relatively mild outcome led to accusations of WHO overreaction, which ironically may have slowed the initial COVID-19 response a decade later.",
        key_facts=[
            "First detected in Mexico in April 2009",
            "Infected an estimated 1.4 billion people worldwide",
            "Disproportionately affected young people (unlike seasonal flu)",
            "Criticism of WHO's 'overreaction' later undermined pandemic preparedness",
        ],
        era="Contemporary",
        chronicle_query="H1N1 Swine Flu",
    ),
    PandemicItem(
        slug="covid-19",
        name="COVID-19",
        year_start=2019,
        year_end=2023,
        year_display="2019–2023",
        pathogen="SARS-CoV-2 (Severe Acute Respiratory Syndrome coronavirus 2)",
        pathogen_type="virus",
        death_toll="7+ million official (20+ million estimated)",
        death_toll_number=20000000,
        geographic_spread="Global",
        impact_rating="Catastrophic",
        regions=["Worldwide"],
        cause_of_death="Pneumonia, ARDS, blood clots, organ failure, cytokine storm",
        how_it_spread="Airborne respiratory droplets and aerosols; presymptomatic transmission",
        how_it_ended="Vaccines (mRNA technology breakthrough), natural immunity, virus evolution to less severe variants",
        historical_impact="The defining crisis of the 21st century. Triggered the largest global lockdowns in history, accelerated remote work, disrupted supply chains, and drove political polarization. mRNA vaccine technology, developed in record time, revolutionized medicine. Exposed deep inequities in global health systems.",
        key_facts=[
            "First cases reported in Wuhan, China in December 2019",
            "WHO declared global pandemic on March 11, 2020",
            "mRNA vaccines developed in under a year — fastest in history",
            "Global lockdowns affected 4+ billion people simultaneously",
            "Official death toll exceeds 7 million; excess death estimates suggest 20+ million",
            "Long COVID affects an estimated 10–30% of survivors",
        ],
        era="Contemporary",
        chronicle_query="COVID-19 Pandemic",
    ),
]


# ── DB event matching ────────────────────────────────────────────────────────

PANDEMIC_SEARCH_TERMS: dict[str, list[str]] = {
    "plague-of-athens": ["plague of athens", "plague athens"],
    "antonine-plague": ["antonine plague"],
    "plague-of-cyprian": ["plague of cyprian", "cyprian"],
    "plague-of-justinian": ["plague of justinian", "justinianic"],
    "black-death": ["black death", "bubonic plague 1347"],
    "sweating-sickness": ["sweating sickness"],
    "cocoliztli-epidemic": ["cocoliztli"],
    "great-plague-of-london": ["great plague of london", "plague london 1665"],
    "plague-of-marseille": ["plague of marseille"],
    "russian-plague": ["russian plague", "moscow plague"],
    "yellow-fever-philadelphia": ["yellow fever"],
    "cholera-pandemics": ["cholera"],
    "spanish-flu": ["spanish flu", "1918 flu", "1918 pandemic"],
    "asian-flu": ["asian flu", "h2n2"],
    "hiv-aids": ["hiv", "aids epidemic", "aids pandemic"],
    "sars": ["sars 2002", "sars 2003"],
    "h1n1-swine-flu": ["h1n1", "swine flu"],
    "covid-19": ["covid", "sars-cov-2", "coronavirus pandemic"],
}


async def _match_db_events(db: AsyncSession) -> dict[str, list[str]]:
    """Query DB for pandemic-related events and match to hardcoded pandemics."""
    conditions = []
    for terms in PANDEMIC_SEARCH_TERMS.values():
        for term in terms:
            conditions.append(Event.title.ilike(f"%{term}%"))

    q = (
        select(Event.slug, Event.title, Event.year_approx)
        .where(Event.review_status == "approved")
        .where(or_(*conditions))
        .order_by(Event.year_approx.asc().nullsfirst())
    )
    rows = (await db.execute(q)).all()

    # Map pandemics to slugs
    pandemic_to_slugs: dict[str, list[str]] = {}
    pandemic_items_by_slug = {p.slug: p for p in PANDEMICS}

    for pid, terms in PANDEMIC_SEARCH_TERMS.items():
        matched = []
        p_data = pandemic_items_by_slug.get(pid)
        for row in rows:
            title_lower = row.title.lower()
            if any(term in title_lower for term in terms):
                matched.append(row.slug)
            elif (
                p_data
                and row.year_approx is not None
                and p_data.year_start <= row.year_approx <= p_data.year_end
                and any(
                    kw in title_lower
                    for kw in [
                        "plague", "pandemic", "epidemic", "disease",
                        "flu", "pox", "cholera", "covid", "virus",
                    ]
                )
            ):
                matched.append(row.slug)
        pandemic_to_slugs[pid] = list(set(matched))

    return pandemic_to_slugs


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("", response_model=PandemicsResponse)
async def list_pandemics(
    db: AsyncSession = Depends(get_db),
    era: Optional[str] = Query(None, description="Filter by era (Ancient, Medieval, etc.)"),
    impact: Optional[str] = Query(None, description="Filter by impact rating"),
    pathogen_type: Optional[str] = Query(None, description="Filter by pathogen type"),
    region: Optional[str] = Query(None, description="Filter by region"),
    sort: Optional[str] = Query("chronological", description="Sort: chronological, deaths, impact"),
):
    # Enrich with DB events
    try:
        db_matches = await _match_db_events(db)
    except Exception:
        db_matches = {}

    total_db = len(set(s for slugs in db_matches.values() for s in slugs))

    enriched = []
    for p in PANDEMICS:
        slugs = db_matches.get(p.slug, [])
        item = p.model_copy(update={"db_event_count": len(slugs), "db_event_slugs": slugs})
        enriched.append(item)

    filtered = enriched

    if era:
        filtered = [p for p in filtered if p.era.lower() == era.lower()]
    if impact:
        filtered = [p for p in filtered if p.impact_rating.lower() == impact.lower()]
    if pathogen_type:
        pt = pathogen_type.lower()
        filtered = [p for p in filtered if p.pathogen_type.lower() == pt]
    if region:
        region_lower = region.lower()
        filtered = [p for p in filtered if any(region_lower in r.lower() for r in p.regions)]

    impact_order = {"Local": 1, "Significant": 2, "Devastating": 3, "Catastrophic": 4}
    if sort == "deaths":
        filtered = sorted(filtered, key=lambda p: p.death_toll_number, reverse=True)
    elif sort == "impact":
        filtered = sorted(filtered, key=lambda p: impact_order.get(p.impact_rating, 0), reverse=True)
    elif sort == "chronological":
        filtered = sorted(filtered, key=lambda p: p.year_start)

    return PandemicsResponse(pandemics=filtered, total=len(filtered), total_db_events=total_db)


@router.get("/{slug}")
async def get_pandemic(slug: str, db: AsyncSession = Depends(get_db)):
    try:
        db_matches = await _match_db_events(db)
    except Exception:
        db_matches = {}

    for p in PANDEMICS:
        if p.slug == slug:
            slugs = db_matches.get(p.slug, [])
            return p.model_copy(update={"db_event_count": len(slugs), "db_event_slugs": slugs})
    return {"error": "Pandemic not found"}
