import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="min-h-svh w-full p-0">
        <Outlet />
      </main>
    </div>
  )
}
