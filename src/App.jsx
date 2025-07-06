import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Public Pages
import Layout from '@/components/organisms/Layout'
import HomePage from '@/components/pages/HomePage'
import GameDetailPage from '@/components/pages/GameDetailPage'
import CategoryPage from '@/components/pages/CategoryPage'
import BlogPage from '@/components/pages/BlogPage'
import BlogDetailPage from '@/components/pages/BlogDetailPage'
import SearchPage from '@/components/pages/SearchPage'
import LoginPage from '@/components/pages/LoginPage'
import StaticPage from '@/components/pages/StaticPage'

// Admin Pages
import AdminLayout from '@/components/organisms/AdminLayout'
import AdminDashboard from '@/components/pages/admin/AdminDashboard'
import AdminGames from '@/components/pages/admin/AdminGames'
import AdminCategories from '@/components/pages/admin/AdminCategories'
import AdminImportGames from '@/components/pages/admin/AdminImportGames'
import AdminAds from '@/components/pages/admin/AdminAds'
import AdminPages from '@/components/pages/admin/AdminPages'
import AdminMenus from '@/components/pages/admin/AdminMenus'
import AdminBlogs from '@/components/pages/admin/AdminBlogs'
import AdminSettings from '@/components/pages/admin/AdminSettings'

// Installation Page
import InstallPage from '@/components/pages/InstallPage'

function App() {
  return (
    <div className="min-h-screen bg-surface-dark text-white">
      <Routes>
        {/* Installation Route */}
        <Route path="/install" element={<InstallPage />} />
        
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="game/:id" element={<GameDetailPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:id" element={<BlogDetailPage />} />
          <Route path="page/:slug" element={<StaticPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="games" element={<AdminGames />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="import-games" element={<AdminImportGames />} />
          <Route path="ads" element={<AdminAds />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="menus" element={<AdminMenus />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App