import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const AdminHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user] = useState({
    firstName: 'Admin',
    name: 'Administrator'
  })

  const handleClearCache = () => {
    toast.success('Cache cleared successfully')
  }

  const handleLogout = () => {
    toast.success('Logged out successfully')
    // Add logout logic here
  }

  return (
    <header className="bg-surface border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white font-montserrat">
            Admin Panel
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            icon="RefreshCw"
            onClick={handleClearCache}
          >
            Clear Cache
          </Button>

          <Link to="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              icon="ExternalLink"
            >
              View Site
            </Button>
          </Link>

<div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </button>

            {isProfileOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-48 category-dropdown rounded-lg shadow-lg z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="p-4 space-y-2">
                  {user && (
                    <div className="text-sm text-gray-300 p-2 border-b border-white/10">
                      Welcome, {user.firstName || user.name || 'Admin'}
                    </div>
                  )}
                  <button className="w-full text-left p-2 rounded hover:bg-white/10 transition-colors text-white font-poppins">
                    Edit Profile
                  </button>
                  <button className="w-full text-left p-2 rounded hover:bg-white/10 transition-colors text-white font-poppins">
                    Change Password
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left p-2 rounded hover:bg-red-500/20 transition-colors text-red-400 font-poppins flex items-center gap-2"
                  >
                    <ApperIcon name="LogOut" className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader