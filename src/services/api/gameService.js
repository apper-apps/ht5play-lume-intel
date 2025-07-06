// Game Service - Mock implementation with localStorage
const STORAGE_KEY = 'ht5play_games'

// Mock game data
const mockGames = [
  {
    id: 1,
    title: 'Puzzle Master',
    slug: 'puzzle-master',
    description: 'Challenge your mind with this exciting puzzle game.',
    url: 'https://example.com/puzzle-master',
    thumb: 'https://via.placeholder.com/300x200',
    category_id: 1,
    featured: true,
    plays: 1250,
    rating: 4.5,
    width: 800,
    height: 600,
    source: 'GameMonetize',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Action Hero',
    slug: 'action-hero',
    description: 'Fast-paced action game with amazing graphics.',
    url: 'https://example.com/action-hero',
    thumb: 'https://via.placeholder.com/300x200',
    category_id: 2,
    featured: false,
    plays: 890,
    rating: 4.2,
    width: 800,
    height: 600,
    source: 'GamePix',
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z'
  },
  {
    id: 3,
    title: 'Racing Thunder',
    slug: 'racing-thunder',
    description: 'High-speed racing game with realistic physics.',
    url: 'https://example.com/racing-thunder',
    thumb: 'https://via.placeholder.com/300x200',
    category_id: 3,
    featured: true,
    plays: 2100,
    rating: 4.8,
    width: 800,
    height: 600,
    source: 'Custom',
    created_at: '2024-01-13T09:20:00Z',
    updated_at: '2024-01-13T09:20:00Z'
  }
]

class GameService {
  constructor() {
    this.initializeStorage()
  }

  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGames))
    }
  }

  getGames() {
    try {
      const games = localStorage.getItem(STORAGE_KEY)
      return games ? JSON.parse(games) : []
    } catch (error) {
      console.error('Error loading games:', error)
      return mockGames
    }
  }

  async getAllGames() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return this.getGames()
  }

  async getGameById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const games = this.getGames()
    const game = games.find(g => g.id === parseInt(id))
    
    if (!game) {
      throw new Error(`Game with ID ${id} not found`)
    }
    
    return game
  }

  async getGameBySlug(slug) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const games = this.getGames()
    const game = games.find(g => g.slug === slug)
    
    if (!game) {
      throw new Error(`Game with slug ${slug} not found`)
    }
    
    return game
  }

  async getFeaturedGames() {
    await new Promise(resolve => setTimeout(resolve, 400))
    const games = this.getGames()
    return games.filter(game => game.featured)
  }

  async getGamesByCategory(categoryId) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const games = this.getGames()
    return games.filter(game => game.category_id === parseInt(categoryId))
  }

  async searchGames(query) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const games = this.getGames()
    const lowerQuery = query.toLowerCase()
    
    return games.filter(game => 
      game.title.toLowerCase().includes(lowerQuery) ||
      game.description.toLowerCase().includes(lowerQuery)
    )
  }

  async createGame(gameData) {
    await new Promise(resolve => setTimeout(resolve, 600))
    const games = this.getGames()
    const newGame = {
      id: Math.max(...games.map(g => g.id)) + 1,
      ...gameData,
      slug: this.generateSlug(gameData.title),
      plays: 0,
      rating: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    games.push(newGame)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
    return newGame
  }

  async updateGame(id, gameData) {
    await new Promise(resolve => setTimeout(resolve, 600))
    const games = this.getGames()
    const index = games.findIndex(g => g.id === parseInt(id))
    
    if (index === -1) {
      throw new Error(`Game with ID ${id} not found`)
    }
    
    games[index] = {
      ...games[index],
      ...gameData,
      updated_at: new Date().toISOString()
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
    return games[index]
  }

  async deleteGame(id) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const games = this.getGames()
    const filteredGames = games.filter(g => g.id !== parseInt(id))
    
    if (filteredGames.length === games.length) {
      throw new Error(`Game with ID ${id} not found`)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredGames))
    return { success: true }
  }

  async toggleFeatured(id) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const games = this.getGames()
    const index = games.findIndex(g => g.id === parseInt(id))
    
    if (index === -1) {
      throw new Error(`Game with ID ${id} not found`)
    }
    
    games[index].featured = !games[index].featured
    games[index].updated_at = new Date().toISOString()
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
    return games[index]
  }

  async incrementPlays(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const games = this.getGames()
    const index = games.findIndex(g => g.id === parseInt(id))
    
    if (index !== -1) {
      games[index].plays = (games[index].plays || 0) + 1
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
    }
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  async getGameStats() {
    await new Promise(resolve => setTimeout(resolve, 300))
    const games = this.getGames()
    
    return {
      total: games.length,
      featured: games.filter(g => g.featured).length,
      recent: games.filter(g => {
        const gameDate = new Date(g.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return gameDate > weekAgo
      }).length,
      bySource: games.reduce((acc, game) => {
        acc[game.source] = (acc[game.source] || 0) + 1
        return acc
      }, {})
    }
  }
}

export const gameService = new GameService()