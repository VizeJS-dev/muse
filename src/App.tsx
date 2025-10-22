import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import { router } from './routes/router'
import { useThemeStore } from './store/themeStore'

export default function App() {
  const { theme, set } = useThemeStore()

  // Initialize theme from prefers-color-scheme on first mount
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    set(prefersDark ? 'dark' : 'light')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <RouterProvider router={router} />
}
