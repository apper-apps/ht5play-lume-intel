import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { categoryService } from '@/services/api/categoryService'
import { toast } from 'react-toastify'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        icon: formData.icon || 'Circle'
      }

      if (editingCategory) {
        await categoryService.update(editingCategory.id, categoryData)
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
        ))
        toast.success('Category updated successfully')
      } else {
        const newCategory = await categoryService.create(categoryData)
        setCategories(prev => [...prev, newCategory])
        toast.success('Category created successfully')
      }

      setIsModalOpen(false)
      setEditingCategory(null)
      setFormData({ name: '', slug: '', icon: '' })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || 'Circle'
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      await categoryService.delete(categoryId)
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      toast.success('Category deleted successfully')
    } catch (err) {
      toast.error('Failed to delete category')
    }
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }))
  }

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadCategories} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-montserrat">
            Categories Management
          </h1>
          <p className="text-gray-400 font-poppins">
            Organize your games into categories
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setIsModalOpen(true)}
        >
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      {categories.length === 0 ? (
        <Empty
          title="No categories found"
          description="Create your first category to organize your games."
          actionLabel="Add Category"
          onAction={() => setIsModalOpen(true)}
          icon="Tags"
        />
      ) : (
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Game Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {categories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center mr-3">
                          <ApperIcon name={category.icon || 'Circle'} className="w-4 h-4 text-accent" />
                        </div>
                        <div className="text-sm font-medium text-white">
                          {category.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400 font-mono">
                        {category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-surface-light text-gray-300 rounded">
                        {category.game_count || 0} games
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="glass-card-strong rounded-lg p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-montserrat">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingCategory(null)
                  setFormData({ name: '', slug: '', icon: '' })
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Category Name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Enter category name"
                required
              />

              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="category-slug"
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 font-poppins">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="form-input w-full px-3 py-2 rounded-lg"
                >
                  <option value="Circle">Default</option>
                  <option value="Gamepad2">Gaming</option>
                  <option value="Zap">Action</option>
                  <option value="Target">Shooting</option>
                  <option value="Brain">Puzzle</option>
                  <option value="Car">Racing</option>
                  <option value="Trophy">Sports</option>
                  <option value="Sword">Adventure</option>
                  <option value="Puzzle">Strategy</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingCategory(null)
                    setFormData({ name: '', slug: '', icon: '' })
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories