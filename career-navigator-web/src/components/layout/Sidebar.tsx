import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Target,
  Briefcase,
  PanelLeft,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resume', label: 'Resume Analysis', icon: FileText },
  { to: '/match', label: 'Job Matcher', icon: Target },
  { to: '/applications', label: 'Applications', icon: Briefcase },
]

type SidebarProps = {
  onCollapse: () => void
}

function Sidebar({ onCollapse }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-3 h-screen sticky top-0">
      <div className="flex items-center justify-between mb-5 px-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/30">
            CN
          </div>
          <div>
            <div className="text-sm font-bold">Career Navigator</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Resume · Match · Track
            </div>
          </div>
        </div>
        <button
          onClick={onCollapse}
          className="text-slate-400 hover:text-white hover:bg-white/5 rounded-lg p-1.5"
          title="Collapse sidebar"
        >
          <PanelLeft size={15} />
        </button>
      </div>
      <nav className="flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} className="block mb-1">
              {({ isActive }) => (
                <span
                  className={`relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-[13.5px] font-semibold transition ${
                    isActive
                      ? 'bg-white/5 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-blue-500" />
                  )}
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-br from-blue-500 to-violet-500 text-white'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  {item.label}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
