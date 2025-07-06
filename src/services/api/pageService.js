// Page Service - Apper Backend Integration
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PageService {
  constructor() {
    this.tableName = 'page';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAllPages() {
    try {
      await delay(400);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "slug" } },
          { field: { Name: "content" } },
          { field: { Name: "meta_title" } },
          { field: { Name: "meta_description" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [
          { fieldName: "title", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Failed to fetch pages');
      return [];
    }
  }

  async getPublishedPages() {
    try {
      await delay(400);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "slug" } },
          { field: { Name: "content" } },
          { field: { Name: "meta_title" } },
          { field: { Name: "meta_description" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "status", Operator: "EqualTo", Values: ["published"] }
        ],
        orderBy: [
          { fieldName: "title", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching published pages:', error);
      toast.error('Failed to fetch published pages');
      return [];
    }
  }

  async getPageById(id) {
    try {
      await delay(300);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "slug" } },
          { field: { Name: "content" } },
          { field: { Name: "meta_title" } },
          { field: { Name: "meta_description" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching page with ID ${id}:`, error);
      toast.error(`Failed to fetch page`);
      return null;
    }
  }

  async getPageBySlug(slug) {
    try {
      await delay(300);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "slug" } },
          { field: { Name: "content" } },
          { field: { Name: "meta_title" } },
          { field: { Name: "meta_description" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "slug", Operator: "EqualTo", Values: [slug] }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        throw new Error(`Page with slug ${slug} not found`);
      }

      return response.data[0];
    } catch (error) {
      console.error(`Error fetching page with slug ${slug}:`, error);
      toast.error(`Failed to fetch page`);
      return null;
    }
  }

  async createPage(pageData) {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: pageData.Name || pageData.title,
          Tags: pageData.Tags || '',
          Owner: pageData.Owner,
          title: pageData.title || '',
          slug: pageData.slug || this.generateSlug(pageData.title),
          content: pageData.content || '',
          meta_title: pageData.meta_title || '',
          meta_description: pageData.meta_description || '',
          status: pageData.status || 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Page created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Failed to create page');
      return null;
    }
  }

  async updatePage(id, pageData) {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: pageData.Name || pageData.title,
          Tags: pageData.Tags || '',
          Owner: pageData.Owner,
          title: pageData.title || '',
          slug: pageData.slug,
          content: pageData.content || '',
          meta_title: pageData.meta_title || '',
          meta_description: pageData.meta_description || '',
          status: pageData.status || 'draft',
          updated_at: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Page updated successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating page:', error);
      toast.error('Failed to update page');
      return null;
    }
  }

  async deletePage(id) {
    try {
      await delay(400);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Page deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
      return false;
    }
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async getPageStats() {
    try {
      await delay(300);
      
      const pages = await this.getAllPages();
      
      return {
        total: pages.length,
        published: pages.filter(p => p.status === 'published').length,
        draft: pages.filter(p => p.status === 'draft').length,
        recent: pages.filter(p => {
          const pageDate = new Date(p.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return pageDate > weekAgo;
        }).length
      };
    } catch (error) {
      console.error('Error getting page stats:', error);
      return {
        total: 0,
        published: 0,
        draft: 0,
        recent: 0
      };
    }
  }
}

export const pageService = new PageService();