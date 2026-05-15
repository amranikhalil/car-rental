import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reservationsApi, type Reservation, type ReservationStatus } from '@/api/reservations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Eye, CheckCircle, XCircle, RotateCcw, Trash2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const STATUS_TABS: { value: ReservationStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Toutes' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'CONFIRMED', label: 'Confirmées' },
  { value: 'RETURNED', label: 'Retournées' },
  { value: 'CANCELLED', label: 'Annulées' },
]

const STATUS_BADGE: Record<ReservationStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  PENDING:   { label: 'En attente',  variant: 'secondary' },
  CONFIRMED: { label: 'Confirmée',   variant: 'default' },
  RETURNED:  { label: 'Retournée',   variant: 'outline' },
  CANCELLED: { label: 'Annulée',     variant: 'destructive' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

function calcDays(start: string, end: string) {
  return Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000))
}

export default function ReservationsPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<ReservationStatus | 'ALL'>('ALL')
  const [detail, setDetail] = useState<Reservation | null>(null)
  const [toDelete, setToDelete] = useState<Reservation | null>(null)

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['reservations', tab],
    queryFn: () => reservationsApi.getAll(tab === 'ALL' ? undefined : tab),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ReservationStatus }) =>
      reservationsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => reservationsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  })

  function updateStatus(reservation: Reservation, status: ReservationStatus) {
    statusMutation.mutate({ id: reservation.id, status })
    if (detail?.id === reservation.id) setDetail((r) => r ? { ...r, status } : r)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Réservations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          {STATUS_TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Voiture</TableHead>
              <TableHead>Aéroport</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  Chargement…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  Aucune réservation.
                </TableCell>
              </TableRow>
            )}
            {reservations.map((r) => {
              const badge = STATUS_BADGE[r.status]
              const days = calcDays(r.startDate, r.endDate)
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.clientName}</div>
                    <div className="text-sm text-muted-foreground">{r.clientEmail}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{r.car.brand} {r.car.model}</div>
                    <div className="text-sm text-muted-foreground">{r.car.year}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{r.car.airport.city}</div>
                    <div className="text-sm text-muted-foreground">{r.car.airport.code}</div>
                  </TableCell>
                  <TableCell>
                    <div>{formatDate(r.startDate)}</div>
                    <div className="text-sm text-muted-foreground">→ {formatDate(r.endDate)}</div>
                  </TableCell>
                  <TableCell>{days}j</TableCell>
                  <TableCell className="font-medium">
                    {Number(r.totalPrice).toLocaleString('fr-DZ')} DZD
                  </TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => setDetail(r)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Voir détails</TooltipContent>
                      </Tooltip>
                      {r.status === 'PENDING' && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-green-600 hover:text-green-600"
                                onClick={() => updateStatus(r, 'CONFIRMED')}>
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Confirmer</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive"
                                onClick={() => updateStatus(r, 'CANCELLED')}>
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Annuler</TooltipContent>
                          </Tooltip>
                        </>
                      )}
                      {r.status === 'CONFIRMED' && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-blue-600 hover:text-blue-600"
                                onClick={() => updateStatus(r, 'RETURNED')}>
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Marquer retournée</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive"
                                onClick={() => updateStatus(r, 'CANCELLED')}>
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Annuler</TooltipContent>
                          </Tooltip>
                        </>
                      )}
                      {r.status === 'CANCELLED' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive"
                              onClick={() => setToDelete(r)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Supprimer</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        {detail && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Réservation #{detail.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <Section title="Client">
                <Row label="Nom" value={detail.clientName} />
                <Row label="Email" value={detail.clientEmail} />
                <Row label="Téléphone" value={detail.clientPhone} />
              </Section>
              <Section title="Voiture">
                <Row label="Modèle" value={`${detail.car.brand} ${detail.car.model} (${detail.car.year})`} />
                <Row label="Aéroport" value={`${detail.car.airport.city} — ${detail.car.airport.code}`} />
              </Section>
              <Section title="Réservation">
                <Row label="Arrivée" value={formatDate(detail.startDate)} />
                <Row label="Retour" value={formatDate(detail.endDate)} />
                <Row label="Durée" value={`${calcDays(detail.startDate, detail.endDate)} jour(s)`} />
                <Row label="Protection" value={detail.protection === 'BASIC' ? 'Basique' : 'Aucune'} />
                <Row label="Total" value={`${Number(detail.totalPrice).toLocaleString('fr-DZ')} DZD`} />
                <Row
                  label="Statut"
                  value={<Badge variant={STATUS_BADGE[detail.status].variant}>{STATUS_BADGE[detail.status].label}</Badge>}
                />
              </Section>

              {(detail.status === 'PENDING' || detail.status === 'CONFIRMED') && (
                <div className="flex gap-2 pt-2">
                  {detail.status === 'PENDING' && (
                    <Button size="sm" className="flex-1" onClick={() => updateStatus(detail, 'CONFIRMED')}>
                      Confirmer
                    </Button>
                  )}
                  {detail.status === 'CONFIRMED' && (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => updateStatus(detail, 'RETURNED')}>
                      Marquer retournée
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => { updateStatus(detail, 'CANCELLED'); setDetail(null) }}>
                    Annuler
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la réservation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La réservation #{toDelete?.id} de {toDelete?.clientName} sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { deleteMutation.mutate(toDelete!.id); setToDelete(null) }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold text-foreground mb-2">{title}</p>
      <div className="space-y-1.5 pl-1">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}
