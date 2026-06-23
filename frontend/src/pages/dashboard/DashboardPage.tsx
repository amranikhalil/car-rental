import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Car, CalendarCheck, Clock, Wallet } from 'lucide-react'
import { statsApi } from '@/api/stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ReservationStatus } from '@/api/reservations'

const STATUS_BADGE: Record<ReservationStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  PENDING:   { label: 'En attente',  variant: 'secondary' },
  CONFIRMED: { label: 'Confirmée',   variant: 'default' },
  RETURNED:  { label: 'Retournée',   variant: 'outline' },
  CANCELLED: { label: 'Annulée',     variant: 'destructive' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDZD(n: number) {
  return n.toLocaleString('fr-DZ') + ' DZD'
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.get,
  })

  const cards = [
    {
      label: 'Voitures',
      value: data ? `${data.availableCars}/${data.totalCars}` : '—',
      hint: 'disponibles / total',
      icon: Car,
    },
    {
      label: 'Réservations',
      value: data?.totalReservations ?? '—',
      hint: 'toutes périodes',
      icon: CalendarCheck,
    },
    {
      label: 'En attente',
      value: data?.reservationsByStatus.PENDING ?? '—',
      hint: 'à confirmer',
      icon: Clock,
    },
    {
      label: 'Revenu',
      value: data ? formatDZD(data.revenue) : '—',
      hint: 'confirmées + retournées',
      icon: Wallet,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de l'activité</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, hint, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium">{label}</CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '…' : value}</div>
              <p className="text-xs text-muted-foreground mt-1">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Dernières réservations</CardTitle>
          <Link to="/reservations" className="text-sm text-primary hover:underline">
            Tout voir
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : !data || data.recentReservations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune réservation pour l'instant.</p>
          ) : (
            <div className="divide-y">
              {data.recentReservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{r.clientName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.car.brand} {r.car.model} · {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium">{formatDZD(Number(r.totalPrice))}</span>
                    <Badge variant={STATUS_BADGE[r.status].variant}>{STATUS_BADGE[r.status].label}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
