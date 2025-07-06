import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message, onRetry }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-400" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-white mb-2 font-montserrat">
        Something went wrong
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md font-poppins">
        {message || "We encountered an error while loading the content. Please try again."}
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="btn-primary px-6 py-3 rounded-lg font-medium font-poppins hover-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error