"""
Country pages API endpoints.

GET /api/countries          — list all distinct countries with event counts
GET /api/countries/{country} — country detail: events, people, era breakdown
"""
from __future__ import annotations

import re
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, EventPerson, Person

router = APIRouter(prefix="/api/countries", tags=["countries"])


# ─────────────────────────────────────────────────────────────────────────────
# Country extraction from geo_modern strings like "Rome, Italy"
# ─────────────────────────────────────────────────────────────────────────────

# Common geo_modern patterns: "City, Country" or "City, State, Country"
# Edge cases to handle: "Petrograd (Saint Petersburg), Russia"

# Map of known suffixes/names that are NOT countries (US states, regions, etc.)
_NOT_COUNTRIES = {
    "North Carolina", "South Carolina", "Virginia", "Massachusetts",
    "Pennsylvania", "New York", "California", "Texas", "Florida",
    "England", "Scotland", "Wales", "Northern Ireland",
}

# Map sub-national regions to their country
_REGION_TO_COUNTRY = {
    "North Carolina": "United States",
    "South Carolina": "United States",
    "Virginia": "United States",
    "Massachusetts": "United States",
    "Pennsylvania": "United States",
    "New York": "United States",
    "California": "United States",
    "Texas": "United States",
    "Florida": "United States",
    "Hawaii": "United States",
    "Alaska": "United States",
    "England": "United Kingdom",
    "Scotland": "United Kingdom",
    "Wales": "United Kingdom",
    "Northern Ireland": "United Kingdom",
    "Bavaria": "Germany",
    "Catalonia": "Spain",
    "Normandy": "France",
    "Provence": "France",
    "Tuscany": "Italy",
    "Lombardy": "Italy",
    "Sicily": "Italy",
    "Sardinia": "Italy",
    "Andalusia": "Spain",
    "Quebec": "Canada",
    "Ontario": "Canada",
    "British Columbia": "Canada",
    "Michigan": "United States",
    "Ohio": "United States",
    "Illinois": "United States",
    "Georgia": "United States",
    "Maryland": "United States",
    "Connecticut": "United States",
    "New Jersey": "United States",
    "Tennessee": "United States",
    "Louisiana": "United States",
    "Mississippi": "United States",
    "Alabama": "United States",
    "Kentucky": "United States",
    "Indiana": "United States",
    "Missouri": "United States",
    "Iowa": "United States",
    "Minnesota": "United States",
    "Wisconsin": "United States",
    "Oregon": "United States",
    "Washington": "United States",
    "Colorado": "United States",
    "Arizona": "United States",
    "New Mexico": "United States",
    "Nevada": "United States",
    "Utah": "United States",
    "Montana": "United States",
    "Idaho": "United States",
    "Wyoming": "United States",
    "Nebraska": "United States",
    "Kansas": "United States",
    "Oklahoma": "United States",
    "Arkansas": "United States",
    "West Virginia": "United States",
    "Maine": "United States",
    "Vermont": "United States",
    "New Hampshire": "United States",
    "Rhode Island": "United States",
    "Delaware": "United States",
    "North Dakota": "United States",
    "South Dakota": "United States",
    # Indian states
    "Maharashtra": "India",
    "Punjab": "India",
    "Henan": "China",
    "Rajasthan": "India",
    "Gujarat": "India",
    "Tamil Nadu": "India",
    "Karnataka": "India",
    "Kerala": "India",
    "Uttar Pradesh": "India",
    "Madhya Pradesh": "India",
    "Bihar": "India",
    "West Bengal": "India",
    "Odisha": "India",
    "Andhra Pradesh": "India",
    "Telangana": "India",
    # Chinese provinces
    "Henan Province": "China",
    "Hubei": "China",
    "Sichuan": "China",
    "Yunnan": "China",
    "Shaanxi": "China",
    "Shandong": "China",
    "Guangdong": "China",
    "Jiangsu": "China",
    "Zhejiang": "China",
    # Ethiopian regions
    "Tigray": "Ethiopia",
    "Amhara": "Ethiopia",
    # Japanese prefectures
    "Aichi": "Japan",
    "Osaka": "Japan",
    "Kyoto": "Japan",
    "Nara": "Japan",
    # Other sub-national
    "Pas-de-Calais": "France",
    "Siem Reap": "Cambodia",
    "Áncash": "Peru",
    "Araucanía": "Chile",
    "Ardèche": "France",
    "Alagoas": "Brazil",
    "Amhara Region": "Ethiopia",
}

# Known single-word locations that are countries
_SINGLE_WORD_COUNTRIES = {
    "China", "Japan", "India", "Korea", "Egypt", "Iraq", "Iran",
    "Syria", "Israel", "Jordan", "Lebanon", "Libya", "Morocco",
    "Tunisia", "Algeria", "Ethiopia", "Kenya", "Nigeria", "Ghana",
    "Mali", "Chad", "Sudan", "Somalia", "Tanzania", "Uganda",
    "Mozambique", "Zimbabwe", "Zambia", "Botswana", "Namibia",
    "Madagascar", "Cuba", "Haiti", "Jamaica", "Mexico", "Peru",
    "Chile", "Brazil", "Argentina", "Colombia", "Venezuela",
    "Bolivia", "Paraguay", "Uruguay", "Ecuador", "Panama",
    "Guatemala", "Honduras", "Nicaragua", "Belize", "Guyana",
    "Suriname", "Fiji", "Samoa", "Tonga", "Nauru", "Palau",
    "Mongolia", "Nepal", "Bhutan", "Myanmar", "Thailand",
    "Vietnam", "Cambodia", "Laos", "Malaysia", "Singapore",
    "Indonesia", "Philippines", "Taiwan", "Afghanistan",
    "Pakistan", "Bangladesh", "Kazakhstan", "Uzbekistan",
    "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Azerbaijan",
    "Georgia", "Armenia", "Russia", "Ukraine", "Belarus",
    "Poland", "Romania", "Bulgaria", "Hungary", "Austria",
    "Switzerland", "Belgium", "Netherlands", "Denmark",
    "Norway", "Sweden", "Finland", "Iceland", "Ireland",
    "Portugal", "Spain", "Italy", "Germany", "France",
    "Greece", "Turkey", "Cyprus", "Malta", "Luxembourg",
    "Liechtenstein", "Monaco", "Andorra", "Montenegro",
    "Serbia", "Croatia", "Slovenia", "Kosovo", "Albania",
    "Macedonia", "Bosnia", "Slovakia", "Czechia",
}

# Aliases
_COUNTRY_ALIASES = {
    "USA": "United States",
    "U.S.A.": "United States",
    "U.S.": "United States",
    "US": "United States",
    "UK": "United Kingdom",
    "U.K.": "United Kingdom",
    "Britain": "United Kingdom",
    "Great Britain": "United Kingdom",
    "South Korea": "South Korea",
    "North Korea": "North Korea",
    "Czech Republic": "Czechia",
    "The Netherlands": "Netherlands",
    "Holland": "Netherlands",
    "Persia": "Iran",
    "Burma": "Myanmar",
    "Siam": "Thailand",
    "Ceylon": "Sri Lanka",
    "Rhodesia": "Zimbabwe",
    "Zaire": "Democratic Republic of the Congo",
    "Ottoman Empire": "Turkey",
    "Byzantium": "Turkey",
    "Byzantine Empire": "Turkey",
    "Prussia": "Germany",
    "West Germany": "Germany",
    "East Germany": "Germany",
    "Soviet Union": "Russia",
    "USSR": "Russia",
    "Judea": "Israel",
    "Palestine": "Palestine",
    "Mesopotamia": "Iraq",
    "Babylon": "Iraq",
    "Assyria": "Iraq",
    "Gaul": "France",
    "Hispania": "Spain",
    "Roman Republic": "Italy",
    "Roman Empire": "Italy",
    "Carthage": "Tunisia",
    "Nubia": "Sudan",
    "Abyssinia": "Ethiopia",
    "Sumer": "Iraq",
    "New Zealand": "New Zealand",
    "South Africa": "South Africa",
    "Saudi Arabia": "Saudi Arabia",
    "Sri Lanka": "Sri Lanka",
    "Costa Rica": "Costa Rica",
    "El Salvador": "El Salvador",
    "Dominican Republic": "Dominican Republic",
    "Trinidad and Tobago": "Trinidad and Tobago",
    "Papua New Guinea": "Papua New Guinea",
    "East Timor": "East Timor",
    "Timor-Leste": "East Timor",
    "North Macedonia": "North Macedonia",
    "Bosnia and Herzegovina": "Bosnia and Herzegovina",
    "Bosnia": "Bosnia and Herzegovina",
    "United Arab Emirates": "United Arab Emirates",
    "UAE": "United Arab Emirates",
    "Democratic Republic of the Congo": "Democratic Republic of the Congo",
    "Republic of the Congo": "Republic of the Congo",
    "Ivory Coast": "Ivory Coast",
    "Côte d'Ivoire": "Ivory Coast",
    "Burkina Faso": "Burkina Faso",
    "Sierra Leone": "Sierra Leone",
    "Central African Republic": "Central African Republic",
    "Equatorial Guinea": "Equatorial Guinea",
    "Guinea-Bissau": "Guinea-Bissau",
    "Guinea": "Guinea",
    "Senegal": "Senegal",
    "Cameroon": "Cameroon",
    "Togo": "Togo",
    "Benin": "Benin",
    "Niger": "Niger",
    "Eritrea": "Eritrea",
    "Djibouti": "Djibouti",
    "Rwanda": "Rwanda",
    "Burundi": "Burundi",
    "Malawi": "Malawi",
    "Angola": "Angola",
    "Gabon": "Gabon",
    "Lesotho": "Lesotho",
    "Eswatini": "Eswatini",
    "Swaziland": "Eswatini",
    "Comoros": "Comoros",
    "Mauritius": "Mauritius",
    "Seychelles": "Seychelles",
    "Cape Verde": "Cape Verde",
    "São Tomé and Príncipe": "São Tomé and Príncipe",
    "Gambia": "Gambia",
    "Liberia": "Liberia",
    "Mauritania": "Mauritania",
    "Oman": "Oman",
    "Yemen": "Yemen",
    "Qatar": "Qatar",
    "Bahrain": "Bahrain",
    "Kuwait": "Kuwait",
    "Maldives": "Maldives",
    "Brunei": "Brunei",
    "Vatican City": "Vatican City",
    "San Marino": "San Marino",
    "United States": "United States",
    "United Kingdom": "United Kingdom",
    "South Sudan": "South Sudan",
}

# Country to flag emoji mapping
COUNTRY_FLAGS: dict[str, str] = {
    "Afghanistan": "\U0001F1E6\U0001F1EB", "Albania": "\U0001F1E6\U0001F1F1",
    "Algeria": "\U0001F1E9\U0001F1FF", "Andorra": "\U0001F1E6\U0001F1E9",
    "Angola": "\U0001F1E6\U0001F1F4", "Argentina": "\U0001F1E6\U0001F1F7",
    "Armenia": "\U0001F1E6\U0001F1F2", "Australia": "\U0001F1E6\U0001F1FA",
    "Austria": "\U0001F1E6\U0001F1F9", "Azerbaijan": "\U0001F1E6\U0001F1FF",
    "Bahrain": "\U0001F1E7\U0001F1ED", "Bangladesh": "\U0001F1E7\U0001F1E9",
    "Belarus": "\U0001F1E7\U0001F1FE", "Belgium": "\U0001F1E7\U0001F1EA",
    "Belize": "\U0001F1E7\U0001F1FF", "Benin": "\U0001F1E7\U0001F1EF",
    "Bhutan": "\U0001F1E7\U0001F1F9", "Bolivia": "\U0001F1E7\U0001F1F4",
    "Bosnia and Herzegovina": "\U0001F1E7\U0001F1E6",
    "Botswana": "\U0001F1E7\U0001F1FC", "Brazil": "\U0001F1E7\U0001F1F7",
    "Brunei": "\U0001F1E7\U0001F1F3", "Bulgaria": "\U0001F1E7\U0001F1EC",
    "Burkina Faso": "\U0001F1E7\U0001F1EB", "Burundi": "\U0001F1E7\U0001F1EE",
    "Cambodia": "\U0001F1F0\U0001F1ED", "Cameroon": "\U0001F1E8\U0001F1F2",
    "Canada": "\U0001F1E8\U0001F1E6", "Cape Verde": "\U0001F1E8\U0001F1FB",
    "Central African Republic": "\U0001F1E8\U0001F1EB",
    "Chad": "\U0001F1F9\U0001F1E9", "Chile": "\U0001F1E8\U0001F1F1",
    "China": "\U0001F1E8\U0001F1F3", "Colombia": "\U0001F1E8\U0001F1F4",
    "Comoros": "\U0001F1F0\U0001F1F2", "Costa Rica": "\U0001F1E8\U0001F1F7",
    "Croatia": "\U0001F1ED\U0001F1F7", "Cuba": "\U0001F1E8\U0001F1FA",
    "Cyprus": "\U0001F1E8\U0001F1FE", "Czechia": "\U0001F1E8\U0001F1FF",
    "Democratic Republic of the Congo": "\U0001F1E8\U0001F1E9",
    "Denmark": "\U0001F1E9\U0001F1F0", "Djibouti": "\U0001F1E9\U0001F1EF",
    "Dominican Republic": "\U0001F1E9\U0001F1F4",
    "East Timor": "\U0001F1F9\U0001F1F1", "Ecuador": "\U0001F1EA\U0001F1E8",
    "Egypt": "\U0001F1EA\U0001F1EC", "El Salvador": "\U0001F1F8\U0001F1FB",
    "Equatorial Guinea": "\U0001F1EC\U0001F1F6",
    "Eritrea": "\U0001F1EA\U0001F1F7", "Eswatini": "\U0001F1F8\U0001F1FF",
    "Ethiopia": "\U0001F1EA\U0001F1F9", "Fiji": "\U0001F1EB\U0001F1EF",
    "Finland": "\U0001F1EB\U0001F1EE", "France": "\U0001F1EB\U0001F1F7",
    "Gabon": "\U0001F1EC\U0001F1E6", "Gambia": "\U0001F1EC\U0001F1F2",
    "Georgia": "\U0001F1EC\U0001F1EA", "Germany": "\U0001F1E9\U0001F1EA",
    "Ghana": "\U0001F1EC\U0001F1ED", "Greece": "\U0001F1EC\U0001F1F7",
    "Guatemala": "\U0001F1EC\U0001F1F9", "Guinea": "\U0001F1EC\U0001F1F3",
    "Guinea-Bissau": "\U0001F1EC\U0001F1FC", "Guyana": "\U0001F1EC\U0001F1FE",
    "Haiti": "\U0001F1ED\U0001F1F9", "Honduras": "\U0001F1ED\U0001F1F3",
    "Hungary": "\U0001F1ED\U0001F1FA", "Iceland": "\U0001F1EE\U0001F1F8",
    "India": "\U0001F1EE\U0001F1F3", "Indonesia": "\U0001F1EE\U0001F1E9",
    "Iran": "\U0001F1EE\U0001F1F7", "Iraq": "\U0001F1EE\U0001F1F6",
    "Ireland": "\U0001F1EE\U0001F1EA", "Israel": "\U0001F1EE\U0001F1F1",
    "Italy": "\U0001F1EE\U0001F1F9", "Ivory Coast": "\U0001F1E8\U0001F1EE",
    "Jamaica": "\U0001F1EF\U0001F1F2", "Japan": "\U0001F1EF\U0001F1F5",
    "Jordan": "\U0001F1EF\U0001F1F4", "Kazakhstan": "\U0001F1F0\U0001F1FF",
    "Kenya": "\U0001F1F0\U0001F1EA", "Kosovo": "\U0001F1FD\U0001F1F0",
    "Kuwait": "\U0001F1F0\U0001F1FC", "Kyrgyzstan": "\U0001F1F0\U0001F1EC",
    "Laos": "\U0001F1F1\U0001F1E6", "Lebanon": "\U0001F1F1\U0001F1E7",
    "Lesotho": "\U0001F1F1\U0001F1F8", "Liberia": "\U0001F1F1\U0001F1F7",
    "Libya": "\U0001F1F1\U0001F1FE", "Liechtenstein": "\U0001F1F1\U0001F1EE",
    "Luxembourg": "\U0001F1F1\U0001F1FA", "Madagascar": "\U0001F1F2\U0001F1EC",
    "Malawi": "\U0001F1F2\U0001F1FC", "Malaysia": "\U0001F1F2\U0001F1FE",
    "Maldives": "\U0001F1F2\U0001F1FB", "Mali": "\U0001F1F2\U0001F1F1",
    "Malta": "\U0001F1F2\U0001F1F9", "Mauritania": "\U0001F1F2\U0001F1F7",
    "Mauritius": "\U0001F1F2\U0001F1FA", "Mexico": "\U0001F1F2\U0001F1FD",
    "Moldova": "\U0001F1F2\U0001F1E9", "Monaco": "\U0001F1F2\U0001F1E8",
    "Mongolia": "\U0001F1F2\U0001F1F3", "Montenegro": "\U0001F1F2\U0001F1EA",
    "Morocco": "\U0001F1F2\U0001F1E6", "Mozambique": "\U0001F1F2\U0001F1FF",
    "Myanmar": "\U0001F1F2\U0001F1F2", "Namibia": "\U0001F1F3\U0001F1E6",
    "Nauru": "\U0001F1F3\U0001F1F7", "Nepal": "\U0001F1F3\U0001F1F5",
    "Netherlands": "\U0001F1F3\U0001F1F1", "New Zealand": "\U0001F1F3\U0001F1FF",
    "Nicaragua": "\U0001F1F3\U0001F1EE", "Niger": "\U0001F1F3\U0001F1EA",
    "Nigeria": "\U0001F1F3\U0001F1EC", "North Korea": "\U0001F1F0\U0001F1F5",
    "North Macedonia": "\U0001F1F2\U0001F1F0", "Norway": "\U0001F1F3\U0001F1F4",
    "Oman": "\U0001F1F4\U0001F1F2", "Pakistan": "\U0001F1F5\U0001F1F0",
    "Palau": "\U0001F1F5\U0001F1FC", "Palestine": "\U0001F1F5\U0001F1F8",
    "Panama": "\U0001F1F5\U0001F1E6", "Papua New Guinea": "\U0001F1F5\U0001F1EC",
    "Paraguay": "\U0001F1F5\U0001F1FE", "Peru": "\U0001F1F5\U0001F1EA",
    "Philippines": "\U0001F1F5\U0001F1ED", "Poland": "\U0001F1F5\U0001F1F1",
    "Portugal": "\U0001F1F5\U0001F1F9", "Qatar": "\U0001F1F6\U0001F1E6",
    "Republic of the Congo": "\U0001F1E8\U0001F1EC",
    "Romania": "\U0001F1F7\U0001F1F4", "Russia": "\U0001F1F7\U0001F1FA",
    "Rwanda": "\U0001F1F7\U0001F1FC", "Samoa": "\U0001F1FC\U0001F1F8",
    "San Marino": "\U0001F1F8\U0001F1F2",
    "Saudi Arabia": "\U0001F1F8\U0001F1E6",
    "Senegal": "\U0001F1F8\U0001F1F3", "Serbia": "\U0001F1F7\U0001F1F8",
    "Seychelles": "\U0001F1F8\U0001F1E8", "Sierra Leone": "\U0001F1F8\U0001F1F1",
    "Singapore": "\U0001F1F8\U0001F1EC", "Slovakia": "\U0001F1F8\U0001F1F0",
    "Slovenia": "\U0001F1F8\U0001F1EE", "Somalia": "\U0001F1F8\U0001F1F4",
    "South Africa": "\U0001F1FF\U0001F1E6", "South Korea": "\U0001F1F0\U0001F1F7",
    "Spain": "\U0001F1EA\U0001F1F8", "Sri Lanka": "\U0001F1F1\U0001F1F0",
    "South Sudan": "\U0001F1F8\U0001F1F8",
    "Sudan": "\U0001F1F8\U0001F1E9", "Suriname": "\U0001F1F8\U0001F1F7",
    "Sweden": "\U0001F1F8\U0001F1EA", "Switzerland": "\U0001F1E8\U0001F1ED",
    "Syria": "\U0001F1F8\U0001F1FE", "Taiwan": "\U0001F1F9\U0001F1FC",
    "Tajikistan": "\U0001F1F9\U0001F1EF", "Tanzania": "\U0001F1F9\U0001F1FF",
    "Thailand": "\U0001F1F9\U0001F1ED", "Togo": "\U0001F1F9\U0001F1EC",
    "Tonga": "\U0001F1F9\U0001F1F4",
    "Trinidad and Tobago": "\U0001F1F9\U0001F1F9",
    "Tunisia": "\U0001F1F9\U0001F1F3", "Turkey": "\U0001F1F9\U0001F1F7",
    "Turkmenistan": "\U0001F1F9\U0001F1F2", "Uganda": "\U0001F1FA\U0001F1EC",
    "Ukraine": "\U0001F1FA\U0001F1E6",
    "United Arab Emirates": "\U0001F1E6\U0001F1EA",
    "United Kingdom": "\U0001F1EC\U0001F1E7",
    "United States": "\U0001F1FA\U0001F1F8", "Uruguay": "\U0001F1FA\U0001F1FE",
    "Uzbekistan": "\U0001F1FA\U0001F1FF", "Vatican City": "\U0001F1FB\U0001F1E6",
    "Venezuela": "\U0001F1FB\U0001F1EA", "Vietnam": "\U0001F1FB\U0001F1F3",
    "Yemen": "\U0001F1FE\U0001F1EA", "Zambia": "\U0001F1FF\U0001F1F2",
    "Zimbabwe": "\U0001F1FF\U0001F1FC",
}

# Country to region mapping
COUNTRY_REGIONS: dict[str, str] = {
    # Europe
    **{c: "Europe" for c in [
        "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina",
        "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Finland", "France",
        "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo",
        "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova",
        "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland",
        "Portugal", "Romania", "San Marino", "Serbia", "Slovakia", "Slovenia",
        "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City",
    ]},
    # Asia
    **{c: "Asia" for c in [
        "Afghanistan", "Armenia", "Azerbaijan", "Bangladesh", "Bhutan", "Brunei",
        "Cambodia", "China", "Georgia", "India", "Indonesia", "Japan", "Kazakhstan",
        "Kyrgyzstan", "Laos", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal",
        "North Korea", "Pakistan", "Philippines", "Singapore", "South Korea",
        "Sri Lanka", "Taiwan", "Tajikistan", "Thailand", "Turkmenistan",
        "Uzbekistan", "Vietnam",
    ]},
    # Americas
    **{c: "Americas" for c in [
        "Argentina", "Belize", "Bolivia", "Brazil", "Canada", "Chile", "Colombia",
        "Costa Rica", "Cuba", "Dominican Republic", "Ecuador", "El Salvador",
        "Guatemala", "Guyana", "Haiti", "Honduras", "Jamaica", "Mexico",
        "Nicaragua", "Panama", "Paraguay", "Peru", "Suriname",
        "Trinidad and Tobago", "United States", "Uruguay", "Venezuela",
    ]},
    # Middle East
    **{c: "Middle East" for c in [
        "Bahrain", "Iran", "Iraq", "Israel", "Jordan", "Kuwait", "Lebanon",
        "Oman", "Palestine", "Qatar", "Saudi Arabia", "Syria", "Turkey",
        "United Arab Emirates", "Yemen",
    ]},
    # Africa
    **{c: "Africa" for c in [
        "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
        "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Comoros",
        "Democratic Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea",
        "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
        "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya",
        "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco",
        "Mozambique", "Namibia", "Niger", "Nigeria", "Republic of the Congo",
        "Rwanda", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
        "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda",
        "Zambia", "Zimbabwe",
    ]},
    # Oceania
    **{c: "Oceania" for c in [
        "Australia", "Fiji", "Nauru", "New Zealand", "Palau",
        "Papua New Guinea", "Samoa", "Tonga", "East Timor",
    ]},
    # Russia spans both
    "Russia": "Europe / Asia",
}


def extract_country(geo_modern: str) -> str | None:
    """Extract country name from a geo_modern string like 'Rome, Italy'."""
    if not geo_modern:
        return None

    geo_modern = geo_modern.strip()

    # Remove parenthetical notes: "Petrograd (Saint Petersburg), Russia" → "Petrograd, Russia"
    cleaned = re.sub(r'\([^)]*\)', '', geo_modern).strip()

    # Split by comma
    parts = [p.strip() for p in cleaned.split(',')]

    # Try the last part first
    last = parts[-1].strip()

    # Check direct alias
    if last in _COUNTRY_ALIASES:
        return _COUNTRY_ALIASES[last]

    # Check single-word country set
    if last in _SINGLE_WORD_COUNTRIES:
        return last

    # Check sub-national region mapping
    if last in _REGION_TO_COUNTRY:
        return _REGION_TO_COUNTRY[last]

    # Check multi-word countries in aliases
    for alias, country in _COUNTRY_ALIASES.items():
        if last.lower() == alias.lower():
            return country

    # If the whole string is a country name
    if geo_modern in _COUNTRY_ALIASES:
        return _COUNTRY_ALIASES[geo_modern]
    if geo_modern in _SINGLE_WORD_COUNTRIES:
        return geo_modern

    # If only one part and it looks like a known country
    if len(parts) == 1:
        for alias, country in _COUNTRY_ALIASES.items():
            if alias.lower() in geo_modern.lower():
                return country

    return last if len(parts) > 1 else None


def classify_era(year: int | None, is_bce: bool = False) -> str:
    """Classify a year into a historical era label."""
    if year is None:
        return "Unknown"
    if is_bce or year < 0:
        abs_year = abs(year)
        if abs_year > 3000:
            return "Ancient (pre-3000 BCE)"
        if abs_year > 500:
            return "Classical Antiquity"
        return "Late Antiquity"
    if year < 500:
        return "Late Antiquity"
    if year < 1500:
        return "Medieval"
    if year < 1800:
        return "Early Modern"
    if year < 1900:
        return "19th Century"
    if year < 2000:
        return "20th Century"
    return "21st Century"


# ─────────────────────────────────────────────────────────────────────────────
# Response schemas
# ─────────────────────────────────────────────────────────────────────────────

class CountryListItem(BaseModel):
    name: str
    slug: str
    flag: str
    region: str
    event_count: int


class CountriesListResponse(BaseModel):
    countries: list[CountryListItem]
    total: int


class CountryEventItem(BaseModel):
    id: str
    slug: str
    title: str
    year_approx: int | None
    category: str | None
    importance_score: float
    geo_modern: str | None
    era: str


class CountryPersonItem(BaseModel):
    id: str
    name: str
    birth_year: int | None
    death_year: int | None
    roles: list[str] | None
    description: str | None
    wikipedia_slug: str | None


class EraCount(BaseModel):
    era: str
    count: int
    color: str


class CountryDetailResponse(BaseModel):
    name: str
    slug: str
    flag: str
    region: str
    total_events: int
    earliest_year: int | None
    latest_year: int | None
    notable_people_count: int
    era_breakdown: list[EraCount]
    events: list[CountryEventItem]
    notable_people: list[CountryPersonItem]
    neighboring_countries: list[CountryListItem]


# Era colors
ERA_COLORS = {
    "Ancient (pre-3000 BCE)": "#a78bfa",
    "Classical Antiquity": "#8b5cf6",
    "Late Antiquity": "#6366f1",
    "Medieval": "#f59e0b",
    "Early Modern": "#f97316",
    "19th Century": "#22c55e",
    "20th Century": "#3b82f6",
    "21st Century": "#ec4899",
    "Unknown": "#6b7280",
}


def country_slug(name: str) -> str:
    """Convert country name to URL slug."""
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("", response_model=CountriesListResponse)
async def list_countries(db: AsyncSession = Depends(get_db)) -> CountriesListResponse:
    """Return all distinct countries extracted from event geo_modern fields."""
    stmt = select(Event.geo_modern).where(
        Event.geo_modern.isnot(None),
        Event.review_status == "approved",
    )
    result = await db.execute(stmt)
    rows = result.fetchall()

    country_counts: dict[str, int] = {}
    for (geo_modern,) in rows:
        country = extract_country(geo_modern)
        if country:
            country_counts[country] = country_counts.get(country, 0) + 1

    countries = sorted(
        [
            CountryListItem(
                name=name,
                slug=country_slug(name),
                flag=COUNTRY_FLAGS.get(name, "\U0001F30D"),
                region=COUNTRY_REGIONS.get(name, "Other"),
                event_count=count,
            )
            for name, count in country_counts.items()
        ],
        key=lambda c: (-c.event_count, c.name),
    )

    return CountriesListResponse(countries=countries, total=len(countries))


@router.get("/{country_slug_param}")
async def get_country_detail(
    country_slug_param: str,
    era: Optional[str] = Query(default=None, description="Filter events by era"),
    db: AsyncSession = Depends(get_db),
) -> CountryDetailResponse:
    """Return full country detail: events, people, era breakdown."""
    # First, find the country name from slug
    # We need to scan all events to find the matching country
    stmt = select(Event.geo_modern).where(
        Event.geo_modern.isnot(None),
        Event.review_status == "approved",
    )
    result = await db.execute(stmt)
    rows = result.fetchall()

    country_name: str | None = None
    for (geo_modern,) in rows:
        c = extract_country(geo_modern)
        if c and country_slug(c) == country_slug_param:
            country_name = c
            break

    if not country_name:
        raise HTTPException(status_code=404, detail=f"Country '{country_slug_param}' not found")

    # Fetch all approved events
    events_stmt = select(
        Event.id,
        Event.slug,
        Event.title,
        Event.year_approx,
        Event.is_bce,
        Event.event_category,
        Event.importance_score,
        Event.geo_modern,
    ).where(
        Event.geo_modern.isnot(None),
        Event.review_status == "approved",
    ).order_by(Event.year_approx.asc().nullslast())

    events_result = await db.execute(events_stmt)
    all_events = events_result.fetchall()

    # Filter to this country
    country_events = []
    for ev in all_events:
        if extract_country(ev.geo_modern) == country_name:
            ev_era = classify_era(ev.year_approx, ev.is_bce)
            if era and ev_era != era:
                continue
            country_events.append(
                CountryEventItem(
                    id=str(ev.id),
                    slug=ev.slug,
                    title=ev.title,
                    year_approx=ev.year_approx,
                    category=ev.event_category,
                    importance_score=ev.importance_score,
                    geo_modern=ev.geo_modern,
                    era=ev_era,
                )
            )

    # Era breakdown (unfiltered)
    era_counts: dict[str, int] = {}
    years = []
    for ev in all_events:
        if extract_country(ev.geo_modern) == country_name:
            ev_era = classify_era(ev.year_approx, ev.is_bce)
            era_counts[ev_era] = era_counts.get(ev_era, 0) + 1
            if ev.year_approx is not None:
                years.append(ev.year_approx)

    era_breakdown = [
        EraCount(era=e, count=c, color=ERA_COLORS.get(e, "#6b7280"))
        for e, c in sorted(era_counts.items(), key=lambda x: -x[1])
    ]

    # Notable people — those linked to events in this country, or with matching nationality
    event_ids = [ev.id for ev in all_events if extract_country(ev.geo_modern) == country_name]

    people: list[CountryPersonItem] = []
    if event_ids:
        people_stmt = (
            select(Person)
            .join(EventPerson, EventPerson.person_id == Person.id)
            .where(EventPerson.event_id.in_(event_ids))
            .distinct()
        )
        people_result = await db.execute(people_stmt)
        person_rows = people_result.scalars().all()
        people = [
            CountryPersonItem(
                id=str(p.id),
                name=p.name,
                birth_year=p.birth_year,
                death_year=p.death_year,
                roles=p.roles,
                description=p.description,
                wikipedia_slug=p.wikipedia_slug,
            )
            for p in person_rows
        ]

    # Neighboring countries (same region, excluding self)
    region = COUNTRY_REGIONS.get(country_name, "Other")

    # Get all countries with counts for neighboring
    all_country_counts: dict[str, int] = {}
    for (geo_modern,) in rows:
        c = extract_country(geo_modern)
        if c:
            all_country_counts[c] = all_country_counts.get(c, 0) + 1

    neighbors = [
        CountryListItem(
            name=n,
            slug=country_slug(n),
            flag=COUNTRY_FLAGS.get(n, "\U0001F30D"),
            region=COUNTRY_REGIONS.get(n, "Other"),
            event_count=cnt,
        )
        for n, cnt in all_country_counts.items()
        if n != country_name and COUNTRY_REGIONS.get(n, "Other") == region
    ]
    neighbors.sort(key=lambda c: (-c.event_count, c.name))
    neighbors = neighbors[:12]

    return CountryDetailResponse(
        name=country_name,
        slug=country_slug(country_name),
        flag=COUNTRY_FLAGS.get(country_name, "\U0001F30D"),
        region=region,
        total_events=sum(era_counts.values()),
        earliest_year=min(years) if years else None,
        latest_year=max(years) if years else None,
        notable_people_count=len(people),
        era_breakdown=era_breakdown,
        events=country_events,
        notable_people=people,
        neighboring_countries=neighbors,
    )
