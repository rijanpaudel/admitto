#!/usr/bin/env python3
"""
Data Validation Script for Nepali Abroad Helper

Validates resources in database:
- Checks for broken links
- Verifies date formats
- Flags outdated information
- Generates validation report

Usage:
    python validate_data.py
    python validate_data.py --category scholarship
    python validate_data.py --fix-broken-links
"""

import argparse
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
from pathlib import Path
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

from utils.supabase_client import SupabaseManager
from config import STALE_DATA_THRESHOLD_DAYS, BROKEN_STATUS_CODES, REQUEST_TIMEOUT

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("logs/validate_data.log"), logging.StreamHandler()],
)

logger = logging.getLogger(__name__)


class DataValidator:
    """
    Validates resource data quality and freshness.
    """

    def __init__(self):
        self.db = SupabaseManager()
        self.validation_results = {
            "total_resources": 0,
            "broken_links": [],
            "stale_data": [],
            "invalid_dates": [],
            "missing_fields": [],
            "passed": [],
        }

    def check_url_status(self, url: str) -> Tuple[bool, int]:
        """
        Check if a URL is accessible.

        Args:
            url: URL to check

        Returns:
            Tuple of (is_valid, status_code)
        """
        if not url:
            return False, 0

        try:
            response = requests.head(
                url,
                timeout=REQUEST_TIMEOUT,
                allow_redirects=True,
                headers={"User-Agent": "NepaliAbroadHelper/DataValidator"},
            )

            is_valid = response.status_code not in BROKEN_STATUS_CODES
            return is_valid, response.status_code

        except requests.exceptions.RequestException as e:
            logger.warning(f"Error checking URL {url}: {e}")
            return False, 0

    def check_links_parallel(self, resources: List[Dict[str, Any]]) -> None:
        """
        Check all resource URLs in parallel for efficiency.

        Args:
            resources: List of resource dictionaries
        """
        logger.info(f"Checking {len(resources)} URLs in parallel...")

        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_resource = {
                executor.submit(self.check_url_status, r["url"]): r
                for r in resources
                if r.get("url")
            }

            for future in as_completed(future_to_resource):
                resource = future_to_resource[future]
                try:
                    is_valid, status_code = future.result()

                    if not is_valid:
                        self.validation_results["broken_links"].append(
                            {
                                "id": resource["id"],
                                "title": resource["title"],
                                "url": resource["url"],
                                "status_code": status_code,
                                "category": resource["category"],
                            }
                        )
                        logger.warning(
                            f"Broken link [{status_code}]: {resource['title']} - {resource['url']}"
                        )
                except Exception as e:
                    logger.error(f"Error checking {resource['title']}: {e}")

    def validate_dates(self, resource: Dict[str, Any]) -> List[str]:
        """
        Validate date fields in resource.
    
        Args:
            resource: Resource dictionary
        
        Returns:
            List of validation errors (empty if all valid)
        """
        errors = []
    
        # Check deadline format
        if resource.get('deadline'):
            try:
                # Deadline is just a date, not datetime
                if isinstance(resource['deadline'], str):
                    datetime.strptime(resource['deadline'], '%Y-%m-%d')
            except (ValueError, TypeError):
                errors.append(f"Invalid deadline format: {resource['deadline']}")
    
        # Check last_updated (more robust handling)
        if resource.get('last_updated'):
            try:
                from dateutil import parser
            
                # Use dateutil.parser which handles all ISO 8601 formats
                last_updated = parser.parse(str(resource['last_updated']))
            
                # Make timezone-naive for comparison
                if last_updated.tzinfo is not None:
                    last_updated = last_updated.replace(tzinfo=None)
            
                days_old = (datetime.now() - last_updated).days
            
                if days_old > STALE_DATA_THRESHOLD_DAYS:
                    self.validation_results['stale_data'].append({
                        'id': resource['id'],
                        'title': resource['title'],
                        'days_old': days_old,
                        'last_updated': resource['last_updated']
                    })
            except Exception as e:
                # Only add error if parsing truly fails
                errors.append(f"Could not parse last_updated: {resource['last_updated']}")
    
        return errors

    def validate_required_fields(self, resource: Dict[str, Any]) -> List[str]:
        """
        Check for missing required fields.

        Args:
            resource: Resource dictionary

        Returns:
            List of missing field names
        """
        required_fields = ["title", "category", "country"]
        missing = []

        for field in required_fields:
            if not resource.get(field):
                missing.append(field)

        # Category-specific required fields
        if resource.get("category") == "scholarship":
            if not resource.get("institution"):
                missing.append("institution (required for scholarships)")

        return missing

    def validate_all_resources(self, category: str = None) -> None:
        """
        Run all validation checks on resources.

        Args:
            category: Optional category filter
        """
        logger.info("Fetching resources from database...")
        resources = self.db.get_all_resources(category)

        self.validation_results["total_resources"] = len(resources)
        logger.info(f"Validating {len(resources)} resources...")

        # Check required fields and dates
        for resource in resources:
            # Check required fields
            missing_fields = self.validate_required_fields(resource)
            if missing_fields:
                self.validation_results["missing_fields"].append(
                    {
                        "id": resource["id"],
                        "title": resource["title"],
                        "missing": missing_fields,
                    }
                )

            # Validate dates
            date_errors = self.validate_dates(resource)
            if date_errors:
                self.validation_results["invalid_dates"].append(
                    {
                        "id": resource["id"],
                        "title": resource["title"],
                        "errors": date_errors,
                    }
                )

            # If all checks passed
            if not missing_fields and not date_errors:
                self.validation_results["passed"].append(resource["id"])

        # Check URLs (parallel)
        self.check_links_parallel(resources)

    def generate_report(self) -> str:
        """
        Generate human-readable validation report.

        Returns:
            Report string
        """
        report = []
        report.append("\n" + "=" * 60)
        report.append("DATA VALIDATION REPORT")
        report.append("=" * 60)
        report.append(f"Timestamp: {datetime.now().isoformat()}")
        report.append(f"Total Resources: {self.validation_results['total_resources']}")
        report.append("")

        # Summary
        issues_count = (
            len(self.validation_results["broken_links"])
            + len(self.validation_results["stale_data"])
            + len(self.validation_results["invalid_dates"])
            + len(self.validation_results["missing_fields"])
        )

        if issues_count == 0:
            report.append("✅ All validations passed!")
        else:
            report.append(f"⚠️  Found {issues_count} issues")

        report.append("")

        # Broken Links
        if self.validation_results["broken_links"]:
            report.append(
                f"🔗 BROKEN LINKS ({len(self.validation_results['broken_links'])})"
            )
            report.append("-" * 60)
            for item in self.validation_results["broken_links"]:
                report.append(
                    f"  [{item['status_code']}] {item['title']}\n"
                    f"    URL: {item['url']}\n"
                    f"    Category: {item['category']}"
                )
            report.append("")

        # Stale Data
        if self.validation_results["stale_data"]:
            report.append(
                f"📅 STALE DATA ({len(self.validation_results['stale_data'])})"
            )
            report.append("-" * 60)
            for item in self.validation_results["stale_data"]:
                report.append(
                    f"  {item['title']}\n"
                    f"    Last updated: {item['last_updated']}\n"
                    f"    Days old: {item['days_old']}"
                )
            report.append("")

        # Invalid Dates
        if self.validation_results["invalid_dates"]:
            report.append(
                f"📆 INVALID DATES ({len(self.validation_results['invalid_dates'])})"
            )
            report.append("-" * 60)
            for item in self.validation_results["invalid_dates"]:
                report.append(f"  {item['title']}")
                for error in item["errors"]:
                    report.append(f"    - {error}")
            report.append("")

        # Missing Fields
        if self.validation_results["missing_fields"]:
            report.append(
                f"📝 MISSING FIELDS ({len(self.validation_results['missing_fields'])})"
            )
            report.append("-" * 60)
            for item in self.validation_results["missing_fields"]:
                report.append(f"  {item['title']}")
                report.append(f"    Missing: {', '.join(item['missing'])}")
            report.append("")

        report.append("=" * 60)

        return "\n".join(report)

    def save_report(self, filename: str = "validation_report.txt") -> None:
        """
        Save validation report to file.

        Args:
            filename: Output filename
        """
        report = self.generate_report()

        output_path = Path("logs") / filename
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(report)

        logger.info(f"Report saved to {output_path}")


def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(description="Validate resource data")
    parser.add_argument(
        "--category",
        choices=["scholarship", "visa", "job", "university"],
        help="Validate specific category only",
    )
    parser.add_argument(
        "--output", default="validation_report.txt", help="Output report filename"
    )

    args = parser.parse_args()

    # Create logs directory
    Path("logs").mkdir(exist_ok=True)

    validator = DataValidator()

    print("=" * 60)
    print("Nepali Abroad Helper - Data Validator")
    print("=" * 60)

    # Run validation
    validator.validate_all_resources(args.category)

    # Generate and display report
    report = validator.generate_report()
    print(report)

    # Save report
    validator.save_report(args.output)

    print(f"\n✅ Validation complete! Report saved to logs/{args.output}")


if __name__ == "__main__":
    main()
