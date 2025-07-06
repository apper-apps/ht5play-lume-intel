// Category Service - Mock implementation with localStorage
const STORAGE_KEY = 'ht5play_categories'

// Mock category data
const mockCategories = [
  {
    id: 1,
    name: 'Puzzle',
    slug: 'puzzle',
    icon: 'Puzzle',
    color: '#10B981',
    description: 'Challenge your mind with brain-teasing puzzles',
    game_count: 15,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Action',
    slug: 'action',
    icon: 'Zap',
    color: '#EF4444',
    description: 'Fast-paced action games for adrenaline junkies',
    game_count: 23,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Racing',
    slug: 'racing',
    icon: 'Car',
    color: '#F59E0B',
    description: 'High-speed racing games with realistic physics',
    game_count: 12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Sports',
    slug: 'sports',
    icon: 'Trophy',
    color: '#3B82F6',
    description: 'Sports games for all types of athletes',
    game_count: 18,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Strategy',
    slug: 'strategy',
    icon: 'Target',
    color: '#8B5CF6',
    description: 'Strategic games that test your planning skills',
    game_count: 9,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

class CategoryService {
  constructor() {
    this.initializeStorage()
  }

  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCategories))
    }
  }

  getCategories() {
    try {
      const categories = localStorage.getItem(STORAGE_KEY)
      return categories ? JSON.parse(categories) : []
    } catch (error) {
      console.error('Error loading categories:', error)
      return mockCategories
    }
  }

  async getAllCategories() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return this.getCategories()
  }

  async getCategoryById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const categories = this.getCategories()
    const category = categories.find(c => c.id === parseInt(id))
    
    if (!category) {
      throw new Error(`Category with ID ${id} not found`)
    }
    
    return category
  }

  async getCategoryBySlug(slug) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const categories = this.getCategories()
    const category = categories.find(c => c.slug === slug)
    
    if (!category) {
      throw new Error(`Category with slug ${slug} not found`)
    }
    
    return category
  }

  async createCategory(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const categories = this.getCategories()
    const newCategory = {
      id: Math.max(...categories.map(c => c.id)) + 1,
      ...categoryData,
      slug: this.generateSlug(categoryData.name),
      game_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    categories.push(newCategory)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    return newCategory
  }

  async updateCategory(id, categoryData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const categories = this.getCategories()
    const index = categories.findIndex(c => c.id === parseInt(id))
    
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`)
    }
    
    categories[index] = {
      ...categories[index],
      ...categoryData,
      updated_at: new Date().toISOString()
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    return categories[index]
  }

  async deleteCategory(id) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const categories = this.getCategories()
    const filteredCategories = categories.filter(c => c.id !== parseInt(id))
    
    if (filteredCategories.length === categories.length) {
      throw new Error(`Category with ID ${id} not found`)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCategories))
    return { success: true }
  }

  async updateGameCount(categoryId, count) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const categories = this.getCategories()
    const index = categories.findIndex(c => c.id === parseInt(categoryId))
    
    if (index !== -1) {
      categories[index].game_count = count
      categories[index].updated_at = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    }
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  async getCategoryStats() {
    await new Promise(resolve => setTimeout(resolve, 300))
    const categories = this.getCategories()
    
    return {
      total: categories.length,
      totalGames: categories.reduce((sum, cat) => sum + (cat.game_count || 0), 0),
      averageGamesPerCategory: categories.length > 0 
        ? Math.round(categories.reduce((sum, cat) => sum + (cat.game_count || 0), 0) / categories.length)
        : 0,
      mostPopular: categories.sort((a, b) => (b.game_count || 0) - (a.game_count || 0))[0]
    }
  }
}

export const categoryService = new CategoryService()