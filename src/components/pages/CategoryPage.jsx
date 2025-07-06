import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import GameGrid from '@/components/molecules/GameGrid'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { gameService } from '@/services/api/gameService'
import { categoryService } from '@/services/api/categoryService'

const CategoryPage = () => {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const gamesPerPage = 24

  const sortBy = searchParams.get('sort') || 'title'
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    loadCategory()
  }, [slug])

  useEffect(() => {
    if (category) {
      loadGames()
    }
  }, [category, currentPage, sortBy, searchQuery])

  const loadCategory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const categories = await categoryService.getAll()
      const categoryData = categories.find(c => c.slug === slug)
      
      if (!categoryData) {
        throw new Error('Category not found')
      }
      
      setCategory(categoryData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadGames = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const allGames = await gameService.getAll()
      let filteredGames = allGames.filter(game => game.category_id === category.id)
      
      // Apply search filter
      if (searchQuery) {
        filteredGames = filteredGames.filter(game =>
          game.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Apply sorting
      filteredGames.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title)
          case 'newest':
            return new Date(b.created_at) - new Date(a.created_at)
          case 'oldest':
            return new Date(a.created_at) - new Date(b.created_at)
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

  const handleSearch = (query) => {
    setSearchParams(prev => {
      if (query) {
        prev.set('search', query)
      } else {
        prev.delete('search')
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

  if (loading && !category) {
    return (
      <div className="min-h-screen bg-surface-dark">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-dark">
        <Error message={error} onRetry={loadCategory} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="glass-card rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Gamepad2" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-montserrat">
                {category?.name} Games
              </h1>
              <p className="text-gray-300 font-poppins">
                {category?.game_count} games available
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search games in this category..."
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
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
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
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
              ))}
              
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

export default CategoryPage