import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
dayjs.extend(isLeapYear);

const DAY_MILLISECONDS = 86400000;
const HOUR_MILLISECONDS = 3600000;
const MINUTE_MILLISECONDS = 60000;

const timeUtils = {
  toTime: (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();

    // khác năm → hiển thị full date
    if (now.year() - date.year() > 0) {
      return date.format('DD/MM/YYYY');
    }

    // quá 7 ngày
    if (date.isBefore(now.subtract(7, 'day'))) {
      return date.format('DD/MM');
    }

    const diffMs = now.diff(date);

    // ngày
    const day = Math.floor(diffMs / DAY_MILLISECONDS);
    if (day > 0) return `${String(day).padStart(2, '0')} ngày`;

    // giờ
    const hour = Math.floor(diffMs / HOUR_MILLISECONDS);
    if (hour > 0) return `${String(hour).padStart(2, '0')} giờ`;

    // phút
    const minute = Math.floor(diffMs / MINUTE_MILLISECONDS);
    if (minute > 0) return `${String(minute).padStart(2, '0')} phút`;

    return 'Vài giây';
  },

  transferDateString: (day: number, month: number, year: number) => {
    return dayjs(`${year}-${month}-${day}`).format('DD/MM/YYYY');
  },

  compareDate: (time: Date | string, currentTime: Date | string) => {
    return dayjs(time).isSame(dayjs(currentTime), 'day');
  },

  checkLeapYear: (year: number) => {
    return dayjs(`${year}-01-01`).isLeapYear();
  },

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};

export default timeUtils;
