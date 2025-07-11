import { Outlet } from 'react-router-dom'
import Header from '@/components/organisms/Header'
import Footer from '@/components/organisms/Footer'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-surface-dark via-primary-dark to-surface-dark">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout