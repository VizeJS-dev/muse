import WidgetsGrid from '../components/widgets/WidgetsGrid'
import { useWidgetsStore } from '../store/widgetsStore'

export default function Dashboard() {
  const { add, reset, items } = useWidgetsStore()

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Drag, resize, add and remove widgets.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => add({ title: `Widget ${items.length + 1}` })}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add widget
          </button>
          {items.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          No widgets yet. Click "Add widget" to start.
        </div>
      ) : (
        <WidgetsGrid />
      )}
    </section>
  )
}
