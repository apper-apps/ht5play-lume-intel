import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import GameCard from '@/components/atoms/GameCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { gameService } from '@/services/api/gameService'
import { categoryService } from '@/services/api/categoryService'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalCategories: 0,
    featuredGames: 0,
    recentGames: 0
  })
  const [featuredGames, setFeaturedGames] = useState([])
  const [recentGames, setRecentGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [games, categories] = await Promise.all([
        gameService.getAll(),
        categoryService.getAll()
      ])

      // Calculate stats
      const featuredCount = games.filter(game => game.is_featured).length
      const recentCount = games.filter(game => {
        const gameDate = new Date(game.created_at)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return gameDate > weekAgo
      }).length

      setStats({
        totalGames: games.length,
        totalCategories: categories.length,
        featuredGames: featuredCount,
        recentGames: recentCount
      })

      // Get featured and recent games
      const featured = games.filter(game => game.is_featured).slice(0, 6)
      const recent = games
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6)

      setFeaturedGames(featured)
      setRecentGames(recent)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Games',
      value: stats.totalGames,
      icon: 'Gamepad2',
      color: 'bg-blue-500',
      link: '/admin/games'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: 'Tags',
      color: 'bg-green-500',
      link: '/admin/categories'
    },
    {
      title: 'Featured Games',
      value: stats.featuredGames,
      icon: 'Star',
      color: 'bg-yellow-500',
      link: '/admin/games?filter=featured'
    },
    {
      title: 'Recent Games',
      value: stats.recentGames,
      icon: 'Clock',
      color: 'bg-purple-500',
      link: '/admin/games?filter=recent'
    }
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-montserrat">
            Dashboard
          </h1>
          <p className="text-gray-400 font-poppins">
            Welcome back! Here's what's happening with your gaming platform.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={card.link} className="block">
              <div className="glass-card rounded-lg p-6 hover-scale cursor-pointer">
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
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Featured Games */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="glass-card rounded-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white font-montserrat">
              Featured Games
            </h2>
            <Link
              to="/admin/games?filter=featured"
              className="text-accent hover:text-accent-light text-sm font-poppins"
            >
              View All
            </Link>
          </div>
          
          {featuredGames.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {featuredGames.map((game, index) => (
                <div key={game.id} className="transform scale-90">
                  <GameCard game={game} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Star" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 font-poppins">No featured games yet</p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="glass-card rounded-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white font-montserrat">
              Recently Added
            </h2>
            <Link
              to="/admin/games?filter=recent"
              className="text-accent hover:text-accent-light text-sm font-poppins"
            >
              View All
            </Link>
          </div>
          
          {recentGames.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {recentGames.map((game, index) => (
                <div key={game.id} className="transform scale-90">
                  <GameCard game={game} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Clock" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 font-poppins">No recent games</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard