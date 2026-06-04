import { format } from 'date-fns'
import { IconArrow } from './Illustrations'
import TrustStrip from './TrustStrip'
import heroCar from '@/assets/tuxon.png'
import type { Airport } from '@/api/cars'

interface Props {
  airports: Airport[]
  airportId: string
  startDate: Date | undefined
  endDate: Date | undefined
  onAirportChange: (v: string) => void
  onStartChange: (d: Date | undefined) => void
  onEndChange: (d: Date | undefined) => void
  onSearch: () => void
  canSearch: boolean
}

export default function HeroSection({
  airports,
  airportId,
  startDate,
  endDate,
  onAirportChange,
  onStartChange,
  onEndChange,
  onSearch,
  canSearch,
}: Props) {
  function handleStartChange(e: React.ChangeEvent<HTMLInputElement>) {
    const d = e.target.value ? new Date(e.target.value) : undefined
    onStartChange(d)
  }
  function handleEndChange(e: React.ChangeEvent<HTMLInputElement>) {
    const d = e.target.value ? new Date(e.target.value) : undefined
    onEndChange(d)
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <section className="hero hero-b">
      <div className="frame poster">
        <div className="poster-bg"></div>
        <div className="poster-disc"></div>

        <svg className="poster-arc" viewBox="0 0 600 600" aria-hidden="true">
          <circle cx="300" cy="300" r="280" fill="none" stroke="rgba(255,255,255,.22)"
            strokeWidth="1.5" strokeDasharray="2 8" />
          <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(255,255,255,.10)"
            strokeWidth="1" />
        </svg>

       

        {/* Copy first in DOM — appears first on mobile, left column on desktop */}
        <div className="copy poster-copy">
          <h1 className="poster-h1">
            Une voiture <br />
            qui vous attend,<br />
            <em>où que vous alliez</em>
          </h1>
          <p className="sub poster-sub">
           Réservez en ligne, récupérez à l'aéroport d'Alger ou dans l'une de nos agences. 
           Roulez sans détour — de la Méditerranée jusqu'au Hoggar.

          </p>
        </div>

        {/* Car second in DOM — appears below copy on mobile, right side on desktop */}
        <div className="poster-car">
          <img src={heroCar} alt="Voiture de location" />
          <div className="poster-car-shadow"></div>
        </div>
      </div>

      <div className="booking-wrap">
        <form className="booking" onSubmit={(e) => { e.preventDefault(); if (canSearch) onSearch() }}>
          <div className="bk-field">
            <span className="lbl"> LIEU DE RÉCUPÉRATION </span>
            <select
              value={airportId}
              onChange={(e) => onAirportChange(e.target.value)}
            >
              <option value="">Choisir un lieux</option>
              {airports.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.city} — {a.code}
                </option>
              ))}
            </select>
          </div>

          <div
            className="bk-field"
            onClick={(e) => e.currentTarget.querySelector('input')?.showPicker?.()}
          >
            <span className="lbl">DATE DE RÉCUPÉRATION</span>
            <input
              type="date"
              min={today}
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={handleStartChange}
            />
          </div>

          <div
            className="bk-field"
            onClick={(e) => e.currentTarget.querySelector('input')?.showPicker?.()}
          >
            <span className="lbl">DATE DE RENDU</span>
            <input
              type="date"
              min={startDate ? format(startDate, 'yyyy-MM-dd') : today}
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
              onChange={handleEndChange}
            />
          </div>

          <button type="submit" className="bk-cta" disabled={!canSearch}>
            Voir les voitures
            <IconArrow />
          </button>
        </form>
      </div>

      <TrustStrip />
    </section>
  )
}
