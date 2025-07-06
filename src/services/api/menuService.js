// Menu Service - Mock implementation with localStorage
const STORAGE_KEY = 'ht5play_menus'

// Mock menu data
const mockMenus = [
  {
    id: 1,
    location: 'header',
    label: 'Home',
    link: '/',
    type: 'internal',
    order: 1,
    parent_id: null,
    target: '_self',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    location: 'header',
    label: 'Games',
    link: '/search',
    type: 'internal',
    order: 2,
    parent_id: null,
    target: '_self',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    location: 'header',
    label: 'Categories',
    link: '/categories',
    type: 'internal',
    order: 3,
    parent_id: null,
    target: '_self',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    location: 'header',
    label: 'Blog',
    link: '/blog',
    type: 'internal',
    order: 4,
    parent_id: null,
    target: '_self',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    location: 'footer',
    label: 'Privacy Policy',
    link: '/privacy-policy',
    type: 'page',
    order: 1,
    parent_id: null,
    target: '_self',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    location: 'footer',
    label: 'Terms of Service',
    link: '/terms-of-service',
    type: 'page',
    order: 2,
    parent_id: null,
    target: '_self',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 7,
    location: 'footer',
    label: 'Contact',
    link: '/contact-us',
    type: 'page',
    order: 3,
    parent_id: null,
    target: '_self',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

class MenuService {
  constructor() {
    this.initializeStorage()
  }

  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMenus))
    }
  }

  getMenus() {
    try {
      const menus = localStorage.getItem(STORAGE_KEY)
      return menus ? JSON.parse(menus) : []
    } catch (error) {
      console.error('Error loading menus:', error)
      return mockMenus
    }
  }

  async getAllMenus() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return this.getMenus()
  }

  async getMenusByLocation(location) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const menus = this.getMenus()
    return menus
      .filter(menu => menu.location === location)
      .sort((a, b) => a.order - b.order)
  }

  async getMenuById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const menus = this.getMenus()
    const menu = menus.find(m => m.id === parseInt(id))
    
    if (!menu) {
      throw new Error(`Menu with ID ${id} not found`)
    }
    
    return menu
  }

  async createMenu(menuData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const menus = this.getMenus()
    const newMenu = {
      id: Math.max(...menus.map(m => m.id)) + 1,
      ...menuData,
      order: menuData.order || this.getNextOrder(menus, menuData.location),
      parent_id: menuData.parent_id || null,
      target: menuData.target || '_self',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    menus.push(newMenu)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menus))
    return newMenu
  }

  async updateMenu(id, menuData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const menus = this.getMenus()
    const index = menus.findIndex(m => m.id === parseInt(id))
    
    if (index === -1) {
      throw new Error(`Menu with ID ${id} not found`)
    }
    
    menus[index] = {
      ...menus[index],
      ...menuData,
      updated_at: new Date().toISOString()
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menus))
    return menus[index]
  }

  async deleteMenu(id) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const menus = this.getMenus()
    const filteredMenus = menus.filter(m => m.id !== parseInt(id))
    
    if (filteredMenus.length === menus.length) {
      throw new Error(`Menu with ID ${id} not found`)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMenus))
    return { success: true }
  }

  async reorderMenus(location, menuIds) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const menus = this.getMenus()
    
    menuIds.forEach((id, index) => {
      const menuIndex = menus.findIndex(m => m.id === parseInt(id))
      if (menuIndex !== -1) {
        menus[menuIndex].order = index + 1
        menus[menuIndex].updated_at = new Date().toISOString()
      }
    })
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menus))
    return { success: true }
  }

  getNextOrder(menus, location) {
    const locationMenus = menus.filter(m => m.location === location)
    return locationMenus.length > 0 
      ? Math.max(...locationMenus.map(m => m.order)) + 1 
      : 1
  }

  async buildMenuTree(location) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const menus = await this.getMenusByLocation(location)
    
    const menuMap = new Map()
    const roots = []
    
    // Create menu map
    menus.forEach(menu => {
      menuMap.set(menu.id, { ...menu, children: [] })
    })
    
    // Build tree structure
    menus.forEach(menu => {
      const menuNode = menuMap.get(menu.id)
      if (menu.parent_id) {
        const parent = menuMap.get(menu.parent_id)
        if (parent) {
          parent.children.push(menuNode)
        }
      } else {
        roots.push(menuNode)
      }
    })
    
    return roots
  }

  async getMenuStats() {
    await new Promise(resolve => setTimeout(resolve, 300))
    const menus = this.getMenus()
    
    return {
      total: menus.length,
      byLocation: menus.reduce((acc, menu) => {
        acc[menu.location] = (acc[menu.location] || 0) + 1
        return acc
      }, {}),
      byType: menus.reduce((acc, menu) => {
        acc[menu.type] = (acc[menu.type] || 0) + 1
        return acc
      }, {}),
      withChildren: menus.filter(m => m.parent_id).length
    }
  }
}

export const menuService = new MenuService()