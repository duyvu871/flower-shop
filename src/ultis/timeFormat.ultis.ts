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

export function startTime(
	range:
		| 'hour'
		| 'day'
		| 'week'
		| 'month'
		| 'year'
		| 'all'
		| 'morning'
		| 'afternoon'
		| 'evening'
		| 'other',
	prevSession: boolean = false,
) {
	const currentDate = new Date(); // get current date
	const currentTime = currentDate.getTime(); // get current time
	const currentDayFormat = `${currentDate.getMonth() + 1}/${currentDate.getDate() + 1}/${currentDate.getFullYear()}`; // get format date string

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
			startTime = new Date(
				new Date().getFullYear(),
				new Date().getMonth() - 1,
				new Date().getDate(),
			); // 1 tháng trước
			break;
		case 'year':
			startTime = new Date(
				new Date().getFullYear() - 1,
				new Date().getMonth(),
				new Date().getDate(),
			); // 1 năm trước
			break;
		case 'all':
			startTime = new Date(0); // Thời gian bắt đầu
			break;
		case 'morning':
			startTime = new Date(
				`${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
			);
			break;
		case 'afternoon':
			startTime = new Date(
				`${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
			);
			break;
		case 'evening':
			startTime = new Date(
				`${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
			);
			break;
		case 'other':
			startTime = new Date(
				`${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
			);
			break;
		default:
			throw new Error('Invalid range');
	}
	return startTime;
}

export function getEndTime(range: 'morning' | 'afternoon' | 'evening' | 'other') {
	const currentDate = new Date(); // get current date
	const currentTime = currentDate.getTime(); // get current time
	const currentDayFormat = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`; // get f
	let endTime: Date;
	switch (range) {
		case 'morning':
			endTime = new Date(`${currentDayFormat} 23:59`);
			break;
		case 'afternoon':
			endTime = new Date(`${currentDayFormat} 23:59`);
			break;
		case 'evening':
			endTime = new Date(`${currentDayFormat} 23:59`);
			break;
		default:
			endTime = currentDate;
	}
	return endTime;
}

export function getPreviousCycle(range: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all') {
	let startTime: Date, endTime: Date;

	const currentDate = new Date();

	switch (range) {
		case 'hour':
			startTime = new Date(currentDate.getTime() - 2 * 60 * 60 * 1000); // 1 giờ trước
			endTime = new Date(currentDate.getTime() - 60 * 60 * 1000);
			break;
		case 'day':
			startTime = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 ngày trước
			endTime = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // 1 ngày trước
			break;
		case 'week':
			const firstDayOfWeek = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				currentDate.getDate() - currentDate.getDay() + 1,
			);
			startTime = new Date(firstDayOfWeek.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 tuần trước
			endTime = new Date(firstDayOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000); // 2 ngày trước
			break;
		case 'month':
			startTime = new Date(currentDate.getTime() - 2 * 30 * 24 * 60 * 60 * 1000); // 2 tháng trước
			endTime = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 1 tháng trước
			break;
		default:
			throw new Error('Invalid range');
	}

	return { startTime, endTime };
}

export function getTypeRangeTime(type: 'morning' | 'afternoon' | 'evening') {
	const rangeTime = {
		morning: {
			start: '10:30',
			end: '11:00',
		},
		afternoon: {
			start: '16:30',
			end: '17:00',
		},
		evening: {
			start: '21:00',
			end: '23:00',
		},
	};

	const currentDate = new Date();
	const format = formatDate(currentDate);
	const startTime = new Date(
		`${format.year}-${format.month}-${format.day} ${rangeTime[type].start}`,
	).toISOString();
	const endTime = new Date(
		`${format.year}-${format.month}-${format.day} ${rangeTime[type].end}`,
	).toISOString();

	return { startTime, endTime };
}

export enum TimeRange {
	hour = 'gio',
	day = 'ngay',
	week = 'tuan',
	month = 'thang',
	year = 'nam',
	all = 'tat ca',
	morning = 'trua',
	afternoon = 'chieu',
	evening = 'toi',
	other = 'khac',
}

export enum TimeRangeLabel {
	hour = 'Giờ',
	day = 'Ngày',
	week = 'Tuần',
	month = 'Tháng',
	year = 'Năm',
	all = 'Tất cả',
}

export enum orderTimeRangeSummary {
	morning = 'Trưa',
	afternoon = 'Chiều',
	evening = 'Tối',
	other = 'Khác',
	all = 'Tất cả',
}
