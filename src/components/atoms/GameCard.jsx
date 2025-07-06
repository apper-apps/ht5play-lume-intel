import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const GameCard = ({ game, index = 0 }) => {
  return (
    <motion.div
      className="game-card glass-card rounded-lg overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/game/${game.id}`}>
        <div className="relative">
          <img 
            src={game.thumb} 
            alt={game.title}
            className="w-full h-32 object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-game.png'
            }}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              className="bg-accent rounded-full p-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ApperIcon name="Play" className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          {game.is_featured && (
            <div className="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-white text-sm mb-1 truncate font-poppins">
            {game.title}
          </h3>
          <p className="text-gray-400 text-xs truncate">
            {game.category_name || 'Uncategorized'}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

export default GameCard