#!/usr/bin/env python3
"""
enrich_early_modern.py

Adds 100+ historical events covering the early modern period (1400-1800 CE):
- Renaissance art & architecture
- Protestant Reformation & religious wars
- Age of Exploration (including non-European perspectives)
- Ottoman Empire golden age
- Mughal Empire (Akbar to Aurangzeb)
- Ming/Qing China transition
- Scientific Revolution
- Enlightenment beginnings
- Americas: Aztec/Inca empires and Spanish conquest
- Japan: Sengoku period and Tokugawa unification

Also adds 40+ causality links and recomputes network_y.
"""

import asyncio
import asyncpg
import uuid
import re
from datetime import date
from slugify import slugify
from collections import defaultdict, deque
from typing import Optional

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"
ISOLATED_NUDGE = 15

# ────────────────────────────────────────────────────────────────────────────
# NEW EVENTS DATA
# Format: (title, description, year, geo_modern, event_category, geo_era_label, importance_score)
# ────────────────────────────────────────────────────────────────────────────

NEW_EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════
    # RENAISSANCE ART & ARCHITECTURE (Italy, 1400s-1500s)
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Brunelleschi Completes Florence Cathedral Dome",
     "Filippo Brunelleschi completes the dome of Santa Maria del Fiore, the largest brick dome ever built, revolutionizing Renaissance architecture.",
     1436, "Florence, Italy", "cultural", "Italian Renaissance", 0.85),
    
    ("Donatello's David Sculpture",
     "Donatello creates the first freestanding nude male sculpture since antiquity, marking a Renaissance revival of classical forms.",
     1440, "Florence, Italy", "cultural", "Italian Renaissance", 0.75),
    
    ("Alberti Publishes De re aedificatoria",
     "Leon Battista Alberti publishes his treatise on architecture, codifying Renaissance architectural principles based on classical Roman models.",
     1452, "Rome, Italy", "cultural", "Italian Renaissance", 0.65),
    
    ("Botticelli Paints The Birth of Venus",
     "Sandro Botticelli completes The Birth of Venus, embodying Neoplatonic ideals and becoming an icon of Renaissance art.",
     1485, "Florence, Italy", "cultural", "Italian Renaissance", 0.75),
    
    ("Leonardo Paints The Last Supper",
     "Leonardo da Vinci completes The Last Supper in Milan, pioneering perspective and psychological depth in religious art.",
     1498, "Milan, Italy", "cultural", "Italian Renaissance", 0.85),
    
    ("Michelangelo Completes David",
     "Michelangelo unveils his colossal marble David in Florence, symbolizing the Republic's defiance and human perfectibility.",
     1504, "Florence, Italy", "cultural", "Italian Renaissance", 0.85),
    
    ("Michelangelo Completes Sistine Chapel Ceiling",
     "Michelangelo finishes the Sistine Chapel ceiling after four years, depicting the Creation and becoming the pinnacle of Renaissance painting.",
     1512, "Vatican City", "cultural", "Italian Renaissance", 0.9),
    
    ("Raphael Completes The School of Athens",
     "Raphael finishes The School of Athens fresco, harmonizing classical philosophy with Renaissance humanism.",
     1511, "Vatican City", "cultural", "Italian Renaissance", 0.8),
    
    ("Titian Becomes Venice's Leading Painter",
     "Titian becomes the dominant artist of Venetian Renaissance, revolutionizing oil painting technique and color.",
     1516, "Venice, Italy", "cultural", "Italian Renaissance", 0.7),
    
    ("Palladio Publishes Four Books of Architecture",
     "Andrea Palladio publishes his influential architectural treatise, shaping neoclassical architecture for centuries.",
     1570, "Venice, Italy", "cultural", "Italian Renaissance", 0.7),

    # ═══════════════════════════════════════════════════════════════════════
    # PROTESTANT REFORMATION & RELIGIOUS WARS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Martin Luther Posts Ninety-Five Theses",
     "Martin Luther posts his Ninety-Five Theses criticizing indulgences, sparking the Protestant Reformation.",
     1517, "Wittenberg, Germany", "religious", "Protestant Reformation", 0.95),
    
    ("Diet of Worms — Luther Condemned",
     "Luther refuses to recant at the Diet of Worms, declaring 'Here I stand,' and is declared an outlaw by the Holy Roman Empire.",
     1521, "Worms, Germany", "religious", "Protestant Reformation", 0.85),
    
    ("Peasants' War in Germany",
     "Inspired partly by Reformation ideas, German peasants revolt against feudal oppression; over 100,000 die in the suppression.",
     1525, "Germany", "war", "Protestant Reformation", 0.7),
    
    ("Henry VIII Breaks with Rome",
     "Henry VIII establishes the Church of England, breaking with papal authority over his divorce from Catherine of Aragon.",
     1534, "London, England", "religious", "English Reformation", 0.85),
    
    ("Calvin Establishes Geneva Theocracy",
     "John Calvin transforms Geneva into a Protestant model city, spreading Reformed theology across Europe.",
     1541, "Geneva, Switzerland", "religious", "Protestant Reformation", 0.8),
    
    ("Council of Trent Begins",
     "The Catholic Church convenes the Council of Trent, launching the Counter-Reformation with doctrinal clarifications and reforms.",
     1545, "Trent, Italy", "religious", "Counter-Reformation", 0.8),
    
    ("Peace of Augsburg",
     "The Peace of Augsburg allows German princes to choose Lutheranism or Catholicism for their territories (cuius regio, eius religio).",
     1555, "Augsburg, Germany", "political", "Protestant Reformation", 0.75),
    
    ("St. Bartholomew's Day Massacre",
     "Thousands of French Huguenots are massacred in Paris and across France, deepening the Wars of Religion.",
     1572, "Paris, France", "war", "French Wars of Religion", 0.8),
    
    ("Edict of Nantes",
     "Henry IV issues the Edict of Nantes, granting French Protestants civil rights and ending the Wars of Religion.",
     1598, "Nantes, France", "political", "French Wars of Religion", 0.75),
    
    ("Defenestration of Prague",
     "Protestant nobles throw Catholic officials from a window in Prague, triggering the Thirty Years' War.",
     1618, "Prague, Czech Republic", "war", "Thirty Years' War", 0.75),
    
    ("Battle of White Mountain",
     "Catholic forces defeat Bohemian Protestants, crushing the revolt and beginning Habsburg re-Catholicization of Bohemia.",
     1620, "Prague, Czech Republic", "war", "Thirty Years' War", 0.7),
    
    ("Gustavus Adolphus Enters Thirty Years' War",
     "Swedish King Gustavus Adolphus intervenes to support Protestant cause, revolutionizing military tactics.",
     1630, "Germany", "war", "Thirty Years' War", 0.75),
    
    ("Peace of Westphalia",
     "The Peace of Westphalia ends the Thirty Years' War, establishing the principle of state sovereignty and religious coexistence.",
     1648, "Münster, Germany", "political", "Thirty Years' War", 0.9),
    
    ("Revocation of Edict of Nantes",
     "Louis XIV revokes the Edict of Nantes, forcing Huguenots to flee France and spreading Protestant expertise across Europe.",
     1685, "Fontainebleau, France", "political", "Early Modern France", 0.7),

    # ═══════════════════════════════════════════════════════════════════════
    # OTTOMAN EMPIRE GOLDEN AGE
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Mehmed II Conquers Constantinople",
     "Sultan Mehmed II captures Constantinople, ending the Byzantine Empire and establishing Ottoman dominance.",
     1453, "Istanbul, Turkey", "war", "Ottoman Empire", 0.95),
    
    ("Selim I Conquers Mamluk Egypt",
     "Sultan Selim I defeats the Mamluks, bringing Egypt, Syria, and the holy cities of Mecca and Medina under Ottoman rule.",
     1517, "Cairo, Egypt", "war", "Ottoman Empire", 0.8),
    
    ("Suleiman the Magnificent Begins Reign",
     "Suleiman I begins his 46-year reign, presiding over the Ottoman golden age of military, legal, and cultural achievement.",
     1520, "Istanbul, Turkey", "political", "Ottoman Empire", 0.85),
    
    ("Siege of Vienna (1529)",
     "Suleiman's siege of Vienna marks the Ottoman high-water mark in Central Europe, though the siege fails.",
     1529, "Vienna, Austria", "war", "Ottoman Empire", 0.8),
    
    ("Süleymaniye Mosque Completed",
     "Architect Sinan completes the Süleymaniye Mosque, masterpiece of Ottoman architecture.",
     1558, "Istanbul, Turkey", "cultural", "Ottoman Empire", 0.7),
    
    ("Battle of Lepanto",
     "A Holy League fleet defeats the Ottoman navy at Lepanto, breaking Ottoman Mediterranean naval dominance.",
     1571, "Gulf of Patras, Greece", "war", "Ottoman Empire", 0.8),
    
    ("Battle of Vienna (1683)",
     "A Christian coalition defeats the Ottoman siege of Vienna, beginning Ottoman retreat from Central Europe.",
     1683, "Vienna, Austria", "war", "Ottoman Empire", 0.85),
    
    ("Treaty of Karlowitz",
     "The Ottomans cede Hungary to the Habsburgs in the Treaty of Karlowitz, first major Ottoman territorial loss.",
     1699, "Sremski Karlovci, Serbia", "political", "Ottoman Empire", 0.7),

    # ═══════════════════════════════════════════════════════════════════════
    # MUGHAL EMPIRE
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Babur Founds Mughal Empire",
     "Babur defeats the Delhi Sultanate at Panipat, establishing the Mughal Empire in India.",
     1526, "Panipat, India", "war", "Mughal Empire", 0.85),
    
    ("Humayun Loses and Regains Empire",
     "After losing his empire to Sher Shah Suri, Humayun recaptures Delhi with Persian help.",
     1555, "Delhi, India", "war", "Mughal Empire", 0.65),
    
    ("Akbar the Great Begins Reign",
     "Akbar becomes emperor at 13, beginning a reign of military conquest, religious tolerance, and administrative reform.",
     1556, "Agra, India", "political", "Mughal Empire", 0.85),
    
    ("Akbar Abolishes Jizya Tax",
     "Akbar abolishes the jizya tax on non-Muslims, promoting religious tolerance in the Mughal Empire.",
     1564, "Agra, India", "political", "Mughal Empire", 0.7),
    
    ("Akbar Creates Din-i Ilahi",
     "Akbar promulgates Din-i Ilahi, a syncretic religion drawing from Islam, Hinduism, and other faiths.",
     1582, "Fatehpur Sikri, India", "religious", "Mughal Empire", 0.65),
    
    ("Shah Jahan Begins Reign",
     "Shah Jahan becomes emperor, initiating the peak of Mughal architectural achievement.",
     1628, "Agra, India", "political", "Mughal Empire", 0.75),
    
    ("Taj Mahal Completed",
     "Shah Jahan completes the Taj Mahal as a mausoleum for his wife Mumtaz Mahal, the pinnacle of Mughal architecture.",
     1653, "Agra, India", "cultural", "Mughal Empire", 0.9),
    
    ("Aurangzeb Becomes Emperor",
     "Aurangzeb seizes power after imprisoning his father Shah Jahan, beginning a reign of expansion and religious conservatism.",
     1658, "Delhi, India", "political", "Mughal Empire", 0.75),
    
    ("Aurangzeb Reimposses Jizya",
     "Aurangzeb reimposes the jizya tax on non-Muslims, reversing Akbar's policy of religious tolerance.",
     1679, "Delhi, India", "political", "Mughal Empire", 0.65),
    
    ("Maratha Wars Begin",
     "The Marathas under Shivaji challenge Mughal authority, beginning decades of warfare that will fragment the empire.",
     1680, "Deccan, India", "war", "Mughal Empire", 0.7),
    
    ("Death of Aurangzeb",
     "Aurangzeb dies after 49 years of rule, leaving an overextended empire that rapidly fragments.",
     1707, "Ahmednagar, India", "political", "Mughal Empire", 0.75),

    # ═══════════════════════════════════════════════════════════════════════
    # MING/QING CHINA TRANSITION
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Yongle Emperor Moves Capital to Beijing",
     "The Yongle Emperor moves the Ming capital from Nanjing to Beijing, beginning construction of the Forbidden City.",
     1421, "Beijing, China", "political", "Ming Dynasty", 0.8),
    
    ("Zheng He's First Voyage",
     "Admiral Zheng He begins his first voyage with a massive treasure fleet, projecting Chinese power across the Indian Ocean.",
     1405, "Nanjing, China", "discovery", "Ming Dynasty", 0.85),
    
    ("Zheng He Reaches East Africa",
     "Zheng He's fleet reaches the coast of East Africa, the furthest extent of Chinese maritime exploration.",
     1417, "Malindi, Kenya", "discovery", "Ming Dynasty", 0.75),
    
    ("Ming Ends Maritime Expeditions",
     "The Ming court ends the treasure voyages and turns inward, abandoning China's brief maritime expansion.",
     1433, "Beijing, China", "political", "Ming Dynasty", 0.7),
    
    ("Construction of Great Wall Expanded",
     "The Ming dynasty undertakes massive expansion of the Great Wall, creating the iconic structure known today.",
     1474, "Beijing, China", "cultural", "Ming Dynasty", 0.7),
    
    ("Wang Yangming's Neo-Confucianism",
     "Philosopher Wang Yangming develops his influential school of Neo-Confucianism emphasizing intuitive moral knowledge.",
     1509, "Zhejiang, China", "cultural", "Ming Dynasty", 0.65),
    
    ("Portuguese Reach China",
     "Portuguese traders arrive at the Chinese coast, beginning sustained European contact with Ming China.",
     1513, "Guangzhou, China", "discovery", "Ming Dynasty", 0.7),
    
    ("Li Zicheng Captures Beijing",
     "Rebel leader Li Zicheng captures Beijing; the last Ming emperor commits suicide, ending the dynasty.",
     1644, "Beijing, China", "war", "Ming-Qing Transition", 0.85),
    
    ("Qing Dynasty Established",
     "The Manchu Qing dynasty takes control of Beijing and begins conquering all of China.",
     1644, "Beijing, China", "political", "Qing Dynasty", 0.85),
    
    ("Kangxi Emperor Begins Reign",
     "Kangxi begins his 61-year reign, the longest in Chinese history, presiding over Qing consolidation and expansion.",
     1661, "Beijing, China", "political", "Qing Dynasty", 0.8),
    
    ("Qing Conquers Taiwan",
     "The Qing dynasty defeats the Ming loyalist Zheng family and annexes Taiwan.",
     1683, "Tainan, Taiwan", "war", "Qing Dynasty", 0.65),
    
    ("Qianlong Emperor Begins Reign",
     "Qianlong begins his reign, presiding over the height of Qing power and the largest extent of Chinese territory.",
     1735, "Beijing, China", "political", "Qing Dynasty", 0.75),

    # ═══════════════════════════════════════════════════════════════════════
    # SCIENTIFIC REVOLUTION
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Copernicus Publishes Heliocentric Theory",
     "Nicolaus Copernicus publishes De revolutionibus orbium coelestium, proposing the sun-centered model of the solar system.",
     1543, "Frombork, Poland", "discovery", "Scientific Revolution", 0.9),
    
    ("Vesalius Publishes Human Anatomy",
     "Andreas Vesalius publishes De humani corporis fabrica, founding modern anatomy with detailed dissection illustrations.",
     1543, "Basel, Switzerland", "discovery", "Scientific Revolution", 0.75),
    
    ("Tycho Brahe's Observatory",
     "Tycho Brahe establishes Uraniborg observatory, making the most precise pre-telescopic astronomical observations.",
     1576, "Hven, Denmark", "discovery", "Scientific Revolution", 0.65),
    
    ("Giordano Bruno Burned for Heresy",
     "Philosopher Giordano Bruno is burned at the stake for his cosmological views including infinite worlds.",
     1600, "Rome, Italy", "religious", "Scientific Revolution", 0.7),
    
    ("Kepler's Laws of Planetary Motion",
     "Johannes Kepler publishes his laws of planetary motion, describing elliptical orbits and celestial mechanics.",
     1609, "Prague, Czech Republic", "discovery", "Scientific Revolution", 0.85),
    
    ("Galileo Observes Jupiter's Moons",
     "Galileo uses his telescope to discover Jupiter's four largest moons, providing evidence for the Copernican system.",
     1610, "Padua, Italy", "discovery", "Scientific Revolution", 0.85),
    
    ("Harvey Describes Blood Circulation",
     "William Harvey publishes his discovery of blood circulation, revolutionizing understanding of human physiology.",
     1628, "London, England", "discovery", "Scientific Revolution", 0.8),
    
    ("Galileo Condemned by Inquisition",
     "The Roman Inquisition condemns Galileo for advocating heliocentrism; he is placed under house arrest.",
     1633, "Rome, Italy", "religious", "Scientific Revolution", 0.8),
    
    ("Descartes Publishes Discourse on Method",
     "René Descartes publishes Discourse on the Method, establishing foundational principles of modern philosophy and science.",
     1637, "Leiden, Netherlands", "discovery", "Scientific Revolution", 0.85),
    
    ("Royal Society Founded",
     "The Royal Society of London is founded, becoming a model for scientific academies worldwide.",
     1660, "London, England", "discovery", "Scientific Revolution", 0.75),
    
    ("Newton Publishes Principia",
     "Isaac Newton publishes Principia Mathematica, presenting laws of motion and universal gravitation.",
     1687, "London, England", "discovery", "Scientific Revolution", 0.95),
    
    ("Leibniz Publishes Calculus",
     "Gottfried Wilhelm Leibniz publishes his method of calculus, independently developed from Newton.",
     1684, "Leipzig, Germany", "discovery", "Scientific Revolution", 0.8),
    
    ("Leeuwenhoek Discovers Microorganisms",
     "Antonie van Leeuwenhoek uses his microscopes to discover bacteria and protists, founding microbiology.",
     1676, "Delft, Netherlands", "discovery", "Scientific Revolution", 0.75),

    # ═══════════════════════════════════════════════════════════════════════
    # ENLIGHTENMENT BEGINNINGS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Locke Publishes Two Treatises of Government",
     "John Locke publishes his arguments for natural rights and government by consent, influencing liberal political thought.",
     1689, "London, England", "cultural", "Enlightenment", 0.85),
    
    ("Locke Publishes Essay Concerning Human Understanding",
     "John Locke's Essay argues the mind is a blank slate, founding empiricist philosophy.",
     1689, "London, England", "cultural", "Enlightenment", 0.8),
    
    ("Newton Elected President of Royal Society",
     "Isaac Newton becomes president of the Royal Society, cementing science's institutional authority.",
     1703, "London, England", "discovery", "Enlightenment", 0.6),
    
    ("Montesquieu Publishes Spirit of the Laws",
     "Montesquieu's Spirit of the Laws articulates separation of powers, influencing the U.S. Constitution.",
     1748, "Paris, France", "cultural", "Enlightenment", 0.85),
    
    ("Voltaire Returns from English Exile",
     "Voltaire publishes Letters Concerning the English Nation, spreading English ideas of liberty to France.",
     1733, "Paris, France", "cultural", "Enlightenment", 0.75),
    
    ("Diderot's Encyclopédie Begins Publication",
     "Denis Diderot begins publishing the Encyclopédie, the landmark compendium of Enlightenment knowledge.",
     1751, "Paris, France", "cultural", "Enlightenment", 0.8),
    
    ("Rousseau Publishes The Social Contract",
     "Jean-Jacques Rousseau's Social Contract argues for popular sovereignty and the general will.",
     1762, "Amsterdam, Netherlands", "cultural", "Enlightenment", 0.85),
    
    ("Beccaria Publishes On Crimes and Punishments",
     "Cesare Beccaria argues against torture and capital punishment, founding modern criminal justice reform.",
     1764, "Milan, Italy", "cultural", "Enlightenment", 0.7),
    
    ("Adam Smith Publishes Wealth of Nations",
     "Adam Smith's Wealth of Nations founds classical economics and argues for free markets.",
     1776, "London, England", "cultural", "Enlightenment", 0.85),
    
    ("Kant Publishes Critique of Pure Reason",
     "Immanuel Kant's Critique synthesizes rationalism and empiricism, transforming modern philosophy.",
     1781, "Königsberg, Germany", "cultural", "Enlightenment", 0.8),

    # ═══════════════════════════════════════════════════════════════════════
    # AMERICAS: AZTEC/INCA AND SPANISH CONQUEST
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Aztec Empire Founded — Triple Alliance",
     "Tenochtitlan, Texcoco, and Tlacopan form the Triple Alliance, establishing Aztec dominance in central Mexico.",
     1428, "Tenochtitlan, Mexico", "political", "Aztec Empire", 0.8),
    
    ("Aztec Flower Wars Intensify",
     "The Aztecs institutionalize 'Flower Wars' to capture prisoners for sacrifice, alienating subject peoples.",
     1450, "Tenochtitlan, Mexico", "war", "Aztec Empire", 0.6),
    
    ("Inca Empire Rapid Expansion Begins",
     "Under Pachacuti, the Inca Empire begins rapid expansion from Cusco to dominate the Andes.",
     1438, "Cusco, Peru", "political", "Inca Empire", 0.8),
    
    ("Machu Picchu Constructed",
     "The Inca construct Machu Picchu as a royal estate for Emperor Pachacuti.",
     1450, "Machu Picchu, Peru", "cultural", "Inca Empire", 0.75),
    
    ("Inca Road System Completed",
     "The Inca complete their vast Qhapaq Ñan road network spanning 40,000 km across the Andes.",
     1470, "Andes, South America", "cultural", "Inca Empire", 0.7),
    
    ("Inca Civil War",
     "A devastating civil war between Atahualpa and Huáscar weakens the Inca Empire just before Spanish arrival.",
     1529, "Andes, South America", "war", "Inca Empire", 0.7),
    
    ("Cortés Arrives in Mexico",
     "Hernán Cortés lands on the Mexican coast with 500 soldiers, beginning the Spanish conquest.",
     1519, "Veracruz, Mexico", "war", "Spanish Conquest", 0.85),
    
    ("La Noche Triste — Aztec Victory",
     "The Aztecs drive Cortés and his allies from Tenochtitlan with heavy losses on both sides.",
     1520, "Tenochtitlan, Mexico", "war", "Spanish Conquest", 0.7),
    
    ("Fall of Tenochtitlan",
     "Cortés captures Tenochtitlan after a devastating siege, ending the Aztec Empire. Smallpox kills half the population.",
     1521, "Tenochtitlan, Mexico", "war", "Spanish Conquest", 0.9),
    
    ("Pizarro Captures Atahualpa",
     "Francisco Pizarro captures the Inca emperor Atahualpa at Cajamarca with only 168 soldiers.",
     1532, "Cajamarca, Peru", "war", "Spanish Conquest", 0.85),
    
    ("Atahualpa Executed Despite Ransom",
     "Pizarro executes Atahualpa despite receiving an enormous ransom of gold and silver.",
     1533, "Cajamarca, Peru", "war", "Spanish Conquest", 0.75),
    
    ("Spanish Capture Cusco",
     "Spanish conquistadors capture the Inca capital Cusco, effectively ending Inca resistance.",
     1533, "Cusco, Peru", "war", "Spanish Conquest", 0.8),
    
    ("Columbian Exchange Transforms World",
     "The transfer of crops, animals, and diseases between hemispheres transforms global agriculture and demographics.",
     1500, "Atlantic Ocean", "discovery", "Columbian Exchange", 0.9),
    
    ("Potosí Silver Mining Begins",
     "Spanish discover the Potosí silver mountain; indigenous forced labor produces wealth that transforms global economy.",
     1545, "Potosí, Bolivia", "discovery", "Spanish Colonial", 0.8),
    
    ("Atlantic Slave Trade Intensifies",
     "The Atlantic slave trade expands dramatically to supply labor for sugar plantations in the Americas.",
     1550, "West Africa/Caribbean", "political", "Atlantic Slave Trade", 0.85),
    
    ("Las Casas Advocates for Indigenous Rights",
     "Bartolomé de las Casas publishes his account of Spanish atrocities, advocating for indigenous rights.",
     1552, "Seville, Spain", "cultural", "Spanish Colonial", 0.7),

    # ═══════════════════════════════════════════════════════════════════════
    # JAPAN: SENGOKU PERIOD AND UNIFICATION
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Ōnin War Begins Sengoku Period",
     "The Ōnin War begins, initiating Japan's century of civil war (Sengoku period).",
     1467, "Kyoto, Japan", "war", "Sengoku Japan", 0.75),
    
    ("Portuguese Introduce Firearms to Japan",
     "Portuguese traders introduce firearms to Japan, revolutionizing Japanese warfare.",
     1543, "Tanegashima, Japan", "discovery", "Sengoku Japan", 0.75),
    
    ("Francis Xavier Brings Christianity to Japan",
     "Jesuit missionary Francis Xavier arrives in Japan, beginning Christian missionary activity.",
     1549, "Kagoshima, Japan", "religious", "Sengoku Japan", 0.7),
    
    ("Oda Nobunaga Begins Unification",
     "Oda Nobunaga wins the Battle of Okehazama, beginning Japan's reunification under his rule.",
     1560, "Aichi, Japan", "war", "Sengoku Japan", 0.8),
    
    ("Nobunaga Destroys Buddhist Stronghold",
     "Nobunaga destroys the Enryaku-ji Buddhist monastery, breaking the power of warrior monks.",
     1571, "Mount Hiei, Japan", "war", "Sengoku Japan", 0.65),
    
    ("Battle of Nagashino — Firearms Dominance",
     "Nobunaga's massed firearms defeat the Takeda cavalry, demonstrating the new power of guns in warfare.",
     1575, "Nagashino, Japan", "war", "Sengoku Japan", 0.7),
    
    ("Honnō-ji Incident — Nobunaga Assassinated",
     "Oda Nobunaga is betrayed and killed by his general Akechi Mitsuhide at Honnō-ji temple.",
     1582, "Kyoto, Japan", "political", "Sengoku Japan", 0.75),
    
    ("Toyotomi Hideyoshi Unifies Japan",
     "Hideyoshi completes the unification of Japan, ending the Sengoku period.",
     1590, "Osaka, Japan", "political", "Sengoku Japan", 0.85),
    
    ("Hideyoshi Invades Korea",
     "Hideyoshi launches an invasion of Korea with 150,000 troops, devastating the peninsula before withdrawal.",
     1592, "Korea", "war", "Sengoku Japan", 0.75),
    
    ("Battle of Sekigahara",
     "Tokugawa Ieyasu defeats rival daimyo at Sekigahara, establishing Tokugawa supremacy.",
     1600, "Sekigahara, Japan", "war", "Tokugawa Japan", 0.85),
    
    ("Tokugawa Shogunate Established",
     "Tokugawa Ieyasu becomes shogun, beginning 250 years of Tokugawa rule and peace.",
     1603, "Edo (Tokyo), Japan", "political", "Tokugawa Japan", 0.85),
    
    ("Japan Expels Christians",
     "The Tokugawa shogunate bans Christianity and begins persecution of Japanese Christians.",
     1614, "Edo (Tokyo), Japan", "religious", "Tokugawa Japan", 0.7),
    
    ("Shimabara Rebellion",
     "Christian peasants and ronin rebel in Shimabara; the brutal suppression leads to Japan's isolation policy.",
     1638, "Shimabara, Japan", "war", "Tokugawa Japan", 0.7),
    
    ("Sakoku — Japan Closes to the World",
     "Japan implements sakoku (closed country) policy, restricting foreign contact to limited Dutch and Chinese trade.",
     1639, "Edo (Tokyo), Japan", "political", "Tokugawa Japan", 0.8),
]

# ────────────────────────────────────────────────────────────────────────────
# CAUSALITY LINKS
# Format: (cause_title_substr, effect_title_substr, link_type, strength, description)
# Valid link_types: direct, indirect, contributing, disputed
# ────────────────────────────────────────────────────────────────────────────

LINK_TYPE_MAP = {
    'leads_to': 'indirect',
    'enables': 'contributing',
    'causes': 'direct',
    'context': 'contributing',
    'direct': 'direct',
    'indirect': 'indirect',
    'contributing': 'contributing',
    'disputed': 'disputed',
}

NEW_CAUSALITY_LINKS = [
    # Renaissance connections
    ("Brunelleschi Completes", "Donatello's David", "context", 0.6,
     "Florentine Renaissance masters worked together"),
    ("Donatello's David", "Michelangelo Completes David", "enables", 0.7,
     "Donatello's David inspired Michelangelo's interpretation"),
    ("Leonardo Paints The Last", "Raphael Completes", "enables", 0.6,
     "Leonardo's innovations influenced younger Renaissance masters"),
    ("Michelangelo Completes Sistine", "Palladio Publishes", "context", 0.5,
     "High Renaissance achievements enabled later architectural developments"),
    
    # Reformation chain
    ("Luther Posts Ninety-Five", "Diet of Worms", "leads_to", 0.9,
     "Luther's theses led to his confrontation with imperial authority"),
    ("Diet of Worms", "Peasants' War", "enables", 0.7,
     "Reformation ideas contributed to peasant uprising"),
    ("Luther Posts Ninety-Five", "Calvin Establishes Geneva", "enables", 0.8,
     "Luther's Reformation inspired Calvin's Reformed movement"),
    ("Luther Posts Ninety-Five", "Henry VIII Breaks", "enables", 0.6,
     "Reformation precedent enabled Henry's break with Rome"),
    ("Council of Trent Begins", "St. Bartholomew's Day", "context", 0.6,
     "Counter-Reformation intensified Catholic-Protestant conflict"),
    ("Peace of Augsburg", "Defenestration of Prague", "leads_to", 0.7,
     "Augsburg settlement's breakdown led to Thirty Years' War"),
    ("Defenestration of Prague", "Battle of White Mountain", "leads_to", 0.9,
     "Prague revolt sparked Bohemian phase of war"),
    ("Battle of White Mountain", "Gustavus Adolphus Enters", "leads_to", 0.8,
     "Protestant defeats drew Swedish intervention"),
    ("Gustavus Adolphus Enters", "Peace of Westphalia", "leads_to", 0.8,
     "Prolonged war eventually necessitated comprehensive peace"),
    ("St. Bartholomew's Day", "Edict of Nantes", "leads_to", 0.8,
     "Wars of Religion exhaustion led to tolerance edict"),
    ("Edict of Nantes", "Revocation of Edict of Nantes", "leads_to", 0.7,
     "Nantes policy was eventually reversed by Louis XIV"),
    
    # Ottoman connections
    ("Mehmed II Conquers Constantinople", "Selim I Conquers Mamluk", "enables", 0.7,
     "Ottoman power after Constantinople enabled further expansion"),
    ("Selim I Conquers Mamluk", "Suleiman the Magnificent", "leads_to", 0.8,
     "Selim's conquests set stage for Suleiman's reign"),
    ("Suleiman the Magnificent", "Siege of Vienna (1529)", "leads_to", 0.9,
     "Suleiman personally led Vienna siege"),
    ("Suleiman the Magnificent", "Süleymaniye Mosque", "leads_to", 0.9,
     "Suleiman commissioned the mosque"),
    ("Battle of Lepanto", "Battle of Vienna (1683)", "context", 0.5,
     "Christian victories marked Ottoman naval and land limits"),
    ("Battle of Vienna (1683)", "Treaty of Karlowitz", "leads_to", 0.9,
     "Vienna defeat led to Ottoman territorial losses"),
    
    # Mughal connections
    ("Babur Founds Mughal", "Humayun Loses", "leads_to", 0.8,
     "Babur's unstable empire nearly collapsed under successor"),
    ("Humayun Loses", "Akbar the Great Begins", "leads_to", 0.9,
     "Humayun's reconquest enabled Akbar's reign"),
    ("Akbar the Great Begins", "Akbar Abolishes Jizya", "leads_to", 0.9,
     "Akbar implemented religious tolerance"),
    ("Akbar Abolishes Jizya", "Akbar Creates Din-i", "leads_to", 0.8,
     "Tolerance policy led to syncretic religious experiment"),
    ("Shah Jahan Begins", "Taj Mahal Completed", "leads_to", 0.95,
     "Shah Jahan commissioned the Taj Mahal"),
    ("Aurangzeb Becomes Emperor", "Aurangzeb Reimposses Jizya", "leads_to", 0.9,
     "Aurangzeb reversed Akbar's tolerance"),
    ("Aurangzeb Reimposses Jizya", "Maratha Wars Begin", "enables", 0.7,
     "Religious policy alienated Hindu subjects"),
    ("Maratha Wars Begin", "Death of Aurangzeb", "leads_to", 0.7,
     "Endless wars exhausted the empire"),
    
    # China connections
    ("Zheng He's First Voyage", "Zheng He Reaches East Africa", "leads_to", 0.9,
     "Early voyages led to further expeditions"),
    ("Zheng He Reaches East Africa", "Ming Ends Maritime", "leads_to", 0.8,
     "Court factions eventually ended the voyages"),
    ("Yongle Emperor Moves Capital", "Construction of Great Wall", "context", 0.6,
     "Beijing capital increased northern defense priority"),
    ("Li Zicheng Captures Beijing", "Qing Dynasty Established", "leads_to", 0.95,
     "Ming collapse enabled Qing takeover"),
    ("Qing Dynasty Established", "Kangxi Emperor Begins", "leads_to", 0.9,
     "Qing consolidation under Kangxi"),
    ("Kangxi Emperor Begins", "Qing Conquers Taiwan", "leads_to", 0.8,
     "Kangxi completed conquest of Ming loyalists"),
    
    # Scientific Revolution chain
    ("Copernicus Publishes Heliocentric", "Tycho Brahe's Observatory", "enables", 0.7,
     "Copernican theory motivated precise observations"),
    ("Tycho Brahe's Observatory", "Kepler's Laws of Planetary", "leads_to", 0.9,
     "Tycho's data enabled Kepler's laws"),
    ("Copernicus Publishes Heliocentric", "Giordano Bruno Burned", "leads_to", 0.7,
     "Bruno extended Copernican ideas dangerously"),
    ("Kepler's Laws of Planetary", "Galileo Observes Jupiter", "context", 0.7,
     "Both provided evidence for heliocentrism"),
    ("Galileo Observes Jupiter", "Galileo Condemned by Inquisition", "leads_to", 0.9,
     "Galileo's advocacy led to his condemnation"),
    ("Descartes Publishes Discourse", "Newton Publishes Principia", "enables", 0.7,
     "Cartesian methods influenced Newton"),
    ("Kepler's Laws of Planetary", "Newton Publishes Principia", "enables", 0.9,
     "Newton unified Kepler's laws with gravitation"),
    ("Galileo Observes Jupiter", "Newton Publishes Principia", "enables", 0.7,
     "Galileo's mechanics contributed to Newton's synthesis"),
    ("Newton Publishes Principia", "Leibniz Publishes Calculus", "context", 0.8,
     "Priority dispute over calculus invention"),
    
    # Enlightenment connections
    ("Newton Publishes Principia", "Locke Publishes Two Treatises", "context", 0.6,
     "Scientific revolution influenced political thought"),
    ("Locke Publishes Two Treatises", "Montesquieu Publishes Spirit", "enables", 0.8,
     "Locke's ideas influenced Montesquieu"),
    ("Locke Publishes Two Treatises", "Voltaire Returns from English", "enables", 0.7,
     "Locke influenced Voltaire's English observations"),
    ("Voltaire Returns from English", "Diderot's Encyclopédie", "enables", 0.7,
     "Voltaire contributed to Enlightenment project"),
    ("Montesquieu Publishes Spirit", "Rousseau Publishes Social", "context", 0.7,
     "Enlightenment political theory developed"),
    ("Diderot's Encyclopédie", "Adam Smith Publishes Wealth", "context", 0.5,
     "Encyclopédie spread empirical approach"),
    
    # Americas connections
    ("Aztec Empire Founded", "Aztec Flower Wars", "leads_to", 0.8,
     "Empire expansion led to ritual war system"),
    ("Aztec Flower Wars", "Fall of Tenochtitlan", "enables", 0.7,
     "Flower Wars alienated subjects who joined Cortés"),
    ("Inca Empire Rapid Expansion", "Machu Picchu Constructed", "leads_to", 0.8,
     "Imperial resources enabled construction"),
    ("Inca Civil War", "Pizarro Captures Atahualpa", "enables", 0.9,
     "Civil war weakened Inca resistance"),
    ("Cortés Arrives in Mexico", "La Noche Triste", "leads_to", 0.9,
     "Spanish presence led to Aztec counterattack"),
    ("La Noche Triste", "Fall of Tenochtitlan", "leads_to", 0.9,
     "Cortés regrouped and besieged the city"),
    ("Pizarro Captures Atahualpa", "Atahualpa Executed", "leads_to", 0.95,
     "Pizarro executed his captive"),
    ("Atahualpa Executed", "Spanish Capture Cusco", "leads_to", 0.9,
     "Without emperor, Inca resistance collapsed"),
    ("Fall of Tenochtitlan", "Columbian Exchange", "leads_to", 0.8,
     "Conquest accelerated biological exchange"),
    ("Columbian Exchange", "Atlantic Slave Trade", "enables", 0.8,
     "New World plantations drove slave trade"),
    ("Potosí Silver Mining", "Atlantic Slave Trade", "enables", 0.7,
     "Colonial economy drove labor demand"),
    
    # Japan connections
    ("Ōnin War Begins Sengoku", "Portuguese Introduce Firearms", "context", 0.5,
     "Civil war period when firearms arrived"),
    ("Portuguese Introduce Firearms", "Battle of Nagashino", "enables", 0.9,
     "Firearms revolutionized Japanese warfare"),
    ("Oda Nobunaga Begins Unification", "Nobunaga Destroys Buddhist", "leads_to", 0.8,
     "Nobunaga broke military power of monasteries"),
    ("Nobunaga Destroys Buddhist", "Battle of Nagashino", "context", 0.6,
     "Nobunaga's innovative tactics"),
    ("Battle of Nagashino", "Honnō-ji Incident", "context", 0.5,
     "Nobunaga's dominance led to betrayal"),
    ("Honnō-ji Incident", "Toyotomi Hideyoshi Unifies", "leads_to", 0.9,
     "Hideyoshi avenged and succeeded Nobunaga"),
    ("Toyotomi Hideyoshi Unifies", "Hideyoshi Invades Korea", "leads_to", 0.9,
     "Unified Japan launched foreign war"),
    ("Hideyoshi Invades Korea", "Battle of Sekigahara", "enables", 0.6,
     "Korean war aftermath created instability"),
    ("Battle of Sekigahara", "Tokugawa Shogunate Established", "leads_to", 0.95,
     "Sekigahara victory enabled shogunate"),
    ("Francis Xavier Brings Christianity", "Japan Expels Christians", "leads_to", 0.8,
     "Christian spread led to persecution"),
    ("Japan Expels Christians", "Shimabara Rebellion", "leads_to", 0.9,
     "Persecution sparked Christian rebellion"),
    ("Shimabara Rebellion", "Sakoku — Japan Closes", "leads_to", 0.95,
     "Rebellion led to isolation policy"),
    
    # Cross-regional connections
    ("Mehmed II Conquers Constantinople", "Portuguese Introduce Firearms", "context", 0.4,
     "Ottoman expansion drove European search for alternatives"),
    ("Peace of Westphalia", "Locke Publishes Two Treatises", "enables", 0.6,
     "Religious settlement enabled secular political theory"),
    ("Galileo Condemned by Inquisition", "Royal Society Founded", "context", 0.5,
     "Catholic restrictions pushed science to Protestant countries"),
]


def generate_slug(title: str) -> str:
    """Generate a URL-friendly slug from title."""
    base_slug = slugify(title)
    return base_slug[:80]


def compute_date_fields(year: int) -> dict:
    """Compute date fields from year (positive = CE)."""
    date_earliest = f"{year:04d}-01-01"
    date_latest = f"{year:04d}-12-31"
    
    return {
        'date_earliest': date_earliest,
        'date_latest': date_latest,
        'is_bce': False,
        'year_approx': year
    }


async def insert_events(conn) -> dict:
    """Insert new events and return mapping of title substrings to UUIDs."""
    event_map = {}
    inserted = 0
    skipped = 0
    
    for (title, description, year, geo_modern, event_category, geo_era_label, importance_score) in NEW_EVENTS:
        slug = generate_slug(title)
        
        # Check if event already exists
        existing = await conn.fetchval(
            "SELECT id FROM events WHERE slug = $1 OR title = $2",
            slug, title
        )
        
        if existing:
            event_map[title] = existing
            skipped += 1
            continue
        
        date_fields = compute_date_fields(year)
        
        event_id = await conn.fetchval(f"""
            INSERT INTO events (
                slug, title, article_summary,
                date_earliest, date_latest, is_bce, year_approx,
                geo_modern, event_category, geo_era_label,
                importance_score, created_by, review_status
            ) VALUES (
                $1, $2, $3,
                '{date_fields['date_earliest']}'::date, 
                '{date_fields['date_latest']}'::date, 
                $4, $5,
                $6, $7, $8,
                $9, 'enrich_early_modern.py', 'approved'
            ) RETURNING id
        """,
            slug, title, description,
            date_fields['is_bce'], date_fields['year_approx'],
            geo_modern, event_category, geo_era_label,
            importance_score
        )
        
        event_map[title] = event_id
        inserted += 1
    
    print(f"Events: {inserted} inserted, {skipped} already existed")
    return event_map


async def find_event_by_title_substr(conn, substr: str) -> Optional[str]:
    """Find an event ID by title substring."""
    result = await conn.fetchval(
        "SELECT id FROM events WHERE title ILIKE $1 LIMIT 1",
        f"%{substr}%"
    )
    return result


async def insert_causality_links(conn) -> int:
    """Insert causality links between events."""
    inserted = 0
    skipped = 0
    
    for (cause_substr, effect_substr, link_type_raw, strength, description) in NEW_CAUSALITY_LINKS:
        cause_id = await find_event_by_title_substr(conn, cause_substr)
        effect_id = await find_event_by_title_substr(conn, effect_substr)
        
        if not cause_id or not effect_id:
            print(f"  Skip link: '{cause_substr}' -> '{effect_substr}' (event not found)")
            skipped += 1
            continue
        
        # Prevent self-referencing links
        if cause_id == effect_id:
            print(f"  Skip link: '{cause_substr}' -> '{effect_substr}' (self-reference)")
            skipped += 1
            continue
        
        # Check if link already exists
        existing = await conn.fetchval(
            "SELECT id FROM causality_links WHERE cause_event_id = $1 AND effect_event_id = $2",
            cause_id, effect_id
        )
        
        if existing:
            skipped += 1
            continue
        
        link_type = LINK_TYPE_MAP.get(link_type_raw, 'indirect')
        
        await conn.execute("""
            INSERT INTO causality_links (
                cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status
            ) VALUES ($1, $2, $3, $4, $5, 'enrich_early_modern.py', 'approved')
        """, cause_id, effect_id, link_type, strength, description)
        
        inserted += 1
    
    print(f"Causality links: {inserted} inserted, {skipped} skipped")
    return inserted


async def compute_network_y(conn):
    """Compute network_y for affected events using BFS from causality graph."""
    print("Computing network_y positions...")
    
    events = await conn.fetch("""
        SELECT e.id, e.year_approx, e.importance_score
        FROM events e
        WHERE e.id IN (
            SELECT DISTINCT cause_event_id FROM causality_links
            UNION
            SELECT DISTINCT effect_event_id FROM causality_links
        )
    """)
    
    links = await conn.fetch("SELECT cause_event_id, effect_event_id FROM causality_links")
    
    children = defaultdict(list)
    parents = defaultdict(list)
    for link in links:
        children[str(link['cause_event_id'])].append(str(link['effect_event_id']))
        parents[str(link['effect_event_id'])].append(str(link['cause_event_id']))
    
    event_ids = {str(e['id']) for e in events}
    event_importance = {str(e['id']): e['importance_score'] or 0.5 for e in events}
    
    roots = [eid for eid in event_ids if eid not in parents or not parents[eid]]
    
    depth = {}
    sign = {}
    queue = deque()
    
    for i, root in enumerate(roots):
        depth[root] = 0
        sign[root] = 1 if i % 2 == 0 else -1
        queue.append(root)
    
    while queue:
        node = queue.popleft()
        for child in children.get(node, []):
            if child not in depth:
                depth[child] = depth[node] + 1
                sign[child] = sign.get(node, 1)
                queue.append(child)
    
    max_depth_y = [0, 80, 150, 210, 260, 300]
    
    updates = []
    for eid in event_ids:
        if eid in depth:
            d = min(depth[eid], len(max_depth_y) - 1)
            base_y = max_depth_y[d]
            s = sign.get(eid, 1)
            importance = event_importance.get(eid, 0.5)
            y = s * (base_y + (importance - 0.5) * 20)
            updates.append((y, uuid.UUID(eid)))
        else:
            s = 1 if hash(eid) % 2 == 0 else -1
            updates.append((s * ISOLATED_NUDGE, uuid.UUID(eid)))
    
    await conn.executemany(
        "UPDATE events SET network_y = $1 WHERE id = $2",
        updates
    )
    
    print(f"Updated network_y for {len(updates)} events")


async def main():
    print("=" * 60)
    print("Chronicle Database Enrichment - Early Modern Period (1400-1800)")
    print("=" * 60)
    
    conn = await asyncpg.connect(DB_URL)
    
    try:
        before_count = await conn.fetchval("SELECT COUNT(*) FROM events")
        before_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
        
        # Count for this period before
        before_period = await conn.fetchval(
            "SELECT COUNT(*) FROM events WHERE year_approx BETWEEN 1400 AND 1799"
        )
        
        print(f"\nBefore: {before_count} total events, {before_links} causality links")
        print(f"Events in 1400-1800 CE: {before_period}")
        
        print("\n--- Inserting Events ---")
        await insert_events(conn)
        
        print("\n--- Inserting Causality Links ---")
        await insert_causality_links(conn)
        
        print("\n--- Computing Network Layout ---")
        await compute_network_y(conn)
        
        after_count = await conn.fetchval("SELECT COUNT(*) FROM events")
        after_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
        after_period = await conn.fetchval(
            "SELECT COUNT(*) FROM events WHERE year_approx BETWEEN 1400 AND 1799"
        )
        
        print(f"\nAfter: {after_count} events (+{after_count - before_count}), "
              f"{after_links} causality links (+{after_links - before_links})")
        print(f"Events in 1400-1800 CE: {after_period} (+{after_period - before_period})")
        
        print("\n--- Events by Era/Theme ---")
        era_counts = await conn.fetch("""
            SELECT geo_era_label, COUNT(*) as cnt
            FROM events
            WHERE created_by = 'enrich_early_modern.py'
            GROUP BY geo_era_label
            ORDER BY cnt DESC
        """)
        for row in era_counts:
            print(f"  {row['geo_era_label'] or 'Unknown'}: {row['cnt']}")
        
        print("\n--- Events by Century ---")
        century_counts = await conn.fetch("""
            SELECT 
              CASE 
                WHEN year_approx BETWEEN 1400 AND 1499 THEN '1400s'
                WHEN year_approx BETWEEN 1500 AND 1599 THEN '1500s'
                WHEN year_approx BETWEEN 1600 AND 1699 THEN '1600s'
                WHEN year_approx BETWEEN 1700 AND 1799 THEN '1700s'
              END as century,
              COUNT(*) as events
            FROM events 
            WHERE year_approx BETWEEN 1400 AND 1799
            GROUP BY 1 ORDER BY 1
        """)
        for row in century_counts:
            print(f"  {row['century']}: {row['events']}")
        
    finally:
        await conn.close()
    
    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
