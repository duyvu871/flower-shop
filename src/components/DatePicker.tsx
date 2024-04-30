import React, { useEffect } from 'react';

type DatePickerProps = {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
};

export default function DatePicker({ selectedDate, setSelectedDate }: DatePickerProps) {
	const currentDate = new Date();
	const [minute, setMinute] = React.useState<number>(currentDate.getMinutes());
	const [hour, setHour] = React.useState<number>(currentDate.getHours());
	const [day, setDay] = React.useState<number>(currentDate.getDate());
	const [month, setMonth] = React.useState<number>(currentDate.getMonth() + 1);
	const [year, setYear] = React.useState<number>(currentDate.getFullYear());
	const parseDate = (date: string) => {
		return new Date(date);
	};
	const inputClassName = 'border border-gray-300 rounded-md w-14 text-center h-10 p-2';
	useEffect(() => {
		setSelectedDate(parseDate(`${month}/${day}/${year} ${hour}:${minute}`));
	}, [day, month, year]);
	return (
		<div className='flex flex-row gap-2'>
			<div className={'relative'}>
				<span className={'absolute bottom-10 left-2 text-gray-400'}> ngày</span>
				<input
					type='number'
					min={1}
					max={31}
					value={day}
					onChange={e => setDay(parseInt(e.target.value))}
					className={inputClassName}
				/>
			</div>
			<div className={'relative'}>
				<span className={'absolute bottom-10 left-2 text-gray-400'}>tháng</span>
				<input
					type='number'
					min={1}
					max={12}
					value={month}
					onChange={e => setMonth(parseInt(e.target.value))}
					className={inputClassName}
				/>
			</div>
			<div className={'relative'}>
				<span className={'absolute bottom-10 left-2 text-gray-400'}>năm</span>
				<input
					type='number'
					min={1970}
					max={2100}
					value={year}
					onChange={e => setYear(parseInt(e.target.value))}
					className={inputClassName + ' w-20'}
				/>
			</div>
			<div className={'relative'}>
				<span className={'absolute bottom-10 left-2 text-gray-400'}>giờ</span>
				<input
					type='number'
					min={0}
					max={23}
					value={hour}
					onChange={e => setHour(parseInt(e.target.value))}
					className={inputClassName}
				/>
			</div>
			<div className={'relative'}>
				<span className={'absolute bottom-10 left-2 text-gray-400'}>phút</span>
				<input
					type='number'
					min={0}
					max={59}
					value={minute}
					onChange={e => setMinute(parseInt(e.target.value))}
					className={inputClassName}
				/>
			</div>
		</div>
	);
}
