import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ title, description, actionLabel, onAction, icon = "Search" }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name={icon} className="w-10 h-10 text-accent" />
      </motion.div>
      
      <h3 className="text-xl font-bold text-white mb-2 font-montserrat">
        {title || "No content found"}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md font-poppins">
        {description || "We couldn't find any content to display. Try adjusting your search or filters."}
      </p>
      
      {onAction && actionLabel && (
        <motion.button
          onClick={onAction}
          className="btn-primary px-8 py-3 rounded-lg font-medium font-poppins hover-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty