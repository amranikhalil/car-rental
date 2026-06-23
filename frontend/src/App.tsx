import { BrowserRouter, Routes, Route, Navigate, NavLink, Outlet } from 'react-router-dom'
import { Car, CalendarCheck, LogOut, Home, LayoutDashboard } from 'lucide-react'
import LoginPage from '@/pages/LoginPage'
import CarDetailPage from '@/pages/car/CarDetailPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import CarsPage from '@/pages/cars/CarsPage'
import ReservationsPage from '@/pages/reservations/ReservationsPage'
import SearchPage from '@/pages/search/SearchPage'
import HomePage from '@/pages/home/HomePage'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'

function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
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
       <div className="p-3 border-t border-gray-200 bg-gray-50/50">
              {/* Profil utilisateur */}
              <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-xs font-semibold shrink-0">
                  {user?.email?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <p className="text-[10px] text-gray-500">Administrateur</p>
                </div>
              </div>

              {/* Navigation */}
              <NavLink
                to="/"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all duration-150"
              >
                <Home className="w-4 h-4" />
                Accueil
              </NavLink>

              {/* Déconnexion */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2.5 px-3 py-2 mt-1 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150"
                onClick={logout}
              >
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
    <TooltipProvider delayDuration={300}>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/car/:id" element={<CarDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </TooltipProvider>
  )
}
