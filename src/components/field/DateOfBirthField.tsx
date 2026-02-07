import { useState } from 'react';
import timeUtils from '@/utils/time-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateOfBirthFieldProps {
  field: any;
}

function DateOfBirthField({ field }: DateOfBirthFieldProps) {
  const { name, value } = field;
  const { day, month, year } = value;
  const [dateOfBirth, setDateOfBirth] = useState({ ...value });

  const getDaysInMonth = () => {
    let end = 31;
    const { month, year } = dateOfBirth;
    if (month === 4 || month === 6 || month === 9 || month === 11) end = 30;
    if (month === 2) {
      end = timeUtils.checkLeapYear(year) ? 29 : 28;
    }
    return end;
  };

  const isMonthDisabled = (monthNum: number) => {
    const { day, year } = dateOfBirth;
    if (day === 31) {
      if ([2, 4, 6, 9, 11].includes(monthNum)) return true;
    }
    if (day === 30 && monthNum === 2) return true;
    if (day === 29 && monthNum === 2 && !timeUtils.checkLeapYear(year)) return true;
    return false;
  };

  const handleDayChange = (dayValue: string) => {
    const valueTemp = { ...value, day: parseInt(dayValue) };
    setDateOfBirth(valueTemp);
    handleValueChange(valueTemp);
  };

  const handleMonthChange = (monthValue: string) => {
    const valueTemp = { ...value, month: parseInt(monthValue) };
    setDateOfBirth(valueTemp);
    handleValueChange(valueTemp);
  };

  const handleYearChange = (yearValue: string) => {
    const valueTemp = { ...value, year: parseInt(yearValue) };
    setDateOfBirth(valueTemp);
    handleValueChange(valueTemp);
  };

  const handleValueChange = (newValue: any) => {
    const changeEvent = {
      target: {
        name,
        value: newValue,
      },
    };
    field.onChange(changeEvent);
  };

  const yearValid = new Date().getFullYear() - 10;
  const years = Array.from({ length: yearValid - 1950 + 1 }, (_, i) => 1950 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysCount = getDaysInMonth();
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  return (
    <div className="flex gap-2">
      <Select defaultValue={day?.toString()} onValueChange={handleDayChange}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Ngày" />
        </SelectTrigger>
        <SelectContent>
          {days.map((d) => (
            <SelectItem key={d} value={d.toString()}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={month?.toString()} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Tháng" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m} value={m.toString()} disabled={isMonthDisabled(m)}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={year?.toString()} onValueChange={handleYearChange}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Năm" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default DateOfBirthField;
