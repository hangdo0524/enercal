#!/usr/bin/env python3
"""Extract energy calendar data from PDF files."""

import pdfplumber
import json
import re
from pathlib import Path

CATEGORIES_MAP = {
    "SINH ĐẠO": "Sức khỏe",
    "TRÍ ĐẠO": "Học tập",
    "CÔNG ĐẠO": "Công việc",
    "GIA ĐẠO": "Gia đình",
    "THIÊN ĐẠO": "Thời cơ",
    "ĐỒNG ĐẠO": "Quan hệ",
    "TÂM ĐẠO": "Đầu tư",
    "PHÁP ĐẠO": "Tâm linh",
}

DAILY_PATTERNS = {
    "Sức khỏe": r'SỨC KHỎE\s*[-–]\s*(\d+)',
    "Học tập": r'HỌC TẬP\s*[-–]\s*(\d+)',
    "Công việc": r'CÔNG VIỆC\s*[-–]\s*(\d+)',
    "Gia đình": r'GIA ĐÌNH\s*[-–]\s*(\d+)',
    "Thời cơ": r'THỜI CƠ\s*[-–]\s*(\d+)',
    "Quan hệ": r'QUAN HỆ\s*[-–]\s*(\d+)',
    "Đầu tư": r'ĐẦU TƯ\s*[-–]\s*(\d+)',
    "Tâm linh": r'TÂM LINH\s*[-–]\s*(\d+)',
}

def parse_page(page):
    """Parse a single page and extract day data."""
    text = page.extract_text()
    if not text:
        return None

    # Extract month and day
    month_match = re.search(r'THÁNG\s*(\d+)', text)
    if not month_match:
        return None
    month = int(month_match.group(1))

    # Find the day number - look for standalone number or "1 HỌC" pattern
    day = None
    lines = text.split('\n')
    for line in lines:
        # Check for pattern like "1 HỌC" or standalone day
        match = re.match(r'^(\d{1,2})\s+(HỌC|SỨC|CÔNG|GIA|THỜI|QUAN|ĐẦU|TÂM)', line)
        if match:
            day = int(match.group(1))
            break
        # Also check in the merged cell text
        match = re.search(r'THÁNG\s*\d+\s*(\d{1,2})\s*THỨ', line)
        if match:
            day = int(match.group(1))
            break

    if not day:
        # Try another pattern - look for the large number
        for line in lines:
            if re.match(r'^\d{1,2}$', line.strip()):
                day = int(line.strip())
                break

    if not day:
        # Extract from the first table cell
        match = re.search(r'THÁNG\s*\d+\n(\d{1,2})\n', text)
        if match:
            day = int(match.group(1))

    if not day:
        return None

    year = 2026
    date_str = f"{year}-{month:02d}-{day:02d}"

    # Extract main theme (Ngày X)
    main_theme = ""
    theme_match = re.search(r'Ngày\s+(Sức khỏe|Học tập|Công việc|Gia đình|Thời cơ|Quan hệ|Đầu tư|Tâm linh|Tâm Linh)', text, re.IGNORECASE)
    if theme_match:
        main_theme = f"Ngày {theme_match.group(1).title()}"

    # Extract daily values
    daily_values = {}
    for cat, pattern in DAILY_PATTERNS.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            daily_values[cat] = int(match.group(1))

    # Extract hourly grid
    hourly_grid = {}
    for dao_name, cat_name in CATEGORIES_MAP.items():
        pattern = rf'{dao_name}\s*[-–]\s*\([^)]+\)\s+([\d\s]+)'
        match = re.search(pattern, text)
        if match:
            numbers = [int(n) for n in match.group(1).split()]
            if len(numbers) >= 8:
                hourly_grid[cat_name] = numbers[:8]

    if not daily_values or not hourly_grid:
        return None

    return {
        "date": date_str,
        "mainTheme": main_theme,
        "dailyValues": daily_values,
        "hourlyGrid": hourly_grid
    }

def extract_pdf(pdf_path):
    """Extract all data from a PDF file."""
    print(f"Processing: {pdf_path}")

    days = {}

    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total pages: {total_pages}")

        for i, page in enumerate(pdf.pages):
            if i < 2:  # Skip cover and intro pages
                continue

            if (i + 1) % 50 == 0:
                print(f"  Processing page {i + 1}/{total_pages}...")

            try:
                data = parse_page(page)
                if data and data["date"]:
                    days[data["date"]] = data
            except Exception as e:
                print(f"  Error on page {i + 1}: {e}")

    print(f"  Extracted {len(days)} days")
    return days

def main():
    data_dir = Path(__file__).parent.parent / "data"
    output_dir = Path(__file__).parent.parent / "src" / "data"

    profiles = []

    for pdf_file in sorted(data_dir.glob("*.pdf")):
        name = pdf_file.stem
        profile_id = name.lower().replace(" ", "_").replace("đ", "d").replace("ỗ", "o").replace("ị", "i").replace("ằ", "a").replace("ê", "e").replace("â", "a").replace("ấ", "a").replace("ễ", "e").replace("ứ", "u")

        days = extract_pdf(pdf_file)

        if days:
            profiles.append({
                "id": profile_id,
                "name": name,
                "days": days
            })

    # Write output
    output_file = output_dir / "energyData.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({"profiles": profiles}, f, ensure_ascii=False, indent=2)

    print(f"\nOutput written to: {output_file}")
    print(f"Total profiles: {len(profiles)}")

    # Print sample
    if profiles:
        sample_date = list(profiles[0]["days"].keys())[0]
        print(f"\nSample data for {profiles[0]['name']} - {sample_date}:")
        print(json.dumps(profiles[0]["days"][sample_date], ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
