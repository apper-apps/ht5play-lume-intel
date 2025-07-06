import { useState, useEffect } from 'react'
import { gameService } from '@/services/api/gameService'

export function useGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadGames()
  }, [])

  async function loadGames() {
    try {
      setLoading(true)
      setError(null)
      const data = await gameService.getAllGames()
      setGames(data)
    } catch (err) {
      setError(err.message || 'Failed to load games')
      console.error('Games loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  function getGamesByCategory(categoryId) {
    return games.filter(game => game.category_id === categoryId)
  }

  function getFeaturedGames() {
    return games.filter(game => game.featured)
  }

  function getRecentGames(limit = 10) {
    return games
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit)
  }

  function getPopularGames(limit = 10) {
    return games
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, limit)
  }

  function searchGames(query) {
    if (!query) return games
    
    const lowerQuery = query.toLowerCase()
    return games.filter(game => 
      game.title.toLowerCase().includes(lowerQuery) ||
      game.description.toLowerCase().includes(lowerQuery)
    )
  }

  async function refreshGames() {
    await loadGames()
  }

  return {
    games,
    loading,
    error,
    getGamesByCategory,
    getFeaturedGames,
    getRecentGames,
    getPopularGames,
    searchGames,
    refreshGames
  }
}

export function useGame(gameId) {
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (gameId) {
      loadGame()
    }
  }, [gameId])

  async function loadGame() {
    try {
      setLoading(true)
      setError(null)
      const data = await gameService.getGameById(gameId)
      setGame(data)
    } catch (err) {
      setError(err.message || 'Failed to load game')
      console.error('Game loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function incrementPlays() {
    try {
      await gameService.incrementPlays(gameId)
      if (game) {
        setGame(prev => ({
          ...prev,
          plays: (prev.plays || 0) + 1
        }))
      }
    } catch (err) {
      console.error('Error incrementing plays:', err)
    }
  }

  return {
    game,
    loading,
    error,
    incrementPlays,
    refresh: loadGame
  }
}

export function useGamesByCategory(categoryId) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (categoryId) {
      loadGames()
    }
  }, [categoryId])

  async function loadGames() {
    try {
      setLoading(true)
      setError(null)
      const data = await gameService.getGamesByCategory(categoryId)
      setGames(data)
    } catch (err) {
      setError(err.message || 'Failed to load games')
      console.error('Category games loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    games,
    loading,
    error,
    refresh: loadGames
  }
}

export function useFeaturedGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadGames()
  }, [])

  async function loadGames() {
    try {
      setLoading(true)
      setError(null)
      const data = await gameService.getFeaturedGames()
      setGames(data)
    } catch (err) {
      setError(err.message || 'Failed to load featured games')
      console.error('Featured games loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    games,
    loading,
    error,
    refresh: loadGames
  }
}