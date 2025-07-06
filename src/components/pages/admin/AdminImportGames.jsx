import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { gameService } from '@/services/api/gameService'
import { categoryService } from '@/services/api/categoryService'
import { toast } from 'react-toastify'

const AdminImportGames = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    gamemonetizeGames: 0,
    gamepixGames: 0,
    totalCategories: 0
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [customUrl, setCustomUrl] = useState('')
  const [manualForm, setManualForm] = useState({
    title: '',
    url: '',
    description: '',
    category_id: '',
    thumbnail: null
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [games, categoriesData] = await Promise.all([
        gameService.getAll(),
        categoryService.getAll()
      ])

      const gamemonetizeCount = games.filter(g => g.source === 'GameMonetize').length
      const gamepixCount = games.filter(g => g.source === 'GamePix').length

      setStats({
        totalGames: games.length,
        gamemonetizeGames: gamemonetizeCount,
        gamepixGames: gamepixCount,
        totalCategories: categoriesData.length
      })
      setCategories(categoriesData)
    } catch (err) {
      toast.error('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const handleImportFromSource = async (source) => {
    setImporting(true)
    try {
      // Mock import - in real app, this would call the RSS feed
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockGames = [
        {
          title: `Sample ${source} Game 1`,
          url: 'https://example.com/game1',
          thumb: 'https://via.placeholder.com/300x200',
          description: `A sample game from ${source}`,
          source: source,
          width: 800,
          height: 600,
          category_id: categories[0]?.id || 1
        },
        {
          title: `Sample ${source} Game 2`,
          url: 'https://example.com/game2',
          thumb: 'https://via.placeholder.com/300x200',
          description: `Another sample game from ${source}`,
          source: source,
          width: 800,
          height: 600,
          category_id: categories[0]?.id || 1
        }
      ]

      for (const game of mockGames) {
        await gameService.create(game)
      }

      toast.success(`Successfully imported ${mockGames.length} games from ${source}`)
      loadStats()
    } catch (err) {
      toast.error(`Failed to import from ${source}`)
    } finally {
      setImporting(false)
    }
  }

  const handleCustomImport = async (e) => {
    e.preventDefault()
    if (!customUrl) {
      toast.error('Please enter a valid URL')
      return
    }

    setImporting(true)
    try {
      // Mock custom import
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockGame = {
        title: 'Custom Imported Game',
        url: customUrl,
        thumb: 'https://via.placeholder.com/300x200',
        description: 'A game imported from custom URL',
        source: 'Custom',
        width: 800,
        height: 600,
        category_id: categories[0]?.id || 1
      }

      await gameService.create(mockGame)
      toast.success('Game imported successfully from custom URL')
      setCustomUrl('')
      loadStats()
    } catch (err) {
      toast.error('Failed to import from custom URL')
    } finally {
      setImporting(false)
    }
  }

  const handleManualImport = async (e) => {
    e.preventDefault()
    
    if (!manualForm.title || !manualForm.url) {
      toast.error('Title and URL are required')
      return
    }

    setImporting(true)
    try {
      const gameData = {
        title: manualForm.title,
        url: manualForm.url,
        description: manualForm.description || '',
        category_id: parseInt(manualForm.category_id) || categories[0]?.id || 1,
        thumb: manualForm.thumbnail ? URL.createObjectURL(manualForm.thumbnail) : 'https://via.placeholder.com/300x200',
        source: 'Manual',
        width: 800,
        height: 600
      }

      await gameService.create(gameData)
      toast.success('Game imported manually')
      setManualForm({
        title: '',
        url: '',
        description: '',
        category_id: '',
        thumbnail: null
      })
      loadStats()
    } catch (err) {
      toast.error('Failed to import game manually')
    } finally {
      setImporting(false)
    }
  }

  const statCards = [
    {
      title: 'Total Games',
      value: stats.totalGames,
      icon: 'Gamepad2',
      color: 'bg-blue-500'
    },
    {
      title: 'GameMonetize',
      value: stats.gamemonetizeGames,
      icon: 'Download',
      color: 'bg-green-500'
    },
    {
      title: 'GamePix',
      value: stats.gamepixGames,
      icon: 'Download',
      color: 'bg-purple-500'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: 'Tags',
      color: 'bg-yellow-500'
    }
  ]

  if (loading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-montserrat">
          Import Games
        </h1>
        <p className="text-gray-400 font-poppins">
          Import games from various sources or add them manually
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="glass-card rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-poppins">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-white font-montserrat">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={card.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Import Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automatic Import */}
        <motion.div
          className="glass-card rounded-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Download" className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white font-montserrat">
              Automatic Import
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2 font-poppins">
                RSS Feed Sources
              </h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  icon="Download"
                  onClick={() => handleImportFromSource('GameMonetize')}
                  disabled={importing}
                  loading={importing}
                  className="w-full"
                >
                  Import from GameMonetize
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  icon="Download"
                  onClick={() => handleImportFromSource('GamePix')}
                  disabled={importing}
                  loading={importing}
                  className="w-full"
                >
                  Import from GamePix
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-medium text-white mb-2 font-poppins">
                Custom RSS URL
              </h3>
              <form onSubmit={handleCustomImport} className="space-y-3">
                <Input
                  placeholder="Enter RSS feed URL"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  icon="Link"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  icon="Download"
                  disabled={importing}
                  loading={importing}
                  className="w-full"
                >
                  Import from Custom URL
                </Button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Manual Import */}
        <motion.div
          className="glass-card rounded-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Plus" className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white font-montserrat">
              Manual Import
            </h2>
          </div>

          <form onSubmit={handleManualImport} className="space-y-4">
            <Input
              label="Game Title"
              value={manualForm.title}
              onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter game title"
              required
            />

            <Input
              label="Game URL"
              value={manualForm.url}
              onChange={(e) => setManualForm(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com/game"
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 font-poppins">
                Description
              </label>
              <textarea
                value={manualForm.description}
                onChange={(e) => setManualForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter game description"
                rows={3}
                className="form-input w-full px-3 py-2 rounded-lg resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 font-poppins">
                Category
              </label>
              <select
                value={manualForm.category_id}
                onChange={(e) => setManualForm(prev => ({ ...prev, category_id: e.target.value }))}
                className="form-input w-full px-3 py-2 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 font-poppins">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setManualForm(prev => ({ ...prev, thumbnail: e.target.files[0] }))}
                className="form-input w-full px-3 py-2 rounded-lg"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon="Plus"
              disabled={importing}
              loading={importing}
              className="w-full"
            >
              Import Game
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminImportGames