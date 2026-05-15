import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, differenceInCalendarDays } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Car } from '@/api/cars'
import api from '@/api/axios'

interface Props {
  car: Car
  startDate: Date
  endDate: Date
  onClose: () => void
}

const PROTECTION_FEE = 500

export default function BookingModal({ car, startDate, endDate, onClose }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ clientName: '', clientEmail: '', clientPhone: '' })
  const [protection, setProtection] = useState<'NONE' | 'BASIC'>('NONE')
  const [success, setSuccess] = useState(false)

  const days = Math.max(1, differenceInCalendarDays(endDate, startDate))
  const basePrice = days * Number(car.pricePerDay)
  const protectionFee = protection === 'BASIC' ? days * PROTECTION_FEE : 0
  const totalPrice = basePrice + protectionFee

  const mutation = useMutation({
    mutationFn: () =>
      api.post('/reservations', {
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone,
        carId: car.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        protection,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['search'] })
      setSuccess(true)
    },
  })

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  if (success) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-sm text-center">
          <div className="py-6 space-y-3">
            <div className="text-4xl">✅</div>
            <h2 className="text-lg font-bold">Réservation envoyée !</h2>
            <p className="text-sm text-muted-foreground">
              Votre demande est en attente de confirmation. Vous recevrez une réponse à <strong>{form.clientEmail}</strong>.
            </p>
            <Button className="w-full mt-2" onClick={onClose}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Réserver — {car.brand} {car.model}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Summary */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dates</span>
              <span className="font-medium">
                {format(startDate, 'dd MMM')} → {format(endDate, 'dd MMM yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Durée</span>
              <span className="font-medium">{days} jour{days > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aéroport</span>
              <span className="font-medium">{car.airport.city} — {car.airport.code}</span>
            </div>
          </div>

          <Separator />

          {/* Client info */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nom complet</Label>
              <Input
                placeholder="Karim Amrani"
                value={form.clientName}
                onChange={(e) => set('clientName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="karim@gmail.com"
                value={form.clientEmail}
                onChange={(e) => set('clientEmail', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input
                placeholder="+33 6 12 34 56 78"
                value={form.clientPhone}
                onChange={(e) => set('clientPhone', e.target.value)}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Protection */}
          <div className="space-y-1.5">
            <Label>Protection</Label>
            <Select value={protection} onValueChange={(v) => setProtection(v as typeof protection)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Aucune protection</SelectItem>
                <SelectItem value="BASIC">Protection basique (+{PROTECTION_FEE} DZD/jour)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price breakdown */}
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{days}j × {Number(car.pricePerDay).toLocaleString('fr-DZ')} DZD</span>
              <span>{basePrice.toLocaleString('fr-DZ')} DZD</span>
            </div>
            {protection === 'BASIC' && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protection ({days}j × {PROTECTION_FEE})</span>
                <span>{protectionFee.toLocaleString('fr-DZ')} DZD</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{totalPrice.toLocaleString('fr-DZ')} DZD</span>
            </div>
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">
              Une erreur est survenue. Ce véhicule est peut-être déjà réservé.
            </p>
          )}

          <Button
            className="w-full"
            disabled={mutation.isPending || !form.clientName || !form.clientEmail || !form.clientPhone}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? 'Envoi en cours…' : 'Confirmer la réservation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
