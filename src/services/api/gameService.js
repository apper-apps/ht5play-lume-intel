// Game Service - Apper Backend Integration
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameService {
  constructor() {
    this.tableName = 'game';
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

  async getAllGames() {
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
          { field: { Name: "description" } },
          { field: { Name: "url" } },
          { field: { Name: "thumb" } },
          { field: { Name: "featured" } },
          { field: { Name: "plays" } },
          { field: { Name: "rating" } },
          { field: { Name: "width" } },
          { field: { Name: "height" } },
          { field: { Name: "source" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
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
      console.error('Error fetching games:', error);
      toast.error('Failed to fetch games');
      return [];
    }
  }

  async getGameById(id) {
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
          { field: { Name: "description" } },
          { field: { Name: "url" } },
          { field: { Name: "thumb" } },
          { field: { Name: "featured" } },
          { field: { Name: "plays" } },
          { field: { Name: "rating" } },
          { field: { Name: "width" } },
          { field: { Name: "height" } },
          { field: { Name: "source" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
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
      console.error(`Error fetching game with ID ${id}:`, error);
      toast.error(`Failed to fetch game`);
      return null;
    }
  }

  async getGameBySlug(slug) {
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
          { field: { Name: "description" } },
          { field: { Name: "url" } },
          { field: { Name: "thumb" } },
          { field: { Name: "featured" } },
          { field: { Name: "plays" } },
          { field: { Name: "rating" } },
          { field: { Name: "width" } },
          { field: { Name: "height" } },
          { field: { Name: "source" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
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
        throw new Error(`Game with slug ${slug} not found`);
      }

      return response.data[0];
    } catch (error) {
      console.error(`Error fetching game with slug ${slug}:`, error);
      toast.error(`Failed to fetch game`);
      return null;
    }
  }

  async getFeaturedGames() {
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
          { field: { Name: "description" } },
          { field: { Name: "url" } },
          { field: { Name: "thumb" } },
          { field: { Name: "featured" } },
          { field: { Name: "plays" } },
          { field: { Name: "rating" } },
          { field: { Name: "width" } },
          { field: { Name: "height" } },
          { field: { Name: "source" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          { FieldName: "featured", Operator: "EqualTo", Values: [true] }
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
      console.error('Error fetching featured games:', error);
      toast.error('Failed to fetch featured games');
      return [];
    }
  }

  async getGamesByCategory(categoryId) {
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
          { field: { Name: "description" } },
          { field: { Name: "url" } },
          { field: { Name: "thumb" } },
          { field: { Name: "featured" } },
          { field: { Name: "plays" } },
          { field: { Name: "rating" } },
          { field: { Name: "width" } },
          { field: { Name: "height" } },
          { field: { Name: "source" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          { FieldName: "category_id", Operator: "EqualTo", Values: [parseInt(categoryId)] }
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
      console.error(`Error fetching games by category ${categoryId}:`, error);
      toast.error('Failed to fetch games');
      return [];
    }
  }

  async searchGames(query) {
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
          { field: { Name: "description" } },
          { field: { Name: "url" } },
          { field: { Name: "thumb" } },
          { field: { Name: "featured" } },
          { field: { Name: "plays" } },
          { field: { Name: "rating" } },
          { field: { Name: "width" } },
          { field: { Name: "height" } },
          { field: { Name: "source" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "category_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "title", operator: "Contains", values: [query] }
              ]
            },
            {
              conditions: [
                { fieldName: "description", operator: "Contains", values: [query] }
              ]
            }
          ]
        }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error searching games with query ${query}:`, error);
      toast.error('Failed to search games');
      return [];
    }
  }

  async createGame(gameData) {
    try {
      await delay(600);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: gameData.Name || gameData.title,
          Tags: gameData.Tags || '',
          Owner: gameData.Owner,
          title: gameData.title || '',
          slug: gameData.slug || this.generateSlug(gameData.title),
          description: gameData.description || '',
          url: gameData.url || '',
          thumb: gameData.thumb || '',
          featured: gameData.featured || false,
          plays: gameData.plays || 0,
          rating: gameData.rating || 0,
          width: gameData.width || 800,
          height: gameData.height || 600,
          source: gameData.source || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category_id: parseInt(gameData.category_id) || null
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
          toast.success('Game created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game');
      return null;
    }
  }

  async updateGame(id, gameData) {
    try {
      await delay(600);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: gameData.Name || gameData.title,
          Tags: gameData.Tags || '',
          Owner: gameData.Owner,
          title: gameData.title || '',
          slug: gameData.slug,
          description: gameData.description || '',
          url: gameData.url || '',
          thumb: gameData.thumb || '',
          featured: gameData.featured || false,
          plays: gameData.plays || 0,
          rating: gameData.rating || 0,
          width: gameData.width || 800,
          height: gameData.height || 600,
          source: gameData.source || '',
          updated_at: new Date().toISOString(),
          category_id: parseInt(gameData.category_id) || null
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
          toast.success('Game updated successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating game:', error);
      toast.error('Failed to update game');
      return null;
    }
  }

  async deleteGame(id) {
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
          toast.success('Game deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting game:', error);
      toast.error('Failed to delete game');
      return false;
    }
  }

  async toggleFeatured(id) {
    try {
      await delay(400);
      
      const game = await this.getGameById(id);
      if (!game) {
        throw new Error(`Game with ID ${id} not found`);
      }

      const params = {
        records: [{
          Id: parseInt(id),
          featured: !game.featured,
          updated_at: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success(`Game ${result.data.featured ? 'featured' : 'unfeatured'} successfully`);
          return result.data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error toggling game featured status:', error);
      toast.error('Failed to toggle game featured status');
      return null;
    }
  }

  async incrementPlays(id) {
    try {
      await delay(200);
      
      const game = await this.getGameById(id);
      if (!game) return;

      const params = {
        records: [{
          Id: parseInt(id),
          plays: (game.plays || 0) + 1
        }]
      };

      await this.apperClient.updateRecord(this.tableName, params);
    } catch (error) {
      console.error('Error incrementing game plays:', error);
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

  async getGameStats() {
    try {
      await delay(300);
      
      const games = await this.getAllGames();
      
      return {
        total: games.length,
        featured: games.filter(g => g.featured).length,
        recent: games.filter(g => {
          const gameDate = new Date(g.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return gameDate > weekAgo;
        }).length,
        bySource: games.reduce((acc, game) => {
          acc[game.source] = (acc[game.source] || 0) + 1;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error getting game stats:', error);
      return {
        total: 0,
        featured: 0,
        recent: 0,
        bySource: {}
      };
    }
  }
}

export const gameService = new GameService();