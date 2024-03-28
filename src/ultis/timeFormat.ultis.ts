import moment from "moment";

export function formatISODate(isoDateString: Date): string {
    const isoDate = new Date(isoDateString);

    const year = isoDate.getFullYear();
    const month = String(isoDate.getMonth() + 1).padStart(2, '0');
    const day = String(isoDate.getDate()).padStart(2, '0');
    const hours = String(isoDate.getHours()).padStart(2, '0');
    const minutes = String(isoDate.getMinutes()).padStart(2, '0');
    const seconds = String(isoDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedDate} | ${formattedTime}`;
}

interface FormattedDate {
    day: number;
    month: number;
    year: number;
    time: string;
}

export function formatDate(date: Date): FormattedDate {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format hours and minutes with leading zeros if needed
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    // Construct the time string in HH:mm format
    const time = `${formattedHours}:${formattedMinutes}`;

    return { day, month, year, time };
}

export function startTime(range: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all', prevSession: boolean = false) {
    const currentTime = new Date().getTime();
    let startTime: Date;
    switch (range) {
        case 'hour':
            startTime = new Date(currentTime - 3600 * 1000); // 1 giờ trước
            break;
        case 'day':
            startTime = new Date(currentTime - 24 * 3600 * 1000); // 1 ngày trước
            break;
        case 'week':
            startTime = new Date(currentTime - 7 * 24 * 3600 * 1000); // 1 tuần trước
            break;
        case 'month':
            startTime = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()); // 1 tháng trước
            break;
        case 'year':
            startTime = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()); // 1 năm trước
            break;
        case 'all':
            startTime = new Date(0); // Thời gian bắt đầu
            break;
        default:
            throw new Error('Invalid range');
    }
    return startTime;
}

export function getPreviousCycle(range: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all') {
    let startTime: Date, endTime: Date;

    switch (range) {
        case 'hour':
            startTime = moment().subtract(1, 'hours').startOf('hour').toDate();
            endTime = moment().subtract(1, 'hours').endOf('hour').toDate();
            break;
        case 'day':
            startTime = moment().subtract(1, 'days').startOf('day').toDate();
            endTime = moment().subtract(1, 'days').endOf('day').toDate();
            break;
        case 'week':
            startTime = moment().subtract(1, 'weeks').startOf('isoWeek').toDate();
            endTime = moment().subtract(1, 'weeks').endOf('isoWeek').toDate();
            break;
        case 'month':
            startTime = moment().subtract(1, 'months').startOf('month').toDate();
            endTime = moment().subtract(1, 'months').endOf('month').toDate();
            break;
        default:
            throw new Error('Invalid range');
    }

    return { startTime, endTime };
}

export enum TimeRange {
    hour = 'gio',
    day = 'ngay',
    week = 'tuan',
    month = 'thang',
    year = 'nam',
    all = 'tat ca'
}

export enum TimeRangeLabel {
    hour = 'Giờ',
    day = 'Ngày',
    week = 'Tuần',
    month = 'Tháng',
    year = 'Năm',
    all = 'Tất cả'
}