import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { menuService } from '@/services/api/menuService'
import { pageService } from '@/services/api/pageService'
import { categoryService } from '@/services/api/categoryService'
import { toast } from 'react-toastify'

const AdminMenus = () => {
  const [menus, setMenus] = useState([])
  const [pages, setPages] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeLocation, setActiveLocation] = useState('header')
  const [formData, setFormData] = useState({
    label: '',
    link: '',
    type: 'page'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [menusData, pagesData, categoriesData] = await Promise.all([
        menuService.getAll(),
        pageService.getAll(),
        categoryService.getAll()
      ])
      
      setMenus(menusData)
      setPages(pagesData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMenuItem = async (e) => {
    e.preventDefault()
    
    try {
      let link = formData.link
      
      // Generate link based on type
      if (formData.type === 'page') {
        const page = pages.find(p => p.id === parseInt(formData.link))
        link = `/page/${page?.slug}`
      } else if (formData.type === 'category') {
        const category = categories.find(c => c.id === parseInt(formData.link))
        link = `/category/${category?.slug}`
      }

      const menuData = {
        location: activeLocation,
        label: formData.label,
        link: link
      }

      const newMenu = await menuService.create(menuData)
      setMenus(prev => [...prev, newMenu])
      setFormData({ label: '', link: '', type: 'page' })
      toast.success('Menu item added successfully')
    } catch (err) {
      toast.error('Failed to add menu item')
    }
  }

  const handleDeleteMenuItem = async (menuId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return
    }

    try {
      await menuService.delete(menuId)
      setMenus(prev => prev.filter(menu => menu.id !== menuId))
      toast.success('Menu item deleted successfully')
    } catch (err) {
      toast.error('Failed to delete menu item')
    }
  }

  const getFilteredMenus = (location) => {
    return menus.filter(menu => menu.location === location)
  }

  const menuLocations = [
    { id: 'header', label: 'Header Menu', icon: 'Navigation' },
    { id: 'footer', label: 'Footer Menu', icon: 'Layout' }
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-montserrat">
          Menus Management
        </h1>
        <p className="text-gray-400 font-poppins">
          Manage your website navigation menus
        </p>
      </div>

      {/* Menu Location Tabs */}
      <div className="flex space-x-1 bg-surface-light p-1 rounded-lg">
        {menuLocations.map(location => (
          <button
            key={location.id}
            onClick={() => setActiveLocation(location.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeLocation === location.id
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ApperIcon name={location.icon} className="w-4 h-4" />
            {location.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Menu Items */}
        <motion.div
          className="glass-card rounded-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 font-montserrat">
            Current {menuLocations.find(loc => loc.id === activeLocation)?.label} Items
          </h2>
          
          <div className="space-y-3">
            {getFilteredMenus(activeLocation).map((menu, index) => (
              <motion.div
                key={menu.id}
                className="flex items-center justify-between p-3 bg-surface-light rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div>
                  <div className="text-white font-medium">{menu.label}</div>
                  <div className="text-gray-400 text-sm font-mono">{menu.link}</div>
                </div>
                <button
                  onClick={() => handleDeleteMenuItem(menu.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            
            {getFilteredMenus(activeLocation).length === 0 && (
              <div className="text-center py-8">
                <ApperIcon name="Menu" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No menu items yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Add Menu Item */}
        <motion.div
          className="glass-card rounded-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 font-montserrat">
            Add Menu Item
          </h2>
          
          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <Input
              label="Menu Label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Enter menu label"
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 font-poppins">
                Link Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value, link: '' }))}
                className="form-input w-full px-3 py-2 rounded-lg"
              >
                <option value="page">Page</option>
                <option value="category">Category</option>
                <option value="custom">Custom URL</option>
              </select>
            </div>

            {formData.type === 'page' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 font-poppins">
                  Select Page
                </label>
                <select
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="form-input w-full px-3 py-2 rounded-lg"
                  required
                >
                  <option value="">Select a page</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>
                      {page.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.type === 'category' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 font-poppins">
                  Select Category
                </label>
                <select
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="form-input w-full px-3 py-2 rounded-lg"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.type === 'custom' && (
              <Input
                label="Custom URL"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://example.com"
                required
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon="Plus"
              className="w-full"
            >
              Add Menu Item
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminMenus