# Nepali Abroad Helper - Data Collection Scripts

Production-quality Python scripts for automated data collection and validation.

## 📋 Overview

- **scrape_scholarships.py** - Collect scholarship data from official sources
- **validate_data.py** - Validate existing data quality and check for broken links
- **generate_embeddings.py** - Generate AI embeddings for RAG system (already created)

## 🚀 Setup

### 1. Install Dependencies

cd scripts
python3 -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt


### 2. Configure Environment

Create `.env` file:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key


### 3. Create Required Directories

mkdir -p logs data


## 📖 Usage

### Scholarship Scraper

Dry run (no database updates)
python scrape_scholarships.py --dry-run

Scrape all sources
python scrape_scholarships.py

Scrape specific source
python scrape_scholarships.py --source educanada

Custom output file
python scrape_scholarships.py --output my_scholarships.json


### Data Validator

Validate all resources
python validate_data.py

Validate specific category
python validate_data.py --category scholarship

Custom report name
python validate_data.py --output validation_2025_11_18.txt


### Generate Embeddings

Generate embeddings for all resources
python generate_embeddings.py

Test search
python generate_embeddings.py test "PhD scholarships in Computer Science"


## 🤖 Automation

### Option 1: Using cron (Linux/Mac)

Edit crontab
crontab -e

Add jobs (example: run weekly on Sunday at 2 AM)
0 2 * * 0 cd /path/to/scripts && ./venv/bin/python scrape_scholarships.py
0 3 * * 0 cd /path/to/scripts && ./venv/bin/python validate_data.py
0 4 * * 0 cd /path/to/scripts && ./venv/bin/python generate_embeddings.py


### Option 2: Using schedule library

Create `scripts/scheduler.py`:

import schedule
import time
import subprocess

def run_scraper():
subprocess.run(['python', 'scrape_scholarships.py'])

def run_validator():
subprocess.run(['python', 'validate_data.py'])

Schedule weekly on Sunday at 2 AM
schedule.every().sunday.at("02:00").do(run_scraper)
schedule.every().sunday.at("03:00").do(run_validator)

while True:
schedule.run_pending()
time.sleep(60)


## 🛡️ Ethical Scraping Practices

All scripts follow:

1. **robots.txt compliance** - Automatic checking before scraping
2. **Rate limiting** - 2-second delays between requests
3. **User agent identification** - Clear bot identification
4. **Error handling** - Graceful failure with logging
5. **Retry logic** - Exponential backoff for server errors

## 📊 Output Files

- `logs/scrape_scholarships.log` - Scraping activity logs
- `logs/validate_data.log` - Validation logs
- `logs/validation_report.txt` - Human-readable validation report
- `data/scholarships.json` - Scraped scholarship data (for review before DB insertion)

## 🐛 Troubleshooting

### "robots.txt disallowed"
- Respect the robots.txt rules
- Consider using official APIs instead
- Manual curation may be more appropriate

### "Request timeout"
- Check internet connection
- Website may be down temporarily
- Try increasing REQUEST_TIMEOUT in config.py

### "Supabase connection error"
- Verify .env file has correct credentials
- Check if Supabase project is active
- Ensure service role key (not anon key) is used

## 📝 Notes

- Many scholarship websites don't allow scraping
- Manual curation is often more reliable than scraping
- Always verify scraped data before using in production
- Run validation weekly to catch broken links
- Update embeddings after adding new resources