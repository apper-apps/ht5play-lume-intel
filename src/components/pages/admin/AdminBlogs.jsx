import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { blogService } from '@/services/api/blogService'
import { toast } from 'react-toastify'

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    meta_description: '',
    content: '',
    category: '',
    thumbnail: null
  })

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogService.getAll()
      setBlogs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const blogData = {
        title: formData.title,
        meta_description: formData.meta_description,
        content: formData.content,
        category: formData.category,
        thumbnail: formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : null,
        date_published: editingBlog ? editingBlog.date_published : new Date().toISOString()
      }

      if (editingBlog) {
        await blogService.update(editingBlog.id, blogData)
        setBlogs(prev => prev.map(blog => 
          blog.id === editingBlog.id ? { ...blog, ...blogData } : blog
        ))
        toast.success('Blog updated successfully')
      } else {
        const newBlog = await blogService.create(blogData)
        setBlogs(prev => [...prev, newBlog])
        toast.success('Blog created successfully')
      }

      setIsModalOpen(false)
      setEditingBlog(null)
      setFormData({ title: '', meta_description: '', content: '', category: '', thumbnail: null })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      meta_description: blog.meta_description,
      content: blog.content,
      category: blog.category,
      thumbnail: null
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return
    }

    try {
      await blogService.delete(blogId)
      setBlogs(prev => prev.filter(blog => blog.id !== blogId))
      toast.success('Blog deleted successfully')
    } catch (err) {
      toast.error('Failed to delete blog')
    }
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const blogCategories = [
    'Gaming News',
    'Game Reviews',
    'Tips & Tricks',
    'Industry Updates',
    'Tournaments'
  ]

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadBlogs} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-montserrat">
            Blogs Management
          </h1>
          <p className="text-gray-400 font-poppins">
            Create and manage your blog posts
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setIsModalOpen(true)}
        >
          Add Blog Post
        </Button>
      </div>

      {/* Search */}
      <div className="glass-card rounded-lg p-6">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search blog posts..."
          className="max-w-md"
        />
      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <Empty
          title="No blog posts found"
          description="Create your first blog post to share gaming content."
          actionLabel="Add Blog Post"
          onAction={() => setIsModalOpen(true)}
          icon="PenTool"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              className="glass-card rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-48 bg-gradient-to-br from-accent/20 to-transparent relative overflow-hidden">
                {blog.thumbnail && (
                  <img 
                    src={blog.thumbnail} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
                    {blog.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  {format(new Date(blog.date_published), 'MMM dd, yyyy')}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 font-montserrat line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 font-poppins line-clamp-3">
                  {blog.content.substring(0, 100)}...
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                  <a
                    href={`/blog/${blog.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    <ApperIcon name="ExternalLink" className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="glass-card-strong rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-montserrat">
                {editingBlog ? 'Edit Blog Post' : 'Add Blog Post'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingBlog(null)
                  setFormData({ title: '', meta_description: '', content: '', category: '', thumbnail: null })
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter blog title"
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 font-poppins">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input w-full px-3 py-2 rounded-lg"
                    required
                  >
                    <option value="">Select Category</option>
                    {blogCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Meta Description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="Enter meta description"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 font-poppins">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter blog content"
                  rows={15}
                  className="form-input w-full px-3 py-2 rounded-lg resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 font-poppins">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.files[0] }))}
                  className="form-input w-full px-3 py-2 rounded-lg"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingBlog(null)
                    setFormData({ title: '', meta_description: '', content: '', category: '', thumbnail: null })
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
                  {editingBlog ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminBlogs