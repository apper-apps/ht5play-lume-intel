import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryDropdown = ({ categories = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const categoryIcons = {
    'action': 'Zap',
    'adventure': 'Map',
    'puzzle': 'Brain',
    'racing': 'Car',
    'shooting': 'Target',
    'sports': 'Trophy',
    'strategy': 'Chess',
    'arcade': 'Gamepad2'
  }

  const categoryColors = {
    'action': 'text-red-400',
    'adventure': 'text-green-400',
    'puzzle': 'text-purple-400',
    'racing': 'text-blue-400',
    'shooting': 'text-orange-400',
    'sports': 'text-yellow-400',
    'strategy': 'text-indigo-400',
    'arcade': 'text-pink-400'
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-poppins"
      >
        Categories
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 transition-transform duration-200" 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-64 category-dropdown rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 space-y-2">
              {categories.map((category) => {
                const iconName = categoryIcons[category.slug] || 'Circle'
                const iconColor = categoryColors[category.slug] || 'text-gray-400'
                
                return (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <ApperIcon 
                      name={iconName} 
                      className={`w-5 h-5 ${iconColor} group-hover:scale-110 transition-transform`} 
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white font-poppins">
                        {category.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {category.game_count} games
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategoryDropdown