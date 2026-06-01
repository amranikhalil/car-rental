import { isBefore, startOfToday } from 'date-fns'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
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

export default function SearchBar({
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
  const today = startOfToday()

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-sm font-medium ">Aéroport d'arrivée</label>
            <Select value={airportId} onValueChange={onAirportChange}>
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
            <DatePicker
              value={startDate}
              onChange={onStartChange}
              label="Date d'arrivée"
              placeholder="Arrivée"
              disabled={(d) => isBefore(d, today)}
            />
          </div>

          <div className="space-y-1.5">
            <DatePicker
              value={endDate}
              onChange={onEndChange}
              label="Date de retour"
              placeholder="Retour"
              disabled={(d) =>
                isBefore(d, today) || (startDate ? !isBefore(startDate, d) : false)
              }
            />
          </div>

          <Button onClick={onSearch} disabled={!canSearch} className="gap-2">
            <Search className="w-4 h-4" />
            Rechercher
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
