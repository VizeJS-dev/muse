import { motion } from 'framer-motion'
import { useThemeStore } from '../store/themeStore'

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore()

  return (
    <button
      aria-label="Toggle Theme"
      onClick={toggle}
      className="relative inline-flex h-9 w-16 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
    >
      <motion.span
        layout
        className="inline-block h-7 w-7 rounded-full bg-white dark:bg-black shadow"
        initial={false}
        animate={{ x: theme === 'dark' ? 36 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}
