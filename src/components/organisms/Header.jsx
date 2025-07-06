import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import CategoryDropdown from '@/components/molecules/CategoryDropdown'
import SearchBar from '@/components/molecules/SearchBar'
import { useCategories } from '@/hooks/useCategories'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigate = useNavigate()
  const { categories } = useCategories()

  const navItems = [
    { label: 'Most Recent', path: '/search?sort=recent' },
    { label: 'Random', path: '/search?sort=random' },
  ]

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setIsSearchOpen(false)
  }

  return (
    <header className="nav-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="Gamepad2" className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white font-montserrat">
              HT5PLAY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-white hover:text-accent transition-colors font-poppins"
              >
                {item.label}
              </Link>
            ))}
            <CategoryDropdown categories={categories} />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="Search" className="w-5 h-5 text-white" />
            </motion.button>
            <Link
              to="/login"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              className="w-6 h-6 text-white" 
            />
          </button>
        </div>

        {/* Desktop Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="hidden md:block pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SearchBar onSearch={handleSearch} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              <SearchBar onSearch={handleSearch} />
              
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="block py-2 text-white hover:text-accent transition-colors font-poppins"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block py-2 text-white hover:text-accent transition-colors font-poppins"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  to="/login"
                  className="flex items-center gap-2 py-2 text-white hover:text-accent transition-colors font-poppins"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name="User" className="w-4 h-4" />
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header