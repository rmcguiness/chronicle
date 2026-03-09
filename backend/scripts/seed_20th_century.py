#!/usr/bin/env python3
"""
Chronicle seed script — ~120 events for the 20th century (1900-2000).

Run:
    python backend/scripts/seed_20th_century.py
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

CREATED_BY = "seed-script:20th-century-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


EVENTS: list[dict[str, Any]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # EARLY 20TH CENTURY (1900–1920)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "san-francisco-earthquake-1906",
        "title": "San Francisco Earthquake and Fire",
        "year": 1906, "lat": 37.77, "lng": -122.42,
        "date_display": "April 18, 1906",
        "geo_modern": "San Francisco, California, USA",
        "geo_era_label": "Progressive Era America",
        "category": "natural", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American urban history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The 7.9-magnitude earthquake and subsequent three-day fire destroyed over 80% of San Francisco on April 18, 1906. More than 3,000 people died and 250,000 were left homeless. The disaster prompted major advances in earthquake engineering and urban fire safety.",
             "summary": "A catastrophic earthquake and fire that destroyed San Francisco and reshaped American disaster preparedness.", "evidence_score": 0.88,
             "sources": [
                 {"title": "A Crack in the Edge of the World", "author": "Simon Winchester", "publication": "HarperCollins",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "hms-dreadnought-1906",
        "title": "HMS Dreadnought Launched — Naval Arms Race Begins",
        "year": 1906, "lat": 50.80, "lng": -1.10,
        "date_display": "February 10, 1906",
        "geo_modern": "Portsmouth, England",
        "geo_era_label": "Edwardian Britain",
        "category": "war", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Naval history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "HMS Dreadnought revolutionized naval warfare with its all-big-gun design, rendering every existing battleship obsolete overnight. The ship triggered a naval arms race between Britain and Germany that contributed to tensions leading to World War I.",
             "summary": "The battleship that made all others obsolete and sparked the Anglo-German naval arms race.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Dreadnought: Britain, Germany and the Coming of the Great War", "author": "Robert K. Massie", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "model-t-ford-1908",
        "title": "Model T Ford — Mass Production Begins",
        "year": 1908, "lat": 42.33, "lng": -83.05,
        "date_display": "October 1, 1908",
        "geo_modern": "Detroit, Michigan, USA",
        "geo_era_label": "Progressive Era America",
        "category": "discovery", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Industrial history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Henry Ford's Model T, introduced in 1908 and mass-produced on the first moving assembly line from 1913, made automobiles affordable for ordinary Americans. Over 15 million were built, transforming American society, urban planning, and industrial manufacturing worldwide.",
             "summary": "The car that put America on wheels and pioneered modern mass production.", "evidence_score": 0.90,
             "sources": [
                 {"title": "My Life and Work", "author": "Henry Ford", "publication": "Garden City Publishing",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1922}
             ]},
        ],
    },
    {
        "slug": "tunguska-event-1908",
        "title": "Tunguska Event — Largest Impact in Recorded History",
        "year": 1908, "lat": 60.89, "lng": 101.89,
        "date_display": "June 30, 1908",
        "geo_modern": "Krasnoyarsk Krai, Siberia, Russia",
        "geo_era_label": "Russian Empire",
        "category": "natural", "importance_score": 0.55, "zoom_min": 5, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "A massive explosion over the Tunguska River in Siberia on June 30, 1908, flattened 2,150 square kilometers of forest. Believed to be an air burst of a meteoroid or comet fragment, it remains the largest impact event in recorded history and spurred later planetary defense research.",
             "summary": "A mysterious explosion that flattened Siberian forest — the largest impact in recorded history.", "evidence_score": 0.80,
             "sources": [
                 {"title": "The Tunguska Mystery", "author": "Vladimir Rubtsov", "publication": "Springer",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "naacp-founded-1909",
        "title": "NAACP Founded — Fight for Racial Equality",
        "year": 1909, "lat": 40.71, "lng": -74.01,
        "date_display": "February 12, 1909",
        "geo_modern": "New York City, USA",
        "geo_era_label": "Jim Crow America",
        "category": "political", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "African American history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The National Association for the Advancement of Colored People was founded in 1909 by W.E.B. Du Bois, Ida B. Wells, and others in response to widespread racial violence. It became the most influential civil rights organization in American history, leading legal battles against segregation.",
             "summary": "The founding of America's most influential civil rights organization.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Souls of Black Folk", "author": "W.E.B. Du Bois",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1903}
             ]},
        ],
    },
    {
        "slug": "mexican-revolution-1910",
        "title": "Mexican Revolution Begins",
        "year": 1910, "lat": 19.43, "lng": -99.13,
        "date_display": "November 20, 1910",
        "geo_modern": "Mexico City, Mexico",
        "geo_era_label": "Porfiriato Mexico",
        "category": "war", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Mexican perspective", "culture_code": "mx", "viewpoint_type": "nationalist",
             "narrative": "The Mexican Revolution (1910–1920) overthrew the 35-year dictatorship of Porfirio Díaz, unleashing a decade of civil war that killed over one million people. Figures like Zapata, Villa, and Carranza fought for land reform, labor rights, and democratic governance, resulting in the 1917 Constitution.",
             "summary": "A decade-long revolution that reshaped Mexican society and produced one of the world's most progressive constitutions.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Mexican Revolution: A Short History", "author": "Stuart Easterling", "publication": "Haymarket Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "japan-annexes-korea-1910",
        "title": "Japan Annexes Korea",
        "year": 1910, "lat": 37.57, "lng": 126.98,
        "date_display": "August 22, 1910",
        "geo_modern": "Seoul, South Korea",
        "geo_era_label": "Korean Empire / Japanese Empire",
        "category": "political", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Korean perspective", "culture_code": "kr", "viewpoint_type": "nationalist",
             "narrative": "Japan formally annexed Korea in 1910, beginning 35 years of colonial rule marked by cultural suppression, forced labor, and exploitation. The annexation remains a deeply sensitive issue in Korean-Japanese relations and shaped the Korean independence movement.",
             "summary": "Japan's annexation of Korea began 35 years of colonial rule that deeply scarred the Korean nation.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Korea's Grievous War", "author": "Su-kyoung Hwang", "publication": "University of Pennsylvania Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "panama-canal-opens-1914",
        "title": "Panama Canal Opens — Global Shipping Transformed",
        "year": 1914, "lat": 9.08, "lng": -79.68,
        "date_display": "August 15, 1914",
        "geo_modern": "Panama Canal Zone, Panama",
        "geo_era_label": "Progressive Era",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Engineering perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Panama Canal opened on August 15, 1914, after a decade of construction that cost over 5,600 lives. The 82-kilometer waterway connected the Atlantic and Pacific oceans, cutting 12,800 kilometers off the maritime route between New York and San Francisco and reshaping global trade.",
             "summary": "An engineering marvel that connected two oceans and transformed global maritime trade.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Path Between the Seas", "author": "David McCullough", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1977}
             ]},
        ],
    },
    {
        "slug": "easter-rising-ireland-1916",
        "title": "Easter Rising — Irish Republican Rebellion",
        "year": 1916, "lat": 53.35, "lng": -6.26,
        "date_display": "April 24, 1916",
        "geo_modern": "Dublin, Ireland",
        "geo_era_label": "British Ireland",
        "category": "war", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Irish nationalist perspective", "culture_code": "ie", "viewpoint_type": "nationalist",
             "narrative": "On Easter Monday 1916, Irish republicans seized key buildings in Dublin and proclaimed an independent Irish Republic. Though militarily defeated within a week, the British execution of 16 leaders transformed public opinion. The Rising is regarded as the catalyst for Irish independence in 1922.",
             "summary": "A failed rebellion that galvanized Irish independence and led to the birth of the Irish Republic.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Easter 1916: The Irish Rebellion", "author": "Charles Townshend", "publication": "Allen Lane",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "amritsar-massacre-1919",
        "title": "Amritsar Massacre — Jallianwala Bagh",
        "year": 1919, "lat": 31.62, "lng": 74.88,
        "date_display": "April 13, 1919",
        "geo_modern": "Amritsar, Punjab, India",
        "geo_era_label": "British India",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Indian nationalist perspective", "culture_code": "in", "viewpoint_type": "nationalist",
             "narrative": "On April 13, 1919, British troops under General Dyer fired without warning on thousands of unarmed civilians gathered at Jallianwala Bagh in Amritsar, killing at least 379 people. The massacre became a turning point in the Indian independence movement, radicalizing opinion against British rule.",
             "summary": "A British massacre of unarmed Indian civilians that radicalized the independence movement.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Amritsar Massacre: The Untold Story of One Fateful Day", "author": "Nick Lloyd", "publication": "I.B. Tauris",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "us-prohibition-1920",
        "title": "US Prohibition Begins — 18th Amendment",
        "year": 1920, "lat": 38.91, "lng": -77.04,
        "date_display": "January 17, 1920",
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Prohibition Era America",
        "category": "political", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "American social history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The 18th Amendment banned the manufacture, transport, and sale of alcohol in the United States beginning January 17, 1920. Rather than eliminating drinking, Prohibition fueled organized crime, speakeasies, and bootlegging. It was repealed in 1933 by the 21st Amendment.",
             "summary": "The noble experiment that banned alcohol and inadvertently fueled organized crime in America.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Last Call: The Rise and Fall of Prohibition", "author": "Daniel Okrent", "publication": "Scribner",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # INTERWAR PERIOD (1920–1939)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "irish-free-state-1922",
        "title": "Irish Free State Established",
        "year": 1922, "lat": 53.35, "lng": -6.26,
        "date_display": "December 6, 1922",
        "geo_modern": "Dublin, Ireland",
        "geo_era_label": "Anglo-Irish Treaty",
        "category": "political", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Irish perspective", "culture_code": "ie", "viewpoint_type": "nationalist",
             "narrative": "The Anglo-Irish Treaty of 1921 established the Irish Free State in 1922, ending centuries of British rule over most of Ireland. However, the partition of Northern Ireland and the treaty's dominion status sparked a bitter civil war between pro-treaty and anti-treaty factions.",
             "summary": "Ireland gained independence from Britain but partition sparked a civil war.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Irish Civil War 1922–23", "author": "Eoin Neeson", "publication": "Poolbeg Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1989}
             ]},
        ],
    },
    {
        "slug": "soviet-union-founded-1922",
        "title": "Soviet Union Founded — USSR Established",
        "year": 1922, "lat": 55.75, "lng": 37.62,
        "date_display": "December 30, 1922",
        "geo_modern": "Moscow, Russia",
        "geo_era_label": "Soviet Russia",
        "category": "political", "importance_score": 0.90, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Soviet/Russian perspective", "culture_code": "ru", "viewpoint_type": "academic",
             "narrative": "On December 30, 1922, the Russian, Ukrainian, Belarusian, and Transcaucasian republics formally united into the Union of Soviet Socialist Republics. Under Lenin's leadership, the USSR became the world's first constitutionally socialist state, reshaping global politics for the next seven decades.",
             "summary": "The formal creation of the world's first socialist superstate, reshaping 20th century geopolitics.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Soviet Union: A Very Short Introduction", "author": "Stephen Lovell", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "mussolini-march-on-rome-1922",
        "title": "Mussolini's March on Rome — Fascism Takes Power",
        "year": 1922, "lat": 41.90, "lng": 12.50,
        "date_display": "October 28, 1922",
        "geo_modern": "Rome, Italy",
        "geo_era_label": "Kingdom of Italy",
        "category": "political", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "European political history perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "Benito Mussolini's Fascist blackshirts marched on Rome in October 1922, forcing King Victor Emmanuel III to appoint Mussolini as prime minister. Italy became the first European fascist state, establishing a model that Hitler, Franco, and other authoritarian leaders would follow.",
             "summary": "The first fascist seizure of power in Europe, establishing a model imitated across the continent.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Mussolini's Italy: Life Under the Fascist Dictatorship", "author": "R.J.B. Bosworth", "publication": "Penguin",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "tutankhamun-tomb-1922",
        "title": "Discovery of Tutankhamun's Tomb",
        "year": 1922, "lat": 25.74, "lng": 32.60,
        "date_display": "November 4, 1922",
        "geo_modern": "Valley of the Kings, Luxor, Egypt",
        "geo_era_label": "British Protectorate of Egypt",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Howard Carter's discovery of Tutankhamun's nearly intact tomb in the Valley of the Kings on November 4, 1922 was the most spectacular archaeological find of the 20th century. The golden treasures captivated the world and sparked a global fascination with ancient Egypt.",
             "summary": "The greatest archaeological discovery of the 20th century, revealing the splendor of ancient Egypt.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Tomb of Tutankhamen", "author": "Howard Carter",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1923}
             ]},
        ],
    },
    {
        "slug": "scopes-trial-1925",
        "title": "Scopes Trial — Evolution vs. Creationism",
        "year": 1925, "lat": 35.47, "lng": -85.51,
        "date_display": "July 10, 1925",
        "geo_modern": "Dayton, Tennessee, USA",
        "geo_era_label": "Roaring Twenties America",
        "category": "cultural", "importance_score": 0.60, "zoom_min": 5, "is_bce": False,
        "perspectives": [
            {"label": "American culture wars perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The 1925 Scopes 'Monkey Trial' pitted evolution against creationism in a Tennessee courtroom. Teacher John Scopes was convicted of teaching evolution, but the trial — featuring lawyers Clarence Darrow and William Jennings Bryan — became a landmark in the ongoing conflict between science and religion in American public life.",
             "summary": "A landmark trial in the American battle between science and religious fundamentalism.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Summer for the Gods", "author": "Edward Larson", "publication": "Basic Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "lindbergh-transatlantic-flight-1927",
        "title": "Lindbergh's Solo Transatlantic Flight",
        "year": 1927, "lat": 48.97, "lng": 2.55,
        "date_display": "May 21, 1927",
        "geo_modern": "New York to Paris",
        "geo_era_label": "Roaring Twenties",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Aviation history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Charles Lindbergh flew the Spirit of St. Louis from New York to Paris in 33.5 hours on May 20-21, 1927, completing the first solo nonstop transatlantic flight. The achievement made him the most famous person in the world and ignited public enthusiasm for commercial aviation.",
             "summary": "The first solo transatlantic flight, igniting the age of commercial aviation.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Spirit of St. Louis", "author": "Charles A. Lindbergh", "publication": "Charles Scribner's Sons",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1953}
             ]},
        ],
    },
    {
        "slug": "penicillin-discovered-1928",
        "title": "Penicillin Discovered — The Antibiotic Revolution",
        "year": 1928, "lat": 51.52, "lng": -0.17,
        "date_display": "September 28, 1928",
        "geo_modern": "London, England",
        "geo_era_label": "Interwar Britain",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Medical history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Alexander Fleming's accidental discovery of penicillin in 1928 at St Mary's Hospital, London, launched the antibiotic revolution. Developed for mass production by Florey and Chain during WWII, antibiotics have saved an estimated 200 million lives and transformed medicine.",
             "summary": "The accidental discovery that launched the antibiotic age and saved hundreds of millions of lives.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Mold in Dr. Florey's Coat", "author": "Eric Lax", "publication": "Henry Holt",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "japanese-invasion-manchuria-1931",
        "title": "Japanese Invasion of Manchuria",
        "year": 1931, "lat": 41.80, "lng": 123.43,
        "date_display": "September 18, 1931",
        "geo_modern": "Shenyang (Mukden), China",
        "geo_era_label": "Republic of China",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Chinese perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "Japan's invasion of Manchuria in 1931, following the staged Mukden Incident, marked the beginning of Japanese imperial expansion in East Asia. The League of Nations' failure to stop Japan emboldened aggressors worldwide and exposed the weakness of collective security.",
             "summary": "Japan's seizure of Manchuria exposed the League of Nations' impotence and set the stage for WWII in Asia.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Making of Modern Japan", "author": "Marius B. Jansen", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "new-deal-roosevelt-1933",
        "title": "Roosevelt's New Deal — Government Responds to Depression",
        "year": 1933, "lat": 38.91, "lng": -77.04,
        "date_display": "March 1933",
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Great Depression America",
        "category": "political", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American political history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "President Franklin Roosevelt's New Deal (1933–1939) was a sweeping set of federal programs, regulations, and reforms designed to combat the Great Depression. Programs like Social Security, the WPA, and the SEC permanently expanded the role of the federal government in American economic and social life.",
             "summary": "FDR's ambitious programs that reshaped the American social contract and the role of government.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Defining Moment: FDR's Hundred Days and the Triumph of Hope", "author": "Jonathan Alter", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "reichstag-fire-1933",
        "title": "Reichstag Fire — Hitler Seizes Emergency Powers",
        "year": 1933, "lat": 52.52, "lng": 13.38,
        "date_display": "February 27, 1933",
        "geo_modern": "Berlin, Germany",
        "geo_era_label": "Weimar Republic / Nazi Germany",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "European political history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "The burning of the Reichstag building on February 27, 1933, four weeks after Hitler became chancellor, was used as a pretext to suspend civil liberties and consolidate Nazi power. The Reichstag Fire Decree effectively ended democracy in Germany and enabled the totalitarian state.",
             "summary": "The fire that gave Hitler the pretext to destroy German democracy.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Coming of the Third Reich", "author": "Richard J. Evans", "publication": "Penguin",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "italy-invades-ethiopia-1935",
        "title": "Italy Invades Ethiopia — League of Nations Fails",
        "year": 1935, "lat": 9.02, "lng": 38.75,
        "date_display": "October 3, 1935",
        "geo_modern": "Addis Ababa, Ethiopia",
        "geo_era_label": "Ethiopian Empire",
        "category": "war", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Ethiopian/Pan-African perspective", "culture_code": "et", "viewpoint_type": "nationalist",
             "narrative": "Mussolini's invasion of Ethiopia in 1935 was a brutal colonial war that used poison gas against civilians. Emperor Haile Selassie's impassioned plea to the League of Nations fell on deaf ears. The failure to stop Italy destroyed the League's credibility and emboldened Hitler.",
             "summary": "Italy's colonial war on Ethiopia that exposed the League of Nations as powerless.", "evidence_score": 0.86,
             "sources": [
                 {"title": "The Addis Ababa Massacre", "author": "Ian Campbell", "publication": "Hurst & Company",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2017}
             ]},
        ],
    },
    {
        "slug": "berlin-olympics-jesse-owens-1936",
        "title": "Berlin Olympics — Jesse Owens Defies Hitler",
        "year": 1936, "lat": 52.52, "lng": 13.24,
        "date_display": "August 1936",
        "geo_modern": "Berlin, Germany",
        "geo_era_label": "Nazi Germany",
        "category": "cultural", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "African American perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The 1936 Berlin Olympics were intended as a showcase for Nazi racial ideology, but African American athlete Jesse Owens won four gold medals, undermining Hitler's Aryan supremacy narrative. Despite this triumph, Owens returned to a segregated America where he was denied basic civil rights.",
             "summary": "Jesse Owens' four gold medals defied Nazi ideology but couldn't overcome American racism.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Triumph: Jesse Owens and the Berlin Olympics", "author": "Jeremy Schaap", "publication": "Houghton Mifflin",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "nanking-massacre-1937",
        "title": "Nanking Massacre — Rape of Nanking",
        "year": 1937, "lat": 32.06, "lng": 118.80,
        "date_display": "December 13, 1937",
        "geo_modern": "Nanjing, China",
        "geo_era_label": "Republic of China",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Chinese perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "Japanese troops captured Nanjing on December 13, 1937 and carried out six weeks of mass murder, rape, and destruction. An estimated 200,000–300,000 Chinese civilians and prisoners of war were killed. The massacre remains one of the most contested atrocities of WWII and a source of deep tension between China and Japan.",
             "summary": "One of the worst atrocities of WWII — mass murder and rape of Chinese civilians by Japanese troops.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Rape of Nanking", "author": "Iris Chang", "publication": "Basic Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "hindenburg-disaster-1937",
        "title": "Hindenburg Disaster — End of the Airship Era",
        "year": 1937, "lat": 40.03, "lng": -74.33,
        "date_display": "May 6, 1937",
        "geo_modern": "Lakehurst, New Jersey, USA",
        "geo_era_label": "Interwar Period",
        "category": "natural", "importance_score": 0.55, "zoom_min": 5, "is_bce": False,
        "perspectives": [
            {"label": "Aviation history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The German airship Hindenburg burst into flames while landing at Lakehurst, New Jersey on May 6, 1937, killing 36 people. Captured on film and broadcast live on radio, the disaster effectively ended the age of rigid airships and became one of the most iconic disasters of the 20th century.",
             "summary": "The spectacular destruction of the Hindenburg ended the airship era and became an iconic media event.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Hindenburg: An Illustrated History", "author": "Rick Archbold", "publication": "Warner Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1994}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # WORLD WAR II ERA (1939–1945)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "dunkirk-evacuation-1940",
        "title": "Dunkirk Evacuation — Miracle of Deliverance",
        "year": 1940, "lat": 51.03, "lng": 2.38,
        "date_display": "May 26 – June 4, 1940",
        "geo_modern": "Dunkirk, France",
        "geo_era_label": "World War II",
        "category": "war", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "Operation Dynamo evacuated over 338,000 Allied soldiers from the beaches of Dunkirk between May 26 and June 4, 1940. A flotilla of military ships, civilian vessels, and fishing boats crossed the English Channel under constant Luftwaffe bombardment. The 'miracle of deliverance' preserved the core of the British Army.",
             "summary": "The dramatic evacuation of 338,000 Allied troops that saved Britain's army to fight another day.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Dunkirk: The Men They Left Behind", "author": "Sean Longden", "publication": "Constable",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "warsaw-ghetto-uprising-1943",
        "title": "Warsaw Ghetto Uprising",
        "year": 1943, "lat": 52.25, "lng": 20.99,
        "date_display": "April 19, 1943",
        "geo_modern": "Warsaw, Poland",
        "geo_era_label": "Nazi-Occupied Poland",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Jewish/Polish perspective", "culture_code": "pl", "viewpoint_type": "academic",
             "narrative": "On April 19, 1943, the remaining Jewish inhabitants of the Warsaw Ghetto rose up against Nazi forces attempting their final deportation to Treblinka. Though hopelessly outgunned, the fighters held out for nearly a month. The uprising became a symbol of Jewish resistance against the Holocaust.",
             "summary": "Jewish fighters' desperate resistance against Nazi extermination — a symbol of courage against genocide.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Uprising in the Warsaw Ghetto", "author": "Ber Mark", "publication": "Schocken Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1975}
             ]},
        ],
    },
    {
        "slug": "yalta-conference-1945",
        "title": "Yalta Conference — Dividing the Postwar World",
        "year": 1945, "lat": 44.47, "lng": 34.16,
        "date_display": "February 4–11, 1945",
        "geo_modern": "Yalta, Crimea",
        "geo_era_label": "World War II",
        "category": "political", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Cold War history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "At Yalta in February 1945, Roosevelt, Churchill, and Stalin agreed on the postwar division of Europe, the structure of the United Nations, and Soviet entry into the Pacific war. The conference effectively drew the battle lines of the Cold War, dividing Europe into Western and Soviet spheres of influence.",
             "summary": "The Big Three conference that shaped the postwar world order and planted the seeds of the Cold War.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Yalta: The Price of Peace", "author": "S.M. Plokhy", "publication": "Viking",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # COLD WAR / DECOLONIZATION (1945–1970)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "transistor-invented-1947",
        "title": "Transistor Invented — Dawn of the Electronics Age",
        "year": 1947, "lat": 40.68, "lng": -74.40,
        "date_display": "December 23, 1947",
        "geo_modern": "Murray Hill, New Jersey, USA",
        "geo_era_label": "Postwar America",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "John Bardeen, Walter Brattain, and William Shockley invented the transistor at Bell Labs on December 23, 1947. This tiny semiconductor device replaced vacuum tubes and made possible the modern electronics revolution — from radios and televisions to computers and smartphones.",
             "summary": "The invention that made the entire digital age possible.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Crystal Fire: The Invention of the Transistor and the Birth of the Information Age", "author": "Michael Riordan", "publication": "W.W. Norton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "soviet-atomic-bomb-1949",
        "title": "Soviet Union Tests First Atomic Bomb",
        "year": 1949, "lat": 50.44, "lng": 78.41,
        "date_display": "August 29, 1949",
        "geo_modern": "Semipalatinsk, Kazakhstan",
        "geo_era_label": "Early Cold War",
        "category": "war", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Cold War history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Soviet Union detonated its first atomic bomb, 'Joe-1,' on August 29, 1949, at the Semipalatinsk test site in Kazakhstan, ending America's nuclear monopoly years earlier than expected. The test shocked the West and launched the nuclear arms race that defined the Cold War.",
             "summary": "The Soviet bomb that ended America's nuclear monopoly and launched the arms race.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Dark Sun: The Making of the Hydrogen Bomb", "author": "Richard Rhodes", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1995}
             ]},
        ],
    },
    {
        "slug": "stalin-dies-1953",
        "title": "Death of Stalin — End of an Era",
        "year": 1953, "lat": 55.75, "lng": 37.62,
        "date_display": "March 5, 1953",
        "geo_modern": "Moscow, USSR",
        "geo_era_label": "Soviet Union",
        "category": "political", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Soviet history perspective", "culture_code": "ru", "viewpoint_type": "academic",
             "narrative": "Joseph Stalin died on March 5, 1953, ending nearly three decades of totalitarian rule. His death triggered a power struggle that Nikita Khrushchev eventually won, leading to de-Stalinization and a partial thaw in the Cold War. Stalin's legacy includes rapid industrialization but also the deaths of millions through purges, forced collectivization, and the Gulag system.",
             "summary": "The death of the Soviet dictator that opened the door to de-Stalinization.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Stalin: The Court of the Red Tsar", "author": "Simon Sebag Montefiore", "publication": "Weidenfeld & Nicolson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "everest-summit-1953",
        "title": "First Ascent of Mount Everest",
        "year": 1953, "lat": 27.99, "lng": 86.93,
        "date_display": "May 29, 1953",
        "geo_modern": "Mount Everest, Nepal/Tibet border",
        "geo_era_label": "Postwar Era",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Exploration history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Edmund Hillary of New Zealand and Tenzing Norgay, a Nepali-Indian Sherpa, reached the summit of Mount Everest on May 29, 1953 — the first confirmed ascent of the world's highest peak. News reached London on the morning of Queen Elizabeth II's coronation, electrifying the British Commonwealth.",
             "summary": "The first conquest of Earth's highest peak, achieved by Hillary and Tenzing Norgay.", "evidence_score": 0.90,
             "sources": [
                 {"title": "High Adventure", "author": "Edmund Hillary", "publication": "Hodder & Stoughton",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1955}
             ]},
        ],
    },
    {
        "slug": "brown-v-board-education-1954",
        "title": "Brown v. Board of Education — School Segregation Unconstitutional",
        "year": 1954, "lat": 38.91, "lng": -77.04,
        "date_display": "May 17, 1954",
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Jim Crow America",
        "category": "political", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Civil rights perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The U.S. Supreme Court's unanimous ruling in Brown v. Board of Education on May 17, 1954 declared racial segregation in public schools unconstitutional, overturning the 'separate but equal' doctrine of Plessy v. Ferguson. The decision was a landmark victory for the civil rights movement, though implementation faced massive resistance.",
             "summary": "The Supreme Court ruling that struck down school segregation and energized the civil rights movement.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Simple Justice", "author": "Richard Kluger", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1975}
             ]},
        ],
    },
    {
        "slug": "nasa-founded-1958",
        "title": "NASA Founded — US Space Program Begins",
        "year": 1958, "lat": 38.88, "lng": -77.02,
        "date_display": "July 29, 1958",
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Space Race",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Space exploration perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The National Aeronautics and Space Administration was established on July 29, 1958, in direct response to the Soviet Sputnik launch. NASA consolidated US space efforts and within 11 years achieved the moon landing. The agency became a symbol of American technological ambition.",
             "summary": "America's response to Sputnik — the space agency that would put humans on the Moon.", "evidence_score": 0.88,
             "sources": [
                 {"title": "NASA: A History of the U.S. Civil Space Program", "author": "Roger Launius", "publication": "Krieger Publishing",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "mlk-i-have-a-dream-1963",
        "title": "Martin Luther King's 'I Have a Dream' Speech",
        "year": 1963, "lat": 38.89, "lng": -77.05,
        "date_display": "August 28, 1963",
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Civil Rights Era America",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Civil rights perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Before 250,000 people at the March on Washington on August 28, 1963, Martin Luther King Jr. delivered his iconic 'I Have a Dream' speech from the steps of the Lincoln Memorial. The speech became the defining moment of the American civil rights movement and one of the greatest pieces of oratory in history.",
             "summary": "The defining speech of the American civil rights movement, delivered to 250,000 at the Lincoln Memorial.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Let the Trumpet Sound: A Life of Martin Luther King, Jr.", "author": "Stephen B. Oates", "publication": "Harper & Row",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1982}
             ]},
        ],
    },
    {
        "slug": "gulf-of-tonkin-1964",
        "title": "Gulf of Tonkin Incident — US Escalation in Vietnam",
        "year": 1964, "lat": 20.00, "lng": 107.60,
        "date_display": "August 2, 1964",
        "geo_modern": "Gulf of Tonkin, Vietnam",
        "geo_era_label": "Vietnam War",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American foreign policy perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Gulf of Tonkin incidents of August 1964 — one real attack on a US destroyer and one probable false alarm — led Congress to pass the Gulf of Tonkin Resolution, giving President Johnson broad authority to escalate US military involvement in Vietnam without a formal declaration of war.",
             "summary": "The contested incidents that gave the US president a blank check to wage war in Vietnam.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Tonkin Gulf Resolution", "author": "Joseph Goulden", "publication": "Rand McNally",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1969}
             ]},
        ],
    },
    {
        "slug": "us-combat-troops-vietnam-1965",
        "title": "US Combat Troops Enter Vietnam",
        "year": 1965, "lat": 16.07, "lng": 108.22,
        "date_display": "March 8, 1965",
        "geo_modern": "Da Nang, Vietnam",
        "geo_era_label": "Vietnam War",
        "category": "war", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Vietnamese perspective", "culture_code": "vn", "viewpoint_type": "nationalist",
             "narrative": "The first US combat troops — 3,500 Marines — landed at Da Nang on March 8, 1965, beginning America's direct ground war in Vietnam. By 1968, over 500,000 American troops were deployed. The war killed an estimated 2–3 million Vietnamese and 58,000 Americans before ending in 1975.",
             "summary": "The beginning of America's ground war in Vietnam that would last a decade and cost millions of lives.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Vietnam: A History", "author": "Stanley Karnow", "publication": "Viking Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1983}
             ]},
        ],
    },
    {
        "slug": "mlk-assassination-1968",
        "title": "Assassination of Martin Luther King Jr.",
        "year": 1968, "lat": 35.13, "lng": -90.06,
        "date_display": "April 4, 1968",
        "geo_modern": "Memphis, Tennessee, USA",
        "geo_era_label": "Civil Rights Era America",
        "category": "person", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Civil rights perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Martin Luther King Jr. was assassinated on April 4, 1968, at the Lorraine Motel in Memphis, Tennessee. He was 39 years old. His murder triggered riots in over 100 American cities and became a defining moment of a tumultuous year. King's legacy as the preeminent leader of nonviolent resistance endures worldwide.",
             "summary": "The assassination of America's greatest civil rights leader, sparking nationwide upheaval.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Bearing the Cross: Martin Luther King, Jr., and the Southern Christian Leadership Conference", "author": "David Garrow", "publication": "William Morrow",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1986}
             ]},
        ],
    },
    {
        "slug": "rfk-assassination-1968",
        "title": "Assassination of Robert F. Kennedy",
        "year": 1968, "lat": 34.06, "lng": -118.30,
        "date_display": "June 5, 1968",
        "geo_modern": "Los Angeles, California, USA",
        "geo_era_label": "Civil Rights Era America",
        "category": "person", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "American political history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Senator Robert F. Kennedy was shot on June 5, 1968, moments after winning the California Democratic presidential primary, and died the next day. Coming just two months after MLK's assassination, RFK's murder deepened America's sense of crisis and disillusionment during one of its most turbulent years.",
             "summary": "The second Kennedy assassination deepened America's trauma during its most turbulent year.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Bobby Kennedy: The Making of a Liberal Icon", "author": "Larry Tye", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "woodstock-1969",
        "title": "Woodstock Music Festival",
        "year": 1969, "lat": 41.71, "lng": -74.88,
        "date_display": "August 15–18, 1969",
        "geo_modern": "Bethel, New York, USA",
        "geo_era_label": "Counterculture Era",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "American cultural history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Woodstock Music and Art Fair drew over 400,000 people to a dairy farm in Bethel, New York from August 15–18, 1969. Featuring performances by Jimi Hendrix, Janis Joplin, and dozens of others, Woodstock became the defining cultural event of the 1960s counterculture movement.",
             "summary": "The iconic music festival that defined the 1960s counterculture.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Woodstock: The Oral History", "author": "Joel Makower", "publication": "Tilden Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1989}
             ]},
        ],
    },
    {
        "slug": "stonewall-riots-1969",
        "title": "Stonewall Riots — Birth of the Gay Rights Movement",
        "year": 1969, "lat": 40.73, "lng": -74.00,
        "date_display": "June 28, 1969",
        "geo_modern": "New York City, USA",
        "geo_era_label": "Civil Rights Era America",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "LGBTQ+ history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Stonewall riots began on June 28, 1969, when patrons of the Stonewall Inn in Greenwich Village resisted a police raid. The six days of protests that followed are widely considered the catalyst for the modern LGBTQ+ rights movement, leading to the formation of advocacy organizations and annual Pride marches worldwide.",
             "summary": "The uprising that launched the modern LGBTQ+ rights movement.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Stonewall: The Riots That Sparked the Gay Revolution", "author": "David Carter", "publication": "St. Martin's Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # 1970s–1980s
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "kent-state-massacre-1970",
        "title": "Kent State Massacre — Four Students Killed",
        "year": 1970, "lat": 41.15, "lng": -81.34,
        "date_display": "May 4, 1970",
        "geo_modern": "Kent, Ohio, USA",
        "geo_era_label": "Vietnam War Era",
        "category": "political", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "American antiwar perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Ohio National Guard troops fired on unarmed students protesting the Vietnam War at Kent State University on May 4, 1970, killing four and wounding nine. The shootings shocked the nation, triggered a nationwide student strike, and deepened the domestic crisis over Vietnam.",
             "summary": "National Guard troops killed four students, intensifying American opposition to the Vietnam War.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Kent State: What Happened and Why", "author": "James Michener", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1971}
             ]},
        ],
    },
    {
        "slug": "bangladesh-independence-1971",
        "title": "Bangladesh Liberation War — Birth of Bangladesh",
        "year": 1971, "lat": 23.81, "lng": 90.41,
        "date_display": "December 16, 1971",
        "geo_modern": "Dhaka, Bangladesh",
        "geo_era_label": "South Asia",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Bangladeshi perspective", "culture_code": "bd", "viewpoint_type": "nationalist",
             "narrative": "The Bangladesh Liberation War of 1971 resulted from West Pakistan's brutal military crackdown on East Pakistan after Bengali nationalists won elections. Indian intervention in December 1971 led to Pakistan's surrender and the creation of Bangladesh. An estimated 300,000–3 million Bengalis were killed during the conflict.",
             "summary": "A brutal independence war that created Bangladesh from the ruins of East Pakistan.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Blood Telegram", "author": "Gary J. Bass", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "munich-olympics-massacre-1972",
        "title": "Munich Olympics Massacre",
        "year": 1972, "lat": 48.17, "lng": 11.55,
        "date_display": "September 5, 1972",
        "geo_modern": "Munich, Germany",
        "geo_era_label": "Cold War Europe",
        "category": "war", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "International perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Palestinian Black September terrorists seized 11 Israeli athletes at the 1972 Munich Olympics on September 5. A botched rescue attempt by German police left all 11 hostages, five terrorists, and one police officer dead. The attack marked the beginning of the modern era of international terrorism.",
             "summary": "Palestinian terrorists killed 11 Israeli athletes, shocking the world and ushering in the age of terrorism.", "evidence_score": 0.88,
             "sources": [
                 {"title": "One Day in September", "author": "Simon Reeve", "publication": "Faber and Faber",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "watergate-scandal-1972",
        "title": "Watergate Scandal Begins",
        "year": 1972, "lat": 38.90, "lng": -77.05,
        "date_display": "June 17, 1972",
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Vietnam War Era",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American political history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The break-in at the Democratic National Committee headquarters at the Watergate complex on June 17, 1972, led to the greatest political scandal in American history. Investigative journalism and congressional hearings revealed a web of abuses of power, ultimately forcing President Nixon's resignation in August 1974.",
             "summary": "The political scandal that brought down a president and transformed American political culture.", "evidence_score": 0.92,
             "sources": [
                 {"title": "All the President's Men", "author": "Bob Woodward and Carl Bernstein", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1974}
             ]},
        ],
    },
    {
        "slug": "pinochet-coup-chile-1973",
        "title": "Pinochet Coup in Chile — Allende Overthrown",
        "year": 1973, "lat": -33.45, "lng": -70.67,
        "date_display": "September 11, 1973",
        "geo_modern": "Santiago, Chile",
        "geo_era_label": "Cold War Latin America",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Chilean/Latin American perspective", "culture_code": "cl", "viewpoint_type": "academic",
             "narrative": "On September 11, 1973, General Augusto Pinochet led a US-backed military coup that overthrew Chile's democratically elected socialist president Salvador Allende, who died during the assault on the presidential palace. Pinochet's 17-year dictatorship killed over 3,000 people and tortured tens of thousands.",
             "summary": "A CIA-backed coup that overthrew Latin America's first democratically elected socialist and installed a brutal dictatorship.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Pinochet File", "author": "Peter Kornbluh", "publication": "The New Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "nixon-resigns-1974",
        "title": "Nixon Resigns — First US Presidential Resignation",
        "year": 1974, "lat": 38.91, "lng": -77.04,
        "date_display": "August 9, 1974",
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Post-Vietnam America",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American political history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Facing certain impeachment for his role in the Watergate cover-up, Richard Nixon resigned the presidency on August 9, 1974 — the only US president to do so. The resignation was a triumph for constitutional governance and the rule of law, but deepened public cynicism about government.",
             "summary": "The only US presidential resignation, a consequence of the Watergate scandal.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Final Days", "author": "Bob Woodward and Carl Bernstein", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1976}
             ]},
        ],
    },
    {
        "slug": "soweto-uprising-1976",
        "title": "Soweto Uprising — South African Students Revolt",
        "year": 1976, "lat": -26.27, "lng": 27.86,
        "date_display": "June 16, 1976",
        "geo_modern": "Soweto, Johannesburg, South Africa",
        "geo_era_label": "Apartheid South Africa",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "South African perspective", "culture_code": "za", "viewpoint_type": "nationalist",
             "narrative": "On June 16, 1976, thousands of Black South African students in Soweto protested the mandatory use of Afrikaans in schools. Police opened fire, killing Hector Pieterson, age 13, among hundreds. The photograph of his body became an iconic image of apartheid's brutality and galvanized international sanctions against South Africa.",
             "summary": "A student protest that became a turning point in the struggle against apartheid.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Soweto: A History", "author": "Philip Bonner", "publication": "Maskew Miller Longman",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "voyager-missions-1977",
        "title": "Voyager Spacecraft Launched — Grand Tour of the Outer Planets",
        "year": 1977, "lat": 28.57, "lng": -80.65,
        "date_display": "August – September 1977",
        "geo_modern": "Cape Canaveral, Florida, USA",
        "geo_era_label": "Space Age",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Space exploration perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "NASA launched Voyager 1 and Voyager 2 in 1977 on a grand tour of the outer planets, exploiting a rare planetary alignment. The probes revealed the stunning complexity of Jupiter, Saturn, Uranus, and Neptune's systems. Both spacecraft have since entered interstellar space, carrying the Golden Record — humanity's message to the cosmos.",
             "summary": "Twin spacecraft that explored the outer planets and became humanity's first interstellar emissaries.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Voyager: Seeking Newer Worlds in the Third Great Age of Discovery", "author": "Stephen Pyne", "publication": "Viking",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "three-mile-island-1979",
        "title": "Three Mile Island Nuclear Accident",
        "year": 1979, "lat": 40.15, "lng": -76.73,
        "date_display": "March 28, 1979",
        "geo_modern": "Harrisburg, Pennsylvania, USA",
        "geo_era_label": "Cold War America",
        "category": "natural", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Environmental/energy history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "A partial meltdown at the Three Mile Island nuclear power plant on March 28, 1979, was the worst nuclear accident in US history. While no deaths were directly attributed to the incident, it effectively halted new nuclear power plant construction in the United States for decades and energized the anti-nuclear movement.",
             "summary": "America's worst nuclear accident, which derailed the US nuclear power industry.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Three Mile Island: A Nuclear Crisis in Historical Perspective", "author": "J. Samuel Walker", "publication": "University of California Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "thatcher-elected-1979",
        "title": "Margaret Thatcher Becomes Prime Minister",
        "year": 1979, "lat": 51.50, "lng": -0.12,
        "date_display": "May 4, 1979",
        "geo_modern": "London, England",
        "geo_era_label": "Late Cold War Britain",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British political history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Margaret Thatcher became Britain's first female prime minister on May 4, 1979. Over 11 years in power, she privatized state industries, broke the power of trade unions, and championed free-market economics. 'Thatcherism' transformed Britain's economy and political landscape and influenced conservative movements worldwide.",
             "summary": "Britain's first female PM whose free-market revolution transformed the country and inspired global conservatism.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Iron Lady: Margaret Thatcher", "author": "John Campbell", "publication": "Jonathan Cape",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "aids-epidemic-1981",
        "title": "AIDS Epidemic Recognized",
        "year": 1981, "lat": 37.77, "lng": -122.42,
        "date_display": "June 5, 1981",
        "geo_modern": "San Francisco / New York, USA",
        "geo_era_label": "1980s America",
        "category": "natural", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Public health perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "On June 5, 1981, the CDC reported unusual pneumonia cases among gay men in Los Angeles, marking the first official recognition of what became the AIDS epidemic. HIV/AIDS has killed over 40 million people worldwide. The epidemic reshaped public health policy, LGBTQ+ activism, and pharmaceutical research.",
             "summary": "The recognition of a pandemic that has killed 40 million and transformed global health.", "evidence_score": 0.92,
             "sources": [
                 {"title": "And the Band Played On", "author": "Randy Shilts", "publication": "St. Martin's Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1987}
             ]},
        ],
    },
    {
        "slug": "bhopal-disaster-1984",
        "title": "Bhopal Gas Disaster — World's Worst Industrial Accident",
        "year": 1984, "lat": 23.26, "lng": 77.41,
        "date_display": "December 3, 1984",
        "geo_modern": "Bhopal, Madhya Pradesh, India",
        "geo_era_label": "Modern India",
        "category": "natural", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Indian/environmental justice perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "A leak of methyl isocyanate gas from the Union Carbide pesticide plant in Bhopal on December 3, 1984 killed at least 3,800 people immediately and an estimated 15,000–20,000 over subsequent years. The disaster exposed the dangers of lax industrial safety in developing nations and the limits of corporate accountability.",
             "summary": "The world's worst industrial accident, killing thousands and poisoning a city for decades.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Five Past Midnight in Bhopal", "author": "Dominique Lapierre and Javier Moro", "publication": "Warner Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "ethiopian-famine-live-aid-1984",
        "title": "Ethiopian Famine and Live Aid Concert",
        "year": 1984, "lat": 9.02, "lng": 38.75,
        "date_display": "1984–1985",
        "geo_modern": "Ethiopia",
        "geo_era_label": "Horn of Africa",
        "category": "natural", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Humanitarian perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Ethiopian famine of 1983–1985 killed an estimated 400,000–1 million people, driven by drought and civil war. BBC footage of the famine shocked the world and inspired Bob Geldof's Live Aid concerts in 1985, which raised $127 million. The event launched the modern era of celebrity-driven humanitarian campaigns.",
             "summary": "A devastating famine that inspired Live Aid and transformed global humanitarian response.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Politics of Famine in Ethiopia", "author": "Jason Clay and Bonnie Holcomb", "publication": "Cultural Survival",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1986}
             ]},
        ],
    },
    {
        "slug": "gorbachev-glasnost-perestroika-1985",
        "title": "Gorbachev Launches Glasnost and Perestroika",
        "year": 1985, "lat": 55.75, "lng": 37.62,
        "date_display": "March 1985",
        "geo_modern": "Moscow, USSR",
        "geo_era_label": "Late Soviet Union",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Soviet/Russian perspective", "culture_code": "ru", "viewpoint_type": "academic",
             "narrative": "Mikhail Gorbachev became Soviet leader in March 1985 and launched glasnost (openness) and perestroika (restructuring) to modernize the stagnating Soviet system. These reforms unleashed forces he could not control — demands for national independence, democratic elections, and free speech — ultimately leading to the dissolution of the USSR in 1991.",
             "summary": "The reforms intended to save the Soviet Union that instead hastened its collapse.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Gorbachev: His Life and Times", "author": "William Taubman", "publication": "W.W. Norton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2017}
             ]},
        ],
    },
    {
        "slug": "challenger-disaster-1986",
        "title": "Space Shuttle Challenger Disaster",
        "year": 1986, "lat": 28.57, "lng": -80.65,
        "date_display": "January 28, 1986",
        "geo_modern": "Cape Canaveral, Florida, USA",
        "geo_era_label": "Space Age",
        "category": "natural", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Space exploration perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Space Shuttle Challenger broke apart 73 seconds after launch on January 28, 1986, killing all seven crew members including teacher Christa McAuliffe. The disaster, witnessed live on television by millions of schoolchildren, was caused by a failed O-ring seal. It exposed NASA's flawed safety culture and halted shuttle flights for 32 months.",
             "summary": "The shuttle disaster that killed seven crew members and exposed fatal flaws in NASA's safety culture.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Report of the Presidential Commission on the Space Shuttle Challenger Accident", "author": "Rogers Commission",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1986}
             ]},
        ],
    },
    {
        "slug": "black-monday-1987",
        "title": "Black Monday — Stock Market Crash of 1987",
        "year": 1987, "lat": 40.71, "lng": -74.01,
        "date_display": "October 19, 1987",
        "geo_modern": "New York City, USA",
        "geo_era_label": "1980s Boom",
        "category": "economic", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Financial history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "On October 19, 1987, the Dow Jones Industrial Average fell 22.6% — the largest single-day percentage decline in its history. The crash spread globally as markets in Hong Kong, Europe, and Australia also plunged. It led to the introduction of circuit breakers and new regulations on program trading.",
             "summary": "The largest single-day stock market crash in history, which prompted new financial safeguards.", "evidence_score": 0.88,
             "sources": [
                 {"title": "A Brief History of Doom", "author": "Richard Vague", "publication": "University of Pennsylvania Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "inf-treaty-1987",
        "title": "INF Treaty — US and Soviet Union Eliminate Nuclear Missiles",
        "year": 1987, "lat": 38.91, "lng": -77.04,
        "date_display": "December 8, 1987",
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Late Cold War",
        "category": "political", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Arms control perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Intermediate-Range Nuclear Forces Treaty, signed by Reagan and Gorbachev on December 8, 1987, eliminated an entire class of nuclear weapons. It was the first arms control agreement to actually reduce nuclear arsenals rather than merely limit their growth, signaling the approaching end of the Cold War.",
             "summary": "The first treaty to actually eliminate nuclear weapons, a landmark in Cold War de-escalation.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Reagan and Gorbachev: How the Cold War Ended", "author": "Jack F. Matlock Jr.", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "lockerbie-pan-am-103-1988",
        "title": "Pan Am Flight 103 — Lockerbie Bombing",
        "year": 1988, "lat": 55.12, "lng": -3.35,
        "date_display": "December 21, 1988",
        "geo_modern": "Lockerbie, Scotland",
        "geo_era_label": "Late Cold War",
        "category": "war", "importance_score": 0.60, "zoom_min": 5, "is_bce": False,
        "perspectives": [
            {"label": "International terrorism perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Pan Am Flight 103 was destroyed by a bomb over Lockerbie, Scotland on December 21, 1988, killing all 259 on board and 11 on the ground. Libyan intelligence agent Abdelbaset al-Megrahi was convicted in 2001. The bombing was the deadliest terrorist attack involving a US aircraft until September 11, 2001.",
             "summary": "The deadliest terrorist attack on a US aircraft before 9/11.", "evidence_score": 0.87,
             "sources": [
                 {"title": "On the Trail of Terror", "author": "David Leppard", "publication": "Jonathan Cape",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "romanian-revolution-1989",
        "title": "Romanian Revolution — Ceaușescu Overthrown",
        "year": 1989, "lat": 44.43, "lng": 26.10,
        "date_display": "December 25, 1989",
        "geo_modern": "Bucharest, Romania",
        "geo_era_label": "Eastern Bloc Collapse",
        "category": "political", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Eastern European perspective", "culture_code": "ro", "viewpoint_type": "academic",
             "narrative": "Romania's revolution in December 1989 was the only violent overthrow of a communist regime in Eastern Europe. Dictator Nicolae Ceaușescu and his wife were executed on Christmas Day after a popular uprising. Over 1,100 people were killed during the revolution. Romania's transition to democracy proved long and turbulent.",
             "summary": "The only violent revolution of 1989 — the execution of a communist dictator on Christmas Day.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Life and Evil Times of Nicolae Ceausescu", "author": "John Sweeney", "publication": "Hutchinson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1991}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # 1990s
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "iraq-invades-kuwait-1990",
        "title": "Iraq Invades Kuwait",
        "year": 1990, "lat": 29.38, "lng": 47.99,
        "date_display": "August 2, 1990",
        "geo_modern": "Kuwait City, Kuwait",
        "geo_era_label": "Post-Cold War Middle East",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Middle Eastern perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Saddam Hussein's Iraq invaded Kuwait on August 2, 1990, seizing control within two days. The invasion was driven by oil disputes and Iraq's war debts. The UN Security Council condemned the invasion and authorized military force, leading to the Gulf War in January 1991.",
             "summary": "Saddam's invasion of Kuwait that triggered the first major post-Cold War military intervention.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Generals' War", "author": "Michael Gordon and Bernard Trainor", "publication": "Little, Brown",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1995}
             ]},
        ],
    },
    {
        "slug": "hubble-space-telescope-1990",
        "title": "Hubble Space Telescope Launched",
        "year": 1990, "lat": 28.57, "lng": -80.65,
        "date_display": "April 24, 1990",
        "geo_modern": "Cape Canaveral, Florida, USA (orbit)",
        "geo_era_label": "Space Age",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Astronomy perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Hubble Space Telescope was launched on April 24, 1990, and after a corrective mission in 1993, became the most productive scientific instrument in history. Hubble's images of distant galaxies, nebulae, and exoplanets have transformed our understanding of the universe and become iconic cultural images.",
             "summary": "The space telescope that revolutionized our understanding of the universe.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Universe in a Mirror: The Saga of the Hubble Space Telescope", "author": "Robert Zimmerman", "publication": "Princeton University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "yugoslav-wars-begin-1991",
        "title": "Yugoslav Wars Begin — Breakup of Yugoslavia",
        "year": 1991, "lat": 44.81, "lng": 20.46,
        "date_display": "June 1991",
        "geo_modern": "Belgrade, Yugoslavia",
        "geo_era_label": "Post-Cold War Europe",
        "category": "war", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "European perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The breakup of Yugoslavia began with Slovenia and Croatia's declarations of independence in June 1991, triggering a series of wars that lasted until 2001. The conflicts — in Croatia, Bosnia, and Kosovo — killed over 140,000 people, involved ethnic cleansing and genocide, and represented Europe's worst violence since WWII.",
             "summary": "The violent breakup of Yugoslavia that brought genocide back to Europe.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Fall of Yugoslavia", "author": "Misha Glenny", "publication": "Penguin",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1992}
             ]},
        ],
    },
    {
        "slug": "bosnian-war-1992",
        "title": "Bosnian War — Siege of Sarajevo Begins",
        "year": 1992, "lat": 43.86, "lng": 18.41,
        "date_display": "April 5, 1992",
        "geo_modern": "Sarajevo, Bosnia and Herzegovina",
        "geo_era_label": "Yugoslav Wars",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Bosnian perspective", "culture_code": "ba", "viewpoint_type": "academic",
             "narrative": "The Bosnian War (1992–1995) was the deadliest of the Yugoslav conflicts. The siege of Sarajevo lasted 1,425 days — the longest siege of a capital city in modern warfare. Bosnian Serb forces conducted ethnic cleansing against Bosniak Muslims, culminating in the Srebrenica genocide of 1995.",
             "summary": "The deadliest Yugoslav war, featuring the longest modern siege and genocide at Srebrenica.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Bosnia: A Short History", "author": "Noel Malcolm", "publication": "NYU Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "la-riots-1992",
        "title": "Los Angeles Riots",
        "year": 1992, "lat": 33.94, "lng": -118.25,
        "date_display": "April 29, 1992",
        "geo_modern": "Los Angeles, California, USA",
        "geo_era_label": "Post-Cold War America",
        "category": "political", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "American racial justice perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The 1992 Los Angeles riots erupted on April 29 after four LAPD officers were acquitted of beating Black motorist Rodney King, despite videotaped evidence. Over six days, 63 people died, over 2,000 were injured, and property damage exceeded $1 billion. The riots exposed deep racial tensions and police brutality in American cities.",
             "summary": "Deadly riots over police brutality that exposed America's deep racial divisions.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Official Negligence", "author": "Lou Cannon", "publication": "Times Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "earth-summit-rio-1992",
        "title": "Earth Summit — Rio de Janeiro",
        "year": 1992, "lat": -22.91, "lng": -43.17,
        "date_display": "June 3–14, 1992",
        "geo_modern": "Rio de Janeiro, Brazil",
        "geo_era_label": "Post-Cold War",
        "category": "political", "importance_score": 0.65, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Environmental history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The 1992 United Nations Conference on Environment and Development in Rio de Janeiro, attended by 172 nations, was the largest gathering of world leaders in history. It produced the Framework Convention on Climate Change, the Convention on Biological Diversity, and Agenda 21 — laying the groundwork for decades of climate negotiations.",
             "summary": "The landmark summit that launched the global framework for addressing climate change.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Earth in the Balance", "author": "Al Gore", "publication": "Houghton Mifflin",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1992}
             ]},
        ],
    },
    {
        "slug": "oslo-accords-1993",
        "title": "Oslo Accords — Israeli-Palestinian Peace Process",
        "year": 1993, "lat": 38.91, "lng": -77.04,
        "date_display": "September 13, 1993",
        "geo_modern": "Washington, D.C., USA",
        "geo_era_label": "Post-Cold War Middle East",
        "category": "political", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Middle Eastern perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Oslo Accords, signed on the White House lawn on September 13, 1993, were the first face-to-face agreement between Israel and the Palestine Liberation Organization. Rabin and Arafat shook hands before President Clinton in an iconic moment. The accords created the Palestinian Authority but ultimately failed to achieve a final peace settlement.",
             "summary": "The historic but ultimately unfulfilled promise of Israeli-Palestinian peace.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Oslo Accords: International Law and the Israeli-Palestinian Peace Agreements", "author": "Raja Shehadeh", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "eu-maastricht-treaty-1993",
        "title": "European Union Established — Maastricht Treaty",
        "year": 1993, "lat": 50.85, "lng": 5.69,
        "date_display": "November 1, 1993",
        "geo_modern": "Maastricht, Netherlands",
        "geo_era_label": "Post-Cold War Europe",
        "category": "political", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "European integration perspective", "culture_code": "eu", "viewpoint_type": "academic",
             "narrative": "The Maastricht Treaty, which entered into force on November 1, 1993, transformed the European Communities into the European Union. It introduced EU citizenship, laid the groundwork for the euro currency, and established common foreign and security policies — the most ambitious experiment in supranational governance in history.",
             "summary": "The treaty that created the European Union and laid the foundation for deeper integration.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Europe: The Struggle for Supremacy", "author": "Brendan Simms", "publication": "Basic Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "nafta-takes-effect-1994",
        "title": "NAFTA Takes Effect — North American Free Trade",
        "year": 1994, "lat": 19.43, "lng": -99.13,
        "date_display": "January 1, 1994",
        "geo_modern": "North America",
        "geo_era_label": "Post-Cold War",
        "category": "economic", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Economic perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The North American Free Trade Agreement between the US, Canada, and Mexico took effect on January 1, 1994, creating the world's largest free trade zone. NAFTA dramatically increased cross-border trade and investment but remained controversial for its effects on manufacturing jobs and Mexican agriculture.",
             "summary": "The free trade agreement that integrated North American economies amid fierce debate.", "evidence_score": 0.85,
             "sources": [
                 {"title": "NAFTA and Labor in North America", "author": "Norman Caulfield", "publication": "University of Illinois Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "oklahoma-city-bombing-1995",
        "title": "Oklahoma City Bombing",
        "year": 1995, "lat": 35.47, "lng": -97.52,
        "date_display": "April 19, 1995",
        "geo_modern": "Oklahoma City, Oklahoma, USA",
        "geo_era_label": "1990s America",
        "category": "war", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "American domestic terrorism perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Timothy McVeigh detonated a truck bomb outside the Alfred P. Murrah Federal Building in Oklahoma City on April 19, 1995, killing 168 people including 19 children in the building's daycare center. It was the deadliest act of domestic terrorism in US history and exposed the threat of far-right extremism in America.",
             "summary": "The deadliest domestic terrorist attack in US history, exposing the far-right extremist threat.", "evidence_score": 0.90,
             "sources": [
                 {"title": "American Terrorist: Timothy McVeigh and the Oklahoma City Bombing", "author": "Lou Michel and Dan Herbeck", "publication": "Harper",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "srebrenica-massacre-1995",
        "title": "Srebrenica Massacre — Genocide in Bosnia",
        "year": 1995, "lat": 44.11, "lng": 19.30,
        "date_display": "July 11, 1995",
        "geo_modern": "Srebrenica, Bosnia and Herzegovina",
        "geo_era_label": "Yugoslav Wars",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Bosniak perspective", "culture_code": "ba", "viewpoint_type": "academic",
             "narrative": "Bosnian Serb forces under General Ratko Mladić overran the UN-declared safe area of Srebrenica on July 11, 1995, and systematically murdered over 8,000 Bosniak Muslim men and boys. It was the worst mass atrocity in Europe since World War II and was ruled a genocide by the International Criminal Tribunal for the former Yugoslavia.",
             "summary": "The worst genocide in Europe since WWII — 8,000 Bosniak men and boys murdered.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Srebrenica: Record of a War Crime", "author": "Jan Willem Honig and Norbert Both", "publication": "Penguin",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "wto-established-1995",
        "title": "World Trade Organization Established",
        "year": 1995, "lat": 46.23, "lng": 6.15,
        "date_display": "January 1, 1995",
        "geo_modern": "Geneva, Switzerland",
        "geo_era_label": "Post-Cold War Globalization",
        "category": "economic", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Economic globalization perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The World Trade Organization replaced GATT on January 1, 1995, becoming the primary international body governing global trade. With 164 member states, the WTO established binding rules for international commerce and a dispute resolution mechanism, accelerating the era of globalization.",
             "summary": "The institution that formalized the rules-based global trading system.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The WTO: Crisis and the Governance of Global Trade", "author": "Rorden Wilkinson", "publication": "Routledge",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "dolly-sheep-cloned-1996",
        "title": "Dolly the Sheep — First Mammal Cloned",
        "year": 1996, "lat": 55.90, "lng": -3.17,
        "date_display": "July 5, 1996",
        "geo_modern": "Edinburgh, Scotland",
        "geo_era_label": "1990s",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Dolly the sheep, born on July 5, 1996 at the Roslin Institute in Edinburgh, was the first mammal cloned from an adult somatic cell. Her creation by Ian Wilmut's team proved that specialized cells could be reprogrammed, revolutionizing genetics and sparking intense ethical debates about cloning.",
             "summary": "The first cloned mammal, a breakthrough that transformed genetics and bioethics.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Second Creation: Dolly and the Age of Biological Control", "author": "Ian Wilmut", "publication": "Farrar, Straus and Giroux",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "hong-kong-handover-1997",
        "title": "Hong Kong Handover to China",
        "year": 1997, "lat": 22.32, "lng": 114.17,
        "date_display": "July 1, 1997",
        "geo_modern": "Hong Kong, China",
        "geo_era_label": "End of British Empire",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Hong Kong perspective", "culture_code": "hk", "viewpoint_type": "academic",
             "narrative": "At midnight on July 1, 1997, Britain transferred sovereignty of Hong Kong to the People's Republic of China, ending 156 years of colonial rule. Under the 'one country, two systems' framework, Hong Kong was promised 50 years of autonomy. The handover marked the symbolic end of the British Empire.",
             "summary": "The end of British colonial rule in Hong Kong and a symbolic close to the age of European empires.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Gate to China: A New History of the People's Republic and Hong Kong", "author": "Michael Sheridan", "publication": "William Collins",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "asian-financial-crisis-1997",
        "title": "Asian Financial Crisis",
        "year": 1997, "lat": 13.76, "lng": 100.50,
        "date_display": "July 2, 1997",
        "geo_modern": "Bangkok, Thailand (origin)",
        "geo_era_label": "Asian Tiger Economies",
        "category": "economic", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Economic history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Asian financial crisis began with the collapse of the Thai baht on July 2, 1997, and quickly spread to Indonesia, South Korea, and other Asian economies. Currencies collapsed, stock markets crashed, and millions were plunged into poverty. The crisis reshaped Asian economic policies and exposed the risks of rapid financial liberalization.",
             "summary": "A financial contagion that devastated Asian economies and reshaped global financial governance.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Asian Financial Crisis", "author": "Stephan Haggard", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "kyoto-protocol-1997",
        "title": "Kyoto Protocol — First Climate Treaty",
        "year": 1997, "lat": 35.01, "lng": 135.77,
        "date_display": "December 11, 1997",
        "geo_modern": "Kyoto, Japan",
        "geo_era_label": "Post-Cold War",
        "category": "political", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Environmental perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Kyoto Protocol, adopted on December 11, 1997, was the first international treaty to set legally binding targets for greenhouse gas emissions. While the US never ratified it, the protocol committed 37 industrialized nations to reducing emissions and established the framework for subsequent climate agreements including the Paris Agreement.",
             "summary": "The first binding international climate treaty, despite the US refusal to ratify.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Climate Fix", "author": "Roger Pielke Jr.", "publication": "Basic Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "good-friday-agreement-1998",
        "title": "Good Friday Agreement — Northern Ireland Peace",
        "year": 1998, "lat": 54.60, "lng": -5.93,
        "date_display": "April 10, 1998",
        "geo_modern": "Belfast, Northern Ireland",
        "geo_era_label": "The Troubles",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Irish/British perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The Good Friday Agreement of April 10, 1998 ended three decades of sectarian conflict in Northern Ireland known as 'The Troubles,' which had killed over 3,500 people. The agreement established power-sharing between unionists and nationalists and created cross-border institutions with the Republic of Ireland.",
             "summary": "The peace deal that ended three decades of sectarian violence in Northern Ireland.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Making Peace", "author": "George J. Mitchell", "publication": "Knopf",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "nato-bombing-yugoslavia-1999",
        "title": "NATO Bombing of Yugoslavia — Kosovo War",
        "year": 1999, "lat": 42.66, "lng": 21.17,
        "date_display": "March 24 – June 10, 1999",
        "geo_modern": "Belgrade / Pristina, Yugoslavia",
        "geo_era_label": "Yugoslav Wars",
        "category": "war", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "International perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "NATO launched a 78-day air campaign against Yugoslavia on March 24, 1999 to halt Serbian ethnic cleansing of Kosovar Albanians. The bombing — conducted without UN Security Council authorization — forced Milošević to withdraw from Kosovo, but raised contentious questions about humanitarian intervention and international law.",
             "summary": "NATO's controversial air war to stop ethnic cleansing in Kosovo.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Winning Ugly: NATO's War to Save Kosovo", "author": "Ivo Daalder and Michael O'Hanlon", "publication": "Brookings Institution Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "y2k-millennium-1999",
        "title": "Y2K and the Millennium",
        "year": 1999, "lat": 40.71, "lng": -74.01,
        "date_display": "December 31, 1999",
        "geo_modern": "Global",
        "geo_era_label": "End of 20th Century",
        "category": "cultural", "importance_score": 0.55, "zoom_min": 5, "is_bce": False,
        "perspectives": [
            {"label": "Technology history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Y2K bug — the fear that computer systems storing years as two digits would fail when 2000 arrived — prompted a massive global remediation effort costing over $300 billion. The transition to the new millennium on December 31, 1999 passed without major incident, leading to debate over whether the bug was overhyped or whether the preparations had successfully averted disaster.",
             "summary": "The $300 billion effort to prevent a global computer meltdown at the turn of the millennium.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Y2K: An Action Guide", "author": "Jim Lord", "publication": "Kiplinger Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1998}
             ]},
        ],
    },
]


async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting 20th century seed — {len(EVENTS)} events")
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

        existing = await conn.fetchval("SELECT id FROM events WHERE slug=$1", slug)
        if existing:
            print(f"  [skip] {slug} (already exists)")
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
            VALUES ('event', $1, 'create', $2, 'ai', '20th century seed')
            """,
            event_id, CREATED_BY,
        )

        inserted += 1
        print(f"  [ok] {slug}")

    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    print(f"\n✅ 20th century seed complete — {inserted} inserted, {skipped} skipped")
    print(f"   Total approved events in DB: {total}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
