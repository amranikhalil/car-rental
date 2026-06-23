import { format } from 'date-fns'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IconCar, IconCog, IconFuel, IconUsers } from './Illustrations'
import type { Car } from '@/api/cars'

const FUEL_LABEL: Record<string, string> = {
  ESSENCE: 'Essence',
  DIESEL: 'Diesel',
  ELECTRIQUE: 'Électrique',
}
const TRANS_LABEL: Record<string, string> = {
  MANUAL: 'Manuelle',
  AUTOMATIC: 'Automatique',
}

interface Props {
  cars: Car[]
  isLoading: boolean
  isFiltered: boolean
  activeAirport?: { city: string } | null
  startDate?: Date
  endDate?: Date
  canBook: boolean
  onBook: (car: Car) => void
  onReset: () => void
  carsRef: React.RefObject<HTMLDivElement>
}

export default function CarGrid({
  cars,
  isLoading,
  isFiltered,
  activeAirport,
  startDate,
  endDate,
  canBook,
  onBook,
  onReset,
  carsRef,
}: Props) {
  const subtitle = isLoading
    ? 'Chargement…'
    : isFiltered && activeAirport && startDate && endDate
    ? `${cars.length} voiture${cars.length !== 1 ? 's' : ''} disponible${cars.length !== 1 ? 's' : ''} · ${activeAirport.city} — ${format(startDate, 'dd MMM')} → ${format(endDate, 'dd MMM yyyy')}`
    : `${cars.length} voiture${cars.length !== 1 ? 's' : ''} disponible${cars.length !== 1 ? 's' : ''}`

  return (
    <div id="cars" ref={carsRef} className="cars-section">
      <div className="cars-head">
        <div>
          <h2>Notre flotte</h2>
          <p className="cars-sub">{subtitle}</p>
        </div>
        {isFiltered && (
          <button className="reset-btn" onClick={onReset}>
            <X size={13} />
            Réinitialiser
          </button>
        )}
      </div>

      {!isLoading && cars.length === 0 && (
        <div className="empty-state">
          <IconCar />
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Aucune voiture disponible</p>
          <p style={{ fontSize: 14 }}>Essayez d'autres dates ou un autre aéroport.</p>
        </div>
      )}

      <div className="cars-grid">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} canBook={canBook} onBook={() => onBook(car)} />
        ))}
      </div>
    </div>
  )
}

function CarCard({ car, canBook, onBook }: { car: Car; canBook: boolean; onBook: () => void }) {
  const photo = car.photos?.[0]

  return (
    <article className="car-card">
      <Link to={`/car/${car.id}`} className="car-photo">
        {photo
          ? <img src={photo} alt={`${car.brand} ${car.model}`} />
          : <IconCar />
        }
      </Link>

      <div className="car-body">
        <div className="car-top">
          <div>
            <h3 className="car-name">
              <Link to={`/car/${car.id}`}>{car.brand} {car.model}</Link>
            </h3>
            <p className="car-year">{car.year}</p>
          </div>
          <span className="airport-badge">{car.airport.code}</span>
        </div>

        <div className="car-specs">
          <span className="car-spec"><IconCog /> {TRANS_LABEL[car.transmission]}</span>
          <span className="car-spec"><IconFuel /> {FUEL_LABEL[car.fuel]}</span>
          <span className="car-spec"><IconUsers /> {car.seats} places</span>
        </div>

        <div className="car-divider" />

        <div className="car-footer">
          <div className="car-price">
            {Number(car.pricePerDay).toLocaleString('fr-DZ')}
            <span> DZD/jour</span>
          </div>
          <button
            className="btn"
            onClick={onBook}
            disabled={!canBook}
            title={canBook ? undefined : 'Sélectionnez des dates pour réserver'}
            style={{ padding: '10px 18px', fontSize: 13 }}
          >
            Réserver
          </button>
        </div>
      </div>
    </article>
  )
}
