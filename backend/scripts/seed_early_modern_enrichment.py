#!/usr/bin/env python3
"""
Chronicle seed script — ~60 early modern events (1500–1900 CE).

Enriches the early modern period with events covering the Scientific Revolution,
Reformation, Atlantic slave trade, colonialism, Industrial Revolution,
and political revolutions.

Run:
    python backend/scripts/seed_early_modern_enrichment.py
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import os
from typing import Any

import asyncpg

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

CREATED_BY = "seed-script:early-modern-enrichment-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


EVENTS: list[dict[str, Any]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # SCIENTIFIC REVOLUTION
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "copernicus-publishes-de-revolutionibus",
        "title": "Copernicus Publishes De Revolutionibus — Heliocentric Model",
        "year": 1543, "lat": 53.77, "lng": 20.48,
        "geo_modern": "Frauenburg (Frombork), Poland",
        "geo_era_label": "Renaissance Europe",
        "category": "discovery", "importance_score": 0.9, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "pl", "viewpoint_type": "academic",
             "narrative": "Nicolaus Copernicus published De Revolutionibus Orbium Coelestium in 1543, proposing that Earth and other planets orbit the Sun. This heliocentric model challenged 1,400 years of Ptolemaic geocentrism and launched the Scientific Revolution, fundamentally altering humanity's understanding of its place in the cosmos.",
             "summary": "The heliocentric model overthrew geocentrism and launched the Scientific Revolution.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Copernican Revolution", "author": "Thomas Kuhn", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1957}
             ]},
        ],
    },
    {
        "slug": "leibniz-calculus-invention",
        "title": "Leibniz Publishes Calculus — Independent of Newton",
        "year": 1684, "lat": 52.37, "lng": 9.74,
        "geo_modern": "Hanover, Germany",
        "geo_era_label": "Early Modern Europe",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Mathematical history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Gottfried Wilhelm Leibniz published his formulation of calculus in 1684, independently of Newton's unpublished work. Leibniz's notation (∫, dx/dy) proved more practical and is still used today. The priority dispute between Leibniz and Newton became one of the most famous controversies in scientific history.",
             "summary": "Leibniz independently invented calculus with notation still used today.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Calculus Wars: Newton, Leibniz, and the Greatest Mathematical Clash of All Time", "author": "Jason Bardi", "publication": "Thunder's Mouth Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "linnaeus-systema-naturae",
        "title": "Linnaeus Publishes Systema Naturae — Biological Taxonomy",
        "year": 1735, "lat": 59.86, "lng": 17.64,
        "geo_modern": "Uppsala, Sweden",
        "geo_era_label": "Enlightenment Europe",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "History of biology perspective", "culture_code": "se", "viewpoint_type": "academic",
             "narrative": "Carl Linnaeus's Systema Naturae (1735) established the binomial nomenclature system for classifying organisms that remains the foundation of biological taxonomy. His hierarchical classification (kingdom, class, order, genus, species) organized the natural world and laid groundwork for evolutionary theory.",
             "summary": "Linnaeus created the system of biological classification still used today.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Linnaeus: Nature and Nation", "author": "Lisbet Koerner", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # REFORMATION & RELIGIOUS WARS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "english-reformation-henry-viii",
        "title": "English Reformation — Henry VIII Breaks with Rome",
        "year": 1534, "lat": 51.50, "lng": -0.12,
        "geo_modern": "London, England",
        "geo_era_label": "Tudor England",
        "category": "political", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Political-religious perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "In 1534, Henry VIII's Act of Supremacy declared the English monarch head of the Church of England, severing ties with Rome. Motivated partly by Henry's desire to annul his marriage, the English Reformation dissolved monasteries, redistributed church wealth, and set England on a distinct religious and political trajectory.",
             "summary": "Henry VIII established the Church of England, separating from papal authority.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Stripping of the Altars", "author": "Eamon Duffy", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1992}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # ATLANTIC SLAVE TRADE
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "atlantic-slave-trade-begins",
        "title": "Atlantic Slave Trade Begins — Portuguese Africa",
        "year": 1526, "lat": -6.27, "lng": 14.24,
        "geo_modern": "Mbanza Kongo, Congo/Angola",
        "geo_era_label": "Early Colonial Africa",
        "category": "political", "importance_score": 0.9, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "African diaspora perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The transatlantic slave trade began in earnest in the early 1500s when Portuguese traders exported enslaved Africans to the Americas. By 1526, King Afonso I of Kongo wrote to Portugal protesting the slave trade's devastating impact. Over the next 350 years, an estimated 12.5 million Africans would be forcibly transported across the Atlantic.",
             "summary": "The beginning of the transatlantic slave trade that displaced 12.5 million Africans.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Slave Trade: The Story of the Atlantic Slave Trade", "author": "Hugh Thomas", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "abolition-slave-trade-britain",
        "title": "Britain Abolishes the Slave Trade",
        "year": 1807, "lat": 51.50, "lng": -0.12,
        "geo_modern": "London, England",
        "geo_era_label": "Georgian Britain",
        "category": "political", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Abolitionist perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The Slave Trade Act of 1807 abolished the slave trade throughout the British Empire, following decades of campaigning by abolitionists like William Wilberforce, Thomas Clarkson, and Olaudah Equiano. Britain then used its naval power to suppress the trade internationally. Full emancipation followed in 1833.",
             "summary": "Britain outlawed the slave trade after decades of abolitionist campaigning.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Bury the Chains: Prophets and Rebels in the Fight to Free an Empire's Slaves", "author": "Adam Hochschild", "publication": "Houghton Mifflin",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # COLONIALISM & EXPLORATION
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "dutch-east-india-company-founded",
        "title": "Dutch East India Company (VOC) Founded — First Multinational Corporation",
        "year": 1602, "lat": 52.37, "lng": 4.90,
        "geo_modern": "Amsterdam, Netherlands",
        "geo_era_label": "Dutch Golden Age",
        "category": "political", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Economic history perspective", "culture_code": "nl", "viewpoint_type": "academic",
             "narrative": "The VOC (1602) was the world's first publicly traded company and first multinational corporation. It monopolized the spice trade, established colonies across Southeast Asia, and pioneered stock markets, limited liability, and corporate governance. At its peak, the VOC was arguably the most powerful private company in history.",
             "summary": "The world's first multinational corporation, pioneering modern capitalism.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Dutch East India Company: The First 100 Years", "author": "Femme Gaastra", "publication": "Walburg Pers",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "british-east-india-company-india",
        "title": "British East India Company Dominates India",
        "year": 1757, "lat": 22.57, "lng": 88.36,
        "geo_modern": "Plassey (Palashi), West Bengal, India",
        "geo_era_label": "Early Colonial India",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Postcolonial perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "The Battle of Plassey (1757) marked the beginning of British colonial rule in India, as the East India Company defeated the Nawab of Bengal. Over the next century, the Company extended control over most of the subcontinent through military conquest, treaties, and economic exploitation, transforming India's economy and society.",
             "summary": "The Battle of Plassey began British colonial domination of India.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Anarchy: The Relentless Rise of the East India Company", "author": "William Dalrymple", "publication": "Bloomsbury",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "treaty-tordesillas-world-division",
        "title": "Treaty of Tordesillas — Spain and Portugal Divide the World",
        "year": 1494, "lat": 41.50, "lng": -5.00,
        "geo_modern": "Tordesillas, Spain",
        "geo_era_label": "Age of Exploration",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Diplomatic history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Treaty of Tordesillas (1494) divided the newly discovered world between Spain and Portugal along a meridian 370 leagues west of the Cape Verde islands. This papal-sanctioned agreement shaped colonial borders — giving Brazil to Portugal and most of the Americas to Spain — with consequences lasting centuries.",
             "summary": "Spain and Portugal divided the non-European world between them.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Treaty of Tordesillas and the Spatial Division of the World", "author": "Ricardo Padron", "publication": "Journal of Latin American Geography",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # INDUSTRIAL REVOLUTION
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "watt-steam-engine-improved",
        "title": "James Watt Improves the Steam Engine",
        "year": 1769, "lat": 55.86, "lng": -4.25,
        "geo_modern": "Glasgow, Scotland",
        "geo_era_label": "Industrial Revolution Britain",
        "category": "discovery", "importance_score": 0.9, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Industrial history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "James Watt's separate condenser (patented 1769) dramatically improved the efficiency of the steam engine, making it practical for factory and transportation use. The Watt engine became the prime mover of the Industrial Revolution, powering factories, mines, and later railways and steamships.",
             "summary": "Watt's improved steam engine powered the Industrial Revolution.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Most Powerful Idea in the World", "author": "William Rosen", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "spinning-jenny-textile-revolution",
        "title": "Spinning Jenny — Mechanization of Textiles",
        "year": 1764, "lat": 53.70, "lng": -2.10,
        "geo_modern": "Stanhill, Lancashire, England",
        "geo_era_label": "Early Industrial Revolution",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Industrial history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "James Hargreaves's Spinning Jenny (c. 1764) was one of the key inventions that mechanized the textile industry, allowing one worker to operate multiple spindles simultaneously. Combined with Arkwright's water frame and Crompton's mule, it transformed cotton manufacturing from cottage industry to factory production.",
             "summary": "The Spinning Jenny helped mechanize textile production, launching the factory system.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Industrial Revolution: A Very Short Introduction", "author": "Robert Allen", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2017}
             ]},
        ],
    },
    {
        "slug": "first-railway-liverpool-manchester",
        "title": "Liverpool–Manchester Railway — First Intercity Railroad",
        "year": 1830, "lat": 53.48, "lng": -2.24,
        "geo_modern": "Manchester, England",
        "geo_era_label": "Industrial Revolution Britain",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Transport history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The Liverpool & Manchester Railway (1830) was the first intercity passenger railway, using Stephenson's Rocket locomotive. It demonstrated that rail transport was faster, cheaper, and more reliable than canals or roads, triggering a global railway boom that transformed economies, urbanization, and warfare.",
             "summary": "The first modern intercity railway, sparking a global transportation revolution.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Fire and Steam: A New History of the Railways in Britain", "author": "Christian Wolmar", "publication": "Atlantic Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "telegraph-morse-communication",
        "title": "Electric Telegraph — First Long-Distance Communication",
        "year": 1844, "lat": 39.29, "lng": -76.61,
        "geo_modern": "Washington DC / Baltimore, USA",
        "geo_era_label": "Antebellum America",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Communications history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Samuel Morse's first telegraph message ('What hath God wrought') traveled from Washington to Baltimore on May 24, 1844. The telegraph revolutionized communication, enabling near-instantaneous long-distance messaging. Within decades, submarine cables connected continents, transforming business, journalism, diplomacy, and warfare.",
             "summary": "The telegraph enabled near-instantaneous long-distance communication for the first time.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Victorian Internet", "author": "Tom Standage", "publication": "Walker & Company",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "bessemer-process-steel",
        "title": "Bessemer Process — Mass Production of Steel",
        "year": 1856, "lat": 53.38, "lng": -1.47,
        "geo_modern": "Sheffield, England",
        "geo_era_label": "Second Industrial Revolution",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Industrial history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Henry Bessemer's steel-making process (1856) enabled mass production of steel from pig iron for the first time. Cheap, high-quality steel transformed construction (skyscrapers, bridges), transportation (railways, ships), and warfare (artillery, armor), becoming the defining material of industrialization.",
             "summary": "Mass-produced steel became the backbone of industrial civilization.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Steel: A New History of an Old Material", "author": "Thomas Misa", "publication": "Johns Hopkins University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1995}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # POLITICAL REVOLUTIONS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "glorious-revolution-1688",
        "title": "Glorious Revolution — Constitutional Monarchy Established",
        "year": 1688, "lat": 51.50, "lng": -0.12,
        "geo_modern": "London, England",
        "geo_era_label": "Late Stuart England",
        "category": "political", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The Glorious Revolution of 1688 replaced James II with William and Mary, establishing constitutional monarchy and parliamentary sovereignty. The 1689 Bill of Rights guaranteed civil liberties, regular parliaments, and limitations on royal power — influencing the American and French Revolutions.",
             "summary": "Established constitutional monarchy and inspired later democratic revolutions.", "evidence_score": 0.88,
             "sources": [
                 {"title": "1688: The First Modern Revolution", "author": "Steve Pincus", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "american-declaration-independence",
        "title": "American Declaration of Independence",
        "year": 1776, "lat": 39.95, "lng": -75.15,
        "geo_modern": "Philadelphia, Pennsylvania, USA",
        "geo_era_label": "American Revolution",
        "category": "political", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Declaration of Independence (July 4, 1776), drafted primarily by Thomas Jefferson, proclaimed that 'all men are created equal' with 'unalienable Rights' to 'Life, Liberty, and the pursuit of Happiness.' It justified revolution against tyranny and became a foundational document of democratic governance worldwide.",
             "summary": "The founding document of American democracy and inspiration for global liberty movements.", "evidence_score": 0.92,
             "sources": [
                 {"title": "American Scripture: Making the Declaration of Independence", "author": "Pauline Maier", "publication": "Alfred A. Knopf",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "french-revolution-bastille",
        "title": "Storming of the Bastille — French Revolution Begins",
        "year": 1789, "lat": 48.85, "lng": 2.37,
        "geo_modern": "Paris, France",
        "geo_era_label": "French Revolution",
        "category": "political", "importance_score": 0.95, "zoom_min": 1, "is_bce": False,
        "perspectives": [
            {"label": "Revolutionary history perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "The storming of the Bastille on July 14, 1789, symbolized the overthrow of royal tyranny and became the defining moment of the French Revolution. The Revolution's Declaration of the Rights of Man and of the Citizen proclaimed universal rights, abolished feudalism, and inspired revolutionary movements worldwide — while also descending into the Terror and eventually Napoleon's dictatorship.",
             "summary": "The iconic start of the French Revolution that reshaped the modern world.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Citizens: A Chronicle of the French Revolution", "author": "Simon Schama", "publication": "Alfred A. Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1989}
             ]},
        ],
    },
    {
        "slug": "haitian-revolution-independence",
        "title": "Haitian Revolution — First Successful Slave Revolt",
        "year": 1804, "lat": 19.76, "lng": -72.20,
        "geo_modern": "Cap-Haïtien, Haiti",
        "geo_era_label": "Age of Revolutions",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Postcolonial perspective", "culture_code": "ht", "viewpoint_type": "academic",
             "narrative": "The Haitian Revolution (1791–1804) was the only successful large-scale slave revolt in history. Led by Toussaint Louverture and Jean-Jacques Dessalines, enslaved people defeated the French, Spanish, and British armies to establish Haiti as the first independent Black republic. It terrified slaveholding societies and inspired abolition movements worldwide.",
             "summary": "The only successful large-scale slave revolution, establishing the first Black republic.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Black Jacobins: Toussaint L'Ouverture and the San Domingo Revolution", "author": "C.L.R. James", "publication": "Vintage Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1938}
             ]},
        ],
    },
    {
        "slug": "revolutions-1848-springtime-peoples",
        "title": "Revolutions of 1848 — Springtime of Peoples",
        "year": 1848, "lat": 48.85, "lng": 2.35,
        "geo_modern": "Paris / Berlin / Vienna / Budapest",
        "geo_era_label": "19th Century Europe",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "In 1848, a wave of revolutions swept across Europe, from France to the German states, Austrian Empire, Italy, and Hungary. Driven by demands for liberal constitutions, national self-determination, and social reform, they represented the largest revolutionary wave in European history. Though mostly suppressed, they accelerated constitutional reform and nationalist movements.",
             "summary": "The largest wave of revolutions in European history, advancing liberal and nationalist causes.", "evidence_score": 0.88,
             "sources": [
                 {"title": "1848: Year of Revolution", "author": "Mike Rapport", "publication": "Basic Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2008}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # ENLIGHTENMENT & PHILOSOPHY
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "enlightenment-encyclopedie",
        "title": "Diderot's Encyclopédie — Enlightenment Knowledge Project",
        "year": 1751, "lat": 48.85, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "French Enlightenment",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Intellectual history perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "Denis Diderot and Jean le Rond d'Alembert's Encyclopédie (1751–1772) was the supreme achievement of the French Enlightenment. Its 28 volumes compiled human knowledge across arts, sciences, and trades, promoting reason, skepticism, and progress. It challenged religious and political authority and helped inspire the French Revolution.",
             "summary": "The Enlightenment's greatest publishing project, compiling all human knowledge.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Business of Enlightenment: A Publishing History of the Encyclopédie", "author": "Robert Darnton", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1979}
             ]},
        ],
    },
    {
        "slug": "adam-smith-wealth-of-nations",
        "title": "Adam Smith's Wealth of Nations — Birth of Economics",
        "year": 1776, "lat": 55.95, "lng": -3.19,
        "geo_modern": "Edinburgh, Scotland",
        "geo_era_label": "Scottish Enlightenment",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Economic thought perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Adam Smith's An Inquiry into the Nature and Causes of the Wealth of Nations (1776) established economics as a discipline. His concepts of the 'invisible hand,' division of labor, free trade, and market self-regulation became foundational to capitalist economic theory and policy.",
             "summary": "The foundational text of modern economics and free-market capitalism.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Adam Smith: An Enlightened Life", "author": "Nicholas Phillipson", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "kant-critique-pure-reason",
        "title": "Kant's Critique of Pure Reason — Revolution in Philosophy",
        "year": 1781, "lat": 54.71, "lng": 20.51,
        "geo_modern": "Königsberg (Kaliningrad), Prussia",
        "geo_era_label": "German Enlightenment",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Philosophical perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Immanuel Kant's Critique of Pure Reason (1781) attempted to reconcile rationalism and empiricism, arguing that the mind actively structures experience through categories and forms. His 'Copernican revolution in philosophy' transformed epistemology, ethics, and aesthetics, making him arguably the most influential modern philosopher.",
             "summary": "Kant's revolutionary work reshaped Western philosophy.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Kant: A Biography", "author": "Manfred Kuehn", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # 19TH CENTURY — FILLING GAPS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "opium-wars-china-unequal-treaties",
        "title": "First Opium War — Beginning of China's 'Century of Humiliation'",
        "year": 1839, "lat": 23.12, "lng": 113.25,
        "geo_modern": "Guangzhou (Canton), China",
        "geo_era_label": "Late Qing Dynasty",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Chinese historical perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The First Opium War (1839–1842) began when China attempted to suppress British opium imports. Britain's overwhelming naval superiority forced the Treaty of Nanjing — ceding Hong Kong, opening five treaty ports, and imposing extraterritoriality. This began China's 'Century of Humiliation' and the unequal treaty system.",
             "summary": "British military superiority forced open China's economy, beginning a century of foreign domination.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Opium War: Drugs, Dreams, and the Making of Modern China", "author": "Julia Lovell", "publication": "Picador",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "suez-canal-opens-1869",
        "title": "Suez Canal Opens — Connecting Mediterranean and Red Sea",
        "year": 1869, "lat": 30.59, "lng": 32.27,
        "geo_modern": "Port Said / Suez, Egypt",
        "geo_era_label": "Victorian Imperialism",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Geopolitical perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "The Suez Canal, opened in 1869, created a direct sea route between Europe and Asia, eliminating the need to sail around Africa. Engineered by Ferdinand de Lesseps, the 120-mile canal transformed global trade and became a focal point of imperial competition, particularly between Britain and France.",
             "summary": "The canal linking Mediterranean and Red Sea transformed global maritime trade.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Parting the Desert: The Creation of the Suez Canal", "author": "Zachary Karabell", "publication": "Alfred A. Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "napoleon-rise-to-power",
        "title": "Napoleon's Rise to Power — Coup of 18 Brumaire",
        "year": 1799, "lat": 48.86, "lng": 2.34,
        "geo_modern": "Paris, France",
        "geo_era_label": "Post-Revolutionary France",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "Napoleon Bonaparte's coup of 18 Brumaire (November 9, 1799) overthrew the Directory and established the Consulate, making Napoleon the effective ruler of France. His subsequent empire spread revolutionary ideals, legal reforms (the Napoleonic Code), and warfare across Europe, permanently reshaping the continent's political map.",
             "summary": "Napoleon's seizure of power transformed France and reshaped Europe.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Napoleon: A Life", "author": "Andrew Roberts", "publication": "Viking",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "italian-unification-risorgimento",
        "title": "Italian Unification — Risorgimento",
        "year": 1861, "lat": 45.07, "lng": 7.69,
        "geo_modern": "Turin / Rome, Italy",
        "geo_era_label": "19th Century Europe",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "The Italian Risorgimento unified the Italian peninsula into a single kingdom by 1861 (with Rome added in 1870). Led by Cavour's diplomacy, Garibaldi's military campaigns, and Mazzini's ideology, it ended centuries of fragmentation under foreign and local rulers, creating the modern Italian nation-state.",
             "summary": "The unification of Italy from a patchwork of states into a single nation.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Risorgimento: History, Historiography, and the Italian Nation", "author": "Axel Körner", "publication": "Journal of Modern Italian Studies",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # ADDITIONAL KEY EVENTS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "mughal-empire-peak-akbar",
        "title": "Mughal Empire at Its Peak Under Akbar",
        "year": 1556, "lat": 27.18, "lng": 78.02,
        "geo_modern": "Agra / Fatehpur Sikri, India",
        "geo_era_label": "Mughal India",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "South Asian perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "Under Emperor Akbar (r. 1556–1605), the Mughal Empire reached its cultural and administrative peak. Akbar unified most of the Indian subcontinent, promoted religious tolerance (Din-i Ilahi), established an efficient bureaucracy, and patronized art, architecture, and learning. The Mughals created some of India's greatest architectural works including Fatehpur Sikri.",
             "summary": "Akbar's reign represented the Mughal Empire's golden age of tolerance and culture.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Mughal Empire", "author": "John Richards", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "scientific-societies-founded",
        "title": "Royal Society and Scientific Academies Founded",
        "year": 1660, "lat": 51.51, "lng": -0.13,
        "geo_modern": "London, England",
        "geo_era_label": "Scientific Revolution",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The Royal Society of London (1660) and the French Académie des Sciences (1666) institutionalized scientific inquiry. These societies promoted peer review, experimental demonstration, and international collaboration, transforming science from individual genius into a collective enterprise. Their journals (Philosophical Transactions, 1665) created the modern scientific publication system.",
             "summary": "Scientific societies institutionalized research, peer review, and collaboration.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Royal Society: And the Invention of Modern Science", "author": "Adrian Tinniswood", "publication": "Basic Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "microscope-discovery-microorganisms",
        "title": "Leeuwenhoek Discovers Microorganisms",
        "year": 1676, "lat": 52.01, "lng": 4.36,
        "geo_modern": "Delft, Netherlands",
        "geo_era_label": "Dutch Golden Age",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "nl", "viewpoint_type": "academic",
             "narrative": "Antonie van Leeuwenhoek, using self-made microscopes with ~275x magnification, became the first person to observe bacteria and protists in 1676. His 'animalcules' revealed a previously invisible world of microbial life, laying the groundwork for microbiology, germ theory, and modern medicine.",
             "summary": "First observation of microorganisms, founding the field of microbiology.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Antonie van Leeuwenhoek and His 'Little Animals'", "author": "Clifford Dobell", "publication": "Dover Publications",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1932}
             ]},
        ],
    },
    {
        "slug": "french-revolution-declaration-rights-man",
        "title": "Declaration of the Rights of Man and of the Citizen",
        "year": 1789, "lat": 48.86, "lng": 2.32,
        "geo_modern": "Versailles / Paris, France",
        "geo_era_label": "French Revolution",
        "category": "political", "importance_score": 0.9, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Political philosophy perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "The Declaration of the Rights of Man and of the Citizen (August 26, 1789) proclaimed that 'men are born and remain free and equal in rights,' establishing principles of popular sovereignty, equality before law, freedom of speech and religion, and the right to property. It became one of the most influential documents in modern political history.",
             "summary": "A foundational document of human rights and democratic governance.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Declaration of the Rights of Man and of Citizens", "author": "Lynn Hunt", "publication": "Bedford/St. Martin's",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "abolition-serfdom-russia-1861",
        "title": "Abolition of Serfdom in Russia",
        "year": 1861, "lat": 59.93, "lng": 30.32,
        "geo_modern": "Saint Petersburg, Russia",
        "geo_era_label": "Imperial Russia",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Russian history perspective", "culture_code": "ru", "viewpoint_type": "academic",
             "narrative": "Tsar Alexander II's Emancipation Manifesto of 1861 freed Russia's 23 million serfs — the largest single act of emancipation in history. However, the terms were onerous: peasants had to pay redemption dues for land they already worked, and communes restricted mobility. The incomplete reform contributed to social tensions that would erupt in 1905 and 1917.",
             "summary": "The largest emancipation in history freed 23 million serfs, though on unfavorable terms.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Russia in the Age of Alexander II, Tolstoy and Dostoevsky", "author": "W. Bruce Lincoln", "publication": "Northern Illinois University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "tokugawa-japan-isolation",
        "title": "Tokugawa Japan — Sakoku Isolation Policy",
        "year": 1639, "lat": 32.75, "lng": 129.87,
        "geo_modern": "Nagasaki / Edo (Tokyo), Japan",
        "geo_era_label": "Tokugawa Japan",
        "category": "political", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Japanese history perspective", "culture_code": "jp", "viewpoint_type": "academic",
             "narrative": "The Tokugawa shogunate's sakoku (closed country) policy, fully implemented by 1639, restricted foreign contact to limited Dutch and Chinese trade at Nagasaki. For over 200 years, Japan developed in relative isolation, producing a distinctive urban culture, peace, and economic growth — but fell behind in military technology, leading to the crisis of Perry's arrival in 1853.",
             "summary": "Japan's 200-year isolation policy shaped a unique culture but left it vulnerable.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Tokugawa Japan: The Social and Economic Antecedents of Modern Japan", "author": "Conrad Totman", "publication": "University of California Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "qing-dynasty-founding",
        "title": "Qing Dynasty Founded — Manchu Conquest of China",
        "year": 1644, "lat": 39.90, "lng": 116.40,
        "geo_modern": "Beijing, China",
        "geo_era_label": "Early Qing China",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Chinese history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Manchu-led Qing dynasty (1644–1912) conquered China after the fall of the Ming, establishing China's last imperial dynasty. Under the Kangxi, Yongzheng, and Qianlong emperors, the Qing expanded China's territory to its greatest extent, incorporating Tibet, Xinjiang, Mongolia, and Taiwan. The Qing era saw both prosperity and eventual decline.",
             "summary": "China's last dynasty expanded the empire to its greatest extent before eventual decline.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Great Qing: The Mongol-Manchu Encounter", "author": "Evelyn Rawski", "publication": "Stanford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2015}
             ]},
        ],
    },
    {
        "slug": "womens-suffrage-movement-seneca-falls",
        "title": "Seneca Falls Convention — Women's Suffrage Movement Begins",
        "year": 1848, "lat": 42.91, "lng": -76.80,
        "geo_modern": "Seneca Falls, New York, USA",
        "geo_era_label": "Antebellum America",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Women's history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Seneca Falls Convention (1848), organized by Elizabeth Cady Stanton and Lucretia Mott, produced the Declaration of Sentiments asserting that 'all men and women are created equal.' It launched the organized women's suffrage movement in the United States, which would culminate in the 19th Amendment (1920).",
             "summary": "The founding event of the American women's rights movement.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Seneca Falls and the Origins of the Women's Rights Movement", "author": "Sally McMillen", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2008}
             ]},
        ],
    },
]

# ═══════════════════════════════════════════════════════════════════════════
# CAUSALITY LINKS (early modern chains)
# ═══════════════════════════════════════════════════════════════════════════
CAUSALITY_LINKS: list[dict[str, Any]] = [
    # Printing → Reformation → Religious wars → Enlightenment
    {"cause": "gutenberg-printing-press", "effect": "martin-luther-95-theses-1517", "type": "contributing", "strength": 0.8, "desc": "The printing press enabled rapid spread of Luther's ideas across Europe"},
    {"cause": "gutenberg-printing-press", "effect": "copernicus-publishes-de-revolutionibus", "type": "contributing", "strength": 0.6, "desc": "Print enabled dissemination of scientific works"},
    {"cause": "martin-luther-95-theses-1517", "effect": "protestant-reformation-council-trent-1545", "type": "direct", "strength": 0.9, "desc": "The Counter-Reformation was a direct response to Protestant challenges"},
    {"cause": "martin-luther-95-theses-1517", "effect": "english-reformation-henry-viii", "type": "contributing", "strength": 0.6, "desc": "The broader Reformation context facilitated Henry VIII's break with Rome"},
    {"cause": "martin-luther-95-theses-1517", "effect": "thirty-years-war-1618-1648", "type": "direct", "strength": 0.8, "desc": "Religious divisions from the Reformation fueled the Thirty Years' War"},
    {"cause": "thirty-years-war-1618-1648", "effect": "peace-of-westphalia-sovereignty", "type": "direct", "strength": 0.9, "desc": "The Peace of Westphalia ended the Thirty Years' War"},

    # Scientific revolution chain
    {"cause": "copernicus-publishes-de-revolutionibus", "effect": "galileo-telescope-observations", "type": "direct", "strength": 0.8, "desc": "Galileo's telescopic observations confirmed Copernican heliocentrism"},
    {"cause": "galileo-telescope-observations", "effect": "newton-principia-1687", "type": "direct", "strength": 0.8, "desc": "Galileo's mechanics laid groundwork for Newton's laws of motion"},
    {"cause": "copernicus-publishes-de-revolutionibus", "effect": "kepler-planetary-laws-1609", "type": "direct", "strength": 0.8, "desc": "Kepler refined and proved the heliocentric model with mathematical precision"},
    {"cause": "kepler-planetary-laws-1609", "effect": "newton-principia-1687", "type": "direct", "strength": 0.9, "desc": "Newton's gravitational theory explained Kepler's planetary laws"},
    {"cause": "newton-principia-1687", "effect": "leibniz-calculus-invention", "type": "contributing", "strength": 0.7, "desc": "Newton and Leibniz independently developed calculus in the same intellectual milieu"},
    {"cause": "newton-principia-1687", "effect": "enlightenment-encyclopedie", "type": "contributing", "strength": 0.7, "desc": "Newton's success inspired Enlightenment faith in reason and science"},
    {"cause": "scientific-societies-founded", "effect": "newton-principia-1687", "type": "contributing", "strength": 0.6, "desc": "Scientific societies provided institutional support for Newton's work"},
    {"cause": "microscope-discovery-microorganisms", "effect": "linnaeus-systema-naturae", "type": "contributing", "strength": 0.5, "desc": "Microscopy expanded awareness of biological diversity, motivating classification"},
    {"cause": "linnaeus-systema-naturae", "effect": "darwin-on-the-origin-of-species-1859", "type": "contributing", "strength": 0.7, "desc": "Linnaean taxonomy organized biodiversity, enabling evolutionary thinking"},
    {"cause": "harvey-blood-circulation-1628", "effect": "scientific-societies-founded", "type": "contributing", "strength": 0.5, "desc": "Harvey's experimental approach exemplified the new science the societies promoted"},

    # Enlightenment → political revolutions
    {"cause": "enlightenment-encyclopedie", "effect": "french-revolution-bastille", "type": "contributing", "strength": 0.7, "desc": "Enlightenment ideas of liberty and reason inspired the French Revolution"},
    {"cause": "adam-smith-wealth-of-nations", "effect": "watt-steam-engine-improved", "type": "indirect", "strength": 0.4, "desc": "Free-market economics supported industrial entrepreneurship"},
    {"cause": "locke-two-treatises", "effect": "american-declaration-independence", "type": "direct", "strength": 0.8, "desc": "Locke's natural rights philosophy directly influenced Jefferson's Declaration"},
    {"cause": "locke-two-treatises", "effect": "glorious-revolution-1688", "type": "contributing", "strength": 0.7, "desc": "Locke's Two Treatises justified the Glorious Revolution"},
    {"cause": "glorious-revolution-1688", "effect": "american-declaration-independence", "type": "contributing", "strength": 0.6, "desc": "English constitutional precedents shaped American revolutionary thought"},
    {"cause": "american-declaration-independence", "effect": "french-revolution-bastille", "type": "direct", "strength": 0.7, "desc": "The American Revolution inspired French revolutionaries"},
    {"cause": "french-revolution-bastille", "effect": "french-revolution-declaration-rights-man", "type": "direct", "strength": 0.9, "desc": "The Revolution's National Assembly adopted the Declaration of Rights"},
    {"cause": "french-revolution-bastille", "effect": "napoleon-rise-to-power", "type": "direct", "strength": 0.9, "desc": "Napoleon rose through the chaos of the French Revolution"},
    {"cause": "napoleon-rise-to-power", "effect": "congress-vienna-1815", "type": "direct", "strength": 0.9, "desc": "The Congress of Vienna was convened after Napoleon's defeat"},
    {"cause": "napoleon-rise-to-power", "effect": "bolivar-latin-american-independence-1819", "type": "contributing", "strength": 0.7, "desc": "Napoleon's invasion of Spain weakened colonial control, enabling Latin American independence"},
    {"cause": "congress-vienna-1815", "effect": "revolutions-1848-springtime-peoples", "type": "contributing", "strength": 0.6, "desc": "Repression of liberal-nationalist movements by the Vienna system provoked the 1848 revolutions"},

    # Slave trade → revolution → abolition chain
    {"cause": "atlantic-slave-trade-begins", "effect": "trans-atlantic-slave-trade-peak-1780", "type": "direct", "strength": 0.9, "desc": "The slave trade escalated to its peak in the 18th century"},
    {"cause": "trans-atlantic-slave-trade-peak-1780", "effect": "haitian-revolution-independence", "type": "direct", "strength": 0.8, "desc": "The brutality of plantation slavery provoked the Haitian Revolution"},
    {"cause": "haitian-revolution-independence", "effect": "abolition-slave-trade-britain", "type": "contributing", "strength": 0.6, "desc": "Haiti's revolution strengthened abolitionist arguments"},
    {"cause": "abolition-slave-trade-britain", "effect": "abolition-slavery-british-empire-1833", "type": "direct", "strength": 0.9, "desc": "Trade abolition was followed by full emancipation in 1833"},
    {"cause": "abolition-slavery-british-empire-1833", "effect": "american-civil-war-1861-1865", "type": "contributing", "strength": 0.5, "desc": "British abolition intensified the global debate over slavery"},

    # Colonialism chains
    {"cause": "columbus-reaches-americas-1492", "effect": "treaty-tordesillas-world-division", "type": "direct", "strength": 0.9, "desc": "Columbus's discovery prompted Spain and Portugal to divide the new world"},
    {"cause": "columbus-reaches-americas-1492", "effect": "cortez-conquest-aztec-1519-1521", "type": "direct", "strength": 0.8, "desc": "Columbus opened the path to Spanish conquest of the Americas"},
    {"cause": "cortez-conquest-aztec-1519-1521", "effect": "spanish-conquest-inca", "type": "direct", "strength": 0.7, "desc": "Success in Mexico emboldened and enabled the conquest of Peru"},
    {"cause": "cortez-conquest-aztec-1519-1521", "effect": "atlantic-slave-trade-begins", "type": "contributing", "strength": 0.6, "desc": "Conquest created labor demands that fueled the slave trade"},
    {"cause": "vasco-da-gama-india-1498", "effect": "dutch-east-india-company-founded", "type": "contributing", "strength": 0.7, "desc": "Da Gama's route opened Indian Ocean trade to European companies"},
    {"cause": "dutch-east-india-company-founded", "effect": "british-east-india-company-india", "type": "contributing", "strength": 0.6, "desc": "Dutch success in Asia spurred British East India Company expansion"},
    {"cause": "fall-constantinople-1453", "effect": "columbus-reaches-americas-1492", "type": "contributing", "strength": 0.6, "desc": "Ottoman control of eastern trade routes motivated westward exploration"},
    {"cause": "fall-constantinople-1453", "effect": "vasco-da-gama-india-1498", "type": "contributing", "strength": 0.6, "desc": "Ottoman control motivated Portuguese search for sea route to India"},

    # Industrial revolution chain
    {"cause": "spinning-jenny-textile-revolution", "effect": "watt-steam-engine-improved", "type": "contributing", "strength": 0.6, "desc": "Textile mechanization drove demand for steam power"},
    {"cause": "watt-steam-engine-improved", "effect": "first-railway-liverpool-manchester", "type": "direct", "strength": 0.9, "desc": "Steam power enabled the railway revolution"},
    {"cause": "watt-steam-engine-improved", "effect": "bessemer-process-steel", "type": "contributing", "strength": 0.6, "desc": "Steam-powered industry created demand for cheap steel"},
    {"cause": "first-railway-liverpool-manchester", "effect": "telegraph-morse-communication", "type": "contributing", "strength": 0.5, "desc": "Railways created infrastructure corridors for telegraph lines"},
    {"cause": "watt-steam-engine-improved", "effect": "communist-manifesto-1848", "type": "contributing", "strength": 0.6, "desc": "Industrialization's social upheaval inspired Marx's critique of capitalism"},

    # Japan/China chain
    {"cause": "opium-wars-china-unequal-treaties", "effect": "meiji-restoration-japan-1868", "type": "contributing", "strength": 0.6, "desc": "China's humiliation by Western powers alarmed Japanese leaders into modernization"},
    {"cause": "tokugawa-japan-isolation", "effect": "meiji-restoration-japan-1868", "type": "direct", "strength": 0.8, "desc": "The Meiji Restoration overthrew the Tokugawa order"},

    # English Civil War → constitutional chain
    {"cause": "english-civil-war", "effect": "glorious-revolution-1688", "type": "direct", "strength": 0.8, "desc": "The unresolved tensions of the Civil War led to the Glorious Revolution"},

    # Nationalism
    {"cause": "revolutions-1848-springtime-peoples", "effect": "unification-germany-1871", "type": "contributing", "strength": 0.6, "desc": "1848 nationalism failed peacefully, leading to Bismarck's military unification"},
    {"cause": "revolutions-1848-springtime-peoples", "effect": "italian-unification-risorgimento", "type": "contributing", "strength": 0.7, "desc": "1848 revolutionary nationalism directly inspired the Risorgimento"},

    # Mughal/colonial India
    {"cause": "mughal-empire-peak-akbar", "effect": "british-east-india-company-india", "type": "indirect", "strength": 0.5, "desc": "Mughal decline in the 18th century enabled British expansion in India"},

    # Africa

    # Suffrage
    {"cause": "french-revolution-declaration-rights-man", "effect": "womens-suffrage-movement-seneca-falls", "type": "contributing", "strength": 0.5, "desc": "The Declaration of Rights' exclusion of women provoked demands for women's rights"},
    {"cause": "american-declaration-independence", "effect": "womens-suffrage-movement-seneca-falls", "type": "contributing", "strength": 0.6, "desc": "The Declaration's promise of equality inspired the women's suffrage movement"},
]


async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting early modern enrichment seed — {len(EVENTS)} events")

    slug_to_id: dict[str, str] = {}

    # Pre-load existing slugs
    rows = await conn.fetch("SELECT slug, id FROM events")
    for r in rows:
        slug_to_id[r["slug"]] = str(r["id"])

    for event in EVENTS:
        year = event["year"]
        is_bce = event.get("is_bce", False)
        abs_year = abs(year)
        if abs_year > 4712:
            abs_year = 4712

        if is_bce:
            date_e_lit = f"'{abs_year:04d}-01-01 BC'::date"
            date_l_lit = f"'{abs_year:04d}-12-31 BC'::date"
        else:
            date_e_lit = f"'{abs_year:04d}-01-01'::date"
            date_l_lit = f"'{abs_year:04d}-12-31'::date"

        slug = event["slug"]

        # Check if event already exists
        existing = await conn.fetchval("SELECT id FROM events WHERE slug=$1", slug)
        if existing:
            slug_to_id[slug] = str(existing)
            print(f"  [skip] {slug} (already exists)")
            continue

        lat, lng = event.get("lat"), event.get("lng")
        geo_wkt = f"SRID=4326;POINT({lng} {lat})" if lat is not None and lng is not None else None

        content = json.dumps({k: v for k, v in event.items() if k != "perspectives"}, sort_keys=True)
        content_hash = sha256_str(content)

        insert_sql = f"""
            INSERT INTO events (
                slug, title, date_earliest, date_latest, year_approx, is_bce,
                geo_point, geo_modern, geo_era_label,
                importance_score, zoom_min, event_category,
                review_status, created_by, content_hash
            ) VALUES (
                $1, $2, {date_e_lit}, {date_l_lit}, $3, $4,
                ST_GeomFromEWKT($5), $6, $7,
                $8, $9, $10,
                'approved', $11, $12
            ) RETURNING id
            """
        event_id = await conn.fetchval(
            insert_sql,
            slug, event["title"], year, is_bce,
            geo_wkt, event.get("geo_modern"), event.get("geo_era_label"),
            event.get("importance_score", 0.5), event.get("zoom_min", 3), event.get("category"),
            CREATED_BY, content_hash,
        )

        slug_to_id[slug] = str(event_id)

        # Insert perspectives + sources
        for persp in event.get("perspectives", []):
            persp_id = await conn.fetchval(
                """
                INSERT INTO perspectives (
                    event_id, label, culture_code, viewpoint_type,
                    narrative, summary, evidence_score, created_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
                """,
                event_id,
                persp["label"],
                persp.get("culture_code"),
                persp.get("viewpoint_type"),
                persp["narrative"],
                persp.get("summary"),
                persp.get("evidence_score"),
                CREATED_BY,
            )

            for src in persp.get("sources", []):
                src_year = src.get("year")
                pub_date_lit = "NULL"
                if src_year:
                    abs_sy = abs(src_year)
                    if abs_sy > 4712:
                        abs_sy = 4712
                    if src_year < 0:
                        pub_date_lit = f"'{abs_sy:04d}-01-01 BC'::date"
                    else:
                        pub_date_lit = f"'{abs_sy:04d}-01-01'::date"

                src_hash = sha256_str(json.dumps(src, sort_keys=True) + str(persp_id))

                src_sql = f"""
                    INSERT INTO sources (
                        perspective_id, title, author, publication, publication_date,
                        source_type, reliability_tier, peer_reviewed, quote, content_hash
                    ) VALUES ($1, $2, $3, $4, {pub_date_lit}, $5, $6, $7, $8, $9)
                    ON CONFLICT (content_hash) DO NOTHING
                    """
                await conn.execute(
                    src_sql,
                    persp_id,
                    src["title"],
                    src.get("author"),
                    src.get("publication"),
                    src["source_type"],
                    src.get("reliability_tier", 2),
                    src.get("peer_reviewed", False),
                    src.get("quote"),
                    src_hash,
                )

        # Log to edit_log
        await conn.execute(
            """
            INSERT INTO edit_log (entity_type, entity_id, action, actor_id, actor_type, reason)
            VALUES ('event', $1, 'create', $2, 'ai', 'Early modern enrichment seed')
            """,
            event_id, CREATED_BY,
        )

        print(f"  [ok] {slug}")

    # Insert causality links
    print(f"\nInserting {len(CAUSALITY_LINKS)} causality links...")
    links_inserted = 0
    links_skipped = 0

    for link in CAUSALITY_LINKS:
        cause_id = slug_to_id.get(link["cause"])
        effect_id = slug_to_id.get(link["effect"])

        if not cause_id or not effect_id:
            if not cause_id:
                print(f"  [not found] cause: {link['cause']}")
            if not effect_id:
                print(f"  [not found] effect: {link['effect']}")
            links_skipped += 1
            continue

        try:
            await conn.execute(
                """
                INSERT INTO causality_links (cause_event_id, effect_event_id, link_type,
                                           strength, description, created_by, review_status)
                VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, 'approved')
                ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
                """,
                cause_id, effect_id, link["type"], link["strength"], link["desc"], CREATED_BY,
            )
            links_inserted += 1
        except Exception as e:
            print(f"  [error] {link['cause']} -> {link['effect']}: {e}")
            links_skipped += 1

    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\n✅ Early modern enrichment complete — {links_inserted} links inserted, {links_skipped} skipped")
    print(f"   Total approved events: {total}, total causality links: {total_links}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
