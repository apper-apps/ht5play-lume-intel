import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const AdminSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/admin', 
      icon: 'BarChart3',
      exact: true
    },
    { 
      label: 'Games', 
      path: '/admin/games', 
      icon: 'Gamepad2' 
    },
    { 
      label: 'Categories', 
      path: '/admin/categories', 
      icon: 'Tags' 
    },
    { 
      label: 'Import Games', 
      path: '/admin/import-games', 
      icon: 'Download' 
    },
    { 
      label: 'Ads & Code', 
      path: '/admin/ads', 
      icon: 'Code' 
    },
    { 
      label: 'Pages', 
      path: '/admin/pages', 
      icon: 'FileText' 
    },
    { 
      label: 'Menus', 
      path: '/admin/menus', 
      icon: 'Menu' 
    },
    { 
      label: 'Blogs', 
      path: '/admin/blogs', 
      icon: 'PenTool' 
    },
    { 
      label: 'Settings', 
      path: '/admin/settings', 
      icon: 'Settings' 
    }
  ]

  const handleLogout = () => {
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`sidebar-glass ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 hidden lg:block`}>
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Gamepad2" className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-white font-montserrat">
                HT5PLAY
              </span>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full mb-6 p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              className="w-5 h-5 text-white" 
            />
          </button>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActiveRoute(item.path, item.exact)
                    ? 'bg-accent text-white shadow-glow'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="font-medium font-poppins">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <ApperIcon name="LogOut" className="w-5 h-5" />
              {!isCollapsed && (
                <span className="font-medium font-poppins">Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile menu would go here - simplified for this demo */}
      </div>
    </>
  )
}

export default AdminSidebar