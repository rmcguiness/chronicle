#!/usr/bin/env python3
"""
Chronicle seed script — 19th century + modern era (2000+) enrichment.

Adds ~100 new events to underrepresented periods, skipping any that already
exist (checked by both slug AND title).

Run:
    python backend/scripts/seed_19c_modern.py
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

CREATED_BY = "seed-script:19c-modern-enrichment-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


EVENTS: list[dict[str, Any]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # 19TH CENTURY — TECHNOLOGY & ENGINEERING
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "stephenson-rocket-1829",
        "title": "Stephenson's Rocket — The Locomotive That Won the Rainhill Trials",
        "year": 1829, "lat": 53.45, "lng": -2.71,
        "geo_modern": "Rainhill, Lancashire, England",
        "geo_era_label": "Industrial Revolution",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "George and Robert Stephenson's Rocket won the 1829 Rainhill Trials, proving the viability of steam locomotives for passenger railways. Its multi-tube boiler design became the template for nearly all subsequent steam engines.",
             "summary": "The locomotive that proved rail travel was the future of transport.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "Fire & Steam", "author": "Christian Wolmar", "publication": "Atlantic Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "benz-patent-motorwagen-1885",
        "title": "Benz Patent-Motorwagen — First True Automobile",
        "year": 1885, "lat": 49.01, "lng": 8.40,
        "geo_modern": "Mannheim, Germany",
        "geo_era_label": "German Empire",
        "category": "discovery", "importance_score": 0.80, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Karl Benz patented the Motorwagen in 1886 — the first vehicle designed from the ground up as a gasoline-powered automobile. His wife Bertha's 1888 long-distance drive proved its practicality and launched the automotive age.",
             "summary": "The birth of the automobile — Karl Benz invents the car.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Karl Benz: A Life Devoted to the Automobile", "author": "St. John Nixon",
                  "publication": "G.T. Foulis", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1936}
             ]},
        ],
    },
    {
        "slug": "first-modern-olympics-1896",
        "title": "First Modern Olympic Games in Athens",
        "year": 1896, "lat": 37.97, "lng": 23.72,
        "geo_modern": "Athens, Greece",
        "geo_era_label": "Late 19th Century",
        "category": "cultural", "importance_score": 0.80, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Sports history perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "Pierre de Coubertin's vision of reviving the ancient Olympic Games became reality in Athens in April 1896. Fourteen nations sent 241 athletes to compete in 43 events, establishing the world's premier international sporting tradition.",
             "summary": "Revival of the ancient Olympics — birth of the modern Games.",
             "evidence_score": 0.90,
             "sources": [
                 {"title": "The Olympics: A History of the Modern Games", "author": "Allen Guttmann",
                  "publication": "University of Illinois Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "faraday-electromagnetic-induction-1831",
        "title": "Faraday Discovers Electromagnetic Induction",
        "year": 1831, "lat": 51.51, "lng": -0.10,
        "geo_modern": "London, England",
        "geo_era_label": "Victorian Britain",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Michael Faraday's 1831 discovery that a changing magnetic field induces electric current laid the foundation for electric generators, transformers, and the entire electrical power industry. A self-taught bookbinder's apprentice, he became one of history's greatest experimentalists.",
             "summary": "The discovery that made electric power generation possible.",
             "evidence_score": 0.92,
             "sources": [
                 {"title": "Experimental Researches in Electricity", "author": "Michael Faraday",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1839}
             ]},
        ],
    },
    {
        "slug": "war-of-1812-us-britain",
        "title": "War of 1812 — United States vs. Britain",
        "year": 1812, "lat": 38.90, "lng": -77.04,
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Early Republic America",
        "category": "war", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The War of 1812 against Britain (1812–1815) affirmed American sovereignty, produced the Star-Spangled Banner, and ended British support for Native American resistance east of the Mississippi. The burning of Washington and the Battle of New Orleans shaped national identity.",
             "summary": "America's 'second war of independence' against Britain.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "The Civil War of 1812", "author": "Alan Taylor", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "romanticism-movement-early-1800s",
        "title": "Romanticism Movement — Art Rebels Against the Enlightenment",
        "year": 1800, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Europe (Germany, England, France)",
        "geo_era_label": "Post-Enlightenment Europe",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Art history perspective", "culture_code": "eu", "viewpoint_type": "academic",
             "narrative": "Romanticism (c. 1790–1850) rejected Enlightenment rationalism in favor of emotion, nature, and individualism. From Beethoven's symphonies to Wordsworth's poetry and Delacroix's paintings, it reshaped Western art, literature, and philosophy.",
             "summary": "The cultural movement that elevated emotion, nature, and the individual.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "The Roots of Romanticism", "author": "Isaiah Berlin", "publication": "Princeton University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "cholera-pandemic-1817",
        "title": "First Cholera Pandemic Spreads from India",
        "year": 1817, "lat": 22.57, "lng": 88.36,
        "geo_modern": "Calcutta, India",
        "geo_era_label": "British India",
        "category": "disaster", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Medical history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The first cholera pandemic (1817–1824) originated in Bengal and spread through trade routes to Southeast Asia, the Middle East, and East Africa. It was the first of seven pandemics and demonstrated how global trade networks could rapidly spread disease.",
             "summary": "The first global cholera pandemic — disease follows trade routes.",
             "evidence_score": 0.83,
             "sources": [
                 {"title": "The Ghost Map", "author": "Steven Johnson", "publication": "Riverhead Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "monroe-doctrine-1823",
        "title": "Monroe Doctrine — America Claims the Western Hemisphere",
        "year": 1823, "lat": 38.90, "lng": -77.04,
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Early Republic America",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American diplomatic perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "President James Monroe's 1823 declaration warned European powers against further colonization or interference in the Americas. Initially unenforceable, it became a cornerstone of US foreign policy, later invoked to justify American intervention across Latin America.",
             "summary": "The declaration that defined American hegemony over the Western Hemisphere.",
             "evidence_score": 0.87,
             "sources": [
                 {"title": "The Monroe Doctrine: Empire and Nation in Nineteenth-Century America", "author": "Jay Sexton",
                  "publication": "Hill and Wang", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "erie-canal-opens-1825",
        "title": "Erie Canal Opens — Connecting the Atlantic to the Great Lakes",
        "year": 1825, "lat": 42.88, "lng": -78.88,
        "geo_modern": "Buffalo, New York, USA",
        "geo_era_label": "Early Republic America",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "American economic perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The 363-mile Erie Canal, completed in 1825, reduced shipping costs by 95% between the Atlantic and Great Lakes. It transformed New York City into America's commercial capital and triggered a canal-building boom across the nation.",
             "summary": "The canal that made New York City and opened the American interior.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Wedding of the Waters", "author": "Peter Bernstein", "publication": "W.W. Norton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "slavery-abolished-france-colonies-1848",
        "title": "France Abolishes Slavery in All Colonies",
        "year": 1848, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "French Second Republic",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "French Republican perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "Victor Schoelcher's decree of April 27, 1848 abolished slavery throughout the French empire, freeing approximately 250,000 enslaved people in Guadeloupe, Martinique, French Guiana, and Réunion. It fulfilled the revolutionary promise first attempted in 1794.",
             "summary": "Final abolition of slavery across the French empire.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "The French Atlantic Triangle", "author": "Christopher Miller", "publication": "Duke University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "great-exhibition-crystal-palace-1851",
        "title": "Great Exhibition at the Crystal Palace — Industry on Display",
        "year": 1851, "lat": 51.50, "lng": -0.18,
        "geo_modern": "London, England",
        "geo_era_label": "Victorian Britain",
        "category": "cultural", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British imperial perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The Great Exhibition of 1851, housed in Joseph Paxton's revolutionary Crystal Palace in Hyde Park, showcased Britain's industrial supremacy. Over six million visitors viewed 100,000 exhibits from around the world — the first World's Fair.",
             "summary": "The first World's Fair — Victorian Britain shows off its industrial might.",
             "evidence_score": 0.87,
             "sources": [
                 {"title": "The Great Exhibition", "author": "Jeffrey Auerbach", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "florence-nightingale-modern-nursing-1854",
        "title": "Florence Nightingale Pioneers Modern Nursing in the Crimea",
        "year": 1854, "lat": 41.00, "lng": 29.01,
        "geo_modern": "Scutari (Üsküdar), Istanbul, Turkey",
        "geo_era_label": "Ottoman Empire / Crimean War",
        "category": "social", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Medical history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Florence Nightingale's work at the Scutari military hospital during the Crimean War (1854–1856) reduced the death rate from 42% to 2% through sanitation reforms. Her statistical methods and advocacy transformed nursing into a professional discipline.",
             "summary": "The Lady with the Lamp who revolutionized healthcare and nursing.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Florence Nightingale: The Making of an Icon", "author": "Mark Bostridge",
                  "publication": "Farrar, Straus and Giroux", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "first-oil-well-drake-1859",
        "title": "First Commercial Oil Well — Drake's Folly at Titusville",
        "year": 1859, "lat": 41.63, "lng": -79.67,
        "geo_modern": "Titusville, Pennsylvania, USA",
        "geo_era_label": "Antebellum America",
        "category": "discovery", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Energy history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Edwin Drake's successful drilling of an oil well at Titusville, Pennsylvania in August 1859 launched the petroleum industry. Mocked as 'Drake's Folly' before striking oil at 69 feet, it began the fossil fuel age that would transform civilization.",
             "summary": "The oil well that launched the petroleum age.",
             "evidence_score": 0.87,
             "sources": [
                 {"title": "The Prize: The Epic Quest for Oil, Money & Power", "author": "Daniel Yergin",
                  "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "red-cross-founded-1863",
        "title": "International Red Cross Founded by Henry Dunant",
        "year": 1863, "lat": 46.20, "lng": 6.15,
        "geo_modern": "Geneva, Switzerland",
        "geo_era_label": "19th-Century Europe",
        "category": "social", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Humanitarian perspective", "culture_code": "ch", "viewpoint_type": "academic",
             "narrative": "Horrified by the aftermath of the Battle of Solferino (1859), Swiss businessman Henry Dunant founded the International Committee of the Red Cross in 1863. It established the principle that wounded soldiers deserve neutral care regardless of which side they fight on.",
             "summary": "Birth of international humanitarian law and neutral wartime medical care.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "A Memory of Solferino", "author": "Henry Dunant",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1862}
             ]},
        ],
    },
    {
        "slug": "dynamite-invented-nobel-1867",
        "title": "Alfred Nobel Invents Dynamite",
        "year": 1867, "lat": 59.33, "lng": 18.07,
        "geo_modern": "Stockholm, Sweden",
        "geo_era_label": "19th-Century Europe",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "se", "viewpoint_type": "academic",
             "narrative": "Alfred Nobel's 1867 patent for dynamite tamed nitroglycerin into a safe, usable explosive. It revolutionized mining, construction, and warfare. Nobel's later guilt over dynamite's destructive potential led him to establish the Nobel Prizes.",
             "summary": "The explosive that reshaped construction and warfare — and funded the Nobel Prizes.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "The Merchant of Death: Alfred Nobel", "author": "Kenne Fant",
                  "publication": "St. Martin's Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "typewriter-patented-sholes-1868",
        "title": "Sholes Patents the Typewriter — QWERTY Is Born",
        "year": 1868, "lat": 43.04, "lng": -87.91,
        "geo_modern": "Milwaukee, Wisconsin, USA",
        "geo_era_label": "Reconstruction America",
        "category": "discovery", "importance_score": 0.60, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Christopher Latham Sholes's typewriter patent of 1868 introduced the QWERTY keyboard layout. Manufactured by Remington from 1873, it transformed office work, opened clerical careers to women, and created a keyboard layout that persists in the digital age.",
             "summary": "The invention that revolutionized office work and created the QWERTY layout.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Iron Whim: A Fragmented History of Typewriting", "author": "Darren Wershler-Henry",
                  "publication": "Cornell University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "phonograph-edison-1877",
        "title": "Edison Invents the Phonograph — Recorded Sound",
        "year": 1877, "lat": 40.74, "lng": -74.17,
        "geo_modern": "Menlo Park, New Jersey, USA",
        "geo_era_label": "Gilded Age America",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Thomas Edison's phonograph (1877) was the first device to record and reproduce sound. Reciting 'Mary Had a Little Lamb' into the cylinder, Edison created an entirely new relationship between humans and sound — music, speech, and memory could now be preserved.",
             "summary": "The invention that made it possible to record and replay sound.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Edison: A Biography", "author": "Matthew Josephson", "publication": "McGraw-Hill",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1959}
             ]},
        ],
    },
    {
        "slug": "first-skyscraper-chicago-1885",
        "title": "First Skyscraper Built in Chicago — Home Insurance Building",
        "year": 1885, "lat": 41.88, "lng": -87.63,
        "geo_modern": "Chicago, Illinois, USA",
        "geo_era_label": "Gilded Age America",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Architecture history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "William Le Baron Jenney's Home Insurance Building (1885) used a steel skeleton frame to support its weight — the first true skyscraper. Rising 10 stories in Chicago, it launched vertical urbanization and the modern city skyline.",
             "summary": "The first steel-frame skyscraper — birth of the modern urban skyline.",
             "evidence_score": 0.83,
             "sources": [
                 {"title": "The Heights: Anatomy of a Skyscraper", "author": "Kate Ascher",
                  "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "germ-theory-koch-postulates-1890",
        "title": "Koch's Postulates — Scientific Proof That Germs Cause Disease",
        "year": 1890, "lat": 52.52, "lng": 13.41,
        "geo_modern": "Berlin, Germany",
        "geo_era_label": "German Empire",
        "category": "discovery", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Medical history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Robert Koch's postulates (formalized c. 1890) established the scientific criteria for proving a specific microorganism causes a specific disease. Building on his identification of tuberculosis (1882) and cholera (1883) bacteria, Koch's framework became the gold standard of medical microbiology.",
             "summary": "The scientific framework that proved specific germs cause specific diseases.",
             "evidence_score": 0.90,
             "sources": [
                 {"title": "Robert Koch: A Life in Medicine and Bacteriology", "author": "Thomas Brock",
                  "publication": "ASM Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "ottoman-tanzimat-reforms-land-law-1858",
        "title": "Ottoman Land Code of 1858 — Tanzimat Reforms Reshape Property",
        "year": 1858, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Istanbul, Turkey",
        "geo_era_label": "Ottoman Empire",
        "category": "political", "importance_score": 0.60, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Ottoman reform perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "The 1858 Ottoman Land Code was a key Tanzimat reform that attempted to modernize land ownership and taxation. It centralized property registration under the state, disrupting traditional communal land arrangements and concentrating ownership among urban elites and absentee landlords.",
             "summary": "Ottoman modernization of land law — intended to reform, often dispossessed peasants.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "A History of the Modern Middle East", "author": "William Cleveland",
                  "publication": "Westview Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "south-african-diamond-rush-1867",
        "title": "South African Diamond Rush Begins at Kimberley",
        "year": 1867, "lat": -28.74, "lng": 24.76,
        "geo_modern": "Kimberley, South Africa",
        "geo_era_label": "Colonial Southern Africa",
        "category": "economic", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Southern African perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "The discovery of diamonds at Kimberley in 1867 triggered a rush that transformed southern Africa. It drew Cecil Rhodes and De Beers, established migrant labor patterns, and accelerated British imperial expansion — laying the groundwork for apartheid-era mining economics.",
             "summary": "The diamond discovery that reshaped southern Africa's economy and politics.",
             "evidence_score": 0.83,
             "sources": [
                 {"title": "Diamonds, Gold, and War", "author": "Martin Meredith", "publication": "Public Affairs",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "sepoy-mutiny-aftermath-british-raj-1858",
        "title": "British Crown Takes Direct Control of India — End of East India Company",
        "year": 1858, "lat": 28.61, "lng": 77.23,
        "geo_modern": "Delhi, India",
        "geo_era_label": "British India",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Indian perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "Following the Indian Rebellion of 1857, the Government of India Act 1858 dissolved the East India Company and placed India under direct British Crown rule. Queen Victoria was proclaimed Empress of India in 1876, formalizing the British Raj that would last until 1947.",
             "summary": "The East India Company replaced by direct Crown rule — the British Raj begins.",
             "evidence_score": 0.87,
             "sources": [
                 {"title": "The Great Mutiny: India 1857", "author": "Christopher Hibbert",
                  "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1978}
             ]},
        ],
    },
    {
        "slug": "opening-japan-harris-treaty-1858",
        "title": "Treaty of Amity and Commerce — Japan Opens to Western Trade",
        "year": 1858, "lat": 35.44, "lng": 139.64,
        "geo_modern": "Shimoda, Japan",
        "geo_era_label": "Late Tokugawa Japan",
        "category": "political", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Japanese perspective", "culture_code": "jp", "viewpoint_type": "academic",
             "narrative": "The Harris Treaty of 1858 forced Japan into unequal trading terms with the United States, opening additional ports and granting extraterritorial rights to Americans. These 'unequal treaties' humiliated the Tokugawa shogunate and accelerated the Meiji Restoration.",
             "summary": "Forced opening of Japan to Western trade — catalyst for the Meiji Restoration.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Making of Modern Japan", "author": "Marius Jansen", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "panic-of-1873-long-depression",
        "title": "Panic of 1873 — First Global Great Depression",
        "year": 1873, "lat": 40.71, "lng": -74.01,
        "geo_modern": "New York City, USA / Vienna, Austria",
        "geo_era_label": "Gilded Age",
        "category": "economic", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Economic history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Panic of 1873 triggered a global economic depression lasting until 1896. Beginning with the collapse of Jay Cooke & Company and the Vienna stock exchange crash, it caused widespread unemployment, deflation, and social unrest — fueling labor movements and protectionism worldwide.",
             "summary": "The first truly global economic depression — two decades of hardship.",
             "evidence_score": 0.83,
             "sources": [
                 {"title": "The Long Depression", "author": "Michael Roberts", "publication": "Haymarket Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "dreyfus-affair-zola-j-accuse-1898",
        "title": "Émile Zola Publishes J'Accuse — The Dreyfus Affair Explodes",
        "year": 1898, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "Third French Republic",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "French perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "Émile Zola's open letter 'J'Accuse…!' (January 1898) accused the French military of antisemitism and cover-up in the wrongful conviction of Captain Alfred Dreyfus. The resulting national crisis split France, strengthened secular republicanism, and helped inspire Theodor Herzl's Zionist movement.",
             "summary": "Zola's letter that exposed injustice and tore France apart.",
             "evidence_score": 0.87,
             "sources": [
                 {"title": "An Officer and a Spy", "author": "Robert Harris", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "klondike-gold-rush-1896",
        "title": "Klondike Gold Rush — Stampede to the Yukon",
        "year": 1896, "lat": 63.86, "lng": -138.51,
        "geo_modern": "Dawson City, Yukon, Canada",
        "geo_era_label": "Late 19th Century",
        "category": "economic", "importance_score": 0.60, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "North American perspective", "culture_code": "ca", "viewpoint_type": "academic",
             "narrative": "The Klondike Gold Rush (1896–1899) drew 100,000 prospectors to the Canadian Yukon after gold was discovered on Bonanza Creek. The brutal journey through Chilkoot Pass became legendary, transforming the region and devastating First Nations communities.",
             "summary": "100,000 fortune seekers brave the Yukon — the last great gold rush.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Klondike Fever", "author": "Pierre Berton", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1958}
             ]},
        ],
    },
    {
        "slug": "first-zionist-congress-1897",
        "title": "First Zionist Congress — Herzl's Vision of a Jewish State",
        "year": 1897, "lat": 47.56, "lng": 7.59,
        "geo_modern": "Basel, Switzerland",
        "geo_era_label": "Late 19th Century",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Zionist perspective", "culture_code": "global-jewish", "viewpoint_type": "academic",
             "narrative": "Theodor Herzl convened the First Zionist Congress in Basel in August 1897, creating the World Zionist Organization and formally declaring the goal of establishing a Jewish homeland in Palestine. Herzl wrote: 'In Basel I founded the Jewish state.'",
             "summary": "The congress that launched political Zionism and the quest for a Jewish homeland.",
             "evidence_score": 0.87,
             "sources": [
                 {"title": "Herzl", "author": "Amos Elon", "publication": "Holt, Rinehart and Winston",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1975}
             ]},
        ],
    },
    {
        "slug": "aspirin-patented-bayer-1899",
        "title": "Aspirin Patented by Bayer — Birth of Modern Pharmaceuticals",
        "year": 1899, "lat": 51.10, "lng": 7.02,
        "geo_modern": "Leverkusen, Germany",
        "geo_era_label": "German Empire",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Medical history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Felix Hoffmann at Bayer synthesized acetylsalicylic acid (aspirin) in 1897, and it was marketed from 1899. The first mass-produced pharmaceutical, aspirin became the world's most widely used drug and established the modern pharmaceutical industry.",
             "summary": "The world's first blockbuster drug — from Bayer lab to every medicine cabinet.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "Aspirin: The Remarkable Story of a Wonder Drug", "author": "Diarmuid Jeffreys",
                  "publication": "Bloomsbury", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "suez-canal-opens-1869",
        "title": "Suez Canal Opens — Mediterranean Meets the Red Sea",
        "year": 1869, "lat": 30.58, "lng": 32.27,
        "geo_modern": "Port Said, Egypt",
        "geo_era_label": "Ottoman Egypt",
        "category": "discovery", "importance_score": 0.80, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Global trade perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Suez Canal opened on November 17, 1869, reducing the voyage from London to Mumbai by 6,000 miles. It became the most strategically important waterway in the world, reshaping global trade and sparking decades of imperial rivalry over its control.",
             "summary": "The canal that halved the journey from Europe to Asia.",
             "evidence_score": 0.89,
             "sources": [
                 {"title": "Parting the Desert", "author": "Zachary Karabell", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "samoa-partition-1899",
        "title": "Tripartite Convention — Samoa Partitioned Between Powers",
        "year": 1899, "lat": -13.83, "lng": -171.76,
        "geo_modern": "Samoa",
        "geo_era_label": "Imperial Pacific",
        "category": "political", "importance_score": 0.55, "zoom_min": 5, "is_bce": False,
        "perspectives": [
            {"label": "Pacific Islands perspective", "culture_code": "ws", "viewpoint_type": "academic",
             "narrative": "The Tripartite Convention of 1899 formally divided Samoa between the United States (American Samoa) and Germany (Western Samoa), ending a decade of civil war fueled by imperial rivalries. Samoan agency was entirely excluded from the negotiation.",
             "summary": "Western powers carve up Samoa — Pacific Islanders have no say.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Samoa Islands", "author": "Augustin Krämer", "publication": "University of Hawai'i Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "fashoda-incident-1898",
        "title": "Fashoda Incident — Britain and France Nearly Go to War in Africa",
        "year": 1898, "lat": 9.89, "lng": 32.12,
        "geo_modern": "Kodok (Fashoda), South Sudan",
        "geo_era_label": "Scramble for Africa",
        "category": "political", "importance_score": 0.60, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Imperial history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Fashoda Incident of 1898 brought Britain and France to the brink of war when their competing expeditions met at Fashoda on the White Nile. France's withdrawal marked the end of French ambitions for a trans-African empire and paved the way for the Entente Cordiale.",
             "summary": "The colonial crisis that nearly caused a war between Britain and France.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Scramble for Africa", "author": "Thomas Pakenham", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "cuba-independence-war-1895",
        "title": "Cuban War of Independence — José Martí and the Struggle Against Spain",
        "year": 1895, "lat": 23.13, "lng": -82.38,
        "geo_modern": "Havana, Cuba",
        "geo_era_label": "Spanish Colonial Caribbean",
        "category": "war", "importance_score": 0.65, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Cuban perspective", "culture_code": "cu", "viewpoint_type": "nationalist",
             "narrative": "The Cuban War of Independence (1895–1898), led by José Martí and Antonio Maceo, was the culmination of decades of struggle against Spanish rule. Spain's brutal reconcentration camps killed hundreds of thousands and drew US intervention, leading to the Spanish-American War.",
             "summary": "Cuba's bloody fight for freedom from Spain — catalyst for American empire.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "José Martí: An Introduction", "author": "Oscar Montero",
                  "publication": "Palgrave Macmillan", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "boxer-rebellion-eight-nation-1900",
        "title": "Eight-Nation Alliance Invades China — Boxer Protocol",
        "year": 1900, "lat": 39.91, "lng": 116.40,
        "geo_modern": "Beijing, China",
        "geo_era_label": "Late Qing Dynasty",
        "category": "war", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Chinese perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Eight-Nation Alliance's 1900 invasion to suppress the Boxer Rebellion humiliated China. The Boxer Protocol imposed massive indemnities and foreign military garrisons in Beijing, deepening China's 'Century of Humiliation' and fueling revolutionary movements.",
             "summary": "Eight foreign armies occupy Beijing — China's humiliation deepens.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "The Boxer Rebellion and the Great Game in China", "author": "David Silbey",
                  "publication": "Hill and Wang", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # 19TH CENTURY — ADDITIONAL EVENTS FOR DIVERSITY
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "opium-trade-india-china-triangle-1820",
        "title": "British Opium Trade Floods China — East India Company Profits",
        "year": 1820, "lat": 22.28, "lng": 114.16,
        "geo_modern": "Canton (Guangzhou), China",
        "geo_era_label": "Late Qing Dynasty",
        "category": "economic", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Chinese perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "By the 1820s, the East India Company was exporting over 900 tons of opium annually from India to China, creating millions of addicts and draining China's silver reserves. Chinese attempts to stop the trade led directly to the Opium Wars.",
             "summary": "The drug trade that addicted millions and triggered China's 'Century of Humiliation.'",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "The Opium War", "author": "Julia Lovell", "publication": "Picador",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "reconstruction-era-us-1865",
        "title": "Reconstruction Era Begins — Remaking the American South",
        "year": 1865, "lat": 32.78, "lng": -79.93,
        "geo_modern": "Charleston, South Carolina, USA",
        "geo_era_label": "Reconstruction America",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "African American perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Reconstruction (1865–1877) attempted to rebuild the South and integrate formerly enslaved people into American democracy. Black Americans held office, established schools, and built communities, but white supremacist violence and political compromise ended these gains prematurely.",
             "summary": "America's first experiment in multiracial democracy — sabotaged by white supremacy.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Reconstruction: America's Unfinished Revolution", "author": "Eric Foner",
                  "publication": "Harper & Row", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 1988}
             ]},
        ],
    },
    {
        "slug": "chincha-islands-war-1864",
        "title": "Chincha Islands War — Spain's Last Stand in South America",
        "year": 1864, "lat": -13.63, "lng": -76.38,
        "geo_modern": "Chincha Islands, Peru",
        "geo_era_label": "19th-Century South America",
        "category": "war", "importance_score": 0.55, "zoom_min": 5, "is_bce": False,
        "perspectives": [
            {"label": "South American perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Spain's seizure of Peru's guano-rich Chincha Islands in 1864 sparked the last Spanish military intervention in South America. A coalition of Peru, Chile, Bolivia, and Ecuador defeated Spain, definitively ending any hopes of re-colonization.",
             "summary": "Spain's failed attempt to reassert power in South America.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The War of the Pacific", "author": "William Sater",
                  "publication": "University of Nebraska Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # MODERN ERA (2000+) — TECHNOLOGY & INTERNET
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "myspace-social-networking-2003",
        "title": "MySpace Launches — First Mass Social Network",
        "year": 2003, "lat": 34.05, "lng": -118.24,
        "geo_modern": "Los Angeles, California, USA",
        "geo_era_label": "Early Social Media Era",
        "category": "discovery", "importance_score": 0.55, "zoom_min": 5, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "MySpace (2003) was the first social network to reach mainstream adoption, surpassing Google as the most-visited US website in 2006. It democratized music promotion and personal expression online before losing to Facebook's cleaner design and platform strategy.",
             "summary": "The first mass social network — precursor to the Facebook era.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Stealing MySpace", "author": "Julia Angwin", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "apple-app-store-2008",
        "title": "Apple Launches the App Store — The App Economy Begins",
        "year": 2008, "lat": 37.33, "lng": -122.01,
        "geo_modern": "Cupertino, California, USA",
        "geo_era_label": "Smartphone Era",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Apple's App Store launched in July 2008 with 500 apps. By enabling any developer to distribute software to millions of iPhones, it created the 'app economy' — a new software distribution model worth hundreds of billions of dollars annually.",
             "summary": "The marketplace that created the app economy and mobile computing era.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "The One Device: The Secret History of the iPhone", "author": "Brian Merchant",
                  "publication": "Little, Brown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2017}
             ]},
        ],
    },
    {
        "slug": "instagram-launches-2010",
        "title": "Instagram Launches — Photo Sharing Goes Mobile",
        "year": 2010, "lat": 37.77, "lng": -122.42,
        "geo_modern": "San Francisco, California, USA",
        "geo_era_label": "Social Media Era",
        "category": "discovery", "importance_score": 0.60, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Instagram launched in October 2010 and gained 1 million users in two months. Its photo filters and mobile-first design created a new visual culture, transforming how people present themselves and reshaping industries from fashion to food to travel.",
             "summary": "The app that transformed visual culture and created the influencer economy.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "No Filter: The Inside Story of Instagram", "author": "Sarah Frier",
                  "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2020}
             ]},
        ],
    },
    {
        "slug": "uber-ride-sharing-2009",
        "title": "Uber Founded — The Gig Economy Takes Shape",
        "year": 2009, "lat": 37.77, "lng": -122.42,
        "geo_modern": "San Francisco, California, USA",
        "geo_era_label": "Post-Financial Crisis",
        "category": "economic", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Economic perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Uber (founded 2009, launched 2010) pioneered the ride-hailing model that disrupted the taxi industry worldwide. It became the template for the 'gig economy,' raising fundamental questions about worker classification, regulation, and the future of employment.",
             "summary": "The company that disrupted transportation and launched the gig economy.",
             "evidence_score": 0.83,
             "sources": [
                 {"title": "Super Pumped: The Battle for Uber", "author": "Mike Isaac",
                  "publication": "W.W. Norton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "ipad-tablet-revolution-2010",
        "title": "Apple Launches the iPad — Tablet Computing Era Begins",
        "year": 2010, "lat": 37.33, "lng": -122.01,
        "geo_modern": "Cupertino, California, USA",
        "geo_era_label": "Post-Smartphone Era",
        "category": "discovery", "importance_score": 0.55, "zoom_min": 5, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Steve Jobs unveiled the iPad in January 2010, creating the modern tablet category. Selling 15 million units in its first year, the iPad transformed how people consume media, work, and learn — bridging the gap between smartphones and laptops.",
             "summary": "The device that created the modern tablet market.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "Steve Jobs", "author": "Walter Isaacson", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "bitcoin-whitepaper-satoshi-2008",
        "title": "Bitcoin Whitepaper Published — Satoshi Nakamoto's Vision",
        "year": 2008, "lat": 0.0, "lng": 0.0,
        "geo_modern": "Internet (unknown physical location)",
        "geo_era_label": "Financial Crisis Era",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Technology/finance perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The pseudonymous Satoshi Nakamoto published the Bitcoin whitepaper on October 31, 2008, proposing a 'peer-to-peer electronic cash system' requiring no trusted intermediary. Built on blockchain technology, it launched the cryptocurrency revolution and inspired thousands of digital currencies.",
             "summary": "The paper that launched cryptocurrency and blockchain technology.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Bitcoin: A Peer-to-Peer Electronic Cash System", "author": "Satoshi Nakamoto",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 2008}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # MODERN ERA (2000+) — AI & COMPUTING
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "gpt-3-language-model-2020",
        "title": "GPT-3 Released — Large Language Models Arrive",
        "year": 2020, "lat": 37.77, "lng": -122.42,
        "geo_modern": "San Francisco, California, USA",
        "geo_era_label": "AI Era",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "AI history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "OpenAI's GPT-3, released in June 2020, demonstrated that a 175-billion-parameter language model could write essays, code, and poetry with startling fluency. It sparked the large language model revolution and proved that scale could unlock emergent capabilities.",
             "summary": "The language model that proved AI could write — sparking the LLM revolution.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "Language Models are Few-Shot Learners", "author": "Tom Brown et al.",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 2020}
             ]},
        ],
    },
    {
        "slug": "dall-e-ai-image-generation-2021",
        "title": "DALL-E Unveiled — AI Generates Images from Text",
        "year": 2021, "lat": 37.77, "lng": -122.42,
        "geo_modern": "San Francisco, California, USA",
        "geo_era_label": "AI Era",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "AI history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "OpenAI unveiled DALL-E in January 2021, demonstrating that AI could generate novel images from text descriptions. The follow-up DALL-E 2 (2022) produced photorealistic results, launching the generative AI art revolution and raising profound questions about creativity and copyright.",
             "summary": "AI that creates images from words — the birth of generative visual AI.",
             "evidence_score": 0.83,
             "sources": [
                 {"title": "Zero-Shot Text-to-Image Generation", "author": "Aditya Ramesh et al.",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "gpt-4-multimodal-ai-2023",
        "title": "GPT-4 Released — Multimodal AI Breakthrough",
        "year": 2023, "lat": 37.77, "lng": -122.42,
        "geo_modern": "San Francisco, California, USA",
        "geo_era_label": "AI Era",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "AI history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "OpenAI released GPT-4 in March 2023, the first commercially available multimodal large language model capable of processing both text and images. It passed the bar exam, scored in the 90th percentile on many standardized tests, and accelerated enterprise AI adoption.",
             "summary": "The multimodal AI that passed professional exams and transformed enterprise AI.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "GPT-4 Technical Report", "author": "OpenAI",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 2023}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # MODERN ERA (2000+) — SPACE
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "mars-curiosity-rover-landing-2012",
        "title": "Curiosity Rover Lands on Mars — Seven Minutes of Terror",
        "year": 2012, "lat": -4.59, "lng": 137.44,
        "geo_modern": "Gale Crater, Mars",
        "geo_era_label": "Space Exploration Era",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Space exploration perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "NASA's Curiosity rover landed on Mars on August 6, 2012, using an audacious 'sky crane' maneuver. The car-sized rover discovered that Mars once had conditions favorable for microbial life, including liquid water, organic molecules, and the right chemistry.",
             "summary": "NASA's car-sized rover discovers Mars once had conditions for life.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "The Design and Engineering of Curiosity", "author": "Emily Lakdawalla",
                  "publication": "Springer", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2018}
             ]},
        ],
    },
    {
        "slug": "spacex-falcon-9-landing-2015",
        "title": "SpaceX Lands Falcon 9 — Reusable Rockets Become Reality",
        "year": 2015, "lat": 28.49, "lng": -80.58,
        "geo_modern": "Cape Canaveral, Florida, USA",
        "geo_era_label": "Commercial Space Era",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Space industry perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "On December 21, 2015, SpaceX successfully landed a Falcon 9 first stage booster after an orbital mission — the first time an orbital rocket had been recovered for reuse. This achievement fundamentally changed the economics of spaceflight and opened the door to routine space access.",
             "summary": "The first orbital rocket landing — reusable spaceflight becomes reality.",
             "evidence_score": 0.90,
             "sources": [
                 {"title": "Liftoff: Elon Musk and the Desperate Early Days of SpaceX", "author": "Eric Berger",
                  "publication": "William Morrow", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "spacex-falcon-heavy-launch-2018",
        "title": "SpaceX Falcon Heavy Launch — Starman in a Tesla",
        "year": 2018, "lat": 28.61, "lng": -80.60,
        "geo_modern": "Kennedy Space Center, Florida, USA",
        "geo_era_label": "Commercial Space Era",
        "category": "discovery", "importance_score": 0.60, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Space industry perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "SpaceX's Falcon Heavy, the most powerful operational rocket in the world, launched on February 6, 2018. Its payload — Elon Musk's personal Tesla Roadster with a mannequin 'Starman' — entered a heliocentric orbit, while two boosters simultaneously landed back on Earth.",
             "summary": "The world's most powerful rocket launches a car into space.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "SpaceX Falcon Heavy Demo Flight", "author": "SpaceX",
                  "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": 2018}
             ]},
        ],
    },
    {
        "slug": "artemis-i-moon-mission-2022",
        "title": "Artemis I — NASA Returns to the Moon",
        "year": 2022, "lat": 28.61, "lng": -80.60,
        "geo_modern": "Kennedy Space Center, Florida, USA",
        "geo_era_label": "Return to Moon Era",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Space exploration perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Artemis I launched on November 16, 2022, sending the uncrewed Orion spacecraft around the Moon and back — the first lunar mission since Apollo. It was the inaugural flight of the Space Launch System (SLS), the most powerful rocket ever flown, beginning NASA's plan to return astronauts to the Moon.",
             "summary": "NASA's return to the Moon — the first step toward a permanent lunar presence.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "Artemis I Mission Overview", "author": "NASA",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 2022}
             ]},
        ],
    },
    {
        "slug": "james-webb-deep-field-2022",
        "title": "James Webb Space Telescope Reveals Deep Field — Oldest Galaxies Seen",
        "year": 2022, "lat": 28.57, "lng": -80.65,
        "geo_modern": "Space (L2 Lagrange point, 1.5 million km from Earth)",
        "geo_era_label": "Space Telescope Era",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Astronomy perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "In July 2022, the James Webb Space Telescope revealed its first deep field image — the deepest and sharpest infrared view of the distant universe ever taken. JWST has since discovered galaxies forming just 300 million years after the Big Bang, challenging models of early galaxy formation.",
             "summary": "The most powerful space telescope reveals the universe's earliest galaxies.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "JWST First Deep Field Release", "author": "NASA/ESA/CSA",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 2022}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # MODERN ERA (2000+) — GEOPOLITICS & SOCIETY
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "iraq-war-wmds-2003",
        "title": "Iraq War Begins — Coalition Invasion Over WMD Claims",
        "year": 2003, "lat": 33.31, "lng": 44.37,
        "geo_modern": "Baghdad, Iraq",
        "geo_era_label": "War on Terror Era",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Anti-war perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The 2003 US-led invasion of Iraq, justified by claims of weapons of mass destruction that proved false, toppled Saddam Hussein but unleashed sectarian civil war, displaced millions, and destabilized the Middle East for decades. The decision remains one of the most consequential foreign policy blunders of the 21st century.",
             "summary": "The war built on false WMD claims that destabilized the Middle East.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Fiasco: The American Military Adventure in Iraq", "author": "Thomas Ricks",
                  "publication": "Penguin Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "bin-laden-killed-2011",
        "title": "Osama bin Laden Killed in US Raid on Abbottabad",
        "year": 2011, "lat": 34.17, "lng": 73.24,
        "geo_modern": "Abbottabad, Pakistan",
        "geo_era_label": "War on Terror Era",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "US Navy SEALs killed al-Qaeda leader Osama bin Laden on May 2, 2011, in a covert raid on his compound in Abbottabad, Pakistan — less than a mile from Pakistan's military academy. The operation ended a decade-long manhunt but raised questions about Pakistani complicity.",
             "summary": "The raid that killed the mastermind of 9/11 — ending a decade-long manhunt.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "No Easy Day", "author": "Mark Owen", "publication": "Dutton",
                  "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "covid-mrna-vaccines-2020",
        "title": "mRNA COVID-19 Vaccines — Fastest Vaccine Development in History",
        "year": 2020, "lat": 39.10, "lng": -76.77,
        "geo_modern": "Mainz, Germany / Cambridge, MA, USA",
        "geo_era_label": "COVID-19 Pandemic",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Pfizer-BioNTech and Moderna mRNA vaccines, authorized in December 2020, were developed in under a year — unprecedented in vaccine history. Building on decades of mRNA research by Katalin Karikó and others, they proved the mRNA platform and have since been administered billions of times.",
             "summary": "The fastest vaccine ever developed — proving mRNA technology can save millions.",
             "evidence_score": 0.92,
             "sources": [
                 {"title": "A Shot to Save the World", "author": "Gregory Zuckerman",
                  "publication": "Portfolio", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "tiktok-global-phenomenon-2018",
        "title": "TikTok Goes Global — Short-Form Video Conquers Social Media",
        "year": 2018, "lat": 39.91, "lng": 116.40,
        "geo_modern": "Beijing, China / Global",
        "geo_era_label": "Social Media Era",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Technology/culture perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "ByteDance merged Musical.ly into TikTok in 2018, creating a short-form video platform that by 2020 had over 2 billion downloads. Its AI-driven 'For You' algorithm revolutionized content recommendation and became a geopolitical flashpoint between the US and China.",
             "summary": "The Chinese app that conquered global social media through algorithmic content curation.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "Attention Factory: The Story of TikTok and China's ByteDance", "author": "Matthew Brennan",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2020}
             ]},
        ],
    },
    {
        "slug": "parkland-school-shooting-gun-debate-2018",
        "title": "Parkland School Shooting — Students Demand Gun Reform",
        "year": 2018, "lat": 26.30, "lng": -80.27,
        "geo_modern": "Parkland, Florida, USA",
        "geo_era_label": "Contemporary America",
        "category": "social", "importance_score": 0.60, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "American social perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The February 14, 2018 shooting at Marjory Stoneman Douglas High School killed 17 people. Surviving students launched the March for Our Lives movement, organizing one of the largest protests in American history and reinvigorating the gun control debate.",
             "summary": "Student survivors launch a national gun reform movement.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "Parkland: Birth of a Movement", "author": "Dave Cullen",
                  "publication": "Harper", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "brexit-uk-leaves-eu-2020",
        "title": "Brexit Completed — UK Officially Leaves the European Union",
        "year": 2020, "lat": 51.50, "lng": -0.13,
        "geo_modern": "London, United Kingdom",
        "geo_era_label": "Post-Brexit Era",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "European perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The UK formally left the EU on January 31, 2020, after the 2016 referendum, three years of parliamentary deadlock, and two Prime Ministers. The transition period ended on December 31, 2020, severing 47 years of European integration and reshaping British trade, immigration, and identity.",
             "summary": "The UK exits the EU — ending 47 years of European integration.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Brexit: What Everyone Needs to Know", "author": "Anand Menon",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2020}
             ]},
        ],
    },
    {
        "slug": "russia-ukraine-full-invasion-2022",
        "title": "Russia Launches Full-Scale Invasion of Ukraine",
        "year": 2022, "lat": 50.45, "lng": 30.52,
        "geo_modern": "Kyiv, Ukraine",
        "geo_era_label": "Post-Cold War Europe",
        "category": "war", "importance_score": 0.90, "zoom_min": 1, "is_bce": False,
        "perspectives": [
            {"label": "Ukrainian perspective", "culture_code": "ua", "viewpoint_type": "nationalist",
             "narrative": "On February 24, 2022, Russia launched a full-scale invasion of Ukraine, the largest conventional war in Europe since World War II. Ukraine's unexpected resistance, led by President Zelensky, rallied Western support and challenged assumptions about Russian military power, while millions of Ukrainians were displaced.",
             "summary": "Europe's largest war since 1945 — Ukraine defends its sovereignty against Russian invasion.",
             "evidence_score": 0.90,
             "sources": [
                 {"title": "The Gates of Europe: A History of Ukraine", "author": "Serhii Plokhy",
                  "publication": "Basic Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 2015}
             ]},
        ],
    },
    {
        "slug": "arab-spring-egypt-tahrir-2011",
        "title": "Egyptian Revolution — Tahrir Square Protests Topple Mubarak",
        "year": 2011, "lat": 30.04, "lng": 31.24,
        "geo_modern": "Cairo, Egypt",
        "geo_era_label": "Arab Spring",
        "category": "political", "importance_score": 0.80, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Egyptian perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Inspired by Tunisia, millions of Egyptians occupied Tahrir Square from January 25, 2011, demanding the end of Hosni Mubarak's 30-year rule. After 18 days of protests, Mubarak resigned on February 11 — though the revolution's democratic promise was later reversed by a military coup in 2013.",
             "summary": "The revolution that toppled Mubarak — and the counter-revolution that followed.",
             "evidence_score": 0.87,
             "sources": [
                 {"title": "The Eighteen Days of Tahrir", "author": "Ahdaf Soueif",
                  "publication": "Bloomsbury", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "snowden-nsa-revelations-2013",
        "title": "Edward Snowden Reveals Mass NSA Surveillance",
        "year": 2013, "lat": 38.95, "lng": -77.15,
        "geo_modern": "Washington, D.C. / Hong Kong / Moscow",
        "geo_era_label": "Digital Privacy Era",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Privacy/civil liberties perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "In June 2013, former NSA contractor Edward Snowden leaked thousands of classified documents revealing mass surveillance programs including PRISM, which collected data from major tech companies. The revelations sparked global debate about privacy, security, and government overreach in the digital age.",
             "summary": "The leak that exposed mass government surveillance — hero or traitor?",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "No Place to Hide", "author": "Glenn Greenwald", "publication": "Metropolitan Books",
                  "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "metoo-movement-global-2017",
        "title": "#MeToo Movement Exposes Systemic Sexual Harassment",
        "year": 2017, "lat": 34.05, "lng": -118.24,
        "geo_modern": "Global (originated Hollywood, USA)",
        "geo_era_label": "Social Media Activism Era",
        "category": "social", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Feminist perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The #MeToo hashtag, first used by Tarana Burke in 2006, went viral in October 2017 after allegations against Harvey Weinstein. Millions shared their experiences of sexual harassment and assault, toppling powerful figures across industries and sparking a global reckoning with gender-based violence.",
             "summary": "The movement that exposed systemic sexual harassment across industries worldwide.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "She Said", "author": "Jodi Kantor and Megan Twohey", "publication": "Penguin Press",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "extinction-rebellion-climate-activism-2018",
        "title": "Extinction Rebellion and Greta Thunberg — Climate Activism Surges",
        "year": 2018, "lat": 59.33, "lng": 18.07,
        "geo_modern": "Stockholm, Sweden / London, UK",
        "geo_era_label": "Climate Crisis Era",
        "category": "social", "importance_score": 0.60, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Environmental perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "In 2018, 15-year-old Greta Thunberg's solo school strike outside the Swedish parliament and the founding of Extinction Rebellion in London ignited a global youth climate movement. By 2019, millions participated in Fridays for Future strikes in over 150 countries.",
             "summary": "Youth-led climate activism goes global — demanding action on the climate emergency.",
             "evidence_score": 0.83,
             "sources": [
                 {"title": "No One Is Too Small to Make a Difference", "author": "Greta Thunberg",
                  "publication": "Penguin", "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "george-floyd-global-blm-2020",
        "title": "George Floyd Killing Sparks Global Racial Justice Protests",
        "year": 2020, "lat": 44.93, "lng": -93.27,
        "geo_modern": "Minneapolis, Minnesota, USA / Global",
        "geo_era_label": "Contemporary America",
        "category": "social", "importance_score": 0.80, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Racial justice perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The murder of George Floyd by Minneapolis police officer Derek Chauvin on May 25, 2020 sparked the largest protest movement in American history. An estimated 15-26 million people protested across all 50 states and internationally, demanding police reform and racial justice.",
             "summary": "The largest protest movement in US history — a global reckoning on racial justice.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "His Name Is George Floyd", "author": "Robert Samuels and Toluse Olorunnipa",
                  "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2022}
             ]},
        ],
    },
    {
        "slug": "spacex-crew-dragon-first-crewed-2020",
        "title": "SpaceX Crew Dragon — First Commercial Crewed Spaceflight",
        "year": 2020, "lat": 28.61, "lng": -80.60,
        "geo_modern": "Kennedy Space Center, Florida, USA",
        "geo_era_label": "Commercial Space Era",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Space industry perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "On May 30, 2020, SpaceX's Crew Dragon launched astronauts Doug Hurley and Bob Behnken to the ISS — the first crewed orbital spaceflight from American soil since the Space Shuttle retired in 2011, and the first time a private company sent humans to orbit.",
             "summary": "The first private company to launch humans to orbit — a new era of spaceflight.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Liftoff: Elon Musk and the Desperate Early Days of SpaceX", "author": "Eric Berger",
                  "publication": "William Morrow", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "covid-global-lockdowns-2020",
        "title": "COVID-19 Global Lockdowns — The World Shuts Down",
        "year": 2020, "lat": 30.59, "lng": 114.31,
        "geo_modern": "Wuhan, China / Global",
        "geo_era_label": "COVID-19 Pandemic",
        "category": "disaster", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Global public health perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Beginning with Wuhan's lockdown in January 2020, governments worldwide imposed unprecedented restrictions on movement, commerce, and social interaction. By April 2020, half of humanity was under some form of lockdown, transforming work, education, and daily life — and exposing deep inequalities.",
             "summary": "Half of humanity locked down — the most disruptive public health measure in history.",
             "evidence_score": 0.90,
             "sources": [
                 {"title": "The Premonition: A Pandemic Story", "author": "Michael Lewis",
                  "publication": "W.W. Norton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "remote-work-revolution-2020",
        "title": "Remote Work Revolution — COVID Transforms the Workplace",
        "year": 2020, "lat": 37.77, "lng": -122.42,
        "geo_modern": "Global",
        "geo_era_label": "COVID-19 Pandemic",
        "category": "social", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Labor/economic perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The COVID-19 pandemic forced hundreds of millions of knowledge workers to work from home almost overnight. What began as an emergency became a permanent shift — by 2022, hybrid work was the norm for white-collar jobs, reshaping cities, commuting patterns, and work-life balance.",
             "summary": "The pandemic-driven shift that permanently changed how the world works.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "Out of Office: The Big Problem and Bigger Promise of Working from Home",
                  "author": "Charlie Warzel and Anne Helen Petersen", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "supply-chain-crisis-2021",
        "title": "Global Supply Chain Crisis — Ships, Chips, and Shortages",
        "year": 2021, "lat": 30.06, "lng": 32.34,
        "geo_modern": "Global (Suez Canal / ports worldwide)",
        "geo_era_label": "Post-COVID Recovery",
        "category": "economic", "importance_score": 0.60, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Economic perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The post-COVID recovery exposed the fragility of global just-in-time supply chains. Semiconductor shortages, container ship backlogs, and the Ever Given blocking the Suez Canal in March 2021 created cascading shortages of everything from cars to baby formula, fueling inflation worldwide.",
             "summary": "The crisis that revealed how fragile global supply chains had become.",
             "evidence_score": 0.83,
             "sources": [
                 {"title": "How the World Ran Out of Everything", "author": "Peter Goodman",
                  "publication": "Mariner Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2022}
             ]},
        ],
    },
    {
        "slug": "electric-vehicle-tipping-point-2022",
        "title": "Electric Vehicles Reach Global Tipping Point",
        "year": 2022, "lat": 31.23, "lng": 121.47,
        "geo_modern": "Global (China leads production)",
        "geo_era_label": "Energy Transition Era",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Energy transition perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "In 2022, global EV sales exceeded 10 million for the first time, reaching 14% of all new car sales. China led production, Europe set EV mandates, and battery costs plummeted — signaling that the transition away from internal combustion engines had become irreversible.",
             "summary": "10 million EVs sold — the automotive industry's point of no return.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Global EV Outlook 2023", "author": "International Energy Agency",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 2023}
             ]},
        ],
    },
    {
        "slug": "us-china-tech-war-2019",
        "title": "US-China Tech War — Huawei Ban and Chip Restrictions",
        "year": 2019, "lat": 38.90, "lng": -77.04,
        "geo_modern": "Washington, D.C., USA / Shenzhen, China",
        "geo_era_label": "Great Power Competition",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Geopolitical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The US ban on Huawei (2019) and subsequent CHIPS Act restrictions on advanced semiconductor exports to China (2022) marked a new era of technological decoupling between the world's two largest economies. The tech war reshaped global supply chains and accelerated China's push for chip self-sufficiency.",
             "summary": "The technological decoupling of the US and China — reshaping global tech.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Chip War: The Fight for the World's Most Critical Technology", "author": "Chris Miller",
                  "publication": "Scribner", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 2022}
             ]},
        ],
    },
    {
        "slug": "afghan-women-rights-rollback-2021",
        "title": "Taliban Bans Girls from Secondary Education in Afghanistan",
        "year": 2021, "lat": 34.53, "lng": 69.17,
        "geo_modern": "Kabul, Afghanistan",
        "geo_era_label": "Post-US Withdrawal",
        "category": "social", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Human rights perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "After the Taliban retook power in August 2021, they progressively banned Afghan women and girls from secondary education, universities, most workplaces, and public life — the most extreme gender-based restrictions anywhere in the world. The UN called it 'gender apartheid.'",
             "summary": "The Taliban's erasure of women from public life — described as gender apartheid.",
             "evidence_score": 0.87,
             "sources": [
                 {"title": "Gender Persecution: The Basis for Refugee Claims", "author": "UN Refugee Agency",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 2023}
             ]},
        ],
    },
    {
        "slug": "indian-moon-landing-chandrayaan3-2023",
        "title": "India Lands on the Moon's South Pole — Chandrayaan-3",
        "year": 2023, "lat": 13.07, "lng": 80.24,
        "geo_modern": "Sriharikota, India / Moon South Pole",
        "geo_era_label": "New Space Race",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Indian perspective", "culture_code": "in", "viewpoint_type": "nationalist",
             "narrative": "India's Chandrayaan-3 successfully soft-landed near the Moon's south pole on August 23, 2023, making India the fourth nation to land on the Moon and the first to reach the south polar region. Achieved on a budget of $75 million, it demonstrated India's growing space capabilities.",
             "summary": "India becomes the first nation to land near the Moon's south pole.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Chandrayaan-3 Mission Overview", "author": "ISRO",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 2023}
             ]},
        ],
    },
    {
        "slug": "chatgpt-mainstream-ai-2022",
        "title": "ChatGPT Launches — AI Enters the Mainstream",
        "year": 2022, "lat": 37.77, "lng": -122.42,
        "geo_modern": "San Francisco, California, USA",
        "geo_era_label": "AI Era",
        "category": "discovery", "importance_score": 0.80, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "AI history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "OpenAI released ChatGPT on November 30, 2022. It reached 100 million users in two months — the fastest consumer technology adoption in history. By making conversational AI accessible to everyone, it triggered an AI arms race among tech giants and fundamentally shifted public understanding of AI capabilities.",
             "summary": "The chatbot that brought AI to the masses — fastest tech adoption ever.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "The coming wave of AI will transform everything", "author": "Mustafa Suleyman",
                  "publication": "Crown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2023}
             ]},
        ],
    },
    {
        "slug": "semiconductor-chips-act-2022",
        "title": "US CHIPS Act — $280 Billion to Rebuild Domestic Semiconductor Manufacturing",
        "year": 2022, "lat": 38.90, "lng": -77.04,
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Great Power Competition",
        "category": "political", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Industrial policy perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The CHIPS and Science Act, signed in August 2022, committed $280 billion — including $52 billion in direct subsidies — to rebuild US semiconductor manufacturing. Driven by supply chain fragility and competition with China, it marked the largest US industrial policy investment in decades.",
             "summary": "America's biggest industrial policy bet in decades — reshoring chip production.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Chip War", "author": "Chris Miller", "publication": "Scribner",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 2022}
             ]},
        ],
    },
    {
        "slug": "queen-elizabeth-death-2022",
        "title": "Queen Elizabeth II Dies — End of the Second Elizabethan Age",
        "year": 2022, "lat": 57.04, "lng": -3.22,
        "geo_modern": "Balmoral Castle, Scotland, UK",
        "geo_era_label": "Contemporary Britain",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Queen Elizabeth II died on September 8, 2022, after a 70-year reign — the longest in British history. Her death marked the end of an era for the United Kingdom and the Commonwealth, prompting a global outpouring of mourning and renewed debate about the monarchy's future.",
             "summary": "The end of the longest reign in British history — 70 years on the throne.",
             "evidence_score": 0.90,
             "sources": [
                 {"title": "Elizabeth the Queen", "author": "Sally Bedell Smith", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "israel-hamas-war-oct7-2023",
        "title": "October 7 Attack and Israel-Hamas War",
        "year": 2023, "lat": 31.35, "lng": 34.35,
        "geo_modern": "Gaza Strip / Southern Israel",
        "geo_era_label": "Middle East Conflict",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Multi-perspective analysis", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "On October 7, 2023, Hamas launched a devastating attack on southern Israel, killing approximately 1,200 people and taking over 200 hostages. Israel's massive military response in Gaza has killed tens of thousands of Palestinians, displaced nearly the entire population, and sparked global debate about proportionality, international law, and the Israeli-Palestinian conflict.",
             "summary": "The deadliest attack in Israeli history triggers devastating war in Gaza.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "International Court of Justice Advisory Opinion", "author": "ICJ",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 2024}
             ]},
        ],
    },
]


async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting 19c + modern enrichment seed — {len(EVENTS)} events")

    # Pre-load all existing titles for duplicate checking
    existing_titles = set()
    rows = await conn.fetch("SELECT title FROM events")
    for row in rows:
        existing_titles.add(row["title"])

    inserted = 0
    skipped = 0

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

        # Skip by slug
        existing = await conn.fetchval("SELECT id FROM events WHERE slug=$1", slug)
        if existing:
            print(f"  [skip] {slug} (slug exists)")
            skipped += 1
            continue

        # Skip by title
        if event["title"] in existing_titles:
            print(f"  [skip] {slug} (title exists)")
            skipped += 1
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

        await conn.execute(
            """
            INSERT INTO edit_log (entity_type, entity_id, action, actor_id, actor_type, reason)
            VALUES ('event', $1, 'create', $2, 'ai', '19c + modern enrichment seed')
            """,
            event_id, CREATED_BY,
        )

        inserted += 1
        print(f"  [ok] {slug}")

    c19 = await conn.fetchval("SELECT COUNT(*) FROM events WHERE year_approx BETWEEN 1800 AND 1900")
    modern = await conn.fetchval("SELECT COUNT(*) FROM events WHERE year_approx >= 2000")
    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    print(f"\n✅ Enrichment complete — inserted {inserted}, skipped {skipped}")
    print(f"   19th century events: {c19}")
    print(f"   Modern era events:   {modern}")
    print(f"   Total approved:      {total}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
