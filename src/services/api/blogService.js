// Blog Service - Apper Backend Integration
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BlogService {
  constructor() {
    this.tableName = 'blog';
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

  async getAllBlogs() {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "slug" } },
          { field: { Name: "content" } },
          { field: { Name: "excerpt" } },
          { field: { Name: "featured_image" } },
          { field: { Name: "author" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } },
          { field: { Name: "views" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
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
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
      return [];
    }
  }

  async getPublishedBlogs() {
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
          { field: { Name: "excerpt" } },
          { field: { Name: "featured_image" } },
          { field: { Name: "author" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } },
          { field: { Name: "views" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "status", Operator: "EqualTo", Values: ["published"] }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
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
      console.error('Error fetching published blogs:', error);
      toast.error('Failed to fetch published blogs');
      return [];
    }
  }

  async getBlogById(id) {
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
          { field: { Name: "excerpt" } },
          { field: { Name: "featured_image" } },
          { field: { Name: "author" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } },
          { field: { Name: "views" } },
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
      console.error(`Error fetching blog with ID ${id}:`, error);
      toast.error(`Failed to fetch blog`);
      return null;
    }
  }

  async getBlogBySlug(slug) {
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
          { field: { Name: "excerpt" } },
          { field: { Name: "featured_image" } },
          { field: { Name: "author" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } },
          { field: { Name: "views" } },
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
        throw new Error(`Blog with slug ${slug} not found`);
      }

      return response.data[0];
    } catch (error) {
      console.error(`Error fetching blog with slug ${slug}:`, error);
      toast.error(`Failed to fetch blog`);
      return null;
    }
  }

  async getFeaturedBlogs() {
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
          { field: { Name: "excerpt" } },
          { field: { Name: "featured_image" } },
          { field: { Name: "author" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } },
          { field: { Name: "views" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "featured", Operator: "EqualTo", Values: [true] },
          { FieldName: "status", Operator: "EqualTo", Values: ["published"] }
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
      console.error('Error fetching featured blogs:', error);
      toast.error('Failed to fetch featured blogs');
      return [];
    }
  }

  async getRecentBlogs(limit = 5) {
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
          { field: { Name: "excerpt" } },
          { field: { Name: "featured_image" } },
          { field: { Name: "author" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } },
          { field: { Name: "views" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "status", Operator: "EqualTo", Values: ["published"] }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching recent blogs:', error);
      toast.error('Failed to fetch recent blogs');
      return [];
    }
  }

  async createBlog(blogData) {
    try {
      await delay(600);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: blogData.Name || blogData.title,
          Tags: blogData.Tags || '',
          Owner: blogData.Owner,
          title: blogData.title || '',
          slug: blogData.slug || this.generateSlug(blogData.title),
          content: blogData.content || '',
          excerpt: blogData.excerpt || '',
          featured_image: blogData.featured_image || '',
          author: blogData.author || '',
          status: blogData.status || 'draft',
          featured: blogData.featured || false,
          views: blogData.views || 0,
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
          toast.success('Blog created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('Failed to create blog');
      return null;
    }
  }

  async updateBlog(id, blogData) {
    try {
      await delay(600);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: blogData.Name || blogData.title,
          Tags: blogData.Tags || '',
          Owner: blogData.Owner,
          title: blogData.title || '',
          slug: blogData.slug,
          content: blogData.content || '',
          excerpt: blogData.excerpt || '',
          featured_image: blogData.featured_image || '',
          author: blogData.author || '',
          status: blogData.status || 'draft',
          featured: blogData.featured || false,
          views: blogData.views || 0,
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
          toast.success('Blog updated successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
      return null;
    }
  }

  async deleteBlog(id) {
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
          toast.success('Blog deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
      return false;
    }
  }

  async incrementViews(id) {
    try {
      await delay(200);
      
      const blog = await this.getBlogById(id);
      if (!blog) return;

      const params = {
        records: [{
          Id: parseInt(id),
          views: (blog.views || 0) + 1
        }]
      };

      await this.apperClient.updateRecord(this.tableName, params);
    } catch (error) {
      console.error('Error incrementing blog views:', error);
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

  async getBlogStats() {
    try {
      await delay(300);
      
      const blogs = await this.getAllBlogs();
      
      return {
        total: blogs.length,
        published: blogs.filter(b => b.status === 'published').length,
        draft: blogs.filter(b => b.status === 'draft').length,
        featured: blogs.filter(b => b.featured).length,
        totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)
      };
    } catch (error) {
      console.error('Error getting blog stats:', error);
      return {
        total: 0,
        published: 0,
        draft: 0,
        featured: 0,
        totalViews: 0
      };
    }
  }
}

export const blogService = new BlogService();