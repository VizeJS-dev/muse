import { WidthProvider, Responsive, type Layout, type Layouts } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useWidgetsStore } from '../../store/widgetsStore'
import { Widget } from './Widget'
import { useMemo } from 'react'

const ResponsiveGridLayout = WidthProvider(Responsive)

export default function WidgetsGrid() {
  const { items, remove, updateLayout } = useWidgetsStore()

  const layouts: Layouts = useMemo(() => {
    const lg: Layout[] = items.map((w) => ({
      i: w.id,
      x: w.x,
      y: w.y,
      w: w.w,
      h: w.h,
      minW: w.minW,
      minH: w.minH,
    }))
    return { lg }
  }, [items])

  const handleLayoutChange = (currentLayout: Layout[]) => {
    // Map back to our store structure
    updateLayout(currentLayout.map(l => ({ id: l.i, x: l.x, y: l.y, w: l.w, h: l.h })))
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      margin={[12, 12]}
      containerPadding={[0, 0]}
      rowHeight={32}
      onLayoutChange={handleLayoutChange}
      isBounded
      compactType="vertical"
    >
      {items.map((w) => (
        <div key={w.id} data-grid={{ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h, minW: w.minW, minH: w.minH }}>
          <div className="widget-drag-handle">
            <Widget title={w.title} onRemove={() => remove(w.id)}>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Drag by header. Resize from corners. Replace this with your widget.
              </div>
            </Widget>
          </div>
        </div>
      ))}
    </ResponsiveGridLayout>
  )
}
