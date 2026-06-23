import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { addDays, isBefore, startOfToday } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { carsApi } from '@/api/cars'
import { DatePicker } from '@/components/ui/date-picker'
import BookingModal from '@/pages/search/BookingModal'
import { IconCar, IconCog, IconFuel, IconUsers } from '@/pages/home/Illustrations'
import '@/pages/home/home.css'

const FUEL_LABEL: Record<string, string> = {
  ESSENCE: 'Essence',
  DIESEL: 'Diesel',
  ELECTRIQUE: 'Électrique',
}
const TRANS_LABEL: Record<string, string> = {
  MANUAL: 'Manuelle',
  AUTOMATIC: 'Automatique',
}

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>()
  const today = startOfToday()

  const [startDate, setStartDate] = useState<Date | undefined>(addDays(today, 1))
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(today, 7))
  const [photoIndex, setPhotoIndex] = useState(0)
  const [booking, setBooking] = useState(false)

  const { data: car, isLoading, isError } = useQuery({
    queryKey: ['car', id],
    queryFn: () => carsApi.getById(Number(id)),
    enabled: !!id,
  })

  const canBook = !!startDate && !!endDate

  function handleStart(d: Date | undefined) {
    setStartDate(d)
    if (endDate && d && isBefore(endDate, addDays(d, 1))) setEndDate(undefined)
  }

  return (
    <div className="home-root">
      <div className="page">
        <nav className="nav">
          <Link to="/" className="logo">
            <span className="logo-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 16l-9-4-9 4v-2l9-5V4a1.5 1.5 0 1 1 3 0v5l6 3.5v2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity=".25" />
              </svg>
            </span>
            Airsline
          </Link>
        </nav>
      </div>

      <div className="page">
        <Link to="/" className="detail-back">
          <ArrowLeft size={16} />
          Retour aux voitures
        </Link>

        {isLoading && <p className="cars-sub" style={{ marginTop: 24 }}>Chargement…</p>}

        {isError && (
          <div className="empty-state">
            <IconCar />
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Voiture introuvable</p>
            <p style={{ fontSize: 14 }}>Cette voiture n'existe plus ou n'est plus disponible.</p>
          </div>
        )}

        {car && (
          <div className="car-detail">
            <div className="detail-gallery">
              <div className="detail-photo">
                {car.photos?.[photoIndex]
                  ? <img src={car.photos[photoIndex]} alt={`${car.brand} ${car.model}`} />
                  : <IconCar />}
              </div>
              {car.photos && car.photos.length > 1 && (
                <div className="detail-thumbs">
                  {car.photos.map((p, i) => (
                    <button
                      key={i}
                      className={`detail-thumb ${i === photoIndex ? 'active' : ''}`}
                      onClick={() => setPhotoIndex(i)}
                    >
                      <img src={p} alt={`Vue ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="detail-info">
              <div className="detail-top">
                <div>
                  <h1 className="detail-name">{car.brand} {car.model}</h1>
                  <p className="car-year">{car.year}</p>
                </div>
                <span className="airport-badge">{car.airport.code}</span>
              </div>

              <div className="car-specs detail-specs">
                <span className="car-spec"><IconCog /> {TRANS_LABEL[car.transmission]}</span>
                <span className="car-spec"><IconFuel /> {FUEL_LABEL[car.fuel]}</span>
                <span className="car-spec"><IconUsers /> {car.seats} places</span>
              </div>

              <p className="detail-airport">
                Récupération à <strong>{car.airport.name}</strong> · {car.airport.city}
              </p>

              <div className="car-divider" />

              <div className="detail-price">
                {Number(car.pricePerDay).toLocaleString('fr-DZ')}
                <span> DZD/jour</span>
              </div>

              <div className="detail-dates">
                <div className="bk-field">
                  <span className="lbl">DATE DE RÉCUPÉRATION</span>
                  <DatePicker
                    value={startDate}
                    onChange={handleStart}
                    placeholder="Arrivée"
                    disabled={(d) => isBefore(d, today)}
                  />
                </div>
                <div className="bk-field">
                  <span className="lbl">DATE DE RENDU</span>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="Retour"
                    disabled={(d) => !startDate || isBefore(d, addDays(startDate, 1))}
                  />
                </div>
              </div>

              <button className="btn detail-cta" onClick={() => setBooking(true)} disabled={!canBook}>
                Réserver cette voiture
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="page">
        <footer className="home-footer">
          <div>© 2026 Airsline · Alger, Algérie</div>
        </footer>
      </div>

      {booking && car && startDate && endDate && (
        <BookingModal
          car={car}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setBooking(false)}
        />
      )}
    </div>
  )
}
