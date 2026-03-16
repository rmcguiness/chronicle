#!/usr/bin/env python3
"""
Chronicle seed script — Early Middle Ages (500–1000 CE) enrichment.

Adds ~70 new events to fill gaps in the 500–1000 CE range,
skipping any that already exist (checked by both slug AND title).

Run:
    python backend/scripts/seed_early_medieval.py
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

CREATED_BY = "seed-script:early-medieval-enrichment-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


EVENTS: list[dict[str, Any]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # POST-ROMAN WEST (500–800)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "ostrogothic-kingdom-theodoric-493",
        "title": "Theodoric the Great Founds Ostrogothic Kingdom of Italy",
        "year": 493, "lat": 44.41, "lng": 11.34,
        "geo_modern": "Ravenna, Italy",
        "geo_era_label": "Ostrogothic Italy",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Late antique perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "After defeating Odoacer in 493, Theodoric the Great established the Ostrogothic Kingdom in Italy with Ravenna as its capital. He preserved Roman administrative structures, patronized learning, and commissioned magnificent buildings including the Mausoleum of Theodoric. His reign represented a successful fusion of Germanic military power and Roman institutional heritage.",
             "summary": "A Gothic king who preserved Roman civilization in post-imperial Italy.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "Theoderic in Italy", "author": "Jonathan J. Arnold", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "boethius-consolation-philosophy-524",
        "title": "Boethius Writes The Consolation of Philosophy",
        "year": 524, "lat": 45.06, "lng": 9.70,
        "geo_modern": "Pavia, Italy",
        "geo_era_label": "Ostrogothic Italy",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Philosophy perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "While awaiting execution in prison at Pavia, the Roman senator Boethius composed The Consolation of Philosophy — a dialogue between himself and Lady Philosophy on fate, fortune, and the nature of happiness. This work became one of the most influential texts of the medieval period, translated by King Alfred, Chaucer, and Queen Elizabeth I, bridging classical and medieval thought.",
             "summary": "A condemned philosopher's meditation that shaped a thousand years of European thought.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Boethius", "author": "John Marenbon", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "rule-of-saint-benedict-530",
        "title": "Rule of Saint Benedict — Foundation of Western Monasticism",
        "year": 530, "lat": 41.49, "lng": 13.81,
        "geo_modern": "Monte Cassino, Italy",
        "geo_era_label": "Early Medieval Europe",
        "category": "cultural", "importance_score": 0.76, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "Around 530, Benedict of Nursia codified his Rule for monastic life at Monte Cassino. Its balanced approach — 'ora et labora' (pray and work) — became the standard for Western monasticism. Benedictine monasteries preserved classical learning, advanced agriculture, and served as centers of education and hospitality across medieval Europe for centuries.",
             "summary": "The rule that organized Western monasticism and preserved civilization through the Dark Ages.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Rule of Saint Benedict", "author": "Timothy Fry (ed.)", "publication": "Liturgical Press",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1981}
             ]},
        ],
    },
    {
        "slug": "battle-dara-byzantine-sassanid-530",
        "title": "Battle of Dara — Belisarius Defeats Sassanid Persia",
        "year": 530, "lat": 37.18, "lng": 40.95,
        "geo_modern": "Oğuz, Mardin Province, Turkey",
        "geo_era_label": "Byzantine Empire",
        "category": "war", "importance_score": 0.66, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "In 530, the young general Belisarius defeated a numerically superior Sassanid force at Dara through innovative use of trench warfare and cavalry tactics. This victory launched Belisarius's legendary career and demonstrated that the Byzantine Empire could still field armies capable of defeating its most powerful rival.",
             "summary": "A young general's brilliant victory that launched one of history's greatest military careers.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Belisarius", "author": "Ian Hughes", "publication": "Pen and Sword Military",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "columba-founds-iona-563",
        "title": "Saint Columba Founds Iona Monastery — Celtic Christianity Spreads",
        "year": 563, "lat": 56.33, "lng": -6.41,
        "geo_modern": "Isle of Iona, Scotland",
        "geo_era_label": "Early Medieval Britain",
        "category": "cultural", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "In 563, the Irish monk Columba founded a monastery on the island of Iona off the Scottish coast. It became the most important center of Celtic Christianity, sending missionaries across Scotland, northern England, and Continental Europe. The famous Book of Kells may have been created here, and Iona's influence shaped the distinctive character of insular Christianity for centuries.",
             "summary": "A tiny island monastery that became the powerhouse of Celtic Christian civilization.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "Columba", "author": "Adomnán of Iona (trans. Richard Sharpe)", "publication": "Penguin Classics",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1995}
             ]},
        ],
    },
    {
        "slug": "avars-siege-constantinople-626",
        "title": "Avar-Sassanid Siege of Constantinople — The Empire Survives",
        "year": 626, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Istanbul, Turkey",
        "geo_era_label": "Byzantine Empire",
        "category": "war", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Byzantine perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "In 626, a combined Avar-Slavic-Sassanid force besieged Constantinople while Emperor Heraclius campaigned in Persia. The city's massive Theodosian Walls and the Byzantine navy repelled the attackers, marking the Avars' decline and preserving the empire at its most vulnerable moment. The Akathist Hymn, still sung in Orthodox churches, commemorates the city's miraculous deliverance.",
             "summary": "Constantinople survives simultaneous siege from east and west — a turning point for the medieval world.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The History of the Byzantine State", "author": "George Ostrogorsky", "publication": "Rutgers University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1969}
             ]},
        ],
    },
    {
        "slug": "muslim-conquest-egypt-641",
        "title": "Muslim Conquest of Egypt — Amr ibn al-As Takes Alexandria",
        "year": 641, "lat": 31.20, "lng": 29.92,
        "geo_modern": "Alexandria, Egypt",
        "geo_era_label": "Rashidun Caliphate",
        "category": "war", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Islamic history perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "In 641, the Arab general Amr ibn al-As conquered Egypt, ending a millennium of Greco-Roman rule. The conquest transformed Egypt's religious and linguistic character over the following centuries from Coptic-speaking Christian to Arabic-speaking Muslim. Amr founded Fustat (the precursor to Cairo) and established Egypt as a key province of the expanding caliphate.",
             "summary": "The Arab conquest that fundamentally transformed the land of the pharaohs.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Arab Conquest of Egypt", "author": "Alfred Butler", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1902}
             ]},
        ],
    },
    {
        "slug": "battle-karbala-husayn-680",
        "title": "Battle of Karbala — Martyrdom of Husayn and the Sunni-Shia Split",
        "year": 680, "lat": 32.62, "lng": 44.02,
        "geo_modern": "Karbala, Iraq",
        "geo_era_label": "Umayyad Caliphate",
        "category": "war", "importance_score": 0.80, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Islamic history perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "On October 10, 680, Husayn ibn Ali — grandson of Prophet Muhammad — and a small band of followers were killed by Umayyad forces at Karbala. This event became the defining tragedy of Shia Islam, commemorated annually during Ashura with passionate mourning rituals. The massacre crystallized the Sunni-Shia divide that continues to shape the Muslim world.",
             "summary": "The martyrdom that permanently divided Islam into Sunni and Shia traditions.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Martyrs of Karbala", "author": "Kamran Scot Aghaie", "publication": "University of Washington Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "synod-whitby-664",
        "title": "Synod of Whitby — Roman Christianity Prevails in England",
        "year": 664, "lat": 54.49, "lng": -0.61,
        "geo_modern": "Whitby, North Yorkshire, England",
        "geo_era_label": "Anglo-Saxon England",
        "category": "cultural", "importance_score": 0.66, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The Synod of Whitby in 664 resolved the dispute between Celtic and Roman Christian practices in Northumbria, particularly the calculation of Easter. King Oswiu's decision in favor of Rome aligned England with Continental Christianity and the papacy, profoundly shaping English and eventually European religious and political development.",
             "summary": "A pivotal church council that bound England to Rome and the wider Christian world.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Bede's Ecclesiastical History of the English People", "author": "Bede (trans. Leo Sherley-Price)", "publication": "Penguin Classics",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "venerable-bede-ecclesiastical-history-731",
        "title": "Bede Completes Ecclesiastical History — Father of English History",
        "year": 731, "lat": 54.78, "lng": -1.44,
        "geo_modern": "Jarrow, Northumbria, England",
        "geo_era_label": "Anglo-Saxon England",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Historiography perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "In 731, the Northumbrian monk Bede completed his Ecclesiastical History of the English People, the single most important source for early English history. Bede pioneered the use of AD dating (Anno Domini), critical source evaluation, and rigorous chronology, earning him the title 'Father of English History' and establishing standards of historical scholarship that endured for centuries.",
             "summary": "The monk who invented English history and popularized the AD dating system.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "Bede's Ecclesiastical History of the English People", "author": "Bede (trans. Leo Sherley-Price)", "publication": "Penguin Classics",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "pepin-short-papal-alliance-754",
        "title": "Pepin the Short's Alliance with the Pope — Birth of the Papal States",
        "year": 754, "lat": 41.90, "lng": 12.45,
        "geo_modern": "Rome, Italy",
        "geo_era_label": "Carolingian Empire",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Medieval political history", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "In 754, Pepin the Short — who had deposed the last Merovingian king with papal approval — defeated the Lombards in Italy and donated conquered territories to Pope Stephen II, creating the Papal States. This alliance between the Frankish crown and the papacy established the political framework of medieval Europe and the temporal power of the popes that lasted until 1870.",
             "summary": "The Frankish-papal bargain that created the Papal States and shaped medieval Europe's power structure.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Charlemagne: Father of a Continent", "author": "Alessandro Barbero", "publication": "University of California Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "book-of-kells-created-800",
        "title": "Book of Kells — Masterpiece of Insular Illuminated Art",
        "year": 800, "lat": 53.34, "lng": -6.26,
        "geo_modern": "Dublin, Ireland (now at Trinity College)",
        "geo_era_label": "Early Medieval Ireland",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Art history perspective", "culture_code": "ie", "viewpoint_type": "academic",
             "narrative": "Created around 800, likely at Iona or Kells monastery, the Book of Kells is the supreme achievement of Insular illuminated manuscript art. Its 680 pages of the four Gospels feature extraordinarily intricate knotwork, spirals, and animal interlace in vibrant pigments. The manuscript represents the pinnacle of the fusion between Celtic artistic traditions and Christian devotion.",
             "summary": "Medieval Europe's greatest illuminated manuscript — Celtic art at its most transcendent.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Book of Kells", "author": "Bernard Meehan", "publication": "Thames & Hudson",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # ISLAMIC WORLD (622–900)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "constitution-medina-622",
        "title": "Constitution of Medina — First Islamic Political Document",
        "year": 622, "lat": 24.47, "lng": 39.61,
        "geo_modern": "Medina, Saudi Arabia",
        "geo_era_label": "Early Islam",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Islamic history perspective", "culture_code": "sa", "viewpoint_type": "academic",
             "narrative": "Shortly after the Hijra in 622, Muhammad established the Constitution of Medina — a formal agreement between the Muslim emigrants, the Medinan converts, and the Jewish tribes of the city. It defined rights, duties, and mutual defense obligations, creating an unprecedented multi-religious political community (ummah). Scholars consider it one of the earliest written constitutions in history.",
             "summary": "One of history's earliest constitutions — a multi-faith political compact in 7th-century Arabia.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "Muhammad at Medina", "author": "W. Montgomery Watt", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1956}
             ]},
        ],
    },
    {
        "slug": "ridda-wars-632",
        "title": "Ridda Wars — Abu Bakr Reunifies Arabia After Muhammad's Death",
        "year": 632, "lat": 24.63, "lng": 46.72,
        "geo_modern": "Central Arabia, Saudi Arabia",
        "geo_era_label": "Rashidun Caliphate",
        "category": "war", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Islamic history perspective", "culture_code": "sa", "viewpoint_type": "academic",
             "narrative": "After Muhammad's death in 632, many Arabian tribes renounced Islam or refused to pay zakat (alms tax) to the new caliph Abu Bakr. The Ridda (Apostasy) Wars that followed were brutally effective — within a year, Abu Bakr's general Khalid ibn al-Walid reconquered all of Arabia. This consolidation was essential for the subsequent Islamic conquests that would reshape the world.",
             "summary": "The wars that held Islam together and set the stage for global expansion.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Early Islamic Conquests", "author": "Fred Donner", "publication": "Princeton University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1981}
             ]},
        ],
    },
    {
        "slug": "battle-qadisiyyah-636",
        "title": "Battle of al-Qadisiyyah — Arab Conquest of Sassanid Iraq",
        "year": 636, "lat": 32.10, "lng": 44.65,
        "geo_modern": "Al-Qadisiyyah, Iraq",
        "geo_era_label": "Rashidun Caliphate",
        "category": "war", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "In 636, the Arab commander Sa'd ibn Abi Waqqas defeated the Sassanid army at al-Qadisiyyah in a three-day battle that opened Mesopotamia to Muslim conquest. The Sassanid general Rostam was killed, and the Arab forces soon captured the capital Ctesiphon. This battle, alongside Yarmouk against the Byzantines, was one of the two decisive engagements of the early Islamic conquests.",
             "summary": "The battle that opened Persia to Islam — one of the most consequential clashes in world history.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Great Arab Conquests", "author": "Hugh Kennedy", "publication": "Weidenfeld & Nicolson",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "assassination-ali-fitna-661",
        "title": "Assassination of Ali — End of the Rashidun Caliphate",
        "year": 661, "lat": 32.62, "lng": 44.02,
        "geo_modern": "Kufa, Iraq",
        "geo_era_label": "Rashidun Caliphate",
        "category": "political", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Islamic history perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "The assassination of Ali ibn Abi Talib in 661 at the Great Mosque of Kufa by a Kharijite extremist ended the era of the Rashidun (Rightly-Guided) Caliphs and paved the way for the Umayyad dynasty. Ali's death deepened the divisions within Islam — for Shia Muslims, he was the rightful first successor to Muhammad, and his martyrdom remains central to Shia identity and theology.",
             "summary": "The death that ended Islam's foundational era and crystallized the Sunni-Shia divide.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "After the Prophet", "author": "Lesley Hazleton", "publication": "Doubleday",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "great-mosque-damascus-715",
        "title": "Great Mosque of Damascus — Masterpiece of Umayyad Architecture",
        "year": 715, "lat": 33.51, "lng": 36.31,
        "geo_modern": "Damascus, Syria",
        "geo_era_label": "Umayyad Caliphate",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Islamic art perspective", "culture_code": "sy", "viewpoint_type": "academic",
             "narrative": "Completed in 715 under Caliph al-Walid I, the Umayyad Mosque of Damascus was built on the site of a Roman temple and Christian basilica. Its golden mosaics depicting paradise gardens, its massive courtyard, and its three minarets set the template for mosque architecture across the Islamic world. It remains one of the oldest and most significant mosques in continuous use.",
             "summary": "The Umayyad masterpiece that defined Islamic sacred architecture for a millennium.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "Early Muslim Architecture", "author": "K.A.C. Creswell", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1969}
             ]},
        ],
    },
    {
        "slug": "umayyad-emirate-cordoba-756",
        "title": "Abd al-Rahman I Founds Umayyad Emirate of Córdoba",
        "year": 756, "lat": 37.88, "lng": -4.77,
        "geo_modern": "Córdoba, Spain",
        "geo_era_label": "Al-Andalus",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Islamic Spain perspective", "culture_code": "es", "viewpoint_type": "academic",
             "narrative": "In 756, Abd al-Rahman I — the sole survivor of the Abbasid massacre of the Umayyad dynasty — fled across North Africa to Spain and established an independent emirate at Córdoba. This 'Falcon of the Quraysh' founded a dynasty that would rule Al-Andalus for nearly three centuries, transforming Córdoba into the most culturally brilliant city in Western Europe.",
             "summary": "A fugitive prince builds Europe's most advanced civilization in Islamic Spain.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Ornament of the World", "author": "María Rosa Menocal", "publication": "Little, Brown",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "jabir-ibn-hayyan-alchemy-800",
        "title": "Jabir ibn Hayyan — Foundations of Experimental Chemistry",
        "year": 800, "lat": 32.62, "lng": 44.02,
        "geo_modern": "Kufa, Iraq",
        "geo_era_label": "Abbasid Caliphate",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "Jabir ibn Hayyan (Geber in Latin), active around 800, is credited with transforming alchemy from mysticism into systematic experimentation. His corpus describes distillation, crystallization, and the discovery of numerous chemical substances including hydrochloric and nitric acid. The word 'gibberish' may derive from his name, reflecting Europeans' bewilderment at his complex writings.",
             "summary": "The father of chemistry — transforming mystical alchemy into experimental science.",
             "evidence_score": 0.68,
             "sources": [
                 {"title": "The Works of Geber", "author": "Eric John Holmyard", "publication": "Dutton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1928}
             ]},
        ],
    },
    {
        "slug": "hunayn-ibn-ishaq-translations-830",
        "title": "Hunayn ibn Ishaq — Master Translator of Greek to Arabic",
        "year": 830, "lat": 33.34, "lng": 44.40,
        "geo_modern": "Baghdad, Iraq",
        "geo_era_label": "Abbasid Caliphate",
        "category": "cultural", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "Hunayn ibn Ishaq, a Nestorian Christian physician working in Baghdad around 830, led the most ambitious translation project in history. He and his team translated virtually the entire corpus of Greek medical and scientific literature into Arabic, including Galen, Hippocrates, and Dioscorides. Without these translations, much of Greek knowledge would have been lost to the world.",
             "summary": "The translator who saved Greek science — a Christian scholar at the heart of Islamic civilization.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The House of Wisdom", "author": "Jim al-Khalili", "publication": "Penguin Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # EAST ASIA (500–1000)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "sui-grand-canal-construction-605",
        "title": "Sui Dynasty Begins Grand Canal — Engineering Marvel of China",
        "year": 605, "lat": 34.76, "lng": 113.65,
        "geo_modern": "Luoyang to Hangzhou, China",
        "geo_era_label": "Sui Dynasty",
        "category": "discovery", "importance_score": 0.76, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Chinese history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Emperor Yang of Sui mobilized millions of laborers to extend and connect China's waterways into the Grand Canal system beginning in 605. Stretching over 1,700 km from Hangzhou to Beijing, it became the world's longest artificial waterway, linking the rice-producing south with the political capitals of the north. The project's human cost helped topple the Sui dynasty but the canal sustained China's economy for over a millennium.",
             "summary": "The world's longest canal — an engineering triumph that cost an empire but sustained a civilization.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Grand Canal and the World", "author": "Gang Deng", "publication": "University of Michigan Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "tang-legal-code-tang-lv-shu-yi-653",
        "title": "Tang Code Completed — Model Legal System for East Asia",
        "year": 653, "lat": 34.26, "lng": 108.94,
        "geo_modern": "Chang'an (Xi'an), China",
        "geo_era_label": "Tang Dynasty",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Legal history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Tang Code (Tang Lü Shu Yi), completed in 653, was the most systematic and influential legal code in East Asian history. Its 502 articles covering criminal, administrative, and civil law were adopted and adapted by Japan, Korea, and Vietnam. It balanced Confucian ideals of moral governance with Legalist practicality, creating a comprehensive legal framework that shaped East Asian jurisprudence for a millennium.",
             "summary": "The legal code that defined justice across East Asia for a thousand years.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The T'ang Code", "author": "Wallace Johnson (trans.)", "publication": "Princeton University Press",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1979}
             ]},
        ],
    },
    {
        "slug": "empress-wu-zhou-dynasty-690",
        "title": "Empress Wu Zetian Establishes Zhou Dynasty — Breaking the Gender Barrier",
        "year": 690, "lat": 34.26, "lng": 108.94,
        "geo_modern": "Chang'an (Xi'an), China",
        "geo_era_label": "Zhou/Tang Dynasty",
        "category": "political", "importance_score": 0.76, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Chinese history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "In 690, Wu Zetian took the unprecedented step of declaring herself Emperor (not Empress) and founding the Zhou dynasty, making her the only woman in Chinese history to hold the title. Rising from concubine to ruler, she expanded the empire, reformed the civil service examination to promote merit over aristocratic birth, and patronized Buddhism. Traditional historians vilified her, but modern scholarship recognizes her capable governance.",
             "summary": "China's only female emperor — a ruthless, capable ruler who defied two millennia of patriarchal tradition.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Wu Zhao: China's Only Female Emperor", "author": "N. Harry Rothschild", "publication": "Longman",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "nara-todaiji-great-buddha-752",
        "title": "Great Buddha of Todai-ji Dedicated — Japan's Monumental Buddhism",
        "year": 752, "lat": 34.69, "lng": 135.84,
        "geo_modern": "Nara, Japan",
        "geo_era_label": "Nara Period Japan",
        "category": "cultural", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Japanese history perspective", "culture_code": "jp", "viewpoint_type": "academic",
             "narrative": "In 752, Emperor Shōmu dedicated the Great Buddha (Daibutsu) at Todai-ji in Nara — a 15-meter bronze statue that remains the world's largest bronze Buddha. The project consumed most of Japan's copper and much of its gold, symbolizing the state's embrace of Buddhism as a unifying spiritual force. Todai-ji became the head of a national system of provincial temples.",
             "summary": "The world's largest bronze Buddha — a nation pours its wealth into a monumental act of faith.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Cambridge History of Japan, Vol. 1", "author": "Delmer Brown (ed.)", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "tibetan-empire-songtsen-gampo-630",
        "title": "Songtsen Gampo Unifies Tibet — Birth of the Tibetan Empire",
        "year": 630, "lat": 29.65, "lng": 91.17,
        "geo_modern": "Lhasa, Tibet, China",
        "geo_era_label": "Tibetan Empire",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Central Asian perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Around 630, King Songtsen Gampo unified the Tibetan Plateau and established the Tibetan Empire, which would become a major Central Asian power rivaling Tang China. He introduced a writing system based on Indian scripts, built the first Jokhang Temple in Lhasa, and married both a Tang Chinese and a Nepalese princess — both credited with introducing Buddhism to Tibet.",
             "summary": "The warrior-king who created Tibet as a unified power and welcomed Buddhism to the Roof of the World.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "The Tibetan Empire in Central Asia", "author": "Christopher Beckwith", "publication": "Princeton University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1987}
             ]},
        ],
    },
    {
        "slug": "battle-talas-751",
        "title": "Battle of Talas — Arabs Defeat Tang China, Paper Spreads West",
        "year": 751, "lat": 42.52, "lng": 71.23,
        "geo_modern": "Taraz, Kazakhstan",
        "geo_era_label": "Abbasid Caliphate / Tang Dynasty",
        "category": "war", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "World history perspective", "culture_code": "kz", "viewpoint_type": "academic",
             "narrative": "In 751, Abbasid Arab forces defeated a Tang Chinese army at the Talas River in Central Asia — the only major military clash between the Arab and Chinese empires. Though militarily inconclusive, it marked the end of Tang westward expansion and, crucially, Chinese papermakers captured in the battle taught their craft to the Arabs, beginning the spread of paper technology westward that would eventually revolutionize European civilization.",
             "summary": "When Islam met China — a battle that spread papermaking and reshaped civilizations.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "The Great Arab Conquests", "author": "Hugh Kennedy", "publication": "Weidenfeld & Nicolson",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "korean-woodblock-printing-750",
        "title": "Korean Dharani Sutra — World's Oldest Printed Document",
        "year": 750, "lat": 35.75, "lng": 129.22,
        "geo_modern": "Gyeongju, South Korea",
        "geo_era_label": "Unified Silla",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Korean history perspective", "culture_code": "kr", "viewpoint_type": "academic",
             "narrative": "The Great Dharani Sutra, discovered in 1966 inside the Bulguksa Temple pagoda in Gyeongju, dates to around 750 CE and is the world's oldest known printed document. Predating the Diamond Sutra by over a century, this woodblock-printed Buddhist text demonstrates that Korea was at the forefront of printing technology during the Unified Silla period.",
             "summary": "The world's oldest surviving printed text — Korea's pioneering contribution to information technology.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "A History of Korea", "author": "Kyung Moon Hwang", "publication": "Palgrave Macmillan",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "heian-kana-script-development-900",
        "title": "Development of Kana Script — Japan Creates Its Own Writing System",
        "year": 900, "lat": 35.01, "lng": 135.77,
        "geo_modern": "Kyoto, Japan",
        "geo_era_label": "Heian Period Japan",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Japanese cultural perspective", "culture_code": "jp", "viewpoint_type": "academic",
             "narrative": "During the 9th century, Japanese scholars developed the kana syllabaries — hiragana and katakana — by simplifying Chinese characters to represent Japanese sounds. This revolution in writing freed Japanese literature from the constraints of Chinese, enabling women of the Heian court (who were discouraged from learning Chinese) to create masterpieces like The Tale of Genji and The Pillow Book.",
             "summary": "A writing revolution that liberated Japanese literature and empowered women writers.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "A History of Writing in Japan", "author": "Christopher Seeley", "publication": "University of Hawai'i Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # BYZANTINE EMPIRE
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "greek-fire-invention-672",
        "title": "Greek Fire Invented — Byzantine Superweapon",
        "year": 672, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Constantinople (Istanbul), Turkey",
        "geo_era_label": "Byzantine Empire",
        "category": "discovery", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Military technology perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "Around 672, a Syrian engineer named Kallinikos developed Greek Fire — a devastating incendiary weapon that burned on water. Deployed through bronze tubes mounted on Byzantine warships, it could not be extinguished by water, making it the ancient world's most terrifying naval weapon. Its exact composition remains unknown, as the Byzantines guarded the secret so closely that it was eventually lost entirely.",
             "summary": "History's most closely guarded military secret — the napalm of the ancient world.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "Greek Fire, Poison Arrows & Scorpion Bombs", "author": "Adrienne Mayor", "publication": "Overlook Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "iconoclasm-ends-triumph-orthodoxy-843",
        "title": "Triumph of Orthodoxy — End of Byzantine Iconoclasm",
        "year": 843, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Constantinople (Istanbul), Turkey",
        "geo_era_label": "Byzantine Empire",
        "category": "cultural", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "In 843, Empress Theodora formally restored the veneration of icons, ending over a century of Iconoclasm that had torn the Byzantine Empire apart. The 'Triumph of Orthodoxy' — still celebrated on the first Sunday of Lent — affirmed that religious images were legitimate aids to worship, not idolatry. This resolution shaped the distinctive visual culture of Eastern Orthodox Christianity.",
             "summary": "The resolution of Byzantium's great religious crisis — icons return and define Orthodox Christianity.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Iconoclasm", "author": "Leslie Brubaker and John Haldon", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "cyril-methodius-slavic-mission-863",
        "title": "Cyril and Methodius — Apostles to the Slavs",
        "year": 863, "lat": 48.15, "lng": 17.11,
        "geo_modern": "Great Moravia (modern Slovakia/Czech Republic)",
        "geo_era_label": "Byzantine Empire / Slavic World",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Cultural history perspective", "culture_code": "sk", "viewpoint_type": "academic",
             "narrative": "In 863, the Byzantine brothers Cyril and Methodius were sent to Great Moravia to evangelize the Slavs in their own language. Cyril created the Glagolitic alphabet (later refined into Cyrillic by their disciples), translated the Bible and liturgy into Old Church Slavonic, and established the principle that peoples deserved worship in their own tongue. Their work created the literary foundation of Slavic civilization.",
             "summary": "Two brothers gave the Slavic world its alphabet, its literature, and its Christian identity.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Byzantine Missions Among the Slavs", "author": "Francis Dvornik", "publication": "Rutgers University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1970}
             ]},
        ],
    },
    {
        "slug": "byzantine-macedonian-renaissance-867",
        "title": "Macedonian Dynasty — Byzantine Cultural and Military Revival",
        "year": 867, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Constantinople (Istanbul), Turkey",
        "geo_era_label": "Byzantine Empire",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Byzantine perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "Basil I's seizure of power in 867 inaugurated the Macedonian Dynasty — Byzantium's longest-ruling and most successful imperial house. Over nearly two centuries, Macedonian emperors reconquered territory from Arabs and Bulgars, codified law in the Basilika, and presided over a cultural renaissance in art, literature, and scholarship that made Constantinople the most civilized city in Christendom.",
             "summary": "Byzantium's golden age — military reconquest, legal codification, and cultural brilliance.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Byzantium: The Apogee", "author": "John Julius Norwich", "publication": "Penguin",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1991}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # VIKING AGE AND NORTHERN EUROPE
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "danelaw-established-878",
        "title": "Treaty of Wedmore — Danelaw Divides England",
        "year": 878, "lat": 51.24, "lng": -2.83,
        "geo_modern": "Wedmore, Somerset, England",
        "geo_era_label": "Anglo-Saxon England",
        "category": "political", "importance_score": 0.68, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "English history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "After Alfred the Great's decisive victory at Edington in 878, the Treaty of Wedmore divided England between the Anglo-Saxon south and the Viking-controlled Danelaw in the north and east. The Danish leader Guthrum accepted baptism, and the treaty established a boundary that shaped English regional identities, legal traditions, and place names — thousands of English towns ending in -by, -thorpe, and -thwaite preserve their Norse heritage.",
             "summary": "The treaty that divided England and left Norse DNA in its language, law, and landscape.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "Alfred the Great", "author": "Richard Abels", "publication": "Longman",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "viking-discovery-iceland-870",
        "title": "Norse Settlement of Iceland — A Viking Democracy",
        "year": 870, "lat": 64.13, "lng": -21.90,
        "geo_modern": "Reykjavik, Iceland",
        "geo_era_label": "Viking Age",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Norse history perspective", "culture_code": "is", "viewpoint_type": "academic",
             "narrative": "Norse settlers began colonizing Iceland around 870, fleeing the consolidation of royal power in Norway. By 930 they established the Althing — one of the world's oldest parliaments — at Thingvellir. Iceland's saga tradition, preserved in manuscripts like the Codex Regius, became one of medieval Europe's greatest literary achievements, recording Norse mythology, heroic legends, and family histories.",
             "summary": "Viking refugees create a republic, a parliament, and one of Europe's greatest literary traditions.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Viking Age Iceland", "author": "Jesse Byock", "publication": "Penguin",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "althing-iceland-parliament-930",
        "title": "Althing Established in Iceland — World's Oldest Parliament",
        "year": 930, "lat": 64.26, "lng": -21.12,
        "geo_modern": "Thingvellir, Iceland",
        "geo_era_label": "Viking Age Iceland",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "is", "viewpoint_type": "academic",
             "narrative": "In 930, Icelandic chieftains established the Althing at Thingvellir — a general assembly that functioned as both a parliament and supreme court. Meeting annually for two weeks each summer, it resolved disputes, enacted laws, and served as a social gathering for the scattered population. The Althing is often cited as the world's oldest surviving parliamentary institution, predating the English Parliament by over three centuries.",
             "summary": "Vikings invent parliamentary democracy — the Althing predates every European parliament.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "Viking Age Iceland", "author": "Jesse Byock", "publication": "Penguin",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "rollo-normandy-treaty-911",
        "title": "Treaty of Saint-Clair-sur-Epte — Rollo Founds Normandy",
        "year": 911, "lat": 49.17, "lng": 1.78,
        "geo_modern": "Rouen, Normandy, France",
        "geo_era_label": "Viking Age / Carolingian France",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Medieval French perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "In 911, the Frankish king Charles the Simple granted the Viking chieftain Rollo territory around Rouen in exchange for defending against further Viking raids. This Treaty of Saint-Clair-sur-Epte created the Duchy of Normandy — the 'land of the Northmen.' Within 150 years, Rollo's descendants would conquer England (1066), establish kingdoms in Sicily and southern Italy, and lead the First Crusade.",
             "summary": "A desperate bargain that created Normandy — and the dynasty that conquered England, Sicily, and the Holy Land.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "The Normans", "author": "David Crouch", "publication": "Hambledon Continuum",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "erik-red-greenland-settlement-985",
        "title": "Erik the Red Colonizes Greenland — Viking Frontier",
        "year": 985, "lat": 61.20, "lng": -45.38,
        "geo_modern": "Brattahlíð (Qassiarsuk), Greenland",
        "geo_era_label": "Viking Age",
        "category": "political", "importance_score": 0.68, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Norse history perspective", "culture_code": "gl", "viewpoint_type": "academic",
             "narrative": "In 985, Erik the Red — exiled from Iceland for manslaughter — led a fleet of 25 ships to colonize Greenland, which he had cleverly named to attract settlers. The Norse colony survived for nearly 500 years, establishing farms, churches, and trade links with Europe. Its eventual collapse around 1450, possibly due to climate cooling and isolation, remains one of archaeology's most poignant mysteries.",
             "summary": "A convicted killer's marketing genius — naming an icy island 'Greenland' to lure settlers to the edge of the known world.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Viking World", "author": "Stefan Brink and Neil Price (eds.)", "publication": "Routledge",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "vladimir-baptism-kievan-rus-988",
        "title": "Vladimir I's Mass Baptism — Christianization of Kievan Rus",
        "year": 988, "lat": 50.45, "lng": 30.52,
        "geo_modern": "Kyiv, Ukraine",
        "geo_era_label": "Kievan Rus",
        "category": "cultural", "importance_score": 0.76, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Eastern European perspective", "culture_code": "ua", "viewpoint_type": "academic",
             "narrative": "In 988, Grand Prince Vladimir I of Kyiv ordered the mass baptism of his subjects in the Dnieper River, adopting Eastern Orthodox Christianity from Byzantium. According to the Primary Chronicle, Vladimir rejected Islam (no alcohol), Judaism (no homeland), and Western Christianity before choosing Orthodoxy after his envoys were awed by the Hagia Sophia. This decision bound Russia and Ukraine to the Byzantine cultural sphere for a millennium.",
             "summary": "The baptism that made Russia Orthodox — a choice that shaped Eastern European civilization forever.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Russian Primary Chronicle", "author": "Samuel Hazzard Cross (trans.)", "publication": "Harvard University Press",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1953}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # AFRICA (500–1000)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "aksumite-conversion-christianity-340",
        "title": "Kingdom of Aksum Adopts Christianity — Ethiopia's Ancient Faith",
        "year": 340, "lat": 14.13, "lng": 38.73,
        "geo_modern": "Aksum, Tigray, Ethiopia",
        "geo_era_label": "Aksumite Empire",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "African history perspective", "culture_code": "et", "viewpoint_type": "academic",
             "narrative": "Around 340, King Ezana of Aksum converted to Christianity, making Ethiopia one of the first states in the world to adopt the faith — preceding the Roman Empire's official conversion. The Ethiopian Orthodox Church developed its own distinctive traditions including the Ge'ez liturgy, rock-hewn churches, and the claim to possess the Ark of the Covenant. This ancient Christian heritage endures in Ethiopia today.",
             "summary": "One of the world's first Christian kingdoms — Ethiopia's faith predates Europe's.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Aksumite Kingdom", "author": "Stuart Munro-Hay", "publication": "Edinburgh University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "ghana-empire-wagadou-750",
        "title": "Ghana Empire — Gold and Salt Masters of the Sahel",
        "year": 750, "lat": 15.77, "lng": -7.99,
        "geo_modern": "Koumbi Saleh, Mauritania",
        "geo_era_label": "Medieval West Africa",
        "category": "political", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "African history perspective", "culture_code": "mr", "viewpoint_type": "academic",
             "narrative": "The Ghana Empire (Wagadou), centered near modern Mauritania, dominated the trans-Saharan gold trade from roughly 750 to 1200. Arab geographer al-Bakri described its capital as a twin city — one Muslim, one traditional — with the king controlling the gold supply by monopolizing nuggets while allowing gold dust to circulate. The empire's wealth was legendary across the Islamic world, and its taxation of the gold-salt exchange created one of Africa's wealthiest pre-modern states.",
             "summary": "West Africa's golden empire — controlling the trade that made the Sahara a highway of wealth.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "Ancient Ghana and Mali", "author": "Nehemia Levtzion", "publication": "Methuen",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1973}
             ]},
        ],
    },
    {
        "slug": "swahili-coast-trade-cities-800",
        "title": "Swahili Coast City-States — Indian Ocean Trading Civilization",
        "year": 800, "lat": -6.16, "lng": 39.19,
        "geo_modern": "Zanzibar / East African coast",
        "geo_era_label": "Medieval East Africa",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "African history perspective", "culture_code": "tz", "viewpoint_type": "academic",
             "narrative": "By 800, a chain of prosperous city-states stretched along the East African coast from Mogadishu to Mozambique. These Swahili trading centers — Kilwa, Mombasa, Zanzibar, Lamu — connected Africa to the Indian Ocean commercial network, exporting gold, ivory, and enslaved people in exchange for Chinese porcelain, Indian textiles, and Persian Gulf goods. The Swahili language and culture blended Bantu African and Arab elements into a distinctive civilization.",
             "summary": "Africa's Indian Ocean gateway — cosmopolitan trading cities linking Africa, Arabia, India, and China.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "The Swahili: The Social Landscape of a Mercantile Society", "author": "Mark Horton and John Middleton",
                  "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # SOUTH AND SOUTHEAST ASIA
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "pallava-shore-temple-mamallapuram-700",
        "title": "Shore Temple at Mamallapuram — Dravidian Architecture Emerges",
        "year": 700, "lat": 12.62, "lng": 80.20,
        "geo_modern": "Mamallapuram, Tamil Nadu, India",
        "geo_era_label": "Pallava Dynasty",
        "category": "cultural", "importance_score": 0.68, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Indian art history perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "Around 700, the Pallava dynasty built the Shore Temple at Mamallapuram (Mahabalipuram) — one of the earliest structural stone temples in South India. Overlooking the Bay of Bengal, it marked the transition from rock-cut to freestanding Dravidian temple architecture. The Pallavas' innovations in temple design, along with their rock-cut rathas and relief sculptures, established the architectural vocabulary of South Indian temple-building for centuries.",
             "summary": "A seaside temple that launched the great tradition of Dravidian sacred architecture.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Art and Architecture of the Indian Subcontinent", "author": "J.C. Harle", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "shankaracharya-advaita-vedanta-800",
        "title": "Adi Shankaracharya — Unifying Hindu Philosophy",
        "year": 800, "lat": 10.23, "lng": 76.20,
        "geo_modern": "Kalady, Kerala, India",
        "geo_era_label": "Medieval India",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Indian philosophy perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "Around 800, the philosopher Adi Shankaracharya traveled across India consolidating the Advaita Vedanta school of Hindu philosophy — the doctrine that the individual soul (Atman) and the universal consciousness (Brahman) are one. Despite dying at only 32, he established four monasteries (mathas) at India's cardinal points, debated Buddhist and Jain scholars, and created a philosophical framework that remains central to Hinduism.",
             "summary": "The philosopher who unified Hinduism — arguing that all is one, Brahman alone is real.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "Shankara and Indian Philosophy", "author": "Natalia Isayeva", "publication": "SUNY Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "chola-navy-rajendra-985",
        "title": "Rajaraja Chola I — Building India's Greatest Naval Power",
        "year": 985, "lat": 10.78, "lng": 79.13,
        "geo_modern": "Thanjavur, Tamil Nadu, India",
        "geo_era_label": "Chola Empire",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Indian history perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "Rajaraja Chola I, ascending the throne in 985, transformed the Chola kingdom into the Indian subcontinent's greatest naval and military power. He conquered Sri Lanka, the Maldives, and parts of Southeast Asia, established a sophisticated revenue administration, and built the magnificent Brihadeshwara Temple at Thanjavur — a UNESCO World Heritage site. The Chola navy dominated the Indian Ocean, projecting power as far as Southeast Asia.",
             "summary": "India's naval emperor — building a maritime empire and one of the world's greatest temples.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Cholas", "author": "K.A. Nilakanta Sastri", "publication": "University of Madras",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1955}
             ]},
        ],
    },
    {
        "slug": "sailendra-borobudur-construction-780",
        "title": "Sailendra Dynasty Builds Borobudur — World's Largest Buddhist Monument",
        "year": 780, "lat": -7.61, "lng": 110.20,
        "geo_modern": "Magelang, Central Java, Indonesia",
        "geo_era_label": "Sailendra Dynasty",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Southeast Asian perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "Beginning around 780, the Sailendra dynasty constructed Borobudur in Central Java — the world's largest Buddhist monument. Built from two million stone blocks arranged in nine platforms representing the Buddhist cosmological path from desire to enlightenment, its 2,672 relief panels and 504 Buddha statues make it an unparalleled masterpiece of religious art. Abandoned after the 14th century, it was rediscovered in 1814 under volcanic ash and jungle growth.",
             "summary": "A stone mandala the size of a hill — Southeast Asia's answer to the great cathedrals.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "Borobudur: Golden Tales of the Buddhas", "author": "John Miksic", "publication": "Periplus",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1990}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # MESOAMERICA AND THE AMERICAS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "maya-tikal-calakmul-rivalry-562",
        "title": "Star War of Tikal — Calakmul Defeats the Maya Superpower",
        "year": 562, "lat": 17.22, "lng": -89.62,
        "geo_modern": "Tikal, Petén, Guatemala",
        "geo_era_label": "Maya Classic Period",
        "category": "war", "importance_score": 0.68, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Mesoamerican perspective", "culture_code": "gt", "viewpoint_type": "academic",
             "narrative": "In 562, the Maya kingdom of Calakmul defeated its great rival Tikal in a 'Star War' — a ritual conflict timed to the appearance of Venus. This defeat plunged Tikal into a 130-year 'hiatus' with no new monuments. The Tikal-Calakmul rivalry was the Cold War of the Classic Maya world, with each superpower building alliances among smaller kingdoms across the Petén lowlands.",
             "summary": "A Maya superpower falls — the cosmic rivalry that shaped Classic Maya civilization.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "Chronicle of the Maya Kings and Queens", "author": "Simon Martin and Nikolai Grube", "publication": "Thames & Hudson",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "toltec-rise-tula-900",
        "title": "Rise of the Toltec Empire at Tula — Post-Classic Mesoamerica",
        "year": 900, "lat": 20.07, "lng": -99.34,
        "geo_modern": "Tula, Hidalgo, Mexico",
        "geo_era_label": "Post-Classic Mesoamerica",
        "category": "political", "importance_score": 0.68, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Mesoamerican perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "Around 900, the Toltec civilization established its capital at Tula (Tollan) in central Mexico, filling the power vacuum left by Teotihuacan's earlier collapse. The Toltecs became legendary in later Aztec mythology as master craftsmen and builders. Their iconic Atlantean warrior columns at Tula and their cultural influence extending to Chichén Itzá demonstrate their significance as a bridge between Classic and Post-Classic Mesoamerican civilizations.",
             "summary": "The civilization the Aztecs revered as their cultural ancestors — Tula's warrior empire.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "The Toltecs Until the Fall of Tula", "author": "Nigel Davies", "publication": "University of Oklahoma Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1977}
             ]},
        ],
    },
    {
        "slug": "cahokia-mound-builders-900",
        "title": "Cahokia — North America's Largest Pre-Columbian City Emerges",
        "year": 900, "lat": 38.66, "lng": -90.06,
        "geo_modern": "Collinsville, Illinois, USA",
        "geo_era_label": "Mississippian Culture",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "North American archaeology perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Beginning around 900, Cahokia grew into the largest pre-Columbian settlement north of Mexico, peaking at 10,000-20,000 inhabitants around 1100. Its centerpiece, Monks Mound, is the largest earthen structure in the Americas — larger at its base than the Great Pyramid of Giza. Cahokia's sophisticated urban planning, astronomical observatory (Woodhenge), and influence across the Mississippi valley challenge the notion that North America lacked complex civilizations.",
             "summary": "North America's forgotten metropolis — larger than contemporary London, with a pyramid to rival Egypt's.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Cahokia: Ancient America's Great City on the Mississippi", "author": "Timothy Pauketat",
                  "publication": "Penguin", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "maya-classic-collapse-900",
        "title": "Classic Maya Collapse — Abandonment of the Great Cities",
        "year": 900, "lat": 17.22, "lng": -89.62,
        "geo_modern": "Petén, Guatemala / Yucatán, Mexico",
        "geo_era_label": "Terminal Classic Maya",
        "category": "political", "importance_score": 0.76, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Mesoamerican perspective", "culture_code": "gt", "viewpoint_type": "academic",
             "narrative": "Between 800 and 900, the great Maya cities of the southern lowlands — Tikal, Copán, Palenque, Calakmul — were abandoned in one of history's most dramatic civilizational collapses. The causes remain debated: prolonged drought (confirmed by paleoclimate data), warfare, deforestation, political fragmentation, and overpopulation all played roles. The Maya did not disappear — millions of their descendants live in Central America today — but their Classic civilization never recovered.",
             "summary": "One of history's great mysteries — why did the Maya abandon their magnificent cities?",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Classic Maya Collapse", "author": "T. Patrick Culbert (ed.)", "publication": "University of New Mexico Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1973}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # TECHNOLOGY, TRADE, AND CULTURE
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "silk-road-tang-peak-700",
        "title": "Silk Road at Its Peak — Tang Dynasty Global Trade Network",
        "year": 700, "lat": 34.26, "lng": 108.94,
        "geo_modern": "Chang'an (Xi'an) to Constantinople",
        "geo_era_label": "Tang Dynasty / Early Medieval",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "World history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Under the Tang Dynasty, the Silk Road reached its zenith around 700, connecting Chang'an (population one million) to Constantinople via a vast network of overland and maritime routes. Chinese silk, porcelain, and paper flowed west; Central Asian horses, precious stones, and musical instruments traveled east. The cosmopolitan Tang capital hosted Zoroastrian temples, Nestorian churches, Muslim mosques, and Buddhist monasteries side by side.",
             "summary": "The greatest trade network the world had ever seen — linking Tang China to the Mediterranean.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Silk Roads", "author": "Peter Frankopan", "publication": "Bloomsbury",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2015}
             ]},
        ],
    },
    {
        "slug": "chinese-porcelain-invention-700",
        "title": "True Porcelain Invented in Tang China — The White Gold",
        "year": 700, "lat": 29.30, "lng": 117.21,
        "geo_modern": "Jingdezhen, Jiangxi, China",
        "geo_era_label": "Tang Dynasty",
        "category": "discovery", "importance_score": 0.68, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Art history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "By the Tang Dynasty, Chinese potters at kilns in Jingdezhen and elsewhere perfected the production of true porcelain — a translucent, white, incredibly hard ceramic fired at temperatures above 1,300°C. This technological achievement, which Europe would not replicate until 1708 at Meissen, became China's most valuable export commodity. The English word 'china' for fine tableware attests to the material's origin and prestige.",
             "summary": "The material that gave its name to a nation — Chinese porcelain, unmatched for a thousand years.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Chinese Ceramics: From the Paleolithic Period Through the Qing Dynasty", "author": "Zhiyan Li and Virginia Bower",
                  "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "windmill-invention-persia-650",
        "title": "Windmill Invented in Persia — Harnessing the Wind",
        "year": 650, "lat": 34.35, "lng": 58.80,
        "geo_modern": "Sistan, Iran",
        "geo_era_label": "Early Islamic Persia",
        "category": "discovery", "importance_score": 0.66, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "History of technology perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "The world's earliest known windmills appeared in the Sistan region of eastern Persia around 650, using vertical sails to grind grain and pump water. These horizontal-axis windmills were adapted to the region's fierce '120-day wind.' The technology eventually spread westward to Europe, where vertical-axis designs evolved into the iconic windmills of the Netherlands and became crucial to pre-industrial European agriculture.",
             "summary": "Persian engineers harness the wind — an invention that would transform landscapes from Iran to Holland.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "A History of Mechanical Inventions", "author": "Abbott Payson Usher", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1954}
             ]},
        ],
    },
    {
        "slug": "heavy-plow-medieval-europe-600",
        "title": "Heavy Plow Transforms Northern European Agriculture",
        "year": 600, "lat": 51.00, "lng": 10.00,
        "geo_modern": "Northern Europe",
        "geo_era_label": "Early Medieval Europe",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Agricultural history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "The spread of the heavy wheeled plow (carruca) across Northern Europe from the 6th century transformed agriculture. Unlike the light Mediterranean scratch plow, the heavy plow could turn the dense, clay-rich soils of Northern Europe, opening vast areas to cultivation. Combined with the three-field rotation system and horse collar, it enabled the agricultural revolution that supported medieval Europe's population growth and urbanization.",
             "summary": "The humble plow that made Northern Europe farmable — and enabled medieval civilization to flourish.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "Medieval Technology and Social Change", "author": "Lynn White Jr.", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1962}
             ]},
        ],
    },
    {
        "slug": "stirrup-spreads-europe-700",
        "title": "Stirrup Spreads Across Eurasia — Revolution in Mounted Warfare",
        "year": 700, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Central Eurasia to Western Europe",
        "geo_era_label": "Early Medieval Period",
        "category": "discovery", "importance_score": 0.68, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "int", "viewpoint_type": "academic",
             "narrative": "The stirrup, likely originating in Central Asia and spreading to Europe by the 7th-8th century, transformed mounted warfare by allowing riders to fight from a stable platform. Historian Lynn White Jr. controversially argued that the stirrup enabled the armored cavalry charge that defined feudal warfare. While the thesis is debated, the stirrup undeniably increased the lethality of mounted warriors and contributed to the dominance of cavalry across medieval Eurasia.",
             "summary": "A simple loop of metal that may have created the medieval knight and reshaped warfare.",
             "evidence_score": 0.70,
             "sources": [
                 {"title": "Medieval Technology and Social Change", "author": "Lynn White Jr.", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1962}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # SLAVIC AND EASTERN EUROPE
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "slavic-migration-balkans-600",
        "title": "Slavic Migration into the Balkans — Reshaping Southeastern Europe",
        "year": 600, "lat": 43.85, "lng": 18.35,
        "geo_modern": "Balkans (modern Serbia, Bosnia, Croatia, Bulgaria)",
        "geo_era_label": "Early Medieval Balkans",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Eastern European perspective", "culture_code": "rs", "viewpoint_type": "academic",
             "narrative": "From the 6th century, Slavic peoples migrated en masse into the Balkans, fundamentally transforming the region's ethnic and linguistic character. They settled across territories previously held by the Byzantine Empire, establishing communities that would become the ancestors of modern Serbs, Croats, Bulgarians, and Slovenians. The Byzantines struggled to contain this migration, which permanently altered southeastern Europe's demographic landscape.",
             "summary": "The migration that created the Slavic Balkans — reshaping southeastern Europe forever.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "The Early Medieval Balkans", "author": "John V.A. Fine Jr.", "publication": "University of Michigan Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1983}
             ]},
        ],
    },
    {
        "slug": "first-bulgarian-empire-681",
        "title": "First Bulgarian Empire Founded — Slavic-Turkic State on Byzantium's Border",
        "year": 681, "lat": 43.21, "lng": 27.91,
        "geo_modern": "Pliska, Bulgaria",
        "geo_era_label": "First Bulgarian Empire",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Eastern European perspective", "culture_code": "bg", "viewpoint_type": "academic",
             "narrative": "In 681, the Bulgar khan Asparuh defeated Byzantine forces and established the First Bulgarian Empire in the northern Balkans — the first Slavic state recognized by the Byzantine Empire. Over the following centuries, the Turkic Bulgar elite merged with the Slavic majority, and Bulgaria became a major power under Simeon I the Great (893-927), whose realm rivaled Byzantium itself in size and cultural achievement.",
             "summary": "The first Slavic state to challenge Byzantium — where Turkic warriors and Slavic farmers built an empire.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "The Early Medieval Balkans", "author": "John V.A. Fine Jr.", "publication": "University of Michigan Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1983}
             ]},
        ],
    },
    {
        "slug": "great-moravia-833",
        "title": "Great Moravia — First Major Slavic State in Central Europe",
        "year": 833, "lat": 48.88, "lng": 16.85,
        "geo_modern": "Mikulčice, Czech Republic / Slovakia",
        "geo_era_label": "Early Medieval Central Europe",
        "category": "political", "importance_score": 0.66, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Central European perspective", "culture_code": "cz", "viewpoint_type": "academic",
             "narrative": "Great Moravia, unified around 833 under Mojmír I, became the first major West Slavic state, stretching across modern Czech Republic, Slovakia, and parts of Hungary, Poland, and Austria. It was here that Cyril and Methodius brought Christianity and literacy in Slavic. Though destroyed by Magyar invasions around 906, Great Moravia's legacy endured in the cultural and religious foundations it laid for Czech, Slovak, and wider Slavic identity.",
             "summary": "The cradle of West Slavic civilization — the state that first brought Christianity and writing to the Slavs.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "Great Moravia and the Beginnings of Christianity", "author": "Lubomír E. Havlík",
                  "publication": "Czech Academy of Sciences", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "magyar-settlement-hungary-896",
        "title": "Magyar Conquest of the Carpathian Basin — Hungary Founded",
        "year": 896, "lat": 47.50, "lng": 19.04,
        "geo_modern": "Budapest, Hungary",
        "geo_era_label": "Early Medieval Europe",
        "category": "political", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "European history perspective", "culture_code": "hu", "viewpoint_type": "academic",
             "narrative": "In 896, seven Magyar tribes led by Árpád crossed the Carpathian Mountains and settled the Pannonian Plain, establishing what would become the Kingdom of Hungary. These Uralic-speaking horsemen from the Eurasian steppe terrified Europe with devastating raids for decades before settling and converting to Christianity under King Stephen I in 1000, becoming a stable Christian kingdom at the crossroads of East and West.",
             "summary": "Steppe warriors find a homeland — the Magyars settle Hungary and join Christian Europe.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "The Realm of St Stephen: A History of Medieval Hungary", "author": "Pál Engel",
                  "publication": "I.B. Tauris", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # ADDITIONAL GAP FILLERS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "isidore-seville-etymologies-630",
        "title": "Isidore of Seville's Etymologiae — Medieval Encyclopedia",
        "year": 630, "lat": 37.39, "lng": -5.98,
        "geo_modern": "Seville, Spain",
        "geo_era_label": "Visigothic Spain",
        "category": "cultural", "importance_score": 0.68, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Intellectual history perspective", "culture_code": "es", "viewpoint_type": "academic",
             "narrative": "Around 630, Bishop Isidore of Seville compiled the Etymologiae — a 20-volume encyclopedia that attempted to summarize all human knowledge from grammar and law to agriculture and shipbuilding. It became the most widely used textbook of the entire Middle Ages, copied in hundreds of monasteries across Europe. Isidore is often called 'the last scholar of the ancient world' and was proposed as patron saint of the internet.",
             "summary": "The medieval Wikipedia — one man's attempt to save all human knowledge from oblivion.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Etymologies of Isidore of Seville", "author": "Stephen Barney et al. (trans.)",
                  "publication": "Cambridge University Press", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "sasanian-fall-651",
        "title": "Fall of the Sasanian Empire — End of Ancient Persia",
        "year": 651, "lat": 36.27, "lng": 59.62,
        "geo_modern": "Merv, Turkmenistan",
        "geo_era_label": "Rashidun Caliphate",
        "category": "political", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Persian history perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "In 651, the last Sasanian emperor Yazdegerd III was murdered near Merv while fleeing Arab conquest, ending over four centuries of Sasanian rule and the last great pre-Islamic Persian empire. The Sasanians had been Rome/Byzantium's peer rival, creators of Zoroastrian state religion, monumental art, and a sophisticated bureaucracy. Their administrative and cultural traditions were absorbed by the Arab conquerors and profoundly shaped Islamic civilization.",
             "summary": "The end of ancient Persia — but Persian culture would conquer its conquerors.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Sasanian Persia: The Rise and Fall of an Empire", "author": "Touraj Daryaee",
                  "publication": "I.B. Tauris", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "visigothic-code-654",
        "title": "Visigothic Code — First Territorial Law in Post-Roman Europe",
        "year": 654, "lat": 39.86, "lng": -4.02,
        "geo_modern": "Toledo, Spain",
        "geo_era_label": "Visigothic Kingdom",
        "category": "political", "importance_score": 0.66, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Legal history perspective", "culture_code": "es", "viewpoint_type": "academic",
             "narrative": "In 654, King Recceswinth promulgated the Liber Iudiciorum (Visigothic Code) — the first medieval European law code to apply equally to all subjects regardless of ethnic origin, replacing the dual system of Roman law for Romans and customary law for Goths. Its provisions on judicial procedure, property rights, and criminal law influenced later Spanish and Portuguese legal traditions.",
             "summary": "Europe's first post-Roman territorial law code — one law for all peoples, Goth and Roman alike.",
             "evidence_score": 0.74,
             "sources": [
                 {"title": "Law and Society in the Visigothic Kingdom", "author": "P.D. King",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1972}
             ]},
        ],
    },
    {
        "slug": "arab-siege-constantinople-717",
        "title": "Second Arab Siege of Constantinople — Islam's Failed Conquest of Europe",
        "year": 717, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Constantinople (Istanbul), Turkey",
        "geo_era_label": "Byzantine Empire / Umayyad Caliphate",
        "category": "war", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "In 717-718, the Umayyad Caliphate launched its most ambitious attempt to capture Constantinople, sending a massive fleet and army. Emperor Leo III's brilliant defense — combining Greek Fire, diplomatic alliances with the Bulgars, and a devastating winter that froze the Arab camp — destroyed the Umayyad forces. This defeat was arguably more decisive than Tours in halting Islamic expansion into Christian Europe.",
             "summary": "The siege that saved Christian Europe — Constantinople's walls hold against the caliphate's greatest army.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The History of the Byzantine State", "author": "George Ostrogorsky", "publication": "Rutgers University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1969}
             ]},
        ],
    },
    {
        "slug": "charlemagne-saxon-wars-772",
        "title": "Charlemagne's Saxon Wars — Forced Christianization of Germania",
        "year": 772, "lat": 51.75, "lng": 9.36,
        "geo_modern": "Eresburg (Obermarsberg), Germany",
        "geo_era_label": "Carolingian Empire",
        "category": "war", "importance_score": 0.70, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Medieval European perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Beginning in 772, Charlemagne waged a brutal 30-year campaign to conquer and Christianize the pagan Saxons of northern Germany. The wars included the destruction of the Irminsul sacred tree, the Massacre of Verden (782) where reportedly 4,500 Saxon prisoners were executed, and mass forced baptisms. The subjugation of Saxony extended Frankish and Christian civilization to the Elbe, permanently reshaping northern European culture and religion.",
             "summary": "Thirty years of holy war that converted Germania by the sword — Charlemagne's darkest legacy.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Charlemagne: Father of a Continent", "author": "Alessandro Barbero", "publication": "University of California Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "treaty-verdun-843",
        "title": "Treaty of Verdun — Division of Charlemagne's Empire",
        "year": 843, "lat": 49.17, "lng": 5.38,
        "geo_modern": "Verdun, France",
        "geo_era_label": "Carolingian Empire",
        "category": "political", "importance_score": 0.76, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "European history perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "The Treaty of Verdun in 843 divided Charlemagne's empire among his three grandsons: Charles the Bald received West Francia (future France), Louis the German received East Francia (future Germany), and Lothair I received the Middle Kingdom (Lotharingia, including Italy). This division laid the political foundations of modern Western Europe and created the Franco-German rivalry that dominated European history for a millennium.",
             "summary": "The partition that created France and Germany — the birth certificate of modern Western Europe.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Carolingian World", "author": "Marios Costambeys, Matthew Innes, and Simon MacLean",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "viking-siege-paris-845",
        "title": "Viking Siege of Paris — Norse Raiders Strike the Heart of Francia",
        "year": 845, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "Viking Age / Carolingian France",
        "category": "war", "importance_score": 0.68, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Medieval French perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "In 845, a Viking fleet of 120 ships under Ragnar (possibly the legendary Ragnar Lothbrok) sailed up the Seine and besieged Paris. King Charles the Bald, unable to mount an effective defense, paid 7,000 pounds of silver in danegeld to make them leave. This humiliation — and the far larger siege of 885-886 — exposed the weakness of the Carolingian dynasty and contributed to the rise of local strongmen who would become feudal lords.",
             "summary": "Vikings demand — and receive — a king's ransom from the heart of the Carolingian Empire.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "The Vikings", "author": "Else Roesdahl", "publication": "Penguin",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "otto-i-holy-roman-emperor-962",
        "title": "Otto I Crowned Holy Roman Emperor — Revival of the Western Empire",
        "year": 962, "lat": 41.90, "lng": 12.45,
        "geo_modern": "Rome, Italy",
        "geo_era_label": "Holy Roman Empire",
        "category": "political", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "European political history", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "In 962, Pope John XII crowned Otto I of Germany as Holy Roman Emperor, reviving the imperial title that had been vacant since the Carolingian decline. Otto's coronation established the Holy Roman Empire — the political framework of Central Europe for over eight centuries until its dissolution in 1806. The empire's unique structure of elected emperors, prince-bishops, and free cities created the distinctively decentralized character of German politics.",
             "summary": "The coronation that created the Holy Roman Empire — eight centuries of Central European history begin.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Holy Roman Empire", "author": "Peter Wilson", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "song-dynasty-reunification-960",
        "title": "Song Dynasty Reunifies China — An Age of Innovation Begins",
        "year": 960, "lat": 34.76, "lng": 114.36,
        "geo_modern": "Kaifeng, Henan, China",
        "geo_era_label": "Song Dynasty",
        "category": "political", "importance_score": 0.76, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Chinese history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "In 960, the general Zhao Kuangyin founded the Song Dynasty, reunifying China after decades of fragmentation. Though militarily weaker than the Tang, the Song presided over an economic and technological revolution: movable type printing, gunpowder weapons, the magnetic compass, paper money, and blast furnace steel. Song China was the world's most technologically advanced civilization, with a population exceeding 100 million.",
             "summary": "China's age of invention — the dynasty that gave the world printing, gunpowder, and the compass.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Age of Confucian Rule", "author": "Dieter Kuhn", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "fatimid-caliphate-cairo-969",
        "title": "Fatimids Found Cairo — A Shia Caliphate Challenges Baghdad",
        "year": 969, "lat": 30.05, "lng": 31.24,
        "geo_modern": "Cairo, Egypt",
        "geo_era_label": "Fatimid Caliphate",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Islamic history perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "In 969, the Fatimid Caliphate — an Ismaili Shia dynasty from North Africa — conquered Egypt and founded the new capital of Cairo (al-Qahira, 'The Victorious'). The Fatimids established Al-Azhar University (the world's oldest continuously operating university), created a rival caliphate to the Abbasids in Baghdad, and presided over an era of remarkable religious tolerance, cultural achievement, and commercial prosperity.",
             "summary": "A Shia dynasty builds Cairo, founds the world's oldest university, and challenges Sunni Baghdad.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Fatimid Caliphate", "author": "Shainool Jiwa", "publication": "I.B. Tauris",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2018}
             ]},
        ],
    },
    {
        "slug": "leif-erikson-vinland-1000",
        "title": "Leif Erikson Reaches North America — Vikings in the New World",
        "year": 1000, "lat": 51.60, "lng": -55.53,
        "geo_modern": "L'Anse aux Meadows, Newfoundland, Canada",
        "geo_era_label": "Viking Age",
        "category": "discovery", "importance_score": 0.76, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Norse exploration perspective", "culture_code": "ca", "viewpoint_type": "academic",
             "narrative": "Around 1000, Leif Erikson sailed from Greenland to establish a settlement at Vinland — identified with L'Anse aux Meadows in Newfoundland, the only confirmed Norse site in the Americas. Archaeological evidence shows the Vikings built turf houses, smelted iron, and repaired boats here. Though the settlement was abandoned within a few years due to conflicts with indigenous peoples, it represents the first known European contact with the Americas, nearly 500 years before Columbus.",
             "summary": "Europeans reach America five centuries before Columbus — a Viking outpost at the edge of the world.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Viking Discovery of America", "author": "Helge Ingstad and Anne Stine Ingstad",
                  "publication": "Checkmark Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "murasaki-shikibu-tale-genji-1000",
        "title": "Murasaki Shikibu Writes The Tale of Genji — World's First Novel",
        "year": 1000, "lat": 35.01, "lng": 135.77,
        "geo_modern": "Kyoto, Japan",
        "geo_era_label": "Heian Period Japan",
        "category": "cultural", "importance_score": 0.76, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "World literature perspective", "culture_code": "jp", "viewpoint_type": "academic",
             "narrative": "Around 1000, the court lady Murasaki Shikibu composed The Tale of Genji — widely considered the world's first novel. Its 54 chapters follow the romantic and political life of Prince Genji through the refined world of the Heian court, exploring themes of love, loss, impermanence, and the Buddhist concept of mono no aware (the pathos of things). Written in Japanese kana rather than Chinese, it demonstrated the literary power of the Japanese language.",
             "summary": "The world's first novel — a woman's masterpiece that defined Japanese literature and aesthetics.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Tale of Genji (Translated)", "author": "Murasaki Shikibu (trans. Royall Tyler)",
                  "publication": "Penguin Classics", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "al-azhar-university-founded-970",
        "title": "Al-Azhar University Founded — World's Oldest Continuously Operating University",
        "year": 970, "lat": 30.05, "lng": 31.26,
        "geo_modern": "Cairo, Egypt",
        "geo_era_label": "Fatimid Caliphate",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Islamic education perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Founded in 970 by the Fatimid Caliphate, Al-Azhar University in Cairo is the world's oldest continuously operating degree-granting university. Originally a center for Ismaili Shia learning, it became the foremost Sunni theological institution after Saladin's reconquest. For over a millennium, Al-Azhar has been the most influential center of Islamic scholarship, and its fatwas carry weight across the Muslim world.",
             "summary": "A thousand years of continuous learning — the most authoritative voice in Sunni Islamic scholarship.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "A History of Al-Azhar", "author": "Bayard Dodge", "publication": "The Middle East Institute",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1961}
             ]},
        ],
    },
    {
        "slug": "battle-lechfeld-955",
        "title": "Battle of Lechfeld — Otto I Ends the Magyar Raids",
        "year": 955, "lat": 48.37, "lng": 10.90,
        "geo_modern": "Augsburg, Bavaria, Germany",
        "geo_era_label": "Ottonian Germany",
        "category": "war", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "European military history", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "On August 10, 955, Otto I of Germany decisively defeated the Magyars at the Battle of Lechfeld near Augsburg, ending decades of devastating Hungarian raids into Western Europe. The victory was so complete that the Magyars never raided westward again, instead settling permanently in the Carpathian Basin and eventually converting to Christianity. Otto was hailed as savior of Christendom, paving his way to the imperial crown.",
             "summary": "The battle that ended the Magyar terror and made Otto the new Charlemagne.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Germany in the Early Middle Ages", "author": "Timothy Reuter", "publication": "Longman",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "hugh-capet-capetian-dynasty-987",
        "title": "Hugh Capet Founds the Capetian Dynasty — Medieval France Takes Shape",
        "year": 987, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "Medieval France",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "French history perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "In 987, Hugh Capet was elected King of France, founding the Capetian dynasty that would rule France in an unbroken male line for over 300 years — and through cadet branches (Valois, Bourbon) until the French Revolution. At his accession, Hugh controlled little beyond the Île-de-France around Paris, but his descendants gradually built the centralized French state that became Europe's most powerful kingdom.",
             "summary": "A minor duke becomes king — starting the dynasty that built France over eight centuries.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Capetians", "author": "Jim Bradbury", "publication": "Hambledon Continuum",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
]


async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting early medieval enrichment seed — {len(EVENTS)} events")

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
            VALUES ('event', $1, 'create', $2, 'ai', 'Early medieval enrichment seed (500-1000 CE)')
            """,
            event_id, CREATED_BY,
        )

        inserted += 1
        print(f"  [ok] {slug}")

    era = await conn.fetchval("SELECT COUNT(*) FROM events WHERE year_approx BETWEEN 500 AND 1000")
    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    print(f"\n✅ Enrichment complete — inserted {inserted}, skipped {skipped}")
    print(f"   Early medieval events (500-1000 CE): {era}")
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
