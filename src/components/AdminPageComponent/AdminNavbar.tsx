import React, { useEffect } from 'react';
import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Pagination,
} from '@nextui-org/react';
import { tw } from '@/ultis/tailwind.ultis';
import { formatCurrency } from '@/ultis/currency-format';
import { CgProfile } from 'react-icons/cg';
import { TbMoneybag, TbReport } from 'react-icons/tb';
import store from '@/redux/store';
import { GrTransaction } from 'react-icons/gr';
import { RiCustomerService2Line } from 'react-icons/ri';
import { CiSettings } from 'react-icons/ci';
import { FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IoNotifications } from 'react-icons/io5';
import { UserInterface } from 'types/userInterface';
import { formatISODate } from '@/ultis/timeFormat.ultis';
import { ObjectId, WithId } from 'mongodb';

interface AdminNavbarProps {}
type Notification = {
	action: string;
	time: string;
	info: {
		title: string;
		content: string;
		desc: string;
	};
	isRead: boolean;
	category: string;
	referrer: {
		userId: string;
		referrerId: string;
	};
	createdAt: string;
	updatedAt: string;
};

const defaultNotification: WithId<Notification> = {
	isRead: true,
	action: 'string',
	time: 'string',
	info: {
		title: 'string',
		content: 'string',
		desc: 'string',
	},
	category: 'string',
	referrer: {
		userId: 'string',
		referrerId: 'string',
	},
	createdAt: 'string',
	updatedAt: 'string',
	_id: 'string' as unknown as ObjectId,
};

function AdminNavbar({}: AdminNavbarProps) {
	const router = useRouter();

	const [data, setData] = React.useState<Record<string, Notification[]>>({});

	const [notifications, setNotifications] = React.useState<WithId<Notification>[]>([]);
	const [newNotification, setNewNotification] = React.useState<number>(0);
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [totalPage, setTotalPage] = React.useState<number>(3);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [currentSort, setCurrentSort] = React.useState<{
		key: keyof UserInterface;
		order: 'asc' | 'desc';
	}>({
		key: 'createdAt',
		order: 'desc',
	});

	const addNotification = (notifications: WithId<Notification>[]) => {
		setNotifications(prev => [...notifications]);
		setNewNotification(notifications.length);
	};

	const getNotification = async () => {
		const res = await fetch(
			'/api/v1/admin/notification/get-notification?' +
				'page=' +
				currentPage +
				'&limit=' +
				10 +
				'&filterKey=' +
				currentSort.key +
				'&filterOrder=' +
				currentSort.order,
		);
		const data = await res.json();
		if (data.data) {
			addNotification(data.data);
			setNewNotification(data.count);
		}
	};

	React.useEffect(() => {
		getNotification();
	}, [currentPage, currentSort]);

	useEffect(() => {
		setIsLoading(true);

		if (data['notify-data' + currentPage]) {
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
				getNotification();
			} else {
				clearInterval(interval);
			}
			// console.log(count);
		}, 20000);

		return () => {
			clearInterval(interval);
		};
	}, [currentPage]);

	return (
		<div>
			<div className='flex justify-end items-center bg-white shadow-md gap-2 p-4 border-l-1'>
				<div className=''>
					<Dropdown
						placement='bottom-end'
						classNames={{
							trigger: 'cursor-pointer',
							// backdrop: 'bg-gray-900 bg-opacity-50',
						}}
						closeOnSelect={false}>
						<DropdownTrigger>
							<div className={'flex items-center relative'}>
								<IoNotifications className={'text-blue-600 cursor-pointer'} size={30} />
								<span className='text-sm text-blue-600 font-bold bg-gray-200 p-1 rounded-full absolute leading-[1] top-[-6px] right-0'>
									{newNotification}
								</span>
							</div>
						</DropdownTrigger>
						<DropdownMenu
							aria-label='Profile Actions'
							variant='flat'
							itemClasses={{
								base: ['data-[hover=true]:bg-blue-100', 'data-[hover=true]:text-blue-600'],
							}}>
							{[...notifications, defaultNotification].map((item, index) => {
								if (index === notifications.length) {
									return (
										<DropdownSection
											key={'notify-' + index}
											itemClasses={{
												base: ['data-[hover=true]:bg-blue-100', 'data-[hover=true]:text-blue-600'],
												// wrapper: ['data-[hover=true]:bg-red-100', 'data-[hover=true]:text-blue-600'],
											}}>
											<DropdownItem
												key={index}
												isReadOnly
												classNames={{
													base: ['data-[hover=true]:bg-white', 'data-[hover=true]:text-blue-600'],
													wrapper: [
														'data-[hover=true]:bg-red-100',
														'data-[hover=true]:text-blue-600',
													],
												}}>
												<div className='flex justify-center items-center gap-2'>
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
															console.log(page);
															setCurrentPage(page);
														}}
													/>
												</div>
											</DropdownItem>
										</DropdownSection>
									);
								} else {
									return (
										<DropdownItem
											key={'notify-' + index}
											showDivider={index !== notifications.length}
											className={tw('p-2', !item.isRead ? 'bg-blue-100' : '')}
											onClick={_ => {
												if (!item.isRead) {
													fetch('/api/v1/admin/notification/update-notification', {
														method: 'POST',
														headers: {
															'Content-Type': 'application/json',
														},
														body: JSON.stringify({
															id: item._id,
															isRead: true,
														}),
													}).then(r => {
														if (r.status === 200) {
															setNotifications(prev => {
																const newNotifications = [...prev];
																newNotifications[index].isRead = true;
																return newNotifications;
															});
															setNewNotification(newNotification - 1);
														}
													});
													// router.push(`/admin/dashboard/${item.category}-management`);
												}
											}}
											aria-label={item.info.title}
											href={'/admin/dashboard/' + item.category + '-management'}>
											<div
												className={tw(
													'flex justify-between items-center gap-2',
													!item.isRead ? 'bg-blue-100' : '',
												)}>
												<div className={tw('flex gap-2')}>
													<div className={tw('flex justify-center items-center rounded-full p-1')}>
														<CgProfile size={20} />
													</div>
													<div>
														<p className={tw('font-semibold capitalize')}>{item.info.title}</p>
														<p className={tw('text-sm')}>{item.info.content}</p>
													</div>
												</div>
												<div>
													<p className={tw('text-xs')}>{formatISODate(new Date(item.time))}</p>
												</div>
											</div>
										</DropdownItem>
									);
								}
							})}
						</DropdownMenu>
						<DropdownItem>
							<div className='flex justify-center items-center gap-2'>
								<button
									className={tw('p-2', currentPage === 1 ? 'bg-blue-100' : '')}
									onClick={() => setCurrentPage(1)}>
									1
								</button>
								<button
									className={tw('p-2', currentPage === 2 ? 'bg-blue-100' : '')}
									onClick={() => setCurrentPage(2)}>
									2
								</button>
								<button
									className={tw('p-2', currentPage === 3 ? 'bg-blue-100' : '')}
									onClick={() => setCurrentPage(3)}>
									3
								</button>
							</div>
						</DropdownItem>
						{/*</DropdownMenu>*/}
					</Dropdown>
				</div>
				<div className='flex items-center gap-3'>
					<div className='ml-4'>
						<h1 className='text-lg font-semibold'>Admin</h1>
						<p className='text-sm text-gray-500'>Admin</p>
					</div>
					<Dropdown placement='bottom-end'>
						<DropdownTrigger>
							<Avatar color={'primary'} size={'md'} className={'cursor-pointer'} />
						</DropdownTrigger>
						<DropdownMenu aria-label='Profile Actions' variant='flat'>
							<DropdownItem
								key='settings'
								showDivider
								endContent={<CiSettings size={20} />}
								href={'/admin/dashboard/settings'}>
								Cài đặt
							</DropdownItem>
							<DropdownItem
								key='logout'
								color='danger'
								className={'text-danger'}
								endContent={<FaSignOutAlt />}
								onClick={() => {
									signOut().then(() => {
										router.push('/');
									});
								}}>
								Đăng xuất
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
		</div>
	);
}

export default AdminNavbar;
