import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/organisms/AdminSidebar'
import AdminHeader from '@/components/organisms/AdminHeader'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-primary-dark to-surface-dark flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout