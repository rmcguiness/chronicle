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
        "slug": "harvey-discovers-blood-circulation",
        "title": "William Harvey Describes Blood Circulation",
        "year": 1628, "lat": 51.51, "lng": -0.13,
        "geo_modern": "London, England",
        "geo_era_label": "Early Modern England",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Medical history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "William Harvey's Exercitatio Anatomica de Motu Cordis (1628) demonstrated that blood circulates through the body in a closed system, pumped by the heart. This overturned Galen's 1,500-year-old model and established the foundation of modern physiology and evidence-based medicine.",
             "summary": "Harvey's discovery of blood circulation revolutionized medicine.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Circulation of the Blood and Andrea Cesalpino of Arezzo", "author": "Andrew Wear", "publication": "Journal of the History of Medicine",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1973}
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
        "slug": "luther-95-theses-reformation",
        "title": "Martin Luther's 95 Theses — Start of the Protestant Reformation",
        "year": 1517, "lat": 51.87, "lng": 12.64,
        "geo_modern": "Wittenberg, Saxony, Germany",
        "geo_era_label": "Early Modern Europe",
        "category": "cultural", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "On October 31, 1517, Martin Luther posted his 95 Theses challenging papal indulgences, sparking the Protestant Reformation. Luther's insistence on Scripture alone (sola scriptura) and salvation by faith alone (sola fide) fractured Western Christianity and reshaped European politics, culture, and thought for centuries.",
             "summary": "Luther's 95 Theses launched the Protestant Reformation that split Western Christianity.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Martin Luther: Renegade and Prophet", "author": "Lyndal Roper", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "council-of-trent-catholic-reform",
        "title": "Council of Trent — Catholic Counter-Reformation",
        "year": 1545, "lat": 46.07, "lng": 11.12,
        "geo_modern": "Trento, Italy",
        "geo_era_label": "Early Modern Europe",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "The Council of Trent (1545–1563) was the Catholic Church's definitive response to the Protestant Reformation. It reaffirmed Catholic doctrines on Scripture, sacraments, and papal authority while enacting reforms to address corruption. The council shaped Catholicism for the next four centuries.",
             "summary": "The Catholic Church's major reform council in response to Protestantism.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Council of Trent: Reform and Controversy in Europe and Beyond", "author": "Nelson Minnich", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2018}
             ]},
        ],
    },
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
    {
        "slug": "thirty-years-war-begins",
        "title": "Thirty Years' War — Europe's Devastating Religious Conflict",
        "year": 1618, "lat": 50.09, "lng": 14.42,
        "geo_modern": "Prague, Bohemia (Czech Republic)",
        "geo_era_label": "Early Modern Europe",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "The Thirty Years' War (1618–1648) began as a conflict between Protestant and Catholic states in the Holy Roman Empire but escalated into a general European war. It killed an estimated 8 million people (~30% of the German population), devastated Central Europe, and ended with the Peace of Westphalia establishing the modern state system.",
             "summary": "The most destructive European war before the 20th century, reshaping the state system.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Thirty Years' War: Europe's Tragedy", "author": "Peter Wilson", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
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
        "slug": "columbus-reaches-americas",
        "title": "Columbus Reaches the Americas",
        "year": 1492, "lat": 24.05, "lng": -74.53,
        "geo_modern": "San Salvador (Guanahani), Bahamas",
        "geo_era_label": "Age of Exploration",
        "category": "discovery", "importance_score": 0.95, "zoom_min": 1, "is_bce": False,
        "perspectives": [
            {"label": "European exploration perspective", "culture_code": "es", "viewpoint_type": "academic",
             "narrative": "Christopher Columbus's 1492 voyage, funded by Spain, reached the Caribbean islands, initiating sustained European contact with the Americas. This 'Columbian Exchange' transformed both hemispheres through the transfer of crops, animals, diseases, and peoples — but devastated indigenous populations through conquest and epidemic disease.",
             "summary": "Columbus's 1492 voyage initiated the Columbian Exchange between hemispheres.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Columbian Exchange: Biological and Cultural Consequences of 1492", "author": "Alfred Crosby", "publication": "Greenwood Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1972}
             ]},
            {"label": "Indigenous perspective", "culture_code": "global", "viewpoint_type": "indigenous",
             "narrative": "For the Taíno and other indigenous peoples of the Caribbean, Columbus's arrival marked the beginning of catastrophic colonization. Within decades, the Taíno population was decimated by forced labor, disease, and violence — from an estimated 250,000–1 million to near extinction.",
             "summary": "Columbus's arrival began the destruction of Caribbean indigenous civilizations.", "evidence_score": 0.85,
             "sources": [
                 {"title": "A People's History of the United States", "author": "Howard Zinn", "publication": "Harper & Row",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1980}
             ]},
        ],
    },
    {
        "slug": "vasco-da-gama-india-route",
        "title": "Vasco da Gama Reaches India by Sea",
        "year": 1498, "lat": 11.25, "lng": 75.77,
        "geo_modern": "Calicut (Kozhikode), Kerala, India",
        "geo_era_label": "Age of Exploration",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Maritime history perspective", "culture_code": "pt", "viewpoint_type": "academic",
             "narrative": "Vasco da Gama's 1498 voyage around Africa to India established the first direct sea route from Europe to Asia. This broke the Venetian-Ottoman monopoly on the spice trade, shifted global trade patterns, and launched Portuguese maritime empire in the Indian Ocean.",
             "summary": "The first European sea route to India, transforming global trade.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Conquerors: How Portugal Forged the First Global Empire", "author": "Roger Crowley", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2015}
             ]},
        ],
    },
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
        "slug": "english-civil-war-begins-1642",
        "title": "English Civil War Begins — Parliament vs. Crown",
        "year": 1642, "lat": 52.05, "lng": -1.17,
        "geo_modern": "Edgehill, Warwickshire, England",
        "geo_era_label": "Stuart England",
        "category": "war", "importance_score": 0.8, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The English Civil War (1642–1651) pitted Parliament against Charles I over issues of royal prerogative, religious policy, and taxation. The Parliamentary victory, regicide of Charles I (1649), and brief republic under Cromwell established the precedent that monarchs rule with the consent of Parliament — a foundation of constitutional government.",
             "summary": "The English Civil War established parliamentary supremacy over absolute monarchy.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The English Civil War: A People's History", "author": "Diane Purkiss", "publication": "Harper Perennial",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
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
        "slug": "latin-american-independence-movements",
        "title": "Latin American Independence Movements — Bolívar and San Martín",
        "year": 1819, "lat": 4.60, "lng": -74.08,
        "geo_modern": "Bogotá, Colombia",
        "geo_era_label": "Age of Revolutions",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Latin American perspective", "culture_code": "co", "viewpoint_type": "academic",
             "narrative": "Inspired by the American and French Revolutions and enabled by Napoleon's invasion of Spain, Latin American independence movements swept the continent from 1808–1825. Simón Bolívar liberated Venezuela, Colombia, Ecuador, Peru, and Bolivia; José de San Martín freed Argentina, Chile, and Peru. These campaigns created over a dozen new nations.",
             "summary": "Revolutionary wars that liberated most of Latin America from Spanish colonial rule.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Bolívar: American Liberator", "author": "Marie Arana", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2013}
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
        "slug": "printing-press-gutenberg",
        "title": "Gutenberg Printing Press — Revolution in Knowledge",
        "year": 1440, "lat": 50.00, "lng": 8.27,
        "geo_modern": "Mainz, Germany",
        "geo_era_label": "Late Medieval/Renaissance Europe",
        "category": "discovery", "importance_score": 0.95, "zoom_min": 1, "is_bce": False,
        "perspectives": [
            {"label": "Media history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Johannes Gutenberg's movable-type printing press (c. 1440) revolutionized the production and distribution of knowledge. By 1500, an estimated 20 million volumes had been printed. The press enabled the Reformation, Scientific Revolution, and Enlightenment by making books affordable and ideas transmissible across Europe.",
             "summary": "The printing press democratized knowledge and enabled the modern world.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Gutenberg's Europe: The Book and the Invention of Western Modernity", "author": "Frédéric Barbier", "publication": "Polity Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2017}
             ]},
        ],
    },
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
        "slug": "meiji-restoration-japan-modernization",
        "title": "Meiji Restoration — Japan's Rapid Modernization",
        "year": 1868, "lat": 35.68, "lng": 139.75,
        "geo_modern": "Tokyo (Edo), Japan",
        "geo_era_label": "Meiji Japan",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Japanese history perspective", "culture_code": "jp", "viewpoint_type": "academic",
             "narrative": "The Meiji Restoration (1868) overthrew the Tokugawa shogunate and restored imperial rule under Emperor Meiji. Japan then undertook the most rapid modernization program in history, adopting Western technology, institutions, and military systems while preserving Japanese cultural identity. Within 30 years Japan became an industrial and military power.",
             "summary": "Japan's transformation from feudal isolation to industrial world power in one generation.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Making of Modern Japan", "author": "Marius Jansen", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "scramble-for-africa-berlin-conference",
        "title": "Scramble for Africa — Berlin Conference",
        "year": 1884, "lat": 52.52, "lng": 13.41,
        "geo_modern": "Berlin, Germany",
        "geo_era_label": "New Imperialism",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Postcolonial perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Berlin Conference (1884–1885) established rules for European colonization of Africa, formalizing the 'Scramble for Africa.' By 1914, over 90% of Africa was under European control. The arbitrary borders drawn with no regard for ethnic, linguistic, or cultural boundaries continue to shape African conflicts today.",
             "summary": "European powers partitioned Africa at a conference, with lasting consequences.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Scramble for Africa", "author": "Thomas Pakenham", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "darwin-origin-species-evolution",
        "title": "Darwin's On the Origin of Species — Theory of Evolution",
        "year": 1859, "lat": 51.33, "lng": 0.05,
        "geo_modern": "Down House, Kent, England",
        "geo_era_label": "Victorian Britain",
        "category": "discovery", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Charles Darwin's On the Origin of Species (1859) presented the theory of evolution by natural selection, explaining the diversity of life through descent with modification. It revolutionized biology, challenged religious creationism, and fundamentally altered humanity's understanding of its place in nature.",
             "summary": "Darwin's theory of evolution transformed biology and human self-understanding.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Origin of Species by Means of Natural Selection", "author": "Charles Darwin", "publication": "John Murray",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1859}
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
        "slug": "congress-of-vienna-european-order",
        "title": "Congress of Vienna — Post-Napoleonic European Order",
        "year": 1815, "lat": 48.21, "lng": 16.37,
        "geo_modern": "Vienna, Austria",
        "geo_era_label": "Post-Napoleonic Europe",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Diplomatic history perspective", "culture_code": "at", "viewpoint_type": "academic",
             "narrative": "The Congress of Vienna (1814–1815) redrew the map of Europe after Napoleon's defeat. Led by Metternich, Castlereagh, and Talleyrand, it established a 'Concert of Europe' balance-of-power system that maintained relative peace for nearly a century. It also restored monarchies and suppressed liberal-nationalist movements.",
             "summary": "The post-Napoleonic settlement that maintained European peace for nearly a century.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Congress of Vienna: Power and Politics after Napoleon", "author": "Brian Vick", "publication": "Harvard University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "american-civil-war-emancipation",
        "title": "American Civil War and Emancipation",
        "year": 1861, "lat": 38.81, "lng": -77.07,
        "geo_modern": "Washington DC / Southern States, USA",
        "geo_era_label": "Civil War America",
        "category": "war", "importance_score": 0.9, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "American history perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The American Civil War (1861–1865) was fought between the Union and the Confederate States over slavery and states' rights. The bloodiest conflict in American history (~620,000 dead), it resulted in the abolition of slavery (13th Amendment), the preservation of the Union, and a constitutional revolution expanding federal power.",
             "summary": "America's deadliest war, ending slavery and preserving the Union.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Battle Cry of Freedom: The Civil War Era", "author": "James McPherson", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1988}
             ]},
        ],
    },
    {
        "slug": "german-unification-bismarck",
        "title": "German Unification Under Bismarck",
        "year": 1871, "lat": 48.78, "lng": 2.30,
        "geo_modern": "Versailles, France (proclamation) / Berlin, Germany",
        "geo_era_label": "19th Century Europe",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Otto von Bismarck unified Germany through 'blood and iron' — wars against Denmark (1864), Austria (1866), and France (1870–71). The German Empire was proclaimed at Versailles in January 1871, creating a powerful nation-state in the heart of Europe that would transform the balance of power and ultimately contribute to both World Wars.",
             "summary": "Bismarck's wars unified Germany, creating Europe's most powerful continental state.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Bismarck: A Life", "author": "Jonathan Steinberg", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
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
        "slug": "fall-of-constantinople-1453",
        "title": "Fall of Constantinople — End of the Byzantine Empire",
        "year": 1453, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Istanbul, Turkey",
        "geo_era_label": "Late Medieval / Early Modern",
        "category": "war", "importance_score": 0.9, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Ottoman conquest of Constantinople on May 29, 1453, ended the 1,100-year Byzantine Empire. Sultan Mehmed II used massive cannons to breach the Theodosian Walls. The fall reshaped Mediterranean geopolitics, drove Greek scholars westward (contributing to the Renaissance), and established Ottoman dominance in southeastern Europe for centuries.",
             "summary": "The Ottoman conquest ended Byzantium and reshaped Mediterranean geopolitics.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Constantinople: The Last Great Siege, 1453", "author": "Roger Crowley", "publication": "Faber and Faber",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "spanish-conquest-aztec-empire",
        "title": "Spanish Conquest of the Aztec Empire",
        "year": 1521, "lat": 19.43, "lng": -99.13,
        "geo_modern": "Tenochtitlán (Mexico City), Mexico",
        "geo_era_label": "Spanish Conquest",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Postcolonial perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "Hernán Cortés and a small Spanish force, allied with indigenous enemies of the Aztecs, conquered the Aztec Empire by 1521. The fall of Tenochtitlán — a city of 200,000+ — was facilitated by smallpox epidemics, superior Spanish weapons, and local alliances. It destroyed one of the world's great civilizations and began centuries of Spanish colonial rule.",
             "summary": "The destruction of the Aztec Empire by Spanish conquistadors and their indigenous allies.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Conquest of New Spain", "author": "Bernal Díaz del Castillo", "publication": "Penguin Classics",
                  "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": 1568}
             ]},
        ],
    },
    {
        "slug": "spanish-conquest-inca-empire",
        "title": "Spanish Conquest of the Inca Empire",
        "year": 1533, "lat": -13.52, "lng": -71.97,
        "geo_modern": "Cusco, Peru",
        "geo_era_label": "Spanish Conquest",
        "category": "war", "importance_score": 0.8, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Postcolonial perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Francisco Pizarro captured the Inca emperor Atahualpa in 1532 and conquered the Inca Empire by 1533. The largest empire in pre-Columbian America, stretching 2,500 miles along the Andes, fell to fewer than 200 Spaniards aided by civil war, disease, and technological advantages. The conquest destroyed a sophisticated civilization with advanced engineering and governance.",
             "summary": "A handful of Spanish conquistadors overthrew the vast Inca Empire.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Last Days of the Incas", "author": "Kim MacQuarrie", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}
             ]},
        ],
    },
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
        "slug": "marx-communist-manifesto",
        "title": "Marx and Engels Publish The Communist Manifesto",
        "year": 1848, "lat": 51.51, "lng": -0.13,
        "geo_modern": "London, England",
        "geo_era_label": "Industrial Europe",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Political thought perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "The Communist Manifesto (1848) by Karl Marx and Friedrich Engels analyzed history as class struggle and predicted the overthrow of capitalism by the proletariat. Its call 'Workers of the world, unite!' galvanized labor movements globally and laid the ideological foundation for communist revolutions in the 20th century.",
             "summary": "The foundational text of communist ideology that shaped 20th-century politics.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Karl Marx: A Nineteenth-Century Life", "author": "Jonathan Sperber", "publication": "Liveright",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}
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
    {"cause": "printing-press-gutenberg", "effect": "luther-95-theses-reformation", "type": "contributing", "strength": 0.8, "desc": "The printing press enabled rapid spread of Luther's ideas across Europe"},
    {"cause": "printing-press-gutenberg", "effect": "copernicus-publishes-de-revolutionibus", "type": "contributing", "strength": 0.6, "desc": "Print enabled dissemination of scientific works"},
    {"cause": "luther-95-theses-reformation", "effect": "council-of-trent-catholic-reform", "type": "direct", "strength": 0.9, "desc": "The Counter-Reformation was a direct response to Protestant challenges"},
    {"cause": "luther-95-theses-reformation", "effect": "english-reformation-henry-viii", "type": "contributing", "strength": 0.6, "desc": "The broader Reformation context facilitated Henry VIII's break with Rome"},
    {"cause": "luther-95-theses-reformation", "effect": "thirty-years-war-begins", "type": "direct", "strength": 0.8, "desc": "Religious divisions from the Reformation fueled the Thirty Years' War"},
    {"cause": "thirty-years-war-begins", "effect": "peace-of-westphalia-sovereignty", "type": "direct", "strength": 0.9, "desc": "The Peace of Westphalia ended the Thirty Years' War"},

    # Scientific revolution chain
    {"cause": "copernicus-publishes-de-revolutionibus", "effect": "galileo-telescope-1609", "type": "direct", "strength": 0.8, "desc": "Galileo's telescopic observations confirmed Copernican heliocentrism"},
    {"cause": "galileo-telescope-1609", "effect": "scientific-revolution-newton-laws-1687", "type": "direct", "strength": 0.8, "desc": "Galileo's mechanics laid groundwork for Newton's laws of motion"},
    {"cause": "copernicus-publishes-de-revolutionibus", "effect": "kepler-planetary-laws-1609", "type": "direct", "strength": 0.8, "desc": "Kepler refined and proved the heliocentric model with mathematical precision"},
    {"cause": "kepler-planetary-laws-1609", "effect": "scientific-revolution-newton-laws-1687", "type": "direct", "strength": 0.9, "desc": "Newton's gravitational theory explained Kepler's planetary laws"},
    {"cause": "scientific-revolution-newton-laws-1687", "effect": "leibniz-calculus-invention", "type": "contributing", "strength": 0.7, "desc": "Newton and Leibniz independently developed calculus in the same intellectual milieu"},
    {"cause": "scientific-revolution-newton-laws-1687", "effect": "enlightenment-encyclopedie", "type": "contributing", "strength": 0.7, "desc": "Newton's success inspired Enlightenment faith in reason and science"},
    {"cause": "scientific-societies-founded", "effect": "scientific-revolution-newton-laws-1687", "type": "contributing", "strength": 0.6, "desc": "Scientific societies provided institutional support for Newton's work"},
    {"cause": "microscope-discovery-microorganisms", "effect": "linnaeus-systema-naturae", "type": "contributing", "strength": 0.5, "desc": "Microscopy expanded awareness of biological diversity, motivating classification"},
    {"cause": "linnaeus-systema-naturae", "effect": "darwin-origin-species-evolution", "type": "contributing", "strength": 0.7, "desc": "Linnaean taxonomy organized biodiversity, enabling evolutionary thinking"},
    {"cause": "harvey-discovers-blood-circulation", "effect": "scientific-societies-founded", "type": "contributing", "strength": 0.5, "desc": "Harvey's experimental approach exemplified the new science the societies promoted"},

    # Enlightenment → political revolutions
    {"cause": "enlightenment-encyclopedie", "effect": "french-revolution-bastille", "type": "contributing", "strength": 0.7, "desc": "Enlightenment ideas of liberty and reason inspired the French Revolution"},
    {"cause": "adam-smith-wealth-of-nations", "effect": "watt-steam-engine-improved", "type": "indirect", "strength": 0.4, "desc": "Free-market economics supported industrial entrepreneurship"},
    {"cause": "locke-two-treatises", "effect": "american-declaration-independence", "type": "direct", "strength": 0.8, "desc": "Locke's natural rights philosophy directly influenced Jefferson's Declaration"},
    {"cause": "locke-two-treatises", "effect": "glorious-revolution-1688", "type": "contributing", "strength": 0.7, "desc": "Locke's Two Treatises justified the Glorious Revolution"},
    {"cause": "glorious-revolution-1688", "effect": "american-declaration-independence", "type": "contributing", "strength": 0.6, "desc": "English constitutional precedents shaped American revolutionary thought"},
    {"cause": "american-declaration-independence", "effect": "french-revolution-bastille", "type": "direct", "strength": 0.7, "desc": "The American Revolution inspired French revolutionaries"},
    {"cause": "french-revolution-bastille", "effect": "french-revolution-declaration-rights-man", "type": "direct", "strength": 0.9, "desc": "The Revolution's National Assembly adopted the Declaration of Rights"},
    {"cause": "french-revolution-bastille", "effect": "napoleon-rise-to-power", "type": "direct", "strength": 0.9, "desc": "Napoleon rose through the chaos of the French Revolution"},
    {"cause": "napoleon-rise-to-power", "effect": "congress-of-vienna-european-order", "type": "direct", "strength": 0.9, "desc": "The Congress of Vienna was convened after Napoleon's defeat"},
    {"cause": "napoleon-rise-to-power", "effect": "latin-american-independence-movements", "type": "contributing", "strength": 0.7, "desc": "Napoleon's invasion of Spain weakened colonial control, enabling Latin American independence"},
    {"cause": "congress-of-vienna-european-order", "effect": "revolutions-1848-springtime-peoples", "type": "contributing", "strength": 0.6, "desc": "Repression of liberal-nationalist movements by the Vienna system provoked the 1848 revolutions"},

    # Slave trade → revolution → abolition chain
    {"cause": "atlantic-slave-trade-begins", "effect": "trans-atlantic-slave-trade-peak-1780", "type": "direct", "strength": 0.9, "desc": "The slave trade escalated to its peak in the 18th century"},
    {"cause": "trans-atlantic-slave-trade-peak-1780", "effect": "haitian-revolution-independence", "type": "direct", "strength": 0.8, "desc": "The brutality of plantation slavery provoked the Haitian Revolution"},
    {"cause": "haitian-revolution-independence", "effect": "abolition-slave-trade-britain", "type": "contributing", "strength": 0.6, "desc": "Haiti's revolution strengthened abolitionist arguments"},
    {"cause": "abolition-slave-trade-britain", "effect": "abolition-slavery-british-empire-1833", "type": "direct", "strength": 0.9, "desc": "Trade abolition was followed by full emancipation in 1833"},
    {"cause": "abolition-slavery-british-empire-1833", "effect": "american-civil-war-emancipation", "type": "contributing", "strength": 0.5, "desc": "British abolition intensified the global debate over slavery"},

    # Colonialism chains
    {"cause": "columbus-reaches-americas", "effect": "treaty-tordesillas-world-division", "type": "direct", "strength": 0.9, "desc": "Columbus's discovery prompted Spain and Portugal to divide the new world"},
    {"cause": "columbus-reaches-americas", "effect": "spanish-conquest-aztec-empire", "type": "direct", "strength": 0.8, "desc": "Columbus opened the path to Spanish conquest of the Americas"},
    {"cause": "spanish-conquest-aztec-empire", "effect": "spanish-conquest-inca-empire", "type": "direct", "strength": 0.7, "desc": "Success in Mexico emboldened and enabled the conquest of Peru"},
    {"cause": "spanish-conquest-aztec-empire", "effect": "atlantic-slave-trade-begins", "type": "contributing", "strength": 0.6, "desc": "Conquest created labor demands that fueled the slave trade"},
    {"cause": "vasco-da-gama-india-route", "effect": "dutch-east-india-company-founded", "type": "contributing", "strength": 0.7, "desc": "Da Gama's route opened Indian Ocean trade to European companies"},
    {"cause": "dutch-east-india-company-founded", "effect": "british-east-india-company-india", "type": "contributing", "strength": 0.6, "desc": "Dutch success in Asia spurred British East India Company expansion"},
    {"cause": "fall-of-constantinople-1453", "effect": "columbus-reaches-americas", "type": "contributing", "strength": 0.6, "desc": "Ottoman control of eastern trade routes motivated westward exploration"},
    {"cause": "fall-of-constantinople-1453", "effect": "vasco-da-gama-india-route", "type": "contributing", "strength": 0.6, "desc": "Ottoman control motivated Portuguese search for sea route to India"},

    # Industrial revolution chain
    {"cause": "spinning-jenny-textile-revolution", "effect": "watt-steam-engine-improved", "type": "contributing", "strength": 0.6, "desc": "Textile mechanization drove demand for steam power"},
    {"cause": "watt-steam-engine-improved", "effect": "first-railway-liverpool-manchester", "type": "direct", "strength": 0.9, "desc": "Steam power enabled the railway revolution"},
    {"cause": "watt-steam-engine-improved", "effect": "bessemer-process-steel", "type": "contributing", "strength": 0.6, "desc": "Steam-powered industry created demand for cheap steel"},
    {"cause": "first-railway-liverpool-manchester", "effect": "telegraph-morse-communication", "type": "contributing", "strength": 0.5, "desc": "Railways created infrastructure corridors for telegraph lines"},
    {"cause": "watt-steam-engine-improved", "effect": "marx-communist-manifesto", "type": "contributing", "strength": 0.6, "desc": "Industrialization's social upheaval inspired Marx's critique of capitalism"},

    # Japan/China chain
    {"cause": "opium-wars-china-unequal-treaties", "effect": "meiji-restoration-japan-modernization", "type": "contributing", "strength": 0.6, "desc": "China's humiliation by Western powers alarmed Japanese leaders into modernization"},
    {"cause": "tokugawa-japan-isolation", "effect": "meiji-restoration-japan-modernization", "type": "direct", "strength": 0.8, "desc": "The Meiji Restoration overthrew the Tokugawa order"},

    # English Civil War → constitutional chain
    {"cause": "english-civil-war-begins-1642", "effect": "glorious-revolution-1688", "type": "direct", "strength": 0.8, "desc": "The unresolved tensions of the Civil War led to the Glorious Revolution"},

    # Nationalism
    {"cause": "revolutions-1848-springtime-peoples", "effect": "german-unification-bismarck", "type": "contributing", "strength": 0.6, "desc": "1848 nationalism failed peacefully, leading to Bismarck's military unification"},
    {"cause": "revolutions-1848-springtime-peoples", "effect": "italian-unification-risorgimento", "type": "contributing", "strength": 0.7, "desc": "1848 revolutionary nationalism directly inspired the Risorgimento"},

    # Mughal/colonial India
    {"cause": "mughal-empire-peak-akbar", "effect": "british-east-india-company-india", "type": "indirect", "strength": 0.5, "desc": "Mughal decline in the 18th century enabled British expansion in India"},

    # Africa
    {"cause": "scramble-for-africa-berlin-conference", "effect": "berlin-conference-africa-partition-1884", "type": "direct", "strength": 0.9, "desc": "The Berlin Conference formalized the Scramble for Africa"},

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
