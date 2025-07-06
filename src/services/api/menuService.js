// Menu Service - Apper Backend Integration
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MenuService {
  constructor() {
    this.tableName = 'menu';
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

  async getAllMenus() {
    try {
      await delay(400);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "location" } },
          { field: { Name: "label" } },
          { field: { Name: "link" } },
          { field: { Name: "type" } },
          { field: { Name: "order" } },
          { field: { Name: "parent_id" } },
          { field: { Name: "target" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [
          { fieldName: "location", sorttype: "ASC" },
          { fieldName: "order", sorttype: "ASC" }
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
      console.error('Error fetching menus:', error);
      toast.error('Failed to fetch menus');
      return [];
    }
  }

  async getMenusByLocation(location) {
    try {
      await delay(300);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "location" } },
          { field: { Name: "label" } },
          { field: { Name: "link" } },
          { field: { Name: "type" } },
          { field: { Name: "order" } },
          { field: { Name: "parent_id" } },
          { field: { Name: "target" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "location", Operator: "EqualTo", Values: [location] }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
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
      console.error(`Error fetching menus by location ${location}:`, error);
      toast.error('Failed to fetch menus');
      return [];
    }
  }

  async getMenuById(id) {
    try {
      await delay(300);
      
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "location" } },
          { field: { Name: "label" } },
          { field: { Name: "link" } },
          { field: { Name: "type" } },
          { field: { Name: "order" } },
          { field: { Name: "parent_id" } },
          { field: { Name: "target" } },
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
      console.error(`Error fetching menu with ID ${id}:`, error);
      toast.error(`Failed to fetch menu`);
      return null;
    }
  }

  async createMenu(menuData) {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      // Get next order if not provided
      const order = menuData.order || await this.getNextOrder(menuData.location);
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: menuData.Name || menuData.label,
          Tags: menuData.Tags || '',
          Owner: menuData.Owner,
          location: menuData.location || '',
          label: menuData.label || '',
          link: menuData.link || '',
          type: menuData.type || '',
          order: order,
          parent_id: menuData.parent_id || null,
          target: menuData.target || '_self',
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
          toast.success('Menu created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating menu:', error);
      toast.error('Failed to create menu');
      return null;
    }
  }

  async updateMenu(id, menuData) {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: menuData.Name || menuData.label,
          Tags: menuData.Tags || '',
          Owner: menuData.Owner,
          location: menuData.location || '',
          label: menuData.label || '',
          link: menuData.link || '',
          type: menuData.type || '',
          order: menuData.order,
          parent_id: menuData.parent_id || null,
          target: menuData.target || '_self',
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
          toast.success('Menu updated successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating menu:', error);
      toast.error('Failed to update menu');
      return null;
    }
  }

  async deleteMenu(id) {
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
          toast.success('Menu deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Failed to delete menu');
      return false;
    }
  }

  async reorderMenus(location, menuIds) {
    try {
      await delay(500);
      
      if (!this.apperClient) this.initializeClient();
      
      const records = menuIds.map((id, index) => ({
        Id: parseInt(id),
        order: index + 1,
        updated_at: new Date().toISOString()
      }));

      const params = { records };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      toast.success('Menu order updated successfully');
      return true;
    } catch (error) {
      console.error('Error reordering menus:', error);
      toast.error('Failed to reorder menus');
      return false;
    }
  }

  async getNextOrder(location) {
    try {
      const locationMenus = await this.getMenusByLocation(location);
      return locationMenus.length > 0 
        ? Math.max(...locationMenus.map(m => m.order || 0)) + 1 
        : 1;
    } catch (error) {
      console.error('Error getting next order:', error);
      return 1;
    }
  }

  async buildMenuTree(location) {
    try {
      await delay(300);
      const menus = await this.getMenusByLocation(location);
      
      const menuMap = new Map();
      const roots = [];
      
      // Create menu map
      menus.forEach(menu => {
        menuMap.set(menu.Id, { ...menu, children: [] });
      });
      
      // Build tree structure
      menus.forEach(menu => {
        const menuNode = menuMap.get(menu.Id);
        if (menu.parent_id) {
          const parent = menuMap.get(menu.parent_id);
          if (parent) {
            parent.children.push(menuNode);
          }
        } else {
          roots.push(menuNode);
        }
      });
      
      return roots;
    } catch (error) {
      console.error('Error building menu tree:', error);
      return [];
    }
  }

  async getMenuStats() {
    try {
      await delay(300);
      
      const menus = await this.getAllMenus();
      
      return {
        total: menus.length,
        byLocation: menus.reduce((acc, menu) => {
          acc[menu.location] = (acc[menu.location] || 0) + 1;
          return acc;
        }, {}),
        byType: menus.reduce((acc, menu) => {
          acc[menu.type] = (acc[menu.type] || 0) + 1;
          return acc;
        }, {}),
        withChildren: menus.filter(m => m.parent_id).length
      };
    } catch (error) {
      console.error('Error getting menu stats:', error);
      return {
        total: 0,
        byLocation: {},
        byType: {},
        withChildren: 0
      };
    }
  }
}

export const menuService = new MenuService();