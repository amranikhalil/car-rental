import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Props {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  label?: string
  disabled?: (date: Date) => boolean
}

export function DatePicker({ value, onChange, placeholder = 'Choisir une date', label, disabled }: Props) {
  const [open,setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn('w-full h-auto justify-start text-left font-normal py-2', !value && 'text-muted-foreground')}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        <span className="flex flex-col leading-tight">
          {label && <span className="text-xs font-medium text-foreground">{label}</span>}
          <span>{value ? format(value, 'dd MMM yyyy', { locale: fr }) : placeholder}</span>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(data)=>{
            onChange(data)
            setOpen(false)
          }}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
