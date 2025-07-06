import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { pageService } from '@/services/api/pageService'
import { toast } from 'react-toastify'

const AdminPages = () => {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPage, setEditingPage] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: ''
  })

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await pageService.getAll()
      setPages(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const pageData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        content: formData.content
      }

      if (editingPage) {
        await pageService.update(editingPage.id, pageData)
        setPages(prev => prev.map(page => 
          page.id === editingPage.id ? { ...page, ...pageData } : page
        ))
        toast.success('Page updated successfully')
      } else {
        const newPage = await pageService.create(pageData)
        setPages(prev => [...prev, newPage])
        toast.success('Page created successfully')
      }

      setIsModalOpen(false)
      setEditingPage(null)
      setFormData({ title: '', slug: '', content: '' })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (page) => {
    setEditingPage(page)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return
    }

    try {
      await pageService.delete(pageId)
      setPages(prev => prev.filter(page => page.id !== pageId))
      toast.success('Page deleted successfully')
    } catch (err) {
      toast.error('Failed to delete page')
    }
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }))
  }

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadPages} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-montserrat">
            Pages Management
          </h1>
          <p className="text-gray-400 font-poppins">
            Create and manage static pages for your website
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setIsModalOpen(true)}
        >
          Add Page
        </Button>
      </div>

      {/* Pages Table */}
      {pages.length === 0 ? (
        <Empty
          title="No pages found"
          description="Create your first page to add static content to your website."
          actionLabel="Add Page"
          onAction={() => setIsModalOpen(true)}
          icon="FileText"
        />
      ) : (
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {pages.map((page, index) => (
                  <motion.tr
                    key={page.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {page.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">
                          {page.content ? page.content.substring(0, 60) + '...' : 'No content'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400 font-mono">
                        /page/{page.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {new Date(page.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/page/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                        >
                          <ApperIcon name="ExternalLink" className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleEdit(page)}
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
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
            className="glass-card-strong rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-montserrat">
                {editingPage ? 'Edit Page' : 'Add Page'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingPage(null)
                  setFormData({ title: '', slug: '', content: '' })
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Page Title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter page title"
                required
              />

              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="page-slug"
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 font-poppins">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter page content"
                  rows={10}
                  className="form-input w-full px-3 py-2 rounded-lg resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingPage(null)
                    setFormData({ title: '', slug: '', content: '' })
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
                  {editingPage ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminPages