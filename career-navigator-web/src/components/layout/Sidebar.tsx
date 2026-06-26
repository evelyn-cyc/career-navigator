import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/resume', label: 'Resume Analysis' },
  { to: '/match', label: 'Job Matcher' },
  { to: '/applications', label: 'Applications' },
]

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-4 h-screen sticky top-0">
      <div className="mb-6 px-2">
        <div className="text-lg font-bold">Career Navigator</div>
        <div className="text-xs text-slate-400 mt-1">
          Resume · Match · Track
        </div>
      </div>
      <nav className="flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-4 py-2 mb-1 rounded-lg text-sm font-semibold transition ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
