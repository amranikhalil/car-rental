import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { addDays, isBefore, format } from 'date-fns'
import { Car as CarIcon, Fuel, Users, Cog, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { airportsApi, carsApi, type Car } from '@/api/cars'
import BookingModal from './BookingModal'
import SearchBar from '@/components/SearchBar'

const FUEL_LABEL: Record<string, string> = { ESSENCE: 'Essence', DIESEL: 'Diesel', ELECTRIQUE: 'Électrique' }
const TRANS_LABEL: Record<string, string> = { MANUAL: 'Manuelle', AUTOMATIC: 'Automatique' }

interface SearchParams {
  airportId: string
  startDate: Date | undefined
  endDate: Date | undefined
}

export default function SearchPage() {
  const [form, setForm] = useState<SearchParams>({
    airportId: '',
    startDate: undefined,
    endDate: undefined,
  })
  const [activeParams, setActiveParams] = useState<SearchParams | null>(null)
  const [booking, setBooking] = useState<Car | null>(null)

  const { data: airports = [] } = useQuery({
    queryKey: ['airports'],
    queryFn: airportsApi.getAll,
  })

  useEffect(() => {
    if (airports.length > 0 && !form.airportId) {
      const alg = airports.find((a) => a.code === 'ALG')
      if (alg) setForm((p) => ({ ...p, airportId: String(alg.id) }))
    }
  }, [airports])

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['cars', activeParams],
    queryFn: () =>
      activeParams
        ? carsApi.getAll(
            activeParams.airportId ? Number(activeParams.airportId) : undefined,
            activeParams.startDate?.toISOString(),
            activeParams.endDate?.toISOString(),
          )
        : carsApi.getAll(),
  })

  const canSearch = !!form.airportId && !!form.startDate && !!form.endDate
  const isFiltered = activeParams !== null

  function handleSearch() {
    if (!canSearch) return
    setActiveParams(form)
  }

  function handleReset() {
    setForm({ airportId: '', startDate: undefined, endDate: undefined })
    setActiveParams(null)
  }

  function setAirport(v: string) { setForm((p) => ({ ...p, airportId: v })) }
  function setStart(d: Date | undefined) {
    setForm((p) => ({
      ...p,
      startDate: d,
      endDate: p.endDate && d && isBefore(p.endDate, addDays(d, 1)) ? undefined : p.endDate,
    }))
  }
  function setEnd(d: Date | undefined) { setForm((p) => ({ ...p, endDate: d })) }

  const activeAirport = activeParams?.airportId
    ? airports.find((a) => String(a.id) === activeParams.airportId)
    : null

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
        <SearchBar
          airports={airports}
          airportId={form.airportId}
          startDate={form.startDate}
          endDate={form.endDate}
          onAirportChange={setAirport}
          onStartChange={setStart}
          onEndChange={setEnd}
          onSearch={handleSearch}
          canSearch={canSearch}
        />

        {/* Results */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {isLoading
                ? 'Chargement…'
                : isFiltered && activeAirport
                ? `${cars.length} voiture${cars.length !== 1 ? 's' : ''} disponible${cars.length !== 1 ? 's' : ''} · ${activeAirport.city} — ${format(activeParams!.startDate!, 'dd MMM')} → ${format(activeParams!.endDate!, 'dd MMM yyyy')}`
                : `${cars.length} voiture${cars.length !== 1 ? 's' : ''} disponible${cars.length !== 1 ? 's' : ''}`}
            </h2>
            {isFiltered && (
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={handleReset}>
                <X className="w-3.5 h-3.5" />
                Réinitialiser
              </Button>
            )}
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
                canBook={!!form.startDate && !!form.endDate}
                onBook={() => setBooking(car)}
              />
            ))}
          </div>
        </div>
      </div>

      {booking && form.startDate && form.endDate && (
        <BookingModal
          car={booking}
          startDate={form.startDate}
          endDate={form.endDate}
          onClose={() => setBooking(null)}
        />
      )}
    </div>
  )
}

function CarCard({ car, canBook, onBook }: { car: Car; canBook: boolean; onBook: () => void }) {
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
          <Button
            size="sm"
            onClick={onBook}
            disabled={!canBook}
            title={canBook ? undefined : 'Sélectionnez des dates pour réserver'}
          >
            Réserver
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
