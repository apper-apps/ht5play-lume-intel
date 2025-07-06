// Ad Service - Apper Backend Integration
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AdService {
  constructor() {
    this.tableName = 'ad';
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

  async getAllAds() {
    try {
      await delay(400);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "slot" } },
          { field: { Name: "code" } },
          { field: { Name: "active" } },
          { field: { Name: "position" } },
          { field: { Name: "type" } },
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
      console.error('Error fetching ads:', error);
      toast.error('Failed to fetch ads');
      return [];
    }
  }

  async getActiveAds() {
    try {
      await delay(400);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "slot" } },
          { field: { Name: "code" } },
          { field: { Name: "active" } },
          { field: { Name: "position" } },
          { field: { Name: "type" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "active", Operator: "EqualTo", Values: [true] }
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
      console.error('Error fetching active ads:', error);
      toast.error('Failed to fetch active ads');
      return [];
    }
  }

  async getAdById(id) {
    try {
      await delay(300);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "slot" } },
          { field: { Name: "code" } },
          { field: { Name: "active" } },
          { field: { Name: "position" } },
          { field: { Name: "type" } },
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
      console.error(`Error fetching ad with ID ${id}:`, error);
      toast.error(`Failed to fetch ad`);
      return null;
    }
  }

  async getAdBySlot(slot) {
    try {
      await delay(300);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "slot" } },
          { field: { Name: "code" } },
          { field: { Name: "active" } },
          { field: { Name: "position" } },
          { field: { Name: "type" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "slot", Operator: "EqualTo", Values: [slot] }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      return response.data[0];
    } catch (error) {
      console.error(`Error fetching ad with slot ${slot}:`, error);
      return null;
    }
  }

  async getAdsByPosition(position) {
    try {
      await delay(300);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "slot" } },
          { field: { Name: "code" } },
          { field: { Name: "active" } },
          { field: { Name: "position" } },
          { field: { Name: "type" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "position", Operator: "EqualTo", Values: [position] },
          { FieldName: "active", Operator: "EqualTo", Values: [true] }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching ads by position ${position}:`, error);
      return [];
    }
  }

  async createAd(adData) {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: adData.Name || adData.name,
          Tags: adData.Tags || '',
          Owner: adData.Owner,
          slot: adData.slot || '',
          code: adData.code || '',
          active: adData.active || false,
          position: adData.position || '',
          type: adData.type || '',
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
          toast.success('Ad created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error('Failed to create ad');
      return null;
    }
  }

  async updateAd(id, adData) {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: adData.Name || adData.name,
          Tags: adData.Tags || '',
          Owner: adData.Owner,
          slot: adData.slot || '',
          code: adData.code || '',
          active: adData.active || false,
          position: adData.position || '',
          type: adData.type || '',
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
          toast.success('Ad updated successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating ad:', error);
      toast.error('Failed to update ad');
      return null;
    }
  }

  async updateAdBySlot(slot, adData) {
    try {
      const existingAd = await this.getAdBySlot(slot);
      
      if (existingAd) {
        return await this.updateAd(existingAd.Id, adData);
      } else {
        return await this.createAd({ ...adData, slot });
      }
    } catch (error) {
      console.error('Error updating ad by slot:', error);
      toast.error('Failed to update ad');
      return null;
    }
  }

  async deleteAd(id) {
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
          toast.success('Ad deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('Failed to delete ad');
      return false;
    }
  }

  async toggleActive(id) {
    try {
      await delay(400);
      
      const ad = await this.getAdById(id);
      if (!ad) {
        throw new Error(`Ad with ID ${id} not found`);
      }

      const params = {
        records: [{
          Id: parseInt(id),
          active: !ad.active,
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
          toast.success(`Ad ${result.data.active ? 'activated' : 'deactivated'} successfully`);
          return result.data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error toggling ad active status:', error);
      toast.error('Failed to toggle ad status');
      return null;
    }
  }

  async getAdStats() {
    try {
      await delay(300);
      
      const ads = await this.getAllAds();
      
      return {
        total: ads.length,
        active: ads.filter(a => a.active).length,
        inactive: ads.filter(a => !a.active).length,
        byPosition: ads.reduce((acc, ad) => {
          acc[ad.position] = (acc[ad.position] || 0) + 1;
          return acc;
        }, {}),
        byType: ads.reduce((acc, ad) => {
          acc[ad.type] = (acc[ad.type] || 0) + 1;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error getting ad stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        byPosition: {},
        byType: {}
      };
    }
  }

  generateAdsTxt(publisherId) {
    return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n# This ads.txt file was generated by HT5Play Admin Panel\n# Last updated: ${new Date().toISOString()}`;
  }
}

export const adService = new AdService();