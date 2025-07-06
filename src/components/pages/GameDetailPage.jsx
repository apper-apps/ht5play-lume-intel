import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import GameCard from '@/components/atoms/GameCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { gameService } from '@/services/api/gameService'

const GameDetailPage = () => {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [relatedGames, setRelatedGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    loadGame()
  }, [id])

  const loadGame = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const gameData = await gameService.getById(parseInt(id))
      setGame(gameData)
      
      // Load related games from same category
      const allGames = await gameService.getAll()
      const related = allGames
        .filter(g => g.category_id === gameData.category_id && g.id !== gameData.id)
        .slice(0, 6)
      setRelatedGames(related)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleFullscreen = () => {
    const gameFrame = document.getElementById('game-frame')
    if (!document.fullscreenElement) {
      gameFrame.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dark">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-dark">
        <Error message={error} onRetry={loadGame} />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-surface-dark">
        <Error message="Game not found" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <Link to={`/category/${game.category_slug}`} className="hover:text-accent transition-colors">
            {game.category_name}
          </Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-white">{game.title}</span>
        </nav>

        {/* Game Player */}
        <div className="mb-8">
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white font-montserrat">
                {game.title}
              </h1>
              <Button
                variant="secondary"
                size="sm"
                icon="Maximize"
                onClick={toggleFullscreen}
              >
                Fullscreen
              </Button>
            </div>
            
            <div className="game-embed aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                id="game-frame"
                src={game.url}
                title={game.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 font-montserrat">
                About This Game
              </h2>
              <p className="text-gray-300 leading-relaxed font-poppins">
                {game.description || 'No description available for this game.'}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                  {game.category_name}
                </span>
                <span className="px-3 py-1 bg-surface-light rounded-full text-gray-300 text-sm">
                  {game.source}
                </span>
                {game.is_featured && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Game Stats */}
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 font-montserrat">
                Game Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">{game.category_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Source</span>
                  <span className="text-white">{game.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size</span>
                  <span className="text-white">{game.width}x{game.height}</span>
                </div>
              </div>
            </div>

            {/* Ad Section */}
            <div className="glass-card rounded-lg p-6">
              <div className="bg-gray-700 rounded-lg h-32 flex items-center justify-center">
                <span className="text-gray-400 font-poppins">300x250 Ad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="GamepadIcon" className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-montserrat">
                More {game.category_name} Games
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedGames.map((relatedGame, index) => (
                <GameCard key={relatedGame.id} game={relatedGame} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default GameDetailPage