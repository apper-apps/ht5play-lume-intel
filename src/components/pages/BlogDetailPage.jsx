import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { blogService } from '@/services/api/blogService'

const BlogDetailPage = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBlog()
  }, [id])

  const loadBlog = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const blogData = await blogService.getById(parseInt(id))
      setBlog(blogData)
      
      // Load recent blogs
      const allBlogs = await blogService.getAll()
      const recent = allBlogs
        .filter(b => b.id !== blogData.id)
        .sort((a, b) => new Date(b.date_published) - new Date(a.date_published))
        .slice(0, 5)
      setRecentBlogs(recent)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
        <Error message={error} onRetry={loadBlog} />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-surface-dark">
        <Error message="Blog post not found" />
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
          <Link to="/blog" className="hover:text-accent transition-colors">Blog</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-white truncate">{blog.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.article
              className="glass-card rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Featured Image */}
              {blog.thumbnail && (
                <div className="h-64 bg-gradient-to-br from-accent/20 to-transparent overflow-hidden">
                  <img 
                    src={blog.thumbnail} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
                    {blog.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    {format(new Date(blog.date_published), 'MMMM dd, yyyy')}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-6 font-montserrat">
                  {blog.title}
                </h1>

                {/* Meta Description */}
                {blog.meta_description && (
                  <p className="text-xl text-gray-300 mb-8 font-poppins leading-relaxed">
                    {blog.meta_description}
                  </p>
                )}

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed font-poppins whitespace-pre-line">
                    {blog.content}
                  </div>
                </div>

                {/* Social Share */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-medium">Share this post:</span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors">
                        <ApperIcon name="Facebook" className="w-4 h-4 text-white" />
                      </button>
                      <button className="p-2 rounded-lg bg-blue-400 hover:bg-blue-500 transition-colors">
                        <ApperIcon name="Twitter" className="w-4 h-4 text-white" />
                      </button>
                      <button className="p-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors">
                        <ApperIcon name="Share" className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Posts */}
            {recentBlogs.length > 0 && (
              <motion.div
                className="glass-card rounded-lg p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-white mb-4 font-montserrat">
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {recentBlogs.map((recentBlog) => (
                    <Link
                      key={recentBlog.id}
                      to={`/blog/${recentBlog.id}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-accent/20 rounded-lg flex-shrink-0 overflow-hidden">
                          {recentBlog.thumbnail && (
                            <img 
                              src={recentBlog.thumbnail} 
                              alt={recentBlog.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-accent transition-colors">
                            {recentBlog.title}
                          </h4>
                          <p className="text-gray-400 text-xs mt-1">
                            {format(new Date(recentBlog.date_published), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Ad Section */}
            <motion.div
              className="glass-card rounded-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-400 font-poppins">300x250 Ad</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage