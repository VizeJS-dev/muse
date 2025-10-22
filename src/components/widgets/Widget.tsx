import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface WidgetProps {
  title: string
  children?: ReactNode
  className?: string
  onRemove?: () => void
}

export const Widget = ({ title, children, className, onRemove }: WidgetProps) => {
  return (
    <div className={clsx('flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900', className)}>
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 text-sm font-medium dark:border-gray-800">
        <span className="truncate">{title}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
            aria-label="Remove widget"
          >
            Remove
          </button>
        )}
      </div>
      <div className="flex-1 p-3 text-sm text-gray-600 dark:text-gray-300">
        {children ?? <div className="italic text-gray-400 dark:text-gray-500">Empty widget</div>}
      </div>
    </div>
  )
}