#!/usr/bin/env python3
"""
scripts/prepare_airlines.py

Ingests and validates raw airlines.csv from OpenFlights / Kaggle.
Produces:
  - public/data/airlines.json (all normalized rows with airlineKey)
  - public/data/airlines_by_country.json (top 20 countries by active carriers)

Adheres strictly to architecture.md section 2.1 data contract.
"""

import os
import sys
import json
import re
import pandas as pd
import numpy as np

NULL_STRINGS = {'', '-', 'N/A', r'\N', 'nan', 'NaN', 'None'}

def slugify(text: str) -> str:
    """Creates a URL-safe lowercase slug from an airline name."""
    if not text or pd.isna(text):
        return "unknown"
    text = str(text).lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-') or "unknown"

def build_airline_key(icao, iata, name) -> str:
    """
    Builds unique identifier adhering to architecture.md section 2.1:
    airlineKey = ICAO if valid (3 chars) else IATA if valid (2 chars) else slug(Name)
    """
    if pd.notna(icao) and isinstance(icao, str):
        c = icao.strip().upper()
        if len(c) == 3 and c not in NULL_STRINGS:
            return c
    if pd.notna(iata) and isinstance(iata, str):
        c = iata.strip().upper()
        if len(c) == 2 and c not in NULL_STRINGS:
            return c
    return slugify(name)

def is_valid_country(country_str) -> bool:
    """Flags shifted columns or nonsensical country entries."""
    if pd.isna(country_str) or not isinstance(country_str, str):
        return False
    val = country_str.strip()
    if val in NULL_STRINGS or len(val) < 2:
        return False
    # Shifted values frequently contain airline callsigns or numbers
    if re.search(r'\d', val) or val.isupper() and len(val) <= 4:
        return False
    return True

def prepare_airlines(csv_path: str, output_dir: str):
    print("=" * 60)
    print(" SkyGraph Data Prep: airlines.csv")
    print("=" * 60)
    
    if not os.path.exists(csv_path):
        print(f"Error: Could not locate '{csv_path}'.")
        print("Please place 'airlines.csv' in the project root or provide the full path.")
        return

    # Verified columns: Name, IATA, ICAO, Callsign, Country, Active
    df = pd.read_csv(
        csv_path,
        na_values=list(NULL_STRINGS),
        keep_default_na=True,
        dtype=str
    )
    
    raw_count = len(df)
    print(f"Loaded {raw_count:,} raw airline records.")

    # 1. Clean and normalize null representations
    for col in df.columns:
        df[col] = df[col].apply(lambda x: None if pd.isna(x) or str(x).strip() in NULL_STRINGS else str(x).strip())

    # 2. Drop known junk rows (Row 'Private flight')
    df = df[df['Name'] != 'Private flight'].copy()
    dropped_junk = raw_count - len(df)

    # 3. Normalize Active flag (Y/N), handling stray lowercase 'n'
    def normalize_active(val):
        if not val or pd.isna(val):
            return False
        v = str(val).strip().upper()
        return v == 'Y'

    df['active'] = df['Active'].apply(normalize_active)

    # 4. Generate robust airlineKey
    df['key'] = df.apply(lambda r: build_airline_key(r.get('ICAO'), r.get('IATA'), r.get('Name')), axis=1)

    # 5. Detect and flag shifted/invalid countries
    df['valid_country'] = df['Country'].apply(is_valid_country)
    shifted_count = len(df[~df['valid_country']])

    # 6. Build final schema: key, name, iata, icao, country, active, routeCount, countryCount, airportCount
    # Leave routeCount/countryCount/airportCount as None until routes.csv is processed
    airlines_records = []
    for _, row in df.iterrows():
        airlines_records.append({
            "key": row['key'],
            "name": row['Name'],
            "iata": row.get('IATA'),
            "icao": row.get('ICAO'),
            "callsign": row.get('Callsign'),
            "country": row.get('Country') if row['valid_country'] else None,
            "active": bool(row['active']),
            "routeCount": None,
            "countryCount": None,
            "airportCount": None
        })

    # 7. Aggregate airlines by country (Active vs Defunct, top 20 by active)
    valid_country_df = df[df['valid_country']].copy()
    country_grouped = (
        valid_country_df.groupby(['Country', 'active'])
        .size()
        .unstack(fill_value=0)
        .rename(columns={True: 'active', False: 'defunct'})
        .reset_index()
    )
    if 'active' not in country_grouped.columns:
        country_grouped['active'] = 0
    if 'defunct' not in country_grouped.columns:
        country_grouped['defunct'] = 0

    top_20_countries = (
        country_grouped.sort_values(by='active', ascending=False)
        .head(20)
        .rename(columns={'Country': 'country'})
        .to_dict(orient='records')
    )

    # Write output JSON files
    os.makedirs(output_dir, exist_ok=True)
    airlines_out = os.path.join(output_dir, 'airlines.json')
    by_country_out = os.path.join(output_dir, 'airlines_by_country.json')

    with open(airlines_out, 'w', encoding='utf-8') as f:
        json.dump(airlines_records, f, indent=2, ensure_ascii=False)

    with open(by_country_out, 'w', encoding='utf-8') as f:
        json.dump(top_20_countries, f, indent=2, ensure_ascii=False)

    # Quality Report
    active_count = sum(1 for a in airlines_records if a['active'])
    defunct_count = len(airlines_records) - active_count
    missing_iata = sum(1 for a in airlines_records if not a['iata'])
    missing_icao = sum(1 for a in airlines_records if not a['icao'])
    
    # Calculate duplicate IATA among active
    active_iatas = [a['iata'] for a in airlines_records if a['active'] and a['iata']]
    dup_active_iata = len(active_iatas) - len(set(active_iatas))

    print("-" * 60)
    print("DATA QUALITY AUDIT REPORT:")
    print(f"Total processed rows:          {len(airlines_records):,}")
    print(f"Dropped junk rows:             {dropped_junk}")
    print(f"Active airlines (Y):           {active_count:,}")
    print(f"Defunct airlines (N):          {defunct_count:,}")
    print(f"Missing IATA codes:            {missing_iata:,}")
    print(f"Missing ICAO codes:            {missing_icao:,}")
    print(f"Shifted/Invalid country rows:  {shifted_count}")
    print(f"Duplicate active IATA codes:   {dup_active_iata}")
    print("-" * 60)
    print(f"Output saved to:\n  - {airlines_out}\n  - {by_country_out}")
    print("=" * 60)

if __name__ == "__main__":
    csv_file = sys.argv[1] if len(sys.argv) > 1 else "airlines.csv"
    out_path = sys.argv[2] if len(sys.argv) > 2 else os.path.join("public", "data")
    prepare_airlines(csv_file, out_path)
