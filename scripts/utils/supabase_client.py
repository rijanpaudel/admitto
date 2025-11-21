"""
Supabase client utilities for database operations.
"""

import logging
from typing import List, Dict, Any, Optional
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseManager:
    """
    Manage Supabase database operations for resource management.
    """
    
    def __init__(self):
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment")
        
        self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.logger = logger
    
    def upsert_resource(self, resource_data: Dict[str, Any]) -> bool:
        """
        Insert or update a resource in the database.
        
        Args:
            resource_data: Resource dictionary with fields matching database schema
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Check if resource exists by title
            existing = self.client.table('resources')\
                .select('id')\
                .eq('title', resource_data['title'])\
                .execute()
            
            if existing.data:
                # Update existing resource
                resource_id = existing.data[0]['id']
                self.client.table('resources')\
                    .update(resource_data)\
                    .eq('id', resource_id)\
                    .execute()
                self.logger.info(f"Updated resource: {resource_data['title']}")
            else:
                # Insert new resource
                self.client.table('resources')\
                    .insert(resource_data)\
                    .execute()
                self.logger.info(f"Inserted new resource: {resource_data['title']}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error upserting resource: {e}")
            return False
    
    def bulk_upsert_resources(self, resources: List[Dict[str, Any]]) -> Dict[str, int]:
        """
        Bulk insert/update multiple resources.
        
        Args:
            resources: List of resource dictionaries
            
        Returns:
            Dictionary with 'success' and 'failed' counts
        """
        results = {'success': 0, 'failed': 0}
        
        for resource in resources:
            if self.upsert_resource(resource):
                results['success'] += 1
            else:
                results['failed'] += 1
        
        self.logger.info(
            f"Bulk upsert complete: {results['success']} succeeded, "
            f"{results['failed']} failed"
        )
        
        return results
    
    def get_all_resources(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetch all resources, optionally filtered by category.
        
        Args:
            category: Optional category filter (scholarship, visa, job, university)
            
        Returns:
            List of resource dictionaries
        """
        try:
            query = self.client.table('resources').select('*')
            
            if category:
                query = query.eq('category', category)
            
            response = query.execute()
            return response.data or []
            
        except Exception as e:
            self.logger.error(f"Error fetching resources: {e}")
            return []
    
    def delete_resource(self, resource_id: str) -> bool:
        """
        Delete a resource by ID.
        
        Args:
            resource_id: UUID of resource to delete
            
        Returns:
            True if successful, False otherwise
        """
        try:
            self.client.table('resources').delete().eq('id', resource_id).execute()
            self.logger.info(f"Deleted resource: {resource_id}")
            return True
        except Exception as e:
            self.logger.error(f"Error deleting resource: {e}")
            return False