import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'games') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-lg p-2 h-48"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="bg-surface-light rounded-lg h-32 mb-2 loading-shimmer relative overflow-hidden"></div>
            <div className="bg-surface-light rounded h-4 mb-2 loading-shimmer relative overflow-hidden"></div>
            <div className="bg-surface-light rounded h-3 w-3/4 loading-shimmer relative overflow-hidden"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-lg p-4 flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-16 h-16 bg-surface-light rounded-lg loading-shimmer relative overflow-hidden"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-surface-light rounded h-4 w-1/2 loading-shimmer relative overflow-hidden"></div>
              <div className="bg-surface-light rounded h-3 w-3/4 loading-shimmer relative overflow-hidden"></div>
            </div>
            <div className="bg-surface-light rounded h-8 w-20 loading-shimmer relative overflow-hidden"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export default Loading