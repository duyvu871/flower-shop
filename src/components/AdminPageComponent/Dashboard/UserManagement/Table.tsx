'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import TableBody from './TableBody';
import { Input, Pagination } from '@nextui-org/react';
import { UserInterface } from 'types/userInterface';
import { formatCurrency } from '@/ultis/currency-format';
import store from '@/adminRedux/store';
import { updateUsers } from '@/adminRedux/action/userData';
import { RootState } from '@/adminRedux/reducers';
import { useSelector } from 'react-redux';
import { openModal } from '@/adminRedux/action/OpenModal';
import { TimeRange } from '@/ultis/timeFormat.ultis';
import { FaPlus, FaSort } from 'react-icons/fa';
import { ObjectId } from 'mongodb';
import { IoIosSearch } from 'react-icons/io';
import { bgWhite } from 'next/dist/lib/picocolors';
import { useDebounce } from '@uidotdev/usehooks';

interface TableProps {}

const defaultUser: UserInterface = {
	_id: '' as unknown as ObjectId,
	fullName: '',
	email: '',
	phone: '',
	balance: 0,
	orders: 0,
	revenue: 0,
	isLoyalCustomer: false,
	telegram: '',
	status: true,
	createdAt: new Date(),
	updatedAt: new Date(),
	avatar: '',
	role: 'user',
	id_index: 0,
	uid: '',
	virtualVolume: 0,
	total_request_withdraw: 0,
	address: '',
	cart: [],
	orderHistory: [],
	transactions: [],
	actionHistory: [],
	withDrawHistory: [],
	bankingInfo: {
		bank: '',
		accountNumber: '',
		accountName: '',
	},
	allowDebitLimit: 0,
	isUseVirtualVolume: false,
};

const headerTable = [
	{
		title: 'STT',
		key: 'index',
		isSort: false,
	},
	{
		title: 'Tên người dùng',
		key: 'fullName',
		isSort: true,
	},
	{
		title: 'Email',
		key: 'email',
		isSort: false,
	},
	{
		title: 'Số điện thoại',
		key: 'phone',
		isSort: false,
	},
	{
		title: 'Số dư',
		key: 'balance',
		action: 'formatCurrency',
		isSort: true,
	},
	{
		title: 'Số đơn',
		key: 'orders',
		isSort: true,
	},
	{
		title: 'Doanh thu',
		key: 'revenue',
		action: 'formatCurrency',
		isSort: true,
	},
	{
		title: 'loại khách hàng',
		key: 'isLoyalCustomer',
		isSort: false,
	},
	{
		title: 'telegram',
		key: 'telegram',
		isSort: false,
	},
	{
		title: 'Trạng thái',
		key: 'status',
		isSort: false,
	},
	{
		title: 'Action',
		key: 'action',
		isSort: false,
	},
];

const defaultSort = {
	key: 'createdAt',
	order: 'desc',
};

function Table({}: TableProps) {
	const [data, setData] = React.useState<Record<string, UserInterface[]>>({});
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [totalPage, setTotalPage] = React.useState<number>(1);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const { users } = useSelector((state: RootState) => state.users);
	const [currentSort, setCurrentSort] = React.useState<{
		key: keyof UserInterface;
		order: 'asc' | 'desc';
	}>({
		key: 'createdAt',
		order: 'desc',
	});

	const [searchValue, setSearchValue] = React.useState<string>('');
	const debouncedSearchValue = useDebounce(searchValue, 800);
	const searchRef = React.useRef<HTMLInputElement>(null);

	const fetchData = async () => {
		fetch(
			'/api/v1/admin/user/get-users-by-paginate?page=' +
				currentPage +
				'&limit=' +
				10 +
				'&filterKey=' +
				currentSort.key +
				'&filterOrder=' +
				currentSort.order +
				'&search=' +
				debouncedSearchValue,
		).then(async res => {
			if (res.status !== 200) {
				return;
			}
			const data = await res.json();
			setData(prev => ({
				...prev,
				['user-data' + currentPage]: data.data,
			}));
			store.dispatch(updateUsers(data.data));
			setTotalPage(Math.ceil(data.count / 10));
			setIsLoading(false);
			// window.localStorage.setItem('temp-user-data', JSON.stringify(data.data));
		});
	};

	useLayoutEffect(() => {
		fetchData();
	}, [currentPage, currentSort]);

	useEffect(() => {
		setIsLoading(true);

		if (data['user-data' + currentPage]) {
			setIsLoading(false);
			return;
		}
		let count = 0;
		const interval = setInterval(() => {
			count++;
			if (currentPage === 1) {
				// if () {
				//     fetchData(currentPage);
				// }
				fetchData();
			} else {
				clearInterval(interval);
			}
			console.log(count);
		}, 45000);

		return () => {
			clearInterval(interval);
		};
	}, [currentPage]);

	useEffect(() => {
		const search = async () => {
			let result = {};
			if (debouncedSearchValue) {
				setIsLoading(true);
				const searchResponse = await fetch(
					'/api/v1/admin/user/get-users-by-paginate?page=' +
						currentPage +
						'&limit=' +
						10 +
						'&filterKey=' +
						defaultSort.key +
						'&filterOrder=' +
						defaultSort.order +
						'&search=' +
						debouncedSearchValue,
				).then(async res => {
					if (res.status !== 200) {
						setData(prev => ({
							...prev,
							['user-data' + currentPage]: [],
						}));
						setIsLoading(false);
						return;
					}
					const data = await res.json();
					setData(prev => ({
						...prev,
						['user-data' + currentPage]: data.data,
					}));
					store.dispatch(updateUsers(data.data));
					setTotalPage(Math.ceil(data.count / 10));
					setIsLoading(false);
					// window.localStorage.setItem('temp-user-data', JSON.stringify(data.data));
				});
				searchRef.current?.blur();
			} else {
				fetchData();
			}
		};
		search();
	}, [debouncedSearchValue]);

	const generateXLSX = async () => {
		const response = await fetch('/api/v1/admin/finalization/export-user?range=' + 'all');
		const fileBlob = await response.blob();

		// this works and prompts for download
		var link = document.createElement('a'); // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
		link.href = window.URL.createObjectURL(fileBlob);
		link.download = 'thongtinkhachhang-' + 'tatca' + '.xlsx';
		link.click();
		link.remove();
	};

	return (
		<div className={'p-6 min-h-[calc(100vh-146px)] w-full'}>
			<div className={'flex flex-row justify-between items-center py-4'}>
				<h1 className={'text-2xl font-bold'}>Quản lý khách hàng</h1>
				<div className={'flex justify-end items-center gap-4'}>
					<button
						className={'bg-primary text-white rounded-md px-4 py-2 flex justify-center items-center'}
						onClick={() => {
							// @ts-ignore
							store.dispatch(openModal('oke', 'create-user'));
						}}>
						<FaPlus />
						Thêm khách hàng
					</button>
					<button className={'bg-primary text-white rounded-md px-4 py-2'} onClick={generateXLSX}>
						Xuất file
					</button>
				</div>
			</div>
			<div className={'grid grid-cols-1'}>
				<div className={'border rounded-lg border-default-200 bg-gray-50'}>
					<div className={'px-6 py-4 overflow-hidden flex flex-row justify-between items-center gap-4'}>
						<div className={'flex flex-row justify-between items-center whitespace-nowrap'}>
							Danh sách khách hàng
						</div>
						<div className={''}>
							<Input
								classNames={{
									base: ' min-w-[250px] max-w-[300px] h-10',
									mainWrapper: 'h-full bg-gray-100',
									input: 'text-small',
									inputWrapper:
										'h-full font-normal outline-none text-default-500 bg-default-400/20 dark:bg-default-500/20',
								}}
								className={'w-full outline-none bg-white'}
								placeholder='Tìm kiếm khách hàng...'
								size='sm'
								color={'primary'}
								value={searchValue}
								startContent={<IoIosSearch size={18} />}
								type='search'
								ref={searchRef}
								onChange={e => {
									if (currentPage !== 1) {
										setCurrentPage(1);
									}
									setSearchValue(e.target.value);
								}}
								// onKeyUp={(e) => {
								//     if (e.key === "Enter") {
								//         console.log(searchValue);
								//     }
								//     console.log(e.key)
								// }}
							/>
						</div>
						<Pagination
							showControls
							total={totalPage}
							// initialPage={1}
							classNames={{
								forwardIcon: 'text-white',
								item: 'bg-white text-black',
								prev: 'bg-white text-black',
								next: 'bg-white text-black',
								cursor: 'bg-blue-500 text-white',
							}}
							page={currentPage}
							onChange={page => {
								// console.log(page);
								setCurrentPage(page);
							}}
						/>
					</div>
					<div className={'relative overflow-x-auto'}>
						<div className={'min-w-full inline-block align-middle'}>
							<div className={'overflow-hidden'}>
								<table className={'min-w-full divide-y divide-default-200'}>
									<thead className={'bg-white'}>
										<tr className={'text-start'}>
											{headerTable.map((item, index) => (
												<th
													key={index}
													className={
														'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap '
													}>
													<div className={'flex flex-row justify-center items-center gap-1'}>
														<span>{item.title}</span>
														{item.isSort && (
															<FaSort
																className={'cursor-pointer hover:text-blue-600 hover:scale-110'}
																onClick={() => {
																	if (currentSort.key === item.key && defaultUser[item.key] !== undefined) {
																		if (currentSort.order === 'asc') {
																			setCurrentSort({
																				key: item.key as keyof UserInterface,
																				order: 'desc',
																			});
																		} else {
																			setCurrentSort({
																				key: item.key as keyof UserInterface,
																				order: 'asc',
																			});
																		}
																	} else {
																		setCurrentSort({
																			key: item.key as keyof UserInterface,
																			order: 'desc',
																		});
																	}
																}}
															/>
														)}
													</div>
												</th>
											))}
										</tr>
									</thead>
									{isLoading ? (
										<div>Loading...</div>
									) : (
										<TableBody
											keys={headerTable.map(item => item.key)}
											actions={headerTable.map(item => item.action)}
											isSorts={
												headerTable.map(item => ({
													key: item.key,
													order: item.isSort ? 'asc' : 'desc',
													isSort: item.isSort,
												})) as {
													key: keyof UserInterface;
													order: 'asc' | 'desc';
													isSort: boolean;
												}[]
											}
											defaultSort={
												defaultSort as {
													key: keyof UserInterface;
													order: 'asc' | 'desc';
												}
											}
											changeSort={(key: keyof UserInterface, order) => {
												setCurrentSort({
													key,
													order,
												});
											}}
											page={currentPage - 1}
											rowsPerPage={10}
											data={users || []}
										/>
									)}
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Table;
