// Category Service - Apper Backend Integration
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.tableName = 'category';
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

  async getAllCategories() {
    try {
      await delay(400);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "slug" } },
          { field: { Name: "icon" } },
          { field: { Name: "color" } },
          { field: { Name: "description" } },
          { field: { Name: "game_count" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
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
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
      return [];
    }
  }

  async getCategoryById(id) {
    try {
      await delay(300);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "slug" } },
          { field: { Name: "icon" } },
          { field: { Name: "color" } },
          { field: { Name: "description" } },
          { field: { Name: "game_count" } },
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
      console.error(`Error fetching category with ID ${id}:`, error);
      toast.error(`Failed to fetch category`);
      return null;
    }
  }

  async getCategoryBySlug(slug) {
    try {
      await delay(300);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "slug" } },
          { field: { Name: "icon" } },
          { field: { Name: "color" } },
          { field: { Name: "description" } },
          { field: { Name: "game_count" } },
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
        throw new Error(`Category with slug ${slug} not found`);
      }

      return response.data[0];
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      toast.error(`Failed to fetch category`);
      return null;
    }
  }

  async createCategory(categoryData) {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: categoryData.Name || categoryData.name,
          Tags: categoryData.Tags || '',
          Owner: categoryData.Owner,
          slug: categoryData.slug || this.generateSlug(categoryData.Name || categoryData.name),
          icon: categoryData.icon || '',
          color: categoryData.color || '',
          description: categoryData.description || '',
          game_count: categoryData.game_count || 0,
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
          toast.success('Category created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      return null;
    }
  }

  async updateCategory(id, categoryData) {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: categoryData.Name || categoryData.name,
          Tags: categoryData.Tags || '',
          Owner: categoryData.Owner,
          slug: categoryData.slug,
          icon: categoryData.icon || '',
          color: categoryData.color || '',
          description: categoryData.description || '',
          game_count: categoryData.game_count || 0,
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
          toast.success('Category updated successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
      return null;
    }
  }

  async deleteCategory(id) {
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
          toast.success('Category deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      return false;
    }
  }

  async updateGameCount(categoryId, count) {
    try {
      await delay(200);
      
      const params = {
        records: [{
          Id: parseInt(categoryId),
          game_count: count,
          updated_at: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating game count:', error);
      return false;
    }
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async getCategoryStats() {
    try {
      await delay(300);
      
      const categories = await this.getAllCategories();
      
      return {
        total: categories.length,
        totalGames: categories.reduce((sum, cat) => sum + (cat.game_count || 0), 0),
        averageGamesPerCategory: categories.length > 0 
          ? Math.round(categories.reduce((sum, cat) => sum + (cat.game_count || 0), 0) / categories.length)
          : 0,
        mostPopular: categories.sort((a, b) => (b.game_count || 0) - (a.game_count || 0))[0]
      };
    } catch (error) {
      console.error('Error getting category stats:', error);
      return {
        total: 0,
        totalGames: 0,
        averageGamesPerCategory: 0,
        mostPopular: null
      };
    }
  }
}

export const categoryService = new CategoryService();