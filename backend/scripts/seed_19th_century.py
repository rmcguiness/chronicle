#!/usr/bin/env python3
"""
Chronicle seed script — 60 events for the 19th century (1800-1900).

Run:
    python backend/scripts/seed_19th_century.py
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

CREATED_BY = "seed-script:19th-century-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


EVENTS: list[dict[str, Any]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # 19TH CENTURY (1800–1900)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "haitian-revolution-independence",
        "title": "Haitian Revolution — First Black Republic",
        "year": 1804, "lat": 18.54, "lng": -72.34,
        "geo_modern": "Port-au-Prince, Haiti",
        "geo_era_label": "Colonial Caribbean",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Haitian/African diaspora perspective", "culture_code": "ht", "viewpoint_type": "nationalist",
             "narrative": "The Haitian Revolution (1791–1804) was the only successful large-scale slave revolt in history. Led by Toussaint Louverture and Jean-Jacques Dessalines, enslaved Africans defeated the French, Spanish, and British empires to establish the first free Black republic.",
             "summary": "History's only successful slave revolution, creating the world's first Black republic.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Black Jacobins", "author": "C.L.R. James", "publication": "Secker & Warburg",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1938}
             ]},
        ],
    },
    {
        "slug": "battle-trafalgar-1805",
        "title": "Battle of Trafalgar — British Naval Supremacy",
        "year": 1805, "lat": 36.18, "lng": -6.13,
        "geo_modern": "Cape Trafalgar, Cádiz, Spain",
        "geo_era_label": "Napoleonic Wars",
        "category": "war", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "Admiral Nelson's decisive victory at Trafalgar on 21 October 1805 destroyed the combined French-Spanish fleet, ensuring British naval dominance for a century. Nelson's death in the battle made him Britain's greatest naval hero.",
             "summary": "The naval battle that secured British maritime supremacy for 100 years.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Trafalgar: The Nelson Touch", "author": "David Howarth", "publication": "Collins",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1969}
             ]},
        ],
    },
    {
        "slug": "first-steam-locomotive-trevithick",
        "title": "First Steam Locomotive — Trevithick's Penydarren",
        "year": 1804, "lat": 51.75, "lng": -3.38,
        "geo_modern": "Merthyr Tydfil, Wales",
        "geo_era_label": "Industrial Revolution",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Industrial history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Richard Trevithick's Penydarren locomotive made the first railway journey in February 1804, hauling 10 tons of iron and 70 men along a Welsh tramway. It proved steam could move heavy loads on rails, launching the railway age.",
             "summary": "The first steam-powered railway journey — dawn of the railway age.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Richard Trevithick: Giant of Steam", "author": "Anthony Burton", "publication": "Aurum Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "mexican-independence-1821",
        "title": "Mexican Independence from Spain",
        "year": 1821, "lat": 19.43, "lng": -99.13,
        "geo_modern": "Mexico City, Mexico",
        "geo_era_label": "Latin American Independence",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Mexican nationalist perspective", "culture_code": "mx", "viewpoint_type": "nationalist",
             "narrative": "After eleven years of war beginning with Miguel Hidalgo's Grito de Dolores in 1810, Mexico achieved independence in 1821. The struggle united Indigenous, mestizo, and criollo populations against Spanish colonial rule.",
             "summary": "Mexico's independence after a decade-long struggle against Spain.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Mexican Wars of Independence", "author": "Timothy Henderson", "publication": "Hill and Wang",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "greek-independence-1821",
        "title": "Greek War of Independence",
        "year": 1821, "lat": 37.97, "lng": 23.72,
        "geo_modern": "Athens, Greece",
        "geo_era_label": "Ottoman Empire",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Greek perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "The Greek revolt against Ottoman rule (1821–1829), inspired by Enlightenment ideals and classical heritage, galvanized European support from Byron, Delacroix, and others. Greek independence became a symbol of national liberation.",
             "summary": "Greece's liberation from Ottoman rule, inspiring nationalist movements across Europe.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Greek Revolution", "author": "Mark Mazower", "publication": "Penguin Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "first-passenger-railway-stockton-darlington",
        "title": "First Public Passenger Railway — Stockton & Darlington",
        "year": 1825, "lat": 54.52, "lng": -1.55,
        "geo_modern": "County Durham, England",
        "geo_era_label": "Industrial Revolution",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Industrial history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The Stockton & Darlington Railway, opening on 27 September 1825, was the world's first public railway to use steam locomotives. George Stephenson's Locomotion No. 1 hauled passengers and coal, proving the commercial viability of rail transport.",
             "summary": "The world's first public steam-powered railway.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Railways: Nation, Network and People", "author": "Simon Bradley", "publication": "Profile Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2015}
             ]},
        ],
    },
    {
        "slug": "july-revolution-france-1830",
        "title": "July Revolution — France Overthrows the Bourbons",
        "year": 1830, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "Restoration France",
        "category": "political", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "French liberal perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "Three days of street fighting in Paris (Les Trois Glorieuses) overthrew Charles X and installed the 'citizen king' Louis-Philippe. The revolution inspired uprisings across Europe and Delacroix's iconic 'Liberty Leading the People.'",
             "summary": "Three days of revolution that toppled the Bourbon restoration in France.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The French Revolution of 1830", "author": "David Pinkney", "publication": "Princeton University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1972}
             ]},
        ],
    },
    {
        "slug": "belgian-independence-1830",
        "title": "Belgian Independence from the Netherlands",
        "year": 1830, "lat": 50.85, "lng": 4.35,
        "geo_modern": "Brussels, Belgium",
        "geo_era_label": "United Kingdom of the Netherlands",
        "category": "political", "importance_score": 0.65, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Belgian perspective", "culture_code": "be", "viewpoint_type": "nationalist",
             "narrative": "Inspired by the July Revolution in France, Belgian liberals and Catholics revolted against Dutch rule in August 1830. Belgium declared independence and established a constitutional monarchy, becoming a model liberal state.",
             "summary": "Belgium's separation from the Netherlands, creating a new constitutional state.", "evidence_score": 0.83,
             "sources": [
                 {"title": "Belgium: A History", "author": "Bernard Cook", "publication": "Peter Lang",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "first-photograph-daguerre-1839",
        "title": "First Practical Photograph — Daguerreotype",
        "year": 1839, "lat": 48.86, "lng": 2.34,
        "geo_modern": "Paris, France",
        "geo_era_label": "Industrial Age France",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Art/technology perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "Louis Daguerre's photographic process, publicly announced in January 1839, created permanent images on silver-plated copper. The daguerreotype democratized portraiture and inaugurated the age of visual documentation.",
             "summary": "The invention that captured reality — photography enters the world.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Pencil of Nature", "author": "Larry Schaaf", "publication": "Introductory Volume",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1992}
             ]},
        ],
    },
    {
        "slug": "first-opium-war-treaty-nanjing",
        "title": "Treaty of Nanjing — End of the First Opium War",
        "year": 1842, "lat": 32.06, "lng": 118.80,
        "geo_modern": "Nanjing, China",
        "geo_era_label": "Qing Dynasty China",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Chinese perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Treaty of Nanjing (1842) was the first of China's 'unequal treaties,' ceding Hong Kong and opening five ports to British trade. It began what Chinese historians call the 'Century of Humiliation' that shaped modern Chinese nationalism.",
             "summary": "China's first unequal treaty — beginning of the Century of Humiliation.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Opium War", "author": "Julia Lovell", "publication": "Picador",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "telegraph-invention-morse-1844",
        "title": "First Telegraph Message — 'What Hath God Wrought'",
        "year": 1844, "lat": 38.91, "lng": -77.01,
        "geo_modern": "Washington D.C. to Baltimore, USA",
        "geo_era_label": "Antebellum United States",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Samuel Morse's first telegraph message, sent on 24 May 1844 between Washington and Baltimore, inaugurated the age of instant long-distance communication. Within decades, telegraph cables spanned continents and oceans, shrinking the world.",
             "summary": "The birth of telecommunications — instant communication across distances.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Victorian Internet", "author": "Tom Standage", "publication": "Walker & Company",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "california-gold-rush-1849",
        "title": "California Gold Rush",
        "year": 1849, "lat": 38.73, "lng": -120.78,
        "geo_modern": "Coloma / Sacramento, California, USA",
        "geo_era_label": "Antebellum United States",
        "category": "economic", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The 1849 Gold Rush drew 300,000 people to California, transforming it from Mexican frontier to statehood within two years. It accelerated westward expansion, devastated Native American populations, and established San Francisco as a global city.",
             "summary": "A gold discovery that populated California and reshaped the American West.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Age of Gold", "author": "H.W. Brands", "publication": "Doubleday",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "australian-gold-rush-1851",
        "title": "Australian Gold Rush — Ballarat and Bendigo",
        "year": 1851, "lat": -37.56, "lng": 143.85,
        "geo_modern": "Ballarat, Victoria, Australia",
        "geo_era_label": "Colonial Australia",
        "category": "economic", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Australian perspective", "culture_code": "au", "viewpoint_type": "academic",
             "narrative": "Gold discoveries at Ballarat and Bendigo in 1851 tripled Australia's population within a decade, brought immigrants from China, Europe, and the Americas, and led to the Eureka Stockade rebellion — a founding moment of Australian democracy.",
             "summary": "Gold rush that transformed Australia from penal colony to prosperous democracy.", "evidence_score": 0.84,
             "sources": [
                 {"title": "The Rush That Never Ended", "author": "Geoffrey Blainey", "publication": "Melbourne University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1963}
             ]},
        ],
    },
    {
        "slug": "indian-rebellion-1857",
        "title": "Indian Rebellion of 1857 — The Sepoy Mutiny",
        "year": 1857, "lat": 26.85, "lng": 80.91,
        "geo_modern": "Lucknow / Delhi, India",
        "geo_era_label": "British India",
        "category": "war", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Indian nationalist perspective", "culture_code": "in", "viewpoint_type": "nationalist",
             "narrative": "The 1857 rebellion was India's first war of independence — a broad uprising of soldiers, princes, and civilians against the East India Company's exploitative rule. Its brutal suppression led to direct British Crown rule over India.",
             "summary": "India's first major anti-colonial uprising, crushed but never forgotten.", "evidence_score": 0.86,
             "sources": [
                 {"title": "The Last Mughal", "author": "William Dalrymple", "publication": "Bloomsbury",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "second-opium-war-1856-1860",
        "title": "Second Opium War — Burning of the Summer Palace",
        "year": 1860, "lat": 39.99, "lng": 116.30,
        "geo_modern": "Beijing, China",
        "geo_era_label": "Qing Dynasty China",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Chinese perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The destruction of the Old Summer Palace (Yuanmingyuan) by British and French forces in 1860 remains one of China's most painful colonial memories. The war forced further unequal treaties and deepened the Qing dynasty's crisis.",
             "summary": "The burning of China's greatest palace — a wound that still resonates.", "evidence_score": 0.86,
             "sources": [
                 {"title": "Autumn in the Heavenly Kingdom", "author": "Stephen Platt", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "battle-gettysburg-1863",
        "title": "Battle of Gettysburg — Turning Point of the Civil War",
        "year": 1863, "lat": 39.81, "lng": -77.23,
        "geo_modern": "Gettysburg, Pennsylvania, USA",
        "geo_era_label": "American Civil War",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Union perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The three-day Battle of Gettysburg (July 1–3, 1863) was the bloodiest battle of the American Civil War with ~50,000 casualties. Lee's failed invasion of the North marked the strategic turning point of the war.",
             "summary": "The bloodiest battle and strategic turning point of the American Civil War.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Battle Cry of Freedom", "author": "James McPherson", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1988}
             ]},
        ],
    },
    {
        "slug": "first-international-marx-1864",
        "title": "First International — International Workingmen's Association",
        "year": 1864, "lat": 51.51, "lng": -0.12,
        "geo_modern": "London, England",
        "geo_era_label": "Victorian Britain",
        "category": "political", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Socialist perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Founded in London in 1864 with Marx as a leading figure, the International Workingmen's Association united trade unions and socialist groups across Europe. It established the principle of international working-class solidarity.",
             "summary": "Marx's international organization that laid the groundwork for global socialism.", "evidence_score": 0.84,
             "sources": [
                 {"title": "Karl Marx: A Life", "author": "Francis Wheen", "publication": "W.W. Norton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "appomattox-surrender-civil-war-ends",
        "title": "Surrender at Appomattox — American Civil War Ends",
        "year": 1865, "lat": 37.38, "lng": -78.80,
        "geo_modern": "Appomattox Court House, Virginia, USA",
        "geo_era_label": "American Civil War",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "General Robert E. Lee surrendered to Ulysses S. Grant on April 9, 1865, effectively ending the Civil War. The conflict killed 620,000–750,000 Americans, abolished slavery, and preserved the Union — but left deep scars of Reconstruction ahead.",
             "summary": "The end of America's bloodiest war — slavery abolished, the Union preserved.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Battle Cry of Freedom", "author": "James McPherson", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1988}
             ]},
        ],
    },
    {
        "slug": "transatlantic-telegraph-cable-1866",
        "title": "First Permanent Transatlantic Telegraph Cable",
        "year": 1866, "lat": 51.86, "lng": -10.25,
        "geo_modern": "Valentia Island, Ireland to Heart's Content, Newfoundland",
        "geo_era_label": "Victorian Era",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "After multiple failed attempts, the SS Great Eastern successfully laid a permanent telegraph cable across the Atlantic in 1866. For the first time, Europe and North America could communicate in minutes rather than weeks.",
             "summary": "Instant communication across the Atlantic — the world shrinks dramatically.", "evidence_score": 0.87,
             "sources": [
                 {"title": "A Thread Across the Ocean", "author": "John Steele Gordon", "publication": "Walker & Company",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "franco-prussian-war-1870",
        "title": "Franco-Prussian War — Birth of the German Empire",
        "year": 1870, "lat": 49.22, "lng": 6.86,
        "geo_modern": "Sedan / Metz, France",
        "geo_era_label": "Franco-Prussian War",
        "category": "war", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "European diplomatic perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Prussia's crushing defeat of France in 1870–71 unified Germany under Prussian leadership, humiliated France, and redrew the European balance of power. The seeds of World War I were planted in French revanchism over Alsace-Lorraine.",
             "summary": "The war that created Germany and humiliated France — setting the stage for 1914.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Franco-Prussian War", "author": "Geoffrey Wawro", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "san-martin-liberation-peru",
        "title": "San Martín Declares Peruvian Independence",
        "year": 1821, "lat": -12.05, "lng": -77.04,
        "geo_modern": "Lima, Peru",
        "geo_era_label": "Latin American Independence",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Latin American perspective", "culture_code": "pe", "viewpoint_type": "nationalist",
             "narrative": "José de San Martín, having liberated Argentina and Chile, proclaimed Peruvian independence on 28 July 1821. Together with Bolívar, he completed the liberation of South America from Spanish colonial rule.",
             "summary": "San Martín frees Peru — the southern prong of South American liberation.", "evidence_score": 0.85,
             "sources": [
                 {"title": "San Martín: Argentine Soldier, American Hero", "author": "John Lynch", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "telephone-invention-bell-1876",
        "title": "Alexander Graham Bell Patents the Telephone",
        "year": 1876, "lat": 42.36, "lng": -71.06,
        "geo_modern": "Boston, Massachusetts, USA",
        "geo_era_label": "Gilded Age America",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Bell's telephone patent of March 1876 and his famous first call to Watson inaugurated the age of voice telecommunications. The telephone transformed business, social life, and eventually led to the modern connected world.",
             "summary": "The invention that allowed humans to talk across distances for the first time.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Telephone Gambit", "author": "Seth Shulman", "publication": "W.W. Norton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "edison-lightbulb-1879",
        "title": "Edison's Practical Incandescent Light Bulb",
        "year": 1879, "lat": 40.52, "lng": -74.35,
        "geo_modern": "Menlo Park, New Jersey, USA",
        "geo_era_label": "Gilded Age America",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Thomas Edison's development of a practical, long-lasting incandescent light bulb in 1879, combined with his electrical distribution system, made electric lighting commercially viable and launched the electrification of civilization.",
             "summary": "The light bulb that illuminated the world — beginning of the electrical age.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Edison: A Biography", "author": "Matthew Josephson", "publication": "McGraw-Hill",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1959}
             ]},
        ],
    },
    {
        "slug": "first-film-lumiere-brothers-1895",
        "title": "Lumière Brothers' First Public Film Screening",
        "year": 1895, "lat": 48.87, "lng": 2.33,
        "geo_modern": "Paris, France",
        "geo_era_label": "Belle Époque France",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Cultural history perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "On 28 December 1895, Auguste and Louis Lumière screened 10 short films to a paying audience at the Grand Café in Paris. Their Cinématographe created the art form that would dominate 20th-century culture.",
             "summary": "The birth of cinema as a public art form and entertainment medium.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Lumière Galaxy: Seven Key Words for the Cinema to Come", "author": "Francesco Casetti",
                  "publication": "Columbia University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2015}
             ]},
        ],
    },
    {
        "slug": "dreyfus-affair-1894",
        "title": "The Dreyfus Affair — Antisemitism and Justice in France",
        "year": 1894, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "Third French Republic",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "French liberal perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "The false conviction of Jewish army captain Alfred Dreyfus for treason split France into pro- and anti-Dreyfus camps, exposing deep antisemitism. Émile Zola's 'J'Accuse' became a landmark of intellectual political engagement.",
             "summary": "A wrongful conviction that exposed French antisemitism and galvanized civil rights.", "evidence_score": 0.88,
             "sources": [
                 {"title": "An Officer and a Spy", "author": "Robert Harris", "publication": "Hutchinson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "abolition-slavery-usa-13th-amendment",
        "title": "13th Amendment — Abolition of Slavery in the United States",
        "year": 1865, "lat": 38.89, "lng": -77.01,
        "geo_modern": "Washington D.C., USA",
        "geo_era_label": "Reconstruction Era",
        "category": "political", "importance_score": 0.9, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "African American perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The 13th Amendment, ratified in December 1865, permanently abolished slavery in the United States. It was the culmination of decades of abolitionist struggle by Frederick Douglass, Harriet Tubman, and millions of enslaved people who resisted.",
             "summary": "The constitutional end of American slavery — hard-won after centuries of struggle.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Fiery Trial: Abraham Lincoln and American Slavery", "author": "Eric Foner", "publication": "W.W. Norton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "transcontinental-railroad-usa-1869",
        "title": "Transcontinental Railroad Completed — Golden Spike",
        "year": 1869, "lat": 41.62, "lng": -112.55,
        "geo_modern": "Promontory Summit, Utah, USA",
        "geo_era_label": "Gilded Age America",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The driving of the Golden Spike on May 10, 1869, connected the Central Pacific and Union Pacific railroads, linking America coast to coast. Chinese and Irish immigrant labor built most of the line under brutal conditions.",
             "summary": "A continent connected by rail — built by immigrant labor under harsh conditions.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Nothing Like It in the World", "author": "Stephen Ambrose", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "russo-turkish-war-1877",
        "title": "Russo-Turkish War — Bulgarian Liberation",
        "year": 1877, "lat": 42.70, "lng": 23.32,
        "geo_modern": "Pleven / Shipka Pass, Bulgaria",
        "geo_era_label": "Ottoman Decline",
        "category": "war", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Bulgarian perspective", "culture_code": "bg", "viewpoint_type": "nationalist",
             "narrative": "Russia's war against the Ottoman Empire in 1877–78 liberated Bulgaria after nearly 500 years of Ottoman rule. The subsequent Treaty of San Stefano and Congress of Berlin reshaped the Balkans.",
             "summary": "The war that freed Bulgaria from Ottoman rule after five centuries.", "evidence_score": 0.84,
             "sources": [
                 {"title": "The Russo-Turkish War 1877–1878", "author": "Quintin Barry", "publication": "Helion",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "brazilian-abolition-1888",
        "title": "Brazil Abolishes Slavery — Lei Áurea (Golden Law)",
        "year": 1888, "lat": -22.91, "lng": -43.17,
        "geo_modern": "Rio de Janeiro, Brazil",
        "geo_era_label": "Brazilian Empire",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Brazilian perspective", "culture_code": "br", "viewpoint_type": "academic",
             "narrative": "The Lei Áurea, signed by Princess Isabel on 13 May 1888, abolished slavery in Brazil — the last country in the Americas to do so. Brazil had received more enslaved Africans than any other nation. Abolition came without reparations or land reform.",
             "summary": "The last abolition in the Americas — 4 million enslaved people freed.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Brazil: Five Centuries of Change", "author": "Thomas Skidmore", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "eiffel-tower-construction-1889",
        "title": "Eiffel Tower Completed — Symbol of Modernity",
        "year": 1889, "lat": 48.86, "lng": 2.29,
        "geo_modern": "Paris, France",
        "geo_era_label": "Belle Époque France",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Cultural history perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "Built for the 1889 World's Fair centennial of the French Revolution, Gustave Eiffel's 300-meter iron tower was the tallest structure in the world. Initially controversial, it became the ultimate symbol of Paris and of modern engineering.",
             "summary": "An engineering marvel that became the world's most recognizable monument.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Eiffel's Tower", "author": "Jill Jonnes", "publication": "Viking",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "x-ray-discovery-roentgen-1895",
        "title": "Röntgen Discovers X-Rays",
        "year": 1895, "lat": 49.79, "lng": 9.95,
        "geo_modern": "Würzburg, Bavaria, Germany",
        "geo_era_label": "German Empire",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Wilhelm Röntgen's accidental discovery of X-rays on 8 November 1895 — including the famous image of his wife's hand — revolutionized medicine and earned the first Nobel Prize in Physics (1901).",
             "summary": "The accidental discovery that revolutionized medical diagnosis.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Naked to the Bone: Medical Imaging in the Twentieth Century", "author": "Bettyann Kevles",
                  "publication": "Rutgers University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "boxer-rebellion-1899",
        "title": "Boxer Rebellion — Anti-Foreign Uprising in China",
        "year": 1899, "lat": 39.91, "lng": 116.39,
        "geo_modern": "Beijing, China",
        "geo_era_label": "Qing Dynasty China",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Chinese perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Boxer Uprising (1899–1901) was a popular anti-foreign and anti-Christian movement that besieged Beijing's Legation Quarter. Its crushing by an eight-nation alliance further humiliated the Qing dynasty and accelerated China's revolutionary movement.",
             "summary": "A nationalist uprising against foreign imperialism, crushed by allied forces.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Boxer Rebellion and the Great Game in China", "author": "David Silbey", "publication": "Hill and Wang",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "mendeleev-periodic-table-1869",
        "title": "Mendeleev Publishes the Periodic Table",
        "year": 1869, "lat": 59.93, "lng": 30.32,
        "geo_modern": "St. Petersburg, Russia",
        "geo_era_label": "Russian Empire",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "ru", "viewpoint_type": "academic",
             "narrative": "Dmitri Mendeleev's periodic table (1869) organized all known elements by atomic weight and properties, predicting undiscovered elements with remarkable accuracy. It remains the foundation of chemistry and materials science.",
             "summary": "The organizing framework of chemistry — predicting elements before they were found.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Mendeleev's Dream", "author": "Paul Strathern", "publication": "St. Martin's Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "opening-japan-meiji-constitution-1889",
        "title": "Meiji Constitution — Japan Becomes a Constitutional State",
        "year": 1889, "lat": 35.68, "lng": 139.75,
        "geo_modern": "Tokyo, Japan",
        "geo_era_label": "Meiji Era Japan",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Japanese perspective", "culture_code": "jp", "viewpoint_type": "academic",
             "narrative": "The Meiji Constitution of 1889, modeled on the Prussian system, established Japan as Asia's first constitutional state with a parliament (Diet). It was the institutional capstone of Japan's remarkable modernization.",
             "summary": "Asia's first modern constitution — completing Japan's transformation.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Making of Modern Japan", "author": "Marius Jansen", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "sino-japanese-war-1894",
        "title": "First Sino-Japanese War — Japan Defeats China",
        "year": 1894, "lat": 38.72, "lng": 121.15,
        "geo_modern": "Lüshunkou (Port Arthur), China / Korea",
        "geo_era_label": "Meiji Era Japan / Qing China",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "East Asian perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Japan's decisive victory over China in 1894–95 shocked the world, revealing Japan as a major military power and the Qing dynasty's weakness. Japan gained Taiwan and influence over Korea, beginning its imperial expansion.",
             "summary": "Japan's emergence as a great power at China's expense.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Sino-Japanese War of 1894–1895", "author": "S.C.M. Paine", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "rubber-boom-amazon-1880s",
        "title": "Amazon Rubber Boom — Exploitation and Wealth",
        "year": 1880, "lat": -3.12, "lng": -60.02,
        "geo_modern": "Manaus, Amazonas, Brazil",
        "geo_era_label": "Late Imperial Brazil",
        "category": "economic", "importance_score": 0.65, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Brazilian/Indigenous perspective", "culture_code": "br", "viewpoint_type": "academic",
             "narrative": "The rubber boom (1879–1912) brought enormous wealth to Manaus — its opera house was more lavish than those in Europe — while Indigenous and migrant rubber tappers were enslaved through debt peonage in brutal conditions.",
             "summary": "Extreme wealth built on extreme exploitation in the Amazon.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Trees of Paradise: The Rubber Boom", "author": "Warren Dean", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1987}
             ]},
        ],
    },
    {
        "slug": "womens-suffrage-new-zealand-1893",
        "title": "New Zealand Grants Women's Suffrage — World First",
        "year": 1893, "lat": -41.29, "lng": 174.78,
        "geo_modern": "Wellington, New Zealand",
        "geo_era_label": "Colonial New Zealand",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Feminist perspective", "culture_code": "nz", "viewpoint_type": "academic",
             "narrative": "On 19 September 1893, New Zealand became the first self-governing country where women won the right to vote, following years of campaigning led by Kate Sheppard. It set a precedent that took decades for other nations to follow.",
             "summary": "The world's first women's suffrage in a self-governing country.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Women's Suffrage Petition", "source_type": "primary", "reliability_tier": 1, "year": 1893}
             ]},
        ],
    },
    {
        "slug": "unification-italy-rome-1870",
        "title": "Capture of Rome — Completion of Italian Unification",
        "year": 1870, "lat": 41.90, "lng": 12.50,
        "geo_modern": "Rome, Italy",
        "geo_era_label": "Risorgimento Italy",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Italian nationalist perspective", "culture_code": "it", "viewpoint_type": "nationalist",
             "narrative": "The capture of Rome on 20 September 1870 completed the Italian unification begun by Cavour, Garibaldi, and Mazzini. Rome became the capital of the unified Kingdom of Italy, ending the Pope's temporal power.",
             "summary": "Rome becomes capital — the Risorgimento is complete.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Pursuit of Italy", "author": "David Gilmour", "publication": "Farrar, Straus and Giroux",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "germ-theory-koch-tuberculosis-1882",
        "title": "Koch Identifies Tuberculosis Bacterium",
        "year": 1882, "lat": 52.52, "lng": 13.40,
        "geo_modern": "Berlin, Germany",
        "geo_era_label": "German Empire",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Medical history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Robert Koch's identification of the tuberculosis bacterium on 24 March 1882 proved that specific germs caused specific diseases — the cornerstone of modern microbiology. Koch's postulates became the gold standard for establishing infectious disease causation.",
             "summary": "The discovery that proved germs cause disease — founding modern bacteriology.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Etiology of Tuberculosis", "author": "Robert Koch", "source_type": "primary", "reliability_tier": 1, "year": 1882}
             ]},
        ],
    },
    {
        "slug": "ottoman-reform-hatt-i-humayun-1856",
        "title": "Ottoman Reform Edict — Hatt-ı Hümayun",
        "year": 1856, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Istanbul, Turkey",
        "geo_era_label": "Ottoman Empire",
        "category": "political", "importance_score": 0.65, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Ottoman reform perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "The 1856 Reform Edict promised legal equality for all Ottoman subjects regardless of religion, abolished the jizya tax, and opened military service to non-Muslims. It was the high point of the Tanzimat modernization, though implementation lagged behind promise.",
             "summary": "The Ottoman Empire's most ambitious reform decree — equality on paper.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Emergence of Modern Turkey", "author": "Bernard Lewis", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1961}
             ]},
        ],
    },
    {
        "slug": "maxwell-electromagnetic-theory-1865",
        "title": "Maxwell Unifies Electromagnetism",
        "year": 1865, "lat": 55.95, "lng": -3.19,
        "geo_modern": "Edinburgh / London, UK",
        "geo_era_label": "Victorian Britain",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "James Clerk Maxwell's 1865 paper unified electricity, magnetism, and optics into a single theory and predicted electromagnetic waves. Einstein called it 'the most profound and the most fruitful that physics has experienced since the time of Newton.'",
             "summary": "The equations that unified physics and predicted radio waves.", "evidence_score": 0.92,
             "sources": [
                 {"title": "A Dynamical Theory of the Electromagnetic Field", "author": "James Clerk Maxwell",
                  "source_type": "primary", "reliability_tier": 1, "year": 1865}
             ]},
        ],
    },
    {
        "slug": "suez-canal-construction-begins-1859",
        "title": "Suez Canal Construction Begins",
        "year": 1859, "lat": 30.58, "lng": 32.27,
        "geo_modern": "Port Said, Egypt",
        "geo_era_label": "Ottoman Egypt",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Egyptian perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Construction of the Suez Canal (1859–1869) employed forced labor (corvée) of Egyptian peasants under Ferdinand de Lesseps' direction. The canal enriched European commerce while plunging Egypt into debt, leading to British occupation in 1882.",
             "summary": "A marvel of engineering built on Egyptian forced labor and debt.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Parting the Desert", "author": "Zachary Karabell", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "samoa-crisis-1889",
        "title": "Samoan Crisis — Imperial Powers Clash in the Pacific",
        "year": 1889, "lat": -13.83, "lng": -171.76,
        "geo_modern": "Apia, Samoa",
        "geo_era_label": "Imperial Pacific",
        "category": "political", "importance_score": 0.6, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Pacific Islands perspective", "culture_code": "ws", "viewpoint_type": "academic",
             "narrative": "In 1889, a typhoon prevented a naval battle between German, American, and British warships in Apia harbor. The crisis illustrated how imperial rivalries reached even the remote Pacific, ultimately partitioning Samoa between Germany and the US.",
             "summary": "Imperial rivalry reaches the Pacific — Samoa divided between great powers.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Samoa Islands", "author": "Augustin Krämer", "publication": "University of Hawai'i Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "abolition-serfdom-russia-1861",
        "title": "Abolition of Serfdom in Russia",
        "year": 1861, "lat": 59.93, "lng": 30.32,
        "geo_modern": "St. Petersburg, Russia",
        "geo_era_label": "Russian Empire",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Russian perspective", "culture_code": "ru", "viewpoint_type": "academic",
             "narrative": "Tsar Alexander II's Emancipation Manifesto of 19 February 1861 freed 23 million serfs — the largest emancipation in history. However, freed serfs received little land and remained bound by redemption payments, sowing seeds of future revolution.",
             "summary": "23 million serfs freed — Russia's greatest reform, yet deeply flawed.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Russia in the Age of Alexander II, Tolstoy and Dostoevsky", "author": "Robin Bisha et al.",
                  "publication": "Anthem Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "vienna-ringstrasse-construction-1865",
        "title": "Vienna Ringstraße — Imperial Boulevard Transformed",
        "year": 1865, "lat": 48.21, "lng": 16.37,
        "geo_modern": "Vienna, Austria",
        "geo_era_label": "Austro-Hungarian Empire",
        "category": "cultural", "importance_score": 0.6, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Urban history perspective", "culture_code": "at", "viewpoint_type": "academic",
             "narrative": "The Ringstraße, built on Vienna's demolished medieval walls (1857–1865), became the grandest boulevard in Europe — lined with the Opera, Parliament, University, and museums. It defined the Austro-Hungarian Empire's cultural self-image.",
             "summary": "Vienna's grand boulevard — a monument to Habsburg cultural ambition.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Fin-de-Siècle Vienna", "author": "Carl Schorske", "publication": "Vintage",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1980}
             ]},
        ],
    },
    {
        "slug": "ethiopian-modernization-menelik-ii",
        "title": "Menelik II Modernizes Ethiopia",
        "year": 1889, "lat": 9.02, "lng": 38.75,
        "geo_modern": "Addis Ababa, Ethiopia",
        "geo_era_label": "Ethiopian Empire",
        "category": "political", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Ethiopian perspective", "culture_code": "et", "viewpoint_type": "academic",
             "narrative": "Emperor Menelik II (r. 1889–1913) founded Addis Ababa, introduced railways, telegraph, and modern education, and preserved Ethiopian independence during the Scramble for Africa — culminating in the decisive victory at Adwa in 1896.",
             "summary": "Ethiopia's modernizer who kept Africa's oldest nation free from colonialism.", "evidence_score": 0.84,
             "sources": [
                 {"title": "A History of Ethiopia", "author": "Harold Marcus", "publication": "University of California Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "labor-movement-haymarket-affair-1886",
        "title": "Haymarket Affair — Birth of May Day",
        "year": 1886, "lat": 41.89, "lng": -87.65,
        "geo_modern": "Chicago, Illinois, USA",
        "geo_era_label": "Gilded Age America",
        "category": "political", "importance_score": 0.7, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Labor movement perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Haymarket bombing on 4 May 1886 during a labor rally for the eight-hour day led to a show trial and execution of anarchist leaders. It became a global symbol of workers' struggle and the origin of International Workers' Day (May Day).",
             "summary": "The bombing and trial that created May Day — a martyrdom for labor rights.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Death in the Haymarket", "author": "James Green", "publication": "Pantheon Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "wounded-knee-massacre-1890",
        "title": "Wounded Knee Massacre — End of the Indian Wars",
        "year": 1890, "lat": 43.15, "lng": -102.37,
        "geo_modern": "Wounded Knee, South Dakota, USA",
        "geo_era_label": "Gilded Age America",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Lakota/Indigenous perspective", "culture_code": "indigenous-lakota", "viewpoint_type": "indigenous",
             "narrative": "On 29 December 1890, the U.S. 7th Cavalry massacred approximately 300 Lakota men, women, and children at Wounded Knee Creek. It marked the final chapter of the American Indian Wars and remains a symbol of colonial violence against Indigenous peoples.",
             "summary": "A massacre of unarmed Lakota — the end of armed Indigenous resistance.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Bury My Heart at Wounded Knee", "author": "Dee Brown", "publication": "Holt, Rinehart & Winston",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1970}
             ]},
        ],
    },
    {
        "slug": "panama-canal-french-attempt-1881",
        "title": "French Attempt to Build the Panama Canal",
        "year": 1881, "lat": 9.08, "lng": -79.68,
        "geo_modern": "Panama Canal Zone, Panama",
        "geo_era_label": "Republic of Colombia",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Engineering/colonial perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Ferdinand de Lesseps, hero of the Suez Canal, began the Panama Canal in 1881 but failed catastrophically — 22,000 workers died of yellow fever and malaria, the company went bankrupt, and the resulting scandal rocked French politics.",
             "summary": "A catastrophic engineering failure that killed 22,000 workers.", "evidence_score": 0.84,
             "sources": [
                 {"title": "The Path Between the Seas", "author": "David McCullough", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1977}
             ]},
        ],
    },
    {
        "slug": "hertz-electromagnetic-waves-1887",
        "title": "Hertz Proves Electromagnetic Waves Exist",
        "year": 1887, "lat": 49.01, "lng": 8.40,
        "geo_modern": "Karlsruhe, Germany",
        "geo_era_label": "German Empire",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Heinrich Hertz's 1887 experiments conclusively proved Maxwell's prediction that electromagnetic waves exist and travel at the speed of light. This discovery directly led to radio, television, radar, and all wireless communication.",
             "summary": "The experimental proof of electromagnetic waves — enabling wireless communication.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Electric Waves", "author": "Heinrich Hertz", "source_type": "primary", "reliability_tier": 1, "year": 1893}
             ]},
        ],
    },
    {
        "slug": "marconi-wireless-telegraph-1896",
        "title": "Marconi Demonstrates Wireless Telegraphy",
        "year": 1896, "lat": 51.51, "lng": -0.12,
        "geo_modern": "London / Bologna, Italy",
        "geo_era_label": "Late Victorian Era",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "Guglielmo Marconi's 1896 demonstration of wireless telegraphy in London proved that Hertz's electromagnetic waves could carry information over distances. Within five years he transmitted across the Atlantic, launching the radio age.",
             "summary": "The invention that freed communication from wires — birth of radio.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Thunderstruck", "author": "Erik Larson", "publication": "Crown",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
]


async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting 19th century seed — {len(EVENTS)} events")

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

        existing = await conn.fetchval("SELECT id FROM events WHERE slug=$1", slug)
        if existing:
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
            VALUES ('event', $1, 'create', $2, 'ai', '19th century seed')
            """,
            event_id, CREATED_BY,
        )

        print(f"  [ok] {slug}")

    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    print(f"\n✅ 19th century seed complete — total approved events: {total}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
