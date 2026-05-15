import { BrowserRouter, Routes, Route, Navigate, NavLink, Outlet } from 'react-router-dom'
import { Car, CalendarCheck, LogOut } from 'lucide-react'
import LoginPage from '@/pages/LoginPage'
import CarsPage from '@/pages/cars/CarsPage'
import ReservationsPage from '@/pages/reservations/ReservationsPage'
import SearchPage from '@/pages/search/SearchPage'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

const navItems = [
  { to: '/cars', icon: Car, label: 'Voitures' },
  { to: '/reservations', icon: CalendarCheck, label: 'Réservations' },
]

function AdminLayout() {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-56 border-r flex flex-col">
        <div className="p-4">
          <h2 className="font-bold text-lg tracking-tight">Airsline</h2>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <Separator />
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <Separator />
        <div className="p-3 space-y-1">
          <p className="px-3 py-1 text-xs text-muted-foreground truncate">{user?.email}</p>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={logout}>
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="*" element={<Navigate to="/cars" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
