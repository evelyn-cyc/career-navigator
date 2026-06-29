import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { PanelLeft } from 'lucide-react'
import Sidebar from './Sidebar'

function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50">
      {!isCollapsed && <Sidebar onCollapse={() => setIsCollapsed(true)} />}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          title="Show sidebar"
          className="fixed top-4 left-4 z-20 w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm text-slate-700 hover:bg-slate-50"
        >
          <PanelLeft size={18} />
        </button>
      )}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
