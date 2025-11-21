"""
Base scraper class with ethical scraping practices built-in.
All specific scrapers should inherit from this class.
"""

import time
import logging
import requests
from typing import Optional, Dict, Any
from urllib.robotparser import RobotFileParser
from bs4 import BeautifulSoup
from config import (
    REQUEST_DELAY,
    USER_AGENT,
    REQUEST_TIMEOUT,
    MAX_RETRIES
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

class EthicalScraper:
    """
    Base class for all scrapers with built-in ethical practices.
    
    Features:
    - Automatic robots.txt compliance
    - Rate limiting
    - Proper error handling
    - Request retries with exponential backoff
    """
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logging.getLogger(name)
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})
        self.last_request_time = 0
        
    def check_robots_txt(self, url: str, robots_url: str) -> bool:
        """
        Check if URL is allowed by robots.txt.
        
        Args:
            url: URL to check
            robots_url: URL of robots.txt file
            
        Returns:
            True if allowed, False otherwise
        """
        try:
            parser = RobotFileParser()
            parser.set_url(robots_url)
            parser.read()
            
            is_allowed = parser.can_fetch(USER_AGENT, url)
            
            if not is_allowed:
                self.logger.warning(f"URL disallowed by robots.txt: {url}")
            
            return is_allowed
            
        except Exception as e:
            self.logger.error(f"Error checking robots.txt: {e}")
            # If we can't read robots.txt, be conservative and skip
            return False
    
    def rate_limit(self) -> None:
        """
        Enforce rate limiting between requests.
        """
        elapsed = time.time() - self.last_request_time
        if elapsed < REQUEST_DELAY:
            sleep_time = REQUEST_DELAY - elapsed
            self.logger.debug(f"Rate limiting: sleeping for {sleep_time:.2f}s")
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()
    
    def fetch_page(
        self,
        url: str,
        method: str = 'GET',
        data: Optional[Dict] = None,
        retry_count: int = 0
    ) -> Optional[requests.Response]:
        """
        Fetch a page with error handling and retries.
        
        Args:
            url: URL to fetch
            method: HTTP method (GET, POST, etc.)
            data: Optional data for POST requests
            retry_count: Current retry attempt
            
        Returns:
            Response object or None if failed
        """
        self.rate_limit()
        
        try:
            self.logger.info(f"Fetching: {url}")
            
            if method == 'GET':
                response = self.session.get(url, timeout=REQUEST_TIMEOUT)
            elif method == 'POST':
                response = self.session.post(url, data=data, timeout=REQUEST_TIMEOUT)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            response.raise_for_status()
            return response
            
        except requests.exceptions.HTTPError as e:
            status_code = e.response.status_code
            
            # Don't retry client errors (4xx)
            if 400 <= status_code < 500:
                self.logger.error(f"Client error {status_code} for {url}: {e}")
                return None
            
            # Retry server errors (5xx)
            if retry_count < MAX_RETRIES:
                wait_time = 2 ** retry_count  # Exponential backoff
                self.logger.warning(
                    f"Server error {status_code}, retrying in {wait_time}s "
                    f"(attempt {retry_count + 1}/{MAX_RETRIES})"
                )
                time.sleep(wait_time)
                return self.fetch_page(url, method, data, retry_count + 1)
            else:
                self.logger.error(f"Max retries exceeded for {url}")
                return None
                
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Request failed for {url}: {e}")
            return None
    
    def parse_html(self, html: str) -> Optional[BeautifulSoup]:
        """
        Parse HTML content with BeautifulSoup.
        
        Args:
            html: HTML string to parse
            
        Returns:
            BeautifulSoup object or None if parsing fails
        """
        try:
            return BeautifulSoup(html, 'lxml')
        except Exception as e:
            self.logger.error(f"Error parsing HTML: {e}")
            return None
    
    def extract_text(self, soup: BeautifulSoup, selector: str) -> str:
        """
        Safely extract text from HTML using CSS selector.
        
        Args:
            soup: BeautifulSoup object
            selector: CSS selector
            
        Returns:
            Extracted text or empty string
        """
        try:
            element = soup.select_one(selector)
            return element.get_text(strip=True) if element else ''
        except Exception as e:
            self.logger.error(f"Error extracting text with selector '{selector}': {e}")
            return ''
    
    def clean_text(self, text: str) -> str:
        """
        Clean extracted text (remove extra whitespace, etc.).
        
        Args:
            text: Raw text
            
        Returns:
            Cleaned text
        """
        # Remove extra whitespace
        text = ' '.join(text.split())
        # Remove special characters that might cause issues
        text = text.replace('\xa0', ' ')
        return text.strip()
