import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import GameGrid from '@/components/molecules/GameGrid'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { gameService } from '@/services/api/gameService'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const gamesPerPage = 24

  const query = searchParams.get('q') || ''
  const sortBy = searchParams.get('sort') || 'title'
  const category = searchParams.get('category') || ''

  useEffect(() => {
    loadGames()
  }, [query, sortBy, category, currentPage])

  const loadGames = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const allGames = await gameService.getAll()
      let filteredGames = [...allGames]
      
      // Apply search filter
      if (query) {
        filteredGames = filteredGames.filter(game =>
          game.title.toLowerCase().includes(query.toLowerCase()) ||
          game.description?.toLowerCase().includes(query.toLowerCase())
        )
      }
      
      // Apply category filter
      if (category) {
        filteredGames = filteredGames.filter(game =>
          game.category_name?.toLowerCase() === category.toLowerCase()
        )
      }
      
      // Apply sorting
      filteredGames.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title)
          case 'recent':
            return new Date(b.created_at) - new Date(a.created_at)
          case 'trending':
            return b.is_featured - a.is_featured
          case 'random':
            return Math.random() - 0.5
          default:
            return 0
        }
      })
      
      // Pagination
      const total = Math.ceil(filteredGames.length / gamesPerPage)
      const startIndex = (currentPage - 1) * gamesPerPage
      const paginatedGames = filteredGames.slice(startIndex, startIndex + gamesPerPage)
      
      setGames(paginatedGames)
      setTotalPages(total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newQuery) => {
    setSearchParams(prev => {
      if (newQuery) {
        prev.set('q', newQuery)
      } else {
        prev.delete('q')
      }
      return prev
    })
    setCurrentPage(1)
  }

  const handleSortChange = (sort) => {
    setSearchParams(prev => {
      prev.set('sort', sort)
      return prev
    })
    setCurrentPage(1)
  }

  const getPageTitle = () => {
    if (query) return `Search Results for "${query}"`
    if (category) return `${category} Games`
    if (sortBy === 'recent') return 'Most Recent Games'
    if (sortBy === 'trending') return 'Trending Games'
    if (sortBy === 'random') return 'Random Games'
    return 'All Games'
  }

  return (
    <div className="min-h-screen bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="glass-card rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Search" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-montserrat">
                {getPageTitle()}
              </h1>
              <p className="text-gray-300 font-poppins">
                {games.length} games found
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search games..."
              className="flex-1 max-w-md"
            />
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="form-input px-3 py-2 text-sm rounded-lg"
              >
                <option value="title">Title</option>
                <option value="recent">Most Recent</option>
                <option value="trending">Trending</option>
                <option value="random">Random</option>
              </select>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <GameGrid games={games} loading={loading} error={error} onRetry={loadGames} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg btn-glass disabled:opacity-50"
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + Math.max(1, currentPage - 2)
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentPage === page
                        ? 'bg-accent text-white'
                        : 'btn-glass hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg btn-glass disabled:opacity-50"
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage