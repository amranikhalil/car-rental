import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { airportsApi, carsApi, type Car, type CarPayload } from '@/api/cars'
import PhotoUploader from '@/components/PhotoUploader'

interface Props {
  open: boolean
  onClose: () => void
  car?: Car
}

const defaultForm: CarPayload = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  pricePerDay: 0,
  transmission: 'MANUAL',
  fuel: 'ESSENCE',
  seats: 5,
  photos: [],
  airportId: 0,
  isAvailable: true,
}

export default function CarForm({ open, onClose, car }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState<CarPayload>(defaultForm)
  const [isUploading, setIsUploading] = useState(false)

  const { data: airports = [] } = useQuery({
    queryKey: ['airports'],
    queryFn: airportsApi.getAll,
  })

  useEffect(() => {
    if (car) {
      setForm({
        brand: car.brand,
        model: car.model,
        year: car.year,
        pricePerDay: parseFloat(car.pricePerDay),
        transmission: car.transmission,
        fuel: car.fuel,
        seats: car.seats,
        photos: car.photos,
        airportId: car.airportId,
        isAvailable: car.isAvailable,
      })
    } else {
      setForm(defaultForm)
    }
  }, [car, open])

  const mutation = useMutation({
    mutationFn: (data: CarPayload) =>
      car ? carsApi.update(car.id, data) : carsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cars'] })
      onClose()
    },
  })

  function set<K extends keyof CarPayload>(key: K, value: CarPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? 'Modifier la voiture' : 'Ajouter une voiture'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Marque</Label>
              <Input value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="Renault" required />
            </div>
            <div className="space-y-1.5">
              <Label>Modèle</Label>
              <Input value={form.model} onChange={(e) => set('model', e.target.value)} placeholder="Clio" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Année</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => set('year', parseInt(e.target.value))}
                min={1990}
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Prix / jour (DZD)</Label>
              <Input
                type="number"
                value={form.pricePerDay}
                onChange={(e) => set('pricePerDay', parseFloat(e.target.value))}
                min={0}
                step={100}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Transmission</Label>
              <Select value={form.transmission} onValueChange={(v) => set('transmission', v as CarPayload['transmission'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL">Manuelle</SelectItem>
                  <SelectItem value="AUTOMATIC">Automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Carburant</Label>
              <Select value={form.fuel} onValueChange={(v) => set('fuel', v as CarPayload['fuel'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ESSENCE">Essence</SelectItem>
                  <SelectItem value="DIESEL">Diesel</SelectItem>
                  <SelectItem value="ELECTRIQUE">Électrique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Places</Label>
              <Input
                type="number"
                value={form.seats}
                onChange={(e) => set('seats', parseInt(e.target.value))}
                min={2}
                max={9}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Aéroport</Label>
            <Select
              value={form.airportId ? String(form.airportId) : ''}
              onValueChange={(v) => set('airportId', parseInt(v))}
            >
              <SelectTrigger><SelectValue placeholder="Choisir un aéroport" /></SelectTrigger>
              <SelectContent>
                {airports.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.city} — {a.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Photos</Label>
            <PhotoUploader
              value={form.photos}
              onChange={(urls) => set('photos', urls)}
              onUploadingChange={setIsUploading}
              maxFiles={6}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Disponibilité</Label>
            <Select
              value={form.isAvailable ? 'true' : 'false'}
              onValueChange={(v) => set('isAvailable', v === 'true')}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Disponible</SelectItem>
                <SelectItem value="false">Indisponible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">Une erreur est survenue. Vérifiez les champs.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={mutation.isPending || isUploading}>
              {isUploading ? 'Upload en cours…' : mutation.isPending ? 'Enregistrement…' : car ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
