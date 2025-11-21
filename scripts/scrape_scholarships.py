"""
    Scholarship Scraper for Nepali Abroad Helper

    Scrapes scholarship information from official sources and updates Supabase.
    Follows ethical scraping practices including robots.txt compliance and rate limiting.

    Usage:
        python scrape_scholarships.py
        python scrape_scholarships.py --source educanada
        python scrape_scholarships.py --dry-run
    """

import argparse
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path

from utils.scraper_base import EthicalScraper
from utils.supabase_client import SupabaseManager
from config import SCHOLARSHIP_SOURCES

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/scrape_scholarships.log'),
        logging.StreamHandler()
    ]
)

class ScholarshipScraper(EthicalScraper):
    """
    Scraper for collecting scholarship information from official sources.
    
    Note: This is a template - actual scraping logic depends on each website's
    structure. You'll need to customize the parsing logic for each source.
    """
    
    def __init__(self):
        super().__init__('ScholarshipScraper')
        self.db = SupabaseManager()
        self.scraped_scholarships: List[Dict[str, Any]] = []
    
    def scrape_educanada(self) -> List[Dict[str, Any]]:
        """
        Scrape scholarships from EduCanada.
        
        Note: EduCanada actually has a search interface, not a simple list.
        For production, you'd want to use their search API if available,
        or manually curate from their database.
        
        This is a demonstration of the scraping pattern.
        """
        source = next(s for s in SCHOLARSHIP_SOURCES if 'educanada' in s['url'].lower())
        url = source['url']
        
        # Check robots.txt
        if not self.check_robots_txt(url, source['robots_txt']):
            self.logger.warning(f"Skipping {url} - disallowed by robots.txt")
            return []
        
        # Fetch page
        response = self.fetch_page(url)
        if not response:
            return []
        
        soup = self.parse_html(response.text)
        if not soup:
            return []
        
        scholarships = []
        
        # Example parsing logic (you'll need to adjust based on actual page structure)
        # This is pseudocode - actual selectors depend on the website
        
        # scholarship_cards = soup.select('.scholarship-card')  # Example selector
        # 
        # for card in scholarship_cards:
        #     scholarship = {
        #         'title': self.clean_text(self.extract_text(card, '.title')),
        #         'description': self.clean_text(self.extract_text(card, '.description')),
        #         'url': card.find('a')['href'] if card.find('a') else None,
        #         'institution': self.clean_text(self.extract_text(card, '.institution')),
        #         'category': 'scholarship',
        #         'country': 'Canada',
        #         'tags': ['international-students', 'official'],
        #         'metadata': {
        #             'source': 'EduCanada',
        #             'scraped_at': datetime.now().isoformat(),
        #             'last_verified': datetime.now().isoformat()
        #         }
        #     }
        #     scholarships.append(scholarship)
        
        self.logger.info(f"Scraped {len(scholarships)} scholarships from EduCanada")
        return scholarships
    
    def scrape_university_page(self, source: Dict[str, str]) -> List[Dict[str, Any]]:
        """
        Generic scraper for university scholarship pages.
        
        Args:
            source: Source dictionary with URL and metadata
            
        Returns:
            List of scholarship dictionaries
        """
        url = source['url']
        
        # Check robots.txt
        if not self.check_robots_txt(url, source['robots_txt']):
            self.logger.warning(f"Skipping {url} - disallowed by robots.txt")
            return []
        
        response = self.fetch_page(url)
        if not response:
            return []
        
        soup = self.parse_html(response.text)
        if not soup:
            return []
        
        scholarships = []
        
        # University pages typically list scholarships with links to detail pages
        # This is a template - customize for each university's structure
        
        self.logger.info(f"Scraped {len(scholarships)} scholarships from {source['name']}")
        return scholarships
    
    def manual_entry_template(self) -> Dict[str, Any]:
        """
        Template for manually entering scholarships that can't be scraped.
        
        For many scholarship sources, manual curation is more reliable than scraping.
        This template helps maintain consistency.
        """
        return {
            'title': '',
            'description': '',
            'url': '',
            'category': 'scholarship',
            'institution': '',
            'amount': '',
            'deadline': None,  # Format: YYYY-MM-DD or None
            'eligibility': '',
            'tags': [],
            'country': 'Canada',
            'metadata': {
                'source': '',
                'level': '',  # Undergraduate, Masters, PhD
                'duration': '',
                'last_verified': datetime.now().isoformat()
            }
        }
    
    def scrape_all_sources(self) -> List[Dict[str, Any]]:
        """
        Scrape all configured scholarship sources.
        
        Returns:
            Combined list of scholarships from all sources
        """
        all_scholarships = []
        
        for source in SCHOLARSHIP_SOURCES:
            self.logger.info(f"Processing source: {source['name']}")
            
            try:
                if 'educanada' in source['url'].lower():
                    scholarships = self.scrape_educanada()
                else:
                    scholarships = self.scrape_university_page(source)
                
                all_scholarships.extend(scholarships)
                
            except Exception as e:
                self.logger.error(f"Error scraping {source['name']}: {e}")
                continue
        
        return all_scholarships
    
    def save_to_file(self, scholarships: List[Dict[str, Any]], filename: str = 'scholarships.json'):
        """
        Save scraped scholarships to JSON file for review before database insertion.
        
        Args:
            scholarships: List of scholarship dictionaries
            filename: Output filename
        """
        output_path = Path('data') / filename
        output_path.parent.mkdir(exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(scholarships, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Saved {len(scholarships)} scholarships to {output_path}")
    
    def update_database(self, scholarships: List[Dict[str, Any]], dry_run: bool = False):
        """
        Update Supabase database with scraped scholarships.
        
        Args:
            scholarships: List of scholarship dictionaries
            dry_run: If True, only log what would be done without actually updating
        """
        if dry_run:
            self.logger.info(f"DRY RUN: Would update database with {len(scholarships)} scholarships")
            for scholarship in scholarships:
                self.logger.info(f"  - {scholarship['title']}")
            return
        
        results = self.db.bulk_upsert_resources(scholarships)
        
        self.logger.info(
            f"Database update complete: {results['success']} succeeded, "
            f"{results['failed']} failed"
        )

def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(description='Scrape scholarship data')
    parser.add_argument(
        '--source',
        choices=['all', 'educanada', 'utoronto', 'ubc'],
        default='all',
        help='Source to scrape'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Run without updating database'
    )
    parser.add_argument(
        '--output',
        default='scholarships.json',
        help='Output JSON file'
    )
    
    args = parser.parse_args()
    
    # Create logs directory
    Path('logs').mkdir(exist_ok=True)
    Path('data').mkdir(exist_ok=True)
    
    scraper = ScholarshipScraper()
    
    print("="*60)
    print("Nepali Abroad Helper - Scholarship Scraper")
    print("="*60)
    print(f"Source: {args.source}")
    print(f"Dry run: {args.dry_run}")
    print("="*60)
    
    # Scrape scholarships
    scholarships = scraper.scrape_all_sources()
    
    # Save to file
    scraper.save_to_file(scholarships, args.output)
    
    # Update database
    if scholarships:
        scraper.update_database(scholarships, dry_run=args.dry_run)
    else:
        print("\n⚠️  No scholarships scraped. Check logs for details.")
        print("\nNote: Many scholarship websites don't allow scraping.")
        print("Consider manual curation or using official APIs instead.")
    
    print("\n✅ Scraping complete! Check logs/scrape_scholarships.log for details.")

if __name__ == '__main__':
    main()