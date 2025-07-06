import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { pageService } from '@/services/api/pageService'

const StaticPage = () => {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPage()
  }, [slug])

  const loadPage = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const pages = await pageService.getAll()
      const pageData = pages.find(p => p.slug === slug)
      
      if (!pageData) {
        throw new Error('Page not found')
      }
      
      setPage(pageData)
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
        <Error message={error} onRetry={loadPage} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="glass-card rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-6 font-montserrat">
            {page?.title}
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed font-poppins whitespace-pre-line">
              {page?.content}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StaticPage