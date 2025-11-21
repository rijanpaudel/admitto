"""
Configuration for data scraping and collection scripts.
Contains data source URLs, Supabase credentials, and scraping settings.
"""

import os
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

# ============================================
# SUPABASE CONFIGURATION
# ============================================
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# ============================================
# SCRAPING SETTINGS
# ============================================
# Rate limiting (seconds between requests)
REQUEST_DELAY = 2.0

# User agent (identify your bot)
USER_AGENT = 'NepaliAbroadHelper/1.0 (Educational Project; contact@example.com)'

# Request timeout (seconds)
REQUEST_TIMEOUT = 30

# Maximum retries per request
MAX_RETRIES = 3

# ============================================
# DATA SOURCES
# ============================================

# Scholarship sources (websites that allow scraping or have APIs)
SCHOLARSHIP_SOURCES: List[Dict[str, str]] = [
    {
        'name': 'EduCanada Scholarships',
        'url': 'https://www.educanada.ca/scholarships-bourses/index.aspx',
        'type': 'official',
        'robots_txt': 'https://www.educanada.ca/robots.txt',
        'note': 'Canadian government official scholarship database'
    },
    {
        'name': 'University of Toronto Scholarships',
        'url': 'https://future.utoronto.ca/finances/awards/',
        'type': 'university',
        'robots_txt': 'https://www.utoronto.ca/robots.txt',
        'note': 'UofT financial aid page'
    },
    {
        'name': 'UBC Awards Database',
        'url': 'https://you.ubc.ca/financial-planning/scholarships-awards-international-students/',
        'type': 'university',
        'robots_txt': 'https://www.ubc.ca/robots.txt',
        'note': 'UBC international student awards'
    }
]

# Visa information sources
VISA_SOURCES: List[Dict[str, str]] = [
    {
        'name': 'IRCC Study Permits',
        'url': 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
        'type': 'official',
        'note': 'Primary source for Canadian study permit information'
    },
    {
        'name': 'IRCC Processing Times',
        'url': 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html',
        'type': 'official',
        'note': 'Current processing times for various countries'
    }
]

# Job board sources
JOB_SOURCES: List[Dict[str, str]] = [
    {
        'name': 'Job Bank Canada',
        'url': 'https://www.jobbank.gc.ca/home',
        'type': 'official',
        'note': 'Government of Canada job board'
    }
]

# ============================================
# VALIDATION SETTINGS
# ============================================
# How long before warning about outdated data (days)
STALE_DATA_THRESHOLD_DAYS = 90

# HTTP status codes considered "broken"
BROKEN_STATUS_CODES = [404, 403, 410, 500, 502, 503]

# ============================================
# LOGGING
# ============================================
LOG_DIR = 'logs'
LOG_LEVEL = 'INFO'  # DEBUG, INFO, WARNING, ERROR, CRITICAL