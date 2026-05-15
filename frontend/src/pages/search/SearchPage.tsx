import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { addDays, isBefore, startOfToday } from 'date-fns'
import { Search, Car as CarIcon, Fuel, Users, Cog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Separator } from '@/components/ui/separator'
import { airportsApi, carsApi, type Car } from '@/api/cars'
import BookingModal from './BookingModal'

const FUEL_LABEL: Record<string, string> = { ESSENCE: 'Essence', DIESEL: 'Diesel', ELECTRIQUE: 'Électrique' }
const TRANS_LABEL: Record<string, string> = { MANUAL: 'Manuelle', AUTOMATIC: 'Automatique' }

interface SearchParams {
  airportId: string
  startDate: Date | undefined
  endDate: Date | undefined
}

export default function SearchPage() {
  const [params, setParams] = useState<SearchParams>({
    airportId: '',
    startDate: undefined,
    endDate: undefined,
  })
  const [searched, setSearched] = useState(false)
  const [booking, setBooking] = useState<Car | null>(null)

  const { data: airports = [] } = useQuery({
    queryKey: ['airports'],
    queryFn: airportsApi.getAll,
  })

  const { data: cars = [], isLoading, refetch } = useQuery({
    queryKey: ['search', params],
    queryFn: () =>
      carsApi.getAll(
        params.airportId ? Number(params.airportId) : undefined,
        params.startDate?.toISOString(),
        params.endDate?.toISOString(),
      ),
    enabled: false,
  })

  const today = startOfToday()

  function handleSearch() {
    if (!params.airportId || !params.startDate || !params.endDate) return
    setSearched(true)
    refetch()
  }

  function setAirport(v: string) { setParams((p) => ({ ...p, airportId: v })) }
  function setStart(d: Date | undefined) {
    setParams((p) => ({
      ...p,
      startDate: d,
      endDate: p.endDate && d && isBefore(p.endDate, addDays(d, 1)) ? undefined : p.endDate,
    }))
  }
  function setEnd(d: Date | undefined) { setParams((p) => ({ ...p, endDate: d })) }

  const canSearch = !!params.airportId && !!params.startDate && !!params.endDate

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">Airsline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Réservez votre voiture avant d'atterrir
          </p>
        </div>
      </div>

      {/* Search form */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Aéroport d'arrivée</label>
                <Select value={params.airportId} onValueChange={setAirport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un aéroport" />
                  </SelectTrigger>
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
                <label className="text-sm font-medium">Date d'arrivée</label>
                <DatePicker
                  value={params.startDate}
                  onChange={setStart}
                  placeholder="Arrivée"
                  disabled={(d) => isBefore(d, today)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Date de retour</label>
                <DatePicker
                  value={params.endDate}
                  onChange={setEnd}
                  placeholder="Retour"
                  disabled={(d) =>
                    isBefore(d, today) || (params.startDate ? !isBefore(params.startDate, d) : false)
                  }
                />
              </div>

              <Button onClick={handleSearch} disabled={!canSearch} className="gap-2">
                <Search className="w-4 h-4" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {isLoading
                  ? 'Recherche en cours…'
                  : `${cars.length} voiture${cars.length !== 1 ? 's' : ''} disponible${cars.length !== 1 ? 's' : ''}`}
              </h2>
            </div>

            {!isLoading && cars.length === 0 && (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground space-y-2">
                  <CarIcon className="w-10 h-10 mx-auto opacity-30" />
                  <p className="font-medium">Aucune voiture disponible</p>
                  <p className="text-sm">Essayez d'autres dates ou un autre aéroport.</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onBook={() => setBooking(car)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {booking && params.startDate && params.endDate && (
        <BookingModal
          car={booking}
          startDate={params.startDate}
          endDate={params.endDate}
          onClose={() => setBooking(null)}
        />
      )}
    </div>
  )
}

function CarCard({ car, onBook }: { car: Car; onBook: () => void }) {
  const photo = car.photos?.[0]

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-44 bg-muted flex items-center justify-center overflow-hidden">
        {photo ? (
          <img src={photo} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
        ) : (
          <CarIcon className="w-12 h-12 text-muted-foreground/30" />
        )}
      </div>

      <CardContent className="pt-4 pb-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-base leading-tight">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-muted-foreground">{car.year}</p>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {car.airport.code}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Cog className="w-3.5 h-3.5" />
            {TRANS_LABEL[car.transmission]}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" />
            {FUEL_LABEL[car.fuel]}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {car.seats} places
          </span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">
              {Number(car.pricePerDay).toLocaleString('fr-DZ')}
            </span>
            <span className="text-sm text-muted-foreground"> DZD/jour</span>
          </div>
          <Button size="sm" onClick={onBook}>Réserver</Button>
        </div>
      </CardContent>
    </Card>
  )
}
