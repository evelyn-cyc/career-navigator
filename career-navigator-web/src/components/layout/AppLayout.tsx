import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
      />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
