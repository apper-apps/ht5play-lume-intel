import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { gameService } from '@/services/api/gameService'
import { categoryService } from '@/services/api/categoryService'
import { toast } from 'react-toastify'

const AdminGames = () => {
  const [games, setGames] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const gamesPerPage = 20

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [gamesData, categoriesData] = await Promise.all([
        gameService.getAll(),
        categoryService.getAll()
      ])
      
      setGames(gamesData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatured = async (gameId, currentStatus) => {
    try {
      const updatedGame = await gameService.update(gameId, { is_featured: !currentStatus })
      
      setGames(prev => prev.map(game => 
        game.id === gameId 
          ? { ...game, is_featured: !currentStatus }
          : game
      ))
      
      toast.success(`Game ${!currentStatus ? 'featured' : 'unfeatured'} successfully`)
    } catch (err) {
      toast.error('Failed to update game')
    }
  }

  const handleCategoryChange = async (gameId, categoryId) => {
    try {
      const category = categories.find(c => c.id === parseInt(categoryId))
      await gameService.update(gameId, { 
        category_id: parseInt(categoryId),
        category_name: category?.name || 'Uncategorized'
      })
      
      setGames(prev => prev.map(game => 
        game.id === gameId 
          ? { ...game, category_id: parseInt(categoryId), category_name: category?.name || 'Uncategorized' }
          : game
      ))
      
      toast.success('Category updated successfully')
    } catch (err) {
      toast.error('Failed to update category')
    }
  }

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return
    }

    try {
      await gameService.delete(gameId)
      setGames(prev => prev.filter(game => game.id !== gameId))
      toast.success('Game deleted successfully')
    } catch (err) {
      toast.error('Failed to delete game')
    }
  }

  const filteredGames = games.filter(game => {
    const matchesSearch = !searchQuery || 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || 
      game.category_id === parseInt(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage)
  const startIndex = (currentPage - 1) * gamesPerPage
  const paginatedGames = filteredGames.slice(startIndex, startIndex + gamesPerPage)

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-montserrat">
            Games Management
          </h1>
          <p className="text-gray-400 font-poppins">
            Manage your gaming library and categories
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => window.location.href = '/admin/import-games'}
        >
          Import Games
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search games..."
            className="flex-1 max-w-md"
          />
          
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input px-3 py-2 text-sm rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <span className="text-sm text-gray-400">
              {filteredGames.length} games
            </span>
          </div>
        </div>
      </div>

      {/* Games Table */}
      {paginatedGames.length === 0 ? (
        <Empty
          title="No games found"
          description="No games match your search criteria. Try adjusting your filters."
          actionLabel="Import Games"
          onAction={() => window.location.href = '/admin/import-games'}
          icon="Gamepad2"
        />
      ) : (
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paginatedGames.map((game, index) => (
                  <motion.tr
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={game.thumb}
                          alt={game.title}
                          className="w-16 h-12 object-cover rounded-lg mr-4"
                          onError={(e) => {
                            e.target.src = '/placeholder-game.png'
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {game.title}
                          </div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {game.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={game.category_id || ''}
                        onChange={(e) => handleCategoryChange(game.id, e.target.value)}
                        className="form-input px-3 py-1 text-sm rounded-lg bg-surface-light border-white/10"
                      >
                        <option value="">Uncategorized</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-surface-light text-gray-300 rounded">
                        {game.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(game.id, game.is_featured)}
                        className={`p-2 rounded-lg transition-colors ${
                          game.is_featured 
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }`}
                      >
                        <ApperIcon name="Star" className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteGame(game.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + gamesPerPage, filteredGames.length)} of {filteredGames.length} games
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg btn-glass disabled:opacity-50 text-sm"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg btn-glass disabled:opacity-50 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminGames