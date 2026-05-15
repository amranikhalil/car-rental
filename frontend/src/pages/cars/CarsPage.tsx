import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { carsApi, type Car } from '@/api/cars'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import CarForm from './CarForm'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function CarsPage() {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Car | undefined>()
  const [deleting, setDeleting] = useState<Car | undefined>()

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: carsApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => carsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cars'] })
      setDeleting(undefined)
    },
  })

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(car: Car) {
    setEditing(car)
    setFormOpen(true)
  }

  const fuelLabel: Record<string, string> = {
    ESSENCE: 'Essence', DIESEL: 'Diesel', ELECTRIQUE: 'Électrique',
  }
  const transmissionLabel: Record<string, string> = {
    MANUAL: 'Manuelle', AUTOMATIC: 'Automatique',
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des voitures</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {cars.length} voiture{cars.length !== 1 ? 's' : ''} enregistrée{cars.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une voiture
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200"> 
              <TableHead >Voiture</TableHead>
              <TableHead>Aéroport</TableHead>
              <TableHead>Prix / jour</TableHead>
              <TableHead>Transmission</TableHead>
              <TableHead>Carburant</TableHead>
              <TableHead>Places</TableHead>
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
            {!isLoading && cars.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  Aucune voiture enregistrée. Commencez par en ajouter une.
                </TableCell>
              </TableRow>
            )}
            {cars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  <div className="font-medium">{car.brand} {car.model}</div>
                  <div className="text-sm text-muted-foreground">{car.year}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{car.airport.city}</div>
                  <div className="text-sm text-muted-foreground">{car.airport.code}</div>
                </TableCell>
                <TableCell className="font-medium">
                  {Number(car.pricePerDay).toLocaleString('fr-DZ')} DZD
                </TableCell>
                <TableCell>{transmissionLabel[car.transmission]}</TableCell>
                <TableCell>{fuelLabel[car.fuel]}</TableCell>
                <TableCell>{car.seats}</TableCell>
                <TableCell>
                  <Badge variant={car.isAvailable ? 'default' : 'secondary'}>
                    {car.isAvailable ? 'Disponible' : 'Indisponible'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(car)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleting(car)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CarForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        car={editing}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette voiture ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.brand} {deleting?.model} ({deleting?.year}) sera supprimée définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleting && deleteMutation.mutate(deleting.id)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
