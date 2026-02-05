import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface RangeCalendarCustomProps {
  picker?: 'date' | 'month' | 'year';
  onChange?: (date: DateRange | undefined, dateString: [string, string]) => void;
  allowClear?: boolean;
  style?: React.CSSProperties;
}

function RangeCalendarCustom({
  picker = 'date',
  onChange,
  allowClear = false,
  style = {},
}: RangeCalendarCustomProps) {
  const [date, setDate] = useState<DateRange | undefined>();

  const getFormat = () => {
    if (picker === 'month') return 'MM/yyyy';
    if (picker === 'year') return 'yyyy';
    return 'dd/MM/yyyy';
  };

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (onChange) {
      const dateStrings: [string, string] = [
        range?.from ? format(range.from, getFormat(), { locale: vi }) : '',
        range?.to ? format(range.to, getFormat(), { locale: vi }) : '',
      ];
      onChange(range, dateStrings);
    }
  };

  const handleClear = () => {
    setDate(undefined);
    if (onChange) {
      onChange(undefined, ['', '']);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          style={style}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, getFormat(), { locale: vi })} -{' '}
                {format(date.to, getFormat(), { locale: vi })}
              </>
            ) : (
              format(date.from, getFormat(), { locale: vi })
            )
          ) : (
            <span className="text-muted-foreground">Chọn khoảng thời gian</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
        {allowClear && date && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" onClick={handleClear} className="w-full">
              Xóa
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default RangeCalendarCustom;
