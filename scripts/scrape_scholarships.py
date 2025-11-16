import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime
import time

# Load environment variables
load_dotenv()

# Initialize Supabase
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

def scrape_scholarship_example():
    """
    Example scraper - adapt this to actual scholarship websites
    """
    scholarships = [
        {
            'title': 'Vanier Canada Graduate Scholarships',
            'description': 'Doctoral scholarship of $50,000 per year for 3 years for students who demonstrate leadership skills and high academic achievement.',
            'url': 'https://vanier.gc.ca/',
            'category': 'scholarship',
            'country': 'Canada',
            'institution': 'Government of Canada',
            'amount': '$50,000 CAD/year',
            'tags': ['doctoral', 'graduate', 'government-funded', 'leadership']
        },
        {
            'title': 'University of British Columbia International Scholars',
            'description': 'Awards for outstanding international students entering UBC undergraduate programs.',
            'url': 'https://you.ubc.ca/financial-planning/scholarships-awards-international-students/',
            'category': 'scholarship',
            'country': 'Canada',
            'institution': 'University of British Columbia',
            'amount': 'Varies',
            'tags': ['undergraduate', 'international', 'merit-based']
        }
    ]
    
    return scholarships

def save_to_supabase(scholarships):
    """
    Save scholarships to Supabase database
    """
    for scholarship in scholarships:
        scholarship['last_updated'] = datetime.now().isoformat()
        
        # Check if scholarship already exists
        result = supabase.table('resources').select('id').eq('title', scholarship['title']).execute()
        
        if result.data:
            # Update existing
            supabase.table('resources').update(scholarship).eq('title', scholarship['title']).execute()
            print(f"Updated: {scholarship['title']}")
        else:
            # Insert new
            supabase.table('resources').insert(scholarship).execute()
            print(f"Inserted: {scholarship['title']}")

if __name__ == '__main__':
    print("Starting scholarship scraper...")
    scholarships = scrape_scholarship_example()
    save_to_supabase(scholarships)
    print(f"Processed {len(scholarships)} scholarships")