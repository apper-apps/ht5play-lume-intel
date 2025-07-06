import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import GameGrid from '@/components/molecules/GameGrid'
import { useGames } from '@/hooks/useGames'
import { useCategories } from '@/hooks/useCategories'

const HomePage = () => {
  const { games, loading, error, refetch } = useGames()
  const { categories } = useCategories()

  const featuredGames = games.filter(game => game.is_featured).slice(0, 12)
  const actionGames = games.filter(game => game.category_name === 'Action').slice(0, 12)
  const puzzleGames = games.filter(game => game.category_name === 'Puzzle').slice(0, 12)
  const shootingGames = games.filter(game => game.category_name === 'Shooting').slice(0, 12)

  const gameSection = (title, games, icon, color) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
            <ApperIcon name={icon} className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white font-montserrat">
            {title}
          </h2>
        </div>
        <Link 
          to={`/search?category=${title.toLowerCase()}`}
          className="text-accent hover:text-accent-light transition-colors font-poppins"
        >
          View More →
        </Link>
      </div>
      <GameGrid games={games} loading={loading} error={error} onRetry={refetch} />
    </section>
  )

  return (
    <div className="content-area">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-montserrat">
                Play the Best
                <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                  {' '}HTML5 Games
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 font-poppins">
                Discover hundreds of free games you can play instantly in your browser. 
                No downloads, no installations - just pure gaming fun!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  icon="Gamepad2"
                  className="hover-glow"
                >
                  <Link to="/search">All Games</Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon="TrendingUp"
                  className="hover-glow"
                >
                  <Link to="/search?sort=trending">Trending Now</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card-strong rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
                <div className="relative z-10">
                  <div className="grid grid-cols-3 gap-4">
                    {featuredGames.slice(0, 6).map((game, index) => (
                      <motion.div
                        key={game.id}
                        className="glass-card rounded-lg overflow-hidden hover-scale cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link to={`/game/${game.id}`}>
                          <img 
                            src={game.thumb} 
                            alt={game.title}
                            className="w-full h-16 object-cover"
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Game Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {gameSection('Featured Games', featuredGames, 'Star', 'bg-gradient-to-r from-yellow-500 to-orange-500')}
        
        {/* Ad Section */}
        <div className="mb-12">
          <div className="glass-card rounded-lg p-8 text-center">
            <div className="bg-gray-700 rounded-lg h-24 flex items-center justify-center">
              <span className="text-gray-400 font-poppins">728x90 Ad Placeholder</span>
            </div>
          </div>
        </div>

        {gameSection('Action Games', actionGames, 'Zap', 'bg-gradient-to-r from-red-500 to-pink-500')}
        {gameSection('Shooting Games', shootingGames, 'Target', 'bg-gradient-to-r from-orange-500 to-red-500')}
        {gameSection('Puzzle Games', puzzleGames, 'Brain', 'bg-gradient-to-r from-purple-500 to-indigo-500')}
      </div>

      {/* Blog Preview Section */}
      <section className="bg-surface/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-montserrat">
              Latest Gaming News
            </h2>
            <p className="text-gray-300 font-poppins">
              Stay updated with the latest gaming trends and news
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="glass-card rounded-lg overflow-hidden hover-scale cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-48 bg-gradient-to-br from-accent/20 to-transparent"></div>
                <div className="p-6">
                  <div className="text-accent text-sm font-medium mb-2">Gaming News</div>
                  <h3 className="text-lg font-bold text-white mb-2 font-montserrat">
                    Sample Blog Post Title {i}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 font-poppins">
                    This is a sample blog post excerpt that would show the first few lines...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Dec 15, 2024</span>
                    <Button variant="ghost" size="sm">
                      Read All
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" icon="BookOpen">
              <Link to="/blog">View All Blogs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage