import { FileSpreadsheet, FileText, FileType, Presentation } from 'lucide-react';
import PersonalAvatar from '../PersonalAvatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

function TabPaneFile() {
  const [date, setDate] = useState<DateRange | undefined>();

  const handleDatePickerChange = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      console.log('date range', format(range.from, 'dd/MM/yyyy'), format(range.to, 'dd/MM/yyyy'));
    }
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-2 gap-3">
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span>PDF</span>
              </div>
            </SelectItem>
            <SelectItem value="2">
              <div className="flex items-center gap-2">
                <FileType className="h-4 w-4 text-blue-500" />
                <span>Word</span>
              </div>
            </SelectItem>
            <SelectItem value="3">
              <div className="flex items-center gap-2">
                <Presentation className="h-4 w-4 text-orange-500" />
                <span>PowerPoint</span>
              </div>
            </SelectItem>
            <SelectItem value="4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-green-500" />
                <span>Excel</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Người gửi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <div className="flex items-center gap-2">
                <PersonalAvatar dimension={24} />
                <span>Hoàng Hạ Xuyên</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yyyy')} - {format(date.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(date.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDatePickerChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default TabPaneFile;
