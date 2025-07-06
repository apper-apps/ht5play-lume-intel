import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { blogService } from '@/services/api/blogService'

const BlogPage = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 9

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

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)
  const startIndex = (currentPage - 1) * blogsPerPage
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage)

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
        <Error message={error} onRetry={loadBlogs} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Header */}
        <div className="glass-card rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-montserrat">
                Gaming Blog
              </h1>
              <p className="text-gray-300 font-poppins">
                Latest gaming news, reviews, and insights
              </p>
            </div>
          </div>

          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search blog posts..."
            className="max-w-md"
          />
        </div>

        {/* Blog Grid */}
        {paginatedBlogs.length === 0 ? (
          <Empty
            title="No blog posts found"
            description="No blog posts match your search criteria."
            icon="BookOpen"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                className="glass-card rounded-lg overflow-hidden hover-scale cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${blog.id}`}>
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
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      {format(new Date(blog.date_published), 'MMM dd, yyyy')}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 font-montserrat line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 font-poppins line-clamp-3">
                      {blog.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-medium">Read More</span>
                      <ApperIcon name="ArrowRight" className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg btn-glass disabled:opacity-50"
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-accent text-white'
                      : 'btn-glass hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg btn-glass disabled:opacity-50"
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage