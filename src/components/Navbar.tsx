import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200/60 bg-white/70 backdrop-blur dark:bg-gray-900/70 dark:border-gray-800">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-semibold tracking-tight">
          Aurora Dashboard
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:underline ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`
            }
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `hover:underline ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`
            }
          >
            Settings
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
