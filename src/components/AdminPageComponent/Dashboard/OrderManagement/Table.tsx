'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
// import TableBody from "./TableBody";
import TableTemplate from '@/components/AdminPageComponent/Dashboard/Table/TableTemplate';
import { UserInterface } from 'types/userInterface';
import { useSelector } from 'react-redux';
import { RootState } from '@/adminRedux/reducers';
import store from '@/adminRedux/store';
import { updateUsers } from '@/adminRedux/action/userData';
import { setCurrentTable } from '@/adminRedux/action/currentTable';
import {
	TimeRange,
	TimeRangeLabel,
	orderTimeRangeSummary,
	formatISODate,
	startTime,
} from '@/ultis/timeFormat.ultis';
import { Button, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { MenuItemType, OrderType } from 'types/order';
import { ObjectId } from 'mongodb';
import NormalField from '@/components/InputField/NormalField';
import DatePicker from '@/components/DatePicker';
import { formatDate } from 'date-fns';
import { startTime as getStartTime, getEndTime } from '@/ultis/timeFormat.ultis';
import { LuFilter } from 'react-icons/lu';
import { FaFileExport } from 'react-icons/fa';
import { TbReload } from 'react-icons/tb';

interface TableProps {}

const defaultTableData: OrderType = {
	_id: '' as unknown as ObjectId,
	orderVolume: 0,
	status: 'pending',
	takeNote: '',
	location: '',
	createdAt: new Date(),
	updatedAt: new Date(),
	orderList: [],
	promotions: 0,
	receive: 0,
	handlerId: '' as unknown as ObjectId,
	isHandled: false,
	userId: '' as unknown as ObjectId,
	takeOrderName: '',
	fullName: '',
};

function Table({}: TableProps) {
	const headerTable = [
		{
			title: 'STT',
			key: 'index',
			isSort: false,
		},
		{
			title: 'Đơn giá',
			key: 'orderVolume',
			isSort: true,
		},
		{
			key: 'orderList',
			title: 'Danh sách món',
			currentFilter: '',
			isSort: false,
		},
		{
			title: 'Trạng thái',
			key: 'status',
			isSort: false,
		},
		{
			title: 'Tên người dùng',
			key: 'fullName',
			isSort: false,
		},
		// {
		// 	title: 'order-list',
		// 	key: 'orderList',
		// 	isSort: false,
		// },
		{
			title: 'Ghi chú',
			key: 'takeNote',
			isSort: false,
		},
		{
			title: 'Địa chỉ',
			key: 'location',
			isSort: false,
			// action: "formatDate"
		},
		{
			title: 'Ngày tạo',
			key: 'createdAt',
			action: 'formatDate',
			isSort: true,
		},
		{
			title: 'Xem chi tiết',
			key: 'view',
			isSort: false,
		},
	];

	const [data, setData] = React.useState<Record<string, UserInterface[]>>({});
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [totalPage, setTotalPage] = React.useState<number>(1);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const { currentTable } = useSelector((state: RootState) => state.currentTable);
	const [range, setRange] = React.useState<keyof typeof TimeRangeLabel>('all');
	const [currentSort, setCurrentSort] = React.useState<{
		key: keyof MenuItemType;
		order: 'asc' | 'desc';
	}>({
		key: 'createdAt' as unknown as keyof MenuItemType,
		order: 'desc',
	});
	const [orderTimeRange, setOrderTimeRange] =
		React.useState<keyof typeof orderTimeRangeSummary>('morning');
	const [exportTimeRange, setExportTimeRange] =
		useState<keyof typeof orderTimeRangeSummary>('morning');
	const [startTime, setStartTime] = useState<Date>(new Date());
	const [endTime, setEndTime] = useState<Date>(new Date());

	const [isRealTime, setIsRealTime] = useState<boolean>(true);
	const [isFilter, setIsFilter] = useState<boolean>(false);
	const [currentFilter, setCurrentFilter] = useState<{
		start: Date;
		end: Date;
	}>({
		start: new Date(),
		end: new Date(),
	});

	const fetchData = async (page: number) => {
		// if (!isRealTime) return;
		return await fetch(
			'/api/v1/admin/order/get-order?page=' +
				currentPage +
				'&limit=' +
				10 +
				'&filterKey=' +
				currentSort.key +
				'&filterOrder=' +
				currentSort.order,
		).then(async res => {
			if (res.status !== 200) {
				return;
			}
			const data = await res.json();
			setIsLoading(false);
			return data;
		});
	};

	const generateXLSX = async (range: string, start?: Date, end?: Date) => {
		console.log(range, start, end);
		const response = await fetch(
			'/api/v1/admin/finalization/export-order-with-date?start=' +
				formatDate(start || startTime, "yyyy-MM-dd'T'HH:mm:ss.SSS") +
				'&end=' +
				formatDate(end || endTime, "yyyy-MM-dd'T'HH:mm:ss.SSS") +
				'&range=' +
				range,
		);
		const fileBlob = await response.blob();
		// console.log(fileBlob);
		// this works and prompts for download
		var link = document.createElement('a'); // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
		link.href = window.URL.createObjectURL(fileBlob);
		// link.download = 'thongtindonhang-' + TimeRange[range] + '.xlsx';
		if (range === 'all') {
			link.download =
				'thong_tin_don_hang_' +
				`[${formatISODate(startTime)
					.replaceAll('|', '_')
					.replaceAll(':', 'h')
					.replaceAll(' ', '')}]` +
				'_den_' +
				`[${formatISODate(endTime)
					.replaceAll('|', '_')
					.replaceAll(':', 'h')
					.replaceAll(' ', '')}]` +
				'.xlsx';
		} else {
			link.download = 'thongtindonhang-' + TimeRange[range] + '.xlsx';
		}
		link.click();
		link.remove();
	};

	const filterData = async (start?: Date, end?: Date) => {
		const response = await fetch(
			'/api/v1/admin/order/filter-order?range=' +
				exportTimeRange +
				'&page=' +
				currentPage +
				'&limit=' +
				10 +
				'&filterKey=' +
				currentSort.key +
				'&filterOrder=' +
				currentSort.order +
				'&start=' +
				formatDate(start, "yyyy-MM-dd'T'HH:mm:ss.SSS") +
				'&end=' +
				formatDate(end, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
		);
		setCurrentFilter({
			start: start || startTime,
			end: end || endTime,
		});
		const data = await response.json();
		setData(prev => ({
			...prev,
			['user-data' + currentPage]: data.data,
		}));
		store.dispatch(setCurrentTable(data.data));
		setTotalPage(Math.ceil(data.count / 10));
		setIsLoading(false);
		setIsRealTime(false);
		const orderListIndex = headerTable.findIndex(item => item.key === 'orderList');
		headerTable[orderListIndex].currentFilter = exportTimeRange;
	};

	useLayoutEffect(() => {
		if (isRealTime) {
			setIsLoading(true);
			fetchData(currentPage).then(data => {
				store.dispatch(setCurrentTable(data.data));
				setTotalPage(Math.ceil(data.count / 10));
				setIsLoading(false);
			});
		} else {
			if (isFilter) {
				setIsLoading(true);
				setIsRealTime(false);
				filterData(currentFilter.start, currentFilter.end).then(_ => {
					setIsLoading(false);
				});
			}
		}
	}, [currentPage, currentSort]);

	useEffect(() => {
		setIsLoading(true);
		let count = 0;
		const interval = setInterval(() => {
			count++;
			if (currentPage === 1 && isRealTime) {
				fetchData(currentPage).then(data => {
					if (isRealTime) {
						store.dispatch(setCurrentTable(data.data));
						setTotalPage(Math.ceil(data.count / 10));
					} else {
						clearInterval(interval);
					}
				});
			} else {
				clearInterval(interval);
			}
			// console.log(count);
		}, 15000);

		return () => {
			clearInterval(interval);
		};
	}, [currentPage, isRealTime]);

	return (
		<TableTemplate
			headerTable={headerTable}
			totalPage={totalPage}
			currentPage={currentPage}
			setCurrentPage={setCurrentPage}
			isLoading={isLoading}
			data={currentTable || []}
			type={'order-management'}
			title={'Quản lý đơn hàng'}
			addNew={{
				title: 'Tạo đơn',
				onClick: () => {},
				isHidden: true,
			}}
			selectedItems={[]}
			setSelectedItems={() => {}}
			listTitle={'Danh sách đơn'}
			currentSort={currentSort}
			setCurrentSort={setCurrentSort as any}
			defaultTableData={defaultTableData}
			summaryOption={
				<div className={'flex justify-center items-center gap-2'}>
					<button
						className={
							'flex justify-center items-center gap-1 bg-primary text-white whitespace-nowrap rounded-md px-4 py-2'
						}
						onClick={() => {
							setIsRealTime(true);
							setIsLoading(true);
							fetchData(currentPage).then(data => {
								store.dispatch(setCurrentTable(data.data));
								setTotalPage(Math.ceil(data.count / 10));
								setIsLoading(false);
							});
						}}>
						<TbReload />
						{'Tải lại'}
					</button>
					<Select
						items={Object.keys(orderTimeRangeSummary).map(key => ({
							value: key,
							label: orderTimeRangeSummary[key as keyof typeof orderTimeRangeSummary],
						}))}
						selectedKeys={[exportTimeRange]}
						label='Thời gian (hôm nay)'
						// placeholder=""
						className='max-w-xs w-52'
						classNames={{
							base: 'bg-white rounded-xl',
						}}
						onChange={e => {
							// console.log(Object.keys(orderTimeRangeSummary));
							setExportTimeRange(e.target.value as keyof typeof orderTimeRangeSummary);
						}}
						variant={'bordered'}
						color={'primary'}
						showScrollIndicators={true}>
						{covan => (
							<SelectItem key={covan.value} value={covan.value}>
								{covan.label}
							</SelectItem>
						)}
					</Select>
					<button
						className={
							'flex justify-center items-center gap-1  bg-primary text-white whitespace-nowrap rounded-md px-4 py-2'
						}
						onClick={() => {
							// if (isRealTime) {
							setIsLoading(true);
							filterData(getStartTime(exportTimeRange), getEndTime(exportTimeRange)).then(_ => {
								setIsRealTime(false);
								setIsFilter(true);
								setIsLoading(false);
							});
						}}>
						<LuFilter />
						{'Lọc'}
					</button>
					<button
						className={
							'flex justify-center items-center gap-1 bg-primary text-white whitespace-nowrap rounded-md px-4 py-2'
						}
						onClick={() => {
							generateXLSX(
								exportTimeRange,
								getStartTime(exportTimeRange),
								//@ts-ignore
								getEndTime(exportTimeRange),
							);
						}}>
						<FaFileExport />
						Xuất file
					</button>
				</div>
			}>
			{
				<>
					<div className={'flex justify-center items-center gap-1'}>
						<div className={'flex justify-center items-center mr-8 relative'}>
							<DatePicker setSelectedDate={setStartTime} selectedDate={startTime} />
							<span className={'mx-2 text-xl'}>-</span>
							<DatePicker setSelectedDate={setEndTime} selectedDate={endTime} />
							<span className={'mx-2 text-gray-600 text-xs italic absolute top-10'}>
								{/*thời gian tính từ 0 giờ ngày hiển thị*/}
							</span>
						</div>
						{/*<Select*/}
						{/*	items={Object.keys(TimeRangeLabel).map(key => ({*/}
						{/*		value: key,*/}
						{/*		label: TimeRangeLabel[key as keyof typeof TimeRangeLabel],*/}
						{/*	}))}*/}
						{/*	selectedKeys={[range]}*/}
						{/*	label='Phạm vi'*/}
						{/*	// placeholder=""*/}
						{/*	className='max-w-xs w-32'*/}
						{/*	classNames={{*/}
						{/*		base: 'bg-white rounded-xl',*/}
						{/*	}}*/}
						{/*	onChange={e => {*/}
						{/*		setRange(e.target.value as keyof typeof TimeRangeLabel);*/}
						{/*	}}*/}
						{/*	variant={'bordered'}*/}
						{/*	color={'primary'}*/}
						{/*	showScrollIndicators={true}>*/}
						{/*	{covan => (*/}
						{/*		<SelectItem key={covan.value} value={covan.value}>*/}
						{/*			{covan.label}*/}
						{/*		</SelectItem>*/}
						{/*	)}*/}
						{/*</Select>*/}
						<button
							className={
								'flex justify-center items-center gap-1  bg-primary text-white whitespace-nowrap rounded-md px-4 py-2'
							}
							onClick={() => {
								setIsLoading(true);
								filterData(startTime, endTime).then(_ => {
									setIsRealTime(false);
									setIsFilter(true);
									setIsLoading(false);
								});
							}}>
							<LuFilter />
							Lọc
						</button>
						<button
							className={
								'flex justify-center items-center gap-1  bg-primary text-white whitespace-nowrap rounded-md px-4 py-2'
							}
							onClick={() => {
								generateXLSX('all');
							}}>
							<FaFileExport />
							Xuất file
						</button>
					</div>
					<div className={'flex justify-center items-center'}>
						{/*<Select*/}
						{/*	items={Object.keys(TimeRangeLabel).map(key => ({*/}
						{/*		value: key,*/}
						{/*		label: TimeRangeLabel[key as keyof typeof TimeRangeLabel],*/}
						{/*	}))}*/}
						{/*	selectedKeys={[range]}*/}
						{/*	label='Phạm vi'*/}
						{/*	// placeholder=""*/}
						{/*	className='max-w-xs w-32'*/}
						{/*	classNames={{*/}
						{/*		base: 'bg-white rounded-xl',*/}
						{/*	}}*/}
						{/*	onChange={e => {*/}
						{/*		setRange(e.target.value as keyof typeof TimeRangeLabel);*/}
						{/*	}}*/}
						{/*	variant={'bordered'}*/}
						{/*	color={'primary'}*/}
						{/*	showScrollIndicators={true}>*/}
						{/*	{covan => (*/}
						{/*		<SelectItem key={covan.value} value={covan.value}>*/}
						{/*			{covan.label}*/}
						{/*		</SelectItem>*/}
						{/*	)}*/}
						{/*</Select>*/}
						{/*<button*/}
						{/*	className={'bg-primary text-white whitespace-nowrap rounded-md px-4 py-2'}*/}
						{/*	onClick={() => {}}>*/}
						{/*	lọc*/}
						{/*</button>*/}
					</div>
				</>
			}
		</TableTemplate>
	);
}

export default Table;
