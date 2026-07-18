import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { addDays, isBefore } from 'date-fns'
import { airportsApi, carsApi, type Car } from '@/api/cars'
import BookingModal from '@/pages/search/BookingModal'
import HeroSection from './HeroSection'
import HowItWorks from './HowItWorks'
import Testimonials from './Testimonials'
import Contact from './Contact'
import CarGrid from './CarGrid'
import './home.css'

interface SearchParams {
  airportId: string
  startDate: Date | undefined
  endDate: Date | undefined
}

export default function HomePage() {
  const [form, setForm] = useState<SearchParams>({ airportId: '', startDate: undefined, endDate: undefined })
  const [activeParams, setActiveParams] = useState<SearchParams | null>(null)
  const [booking, setBooking] = useState<Car | null>(null)
  const carsRef = useRef<HTMLDivElement>(null!)

  const { data: airports = [] } = useQuery({
    queryKey: ['airports'],
    queryFn: airportsApi.getAll,
  })

  useEffect(() => {
    if (airports.length > 0 && !form.airportId) {
      const alg = airports.find((a) => a.code === 'ALG')
      if (alg) setForm((p) => ({ ...p, airportId: String(alg.id),startDate:addDays(new Date(), 1) , endDate: addDays(new Date(),7)  }))
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
  const activeAirport = activeParams?.airportId
    ? airports.find((a) => String(a.id) === activeParams.airportId)
    : null

  function handleSearch() {
    if (!canSearch) return
    setActiveParams(form)
    setTimeout(() => carsRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
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

  return (
    <div className="home-root">
      {/* Nav */}
      <div className="page">
        <nav className="nav">
          <a href="/" className="logo">
            <span className="logo-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 16l-9-4-9 4v-2l9-5V4a1.5 1.5 0 1 1 3 0v5l6 3.5v2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity=".25"/>
              </svg>
            </span>
            Airsline
          </a>
          {/* <div style={{ display: 'flex', gap: 20, fontSize: 14, alignItems: 'center' }}>
            <a href="#comment-ca-marche" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Comment ça marche</a>
            <a href="#temoignages" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Témoignages</a>
            <a href="#contact" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Contact</a>
          </div> */}
        </nav>
      </div>

      {/* Hero */}
      <div className="page" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div style={{ padding: '0 32px' }}>
          <HeroSection
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
        </div>
      </div>

      {/* How it works */}
      {/* <HowItWorks /> */}

      {/* Testimonials */}
      <Testimonials />

      {/* Contact */}
      {/* <Contact /> */}

      {/* Car grid */}
      <div className="page">
        <CarGrid
          cars={cars}
          isLoading={isLoading}
          isFiltered={isFiltered}
          activeAirport={activeAirport}
          startDate={activeParams?.startDate}
          endDate={activeParams?.endDate}
          canBook={!!form.startDate && !!form.endDate}
          onBook={setBooking}
          onReset={handleReset}
          carsRef={carsRef}
        />
      </div>

      {/* Footer */}
      <div className="page">
        <footer className="home-footer">
          <div>© 2026 Airsline · Alger, Algérie</div>
          <div className="footer-links">
            <a href="#">Mentions légales</a>
            <a href="#">Confidentialité</a>
          </div>
        </footer>
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
