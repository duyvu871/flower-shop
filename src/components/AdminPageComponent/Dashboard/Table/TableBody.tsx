import React from 'react';
// import {useAdminApi} from "@/hooks/useAdminApi";
import { Button, Image } from '@nextui-org/react';
import store from '@/adminRedux/store';
import { openModal } from '@/adminRedux/action/OpenModal';
import { formatCurrency, formatCurrencyWithDot } from '@/ultis/currency-format';
import { OrderStatus, OrderType } from 'types/order';
import { formatISODate, orderTimeRangeSummary } from '@/ultis/timeFormat.ultis';
import { FiEye } from 'react-icons/fi';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
// import { MdContentCopy } from 'react-icons/md';
import Copy from '@/components/CopyToClipBoard';
import { groupBy } from '@/ultis/array-method';
import { MdContentCopy } from 'react-icons/md';

(orderTimeRangeSummary as any).other = 'Khác';

interface TableBodyProps {
	page: number;
	rowsPerPage: number;
	keys: string[];
	actions: string[];
	data: any[];
	type: string;
	isShowSelect?: boolean;
	selectedItems?: {
		key: string;
		value: boolean;
	}[];
	setSelectedItems?: ({ key, value }: { key: string; value: boolean }) => void;
	specialFilter?: string;
}

enum PaymentMethod {
	balance = 'Tài khoản chính',
	virtualVolume = 'Tài khoản nợ',
}

const GreenBadge = ({ children }) => {
	return (
		<span className={'px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500'}>
			{children}
		</span>
	);
};

const RedBadge = ({ children }) => {
	return (
		<span className={'px-3 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-500'}>
			{children}
		</span>
	);
};

const GreyBadge = ({ children }) => {
	return (
		<span className={'px-3 py-1 text-xs font-medium rounded-md bg-gray-500/10 text-gray-500'}>
			{children}
		</span>
	);
};

const UidElement = ({ id, userName }: { id: string; userName: string }) => {
	const [copiedText, copy] = useCopyToClipboard();

	return (
		<div className={'flex justify-around items-center gap-3'}>
			<span
				className={'cursor-pointer hover:text-blue-600 hover:underline'}
				onClick={() => {
					store.dispatch(openModal(id, 'user-management'));
				}}>
				{userName}
			</span>
			<span>
				<Copy text={id} tooltipText={'Đã sao chép ID'} />
			</span>
		</div>
	);
};

function TableBody({
	page = 1,
	rowsPerPage = 10,
	keys = [],
	data,
	actions,
	type,
	isShowSelect,
	selectedItems,
	setSelectedItems,
	specialFilter,
}: TableBodyProps) {
	// console.log(type)
	// console.log(specialFilter);
	return (
		<tbody className={'divide-y divide-default-200'}>
			{data.map((item, data_index) => (
				<tr className={'border-gray-200 border-0 border-b-1 select-auto'} key={'row-' + data_index}>
					{isShowSelect && (
						<td className={'px-6 py-4 whitespace-nowrap text-base'}>
							<input
								type='checkbox'
								onChange={() => setSelectedItems(selectedItems[data_index])}
								checked={selectedItems[data_index].value}
								className='h-4 w-4 text-blue-600 bg-blue-500 border-gray-300 rounded transition-all'
							/>
						</td>
					)}
					{keys.map((key, index) => {
						if (key === 'index') {
							return (
								<td key={'td' + index} className={'px-6 py-4 whitespace-nowrap text-base'}>
									{page * rowsPerPage + data_index + 1}
								</td>
							);
						}

						if (key === 'action') {
							return (
								<td
									key={'td' + index}
									className={'px-3 py-4 whitespace-nowrap text-base cursor-pointer'}>
									<Button
										className={
											' px-3 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-500 h-8'
										}
										onClick={() => {
											// @ts-ignore
											// console.log(item._id as unknown as string, type)
											store.dispatch(
												openModal(
													item._id as unknown as string,
													// @ts-ignore
													type,
												),
											);
										}}>
										Chỉnh sửa
									</Button>
								</td>
							);
						}

						if (key === 'view') {
							return (
								<td
									key={'td' + index}
									className={'px-3 py-4 whitespace-nowrap text-base cursor-pointer'}>
									<Button
										className={
											'w-full px-3 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-500 h-8 flex justify-center items-center gap-1'
										}
										onClick={() => {
											// @ts-ignore
											// console.log(item._id as unknown as string, type)
											store.dispatch(
												openModal(
													item._id as unknown as string,
													// @ts-ignore
													type,
												),
											);
										}}>
										<FiEye /> Xem
									</Button>
								</td>
							);
						}

						if (key === 'orderList') {
							const orderList = (item[key] as OrderType['orderList']) || [];
							const groupByMenuType = groupBy(orderList, 'menuType') as Record<
								OrderType['orderList'][number]['menuType'],
								OrderType['orderList']
							>;
							// console.log(groupByMenuType);
							return (
								<>
									{Object.keys(orderTimeRangeSummary)
										.filter(orderKey =>
											!specialFilter
												? true
												: specialFilter === 'all'
													? true
													: specialFilter === orderKey,
										)
										.map((key: keyof typeof orderTimeRangeSummary, index) => (
											<td
												key={'td' + index}
												className={'h-[inherit] whitespace-break-spaces gap-1 text-base'}>
												<div className={'h-full w-full justify-around items-start gap-2'}>
													{(groupByMenuType[`${key}-menu`] || []).map((order, index) => (
														<div
															key={index}
															className={
																'h-full w-full flex flex-row justify-between items-center whitespace-nowrap gap-1 p-2'
															}>
															<span className={'h-full font-bold'}>{order.name}</span>
															<span
																className={
																	'h-full w-8 aspect-square flex justify-center items-center ml-3 rounded border-[1px] border-gray-300 bg-gray-100 font-bold'
																}>
																{order.totalOrder}
															</span>
														</div>
													))}
												</div>
											</td>
										))}
								</>
							);
						}

						if (actions[index] === 'depositType') {
							return (
								<td key={'td' + index} className={'px-3 py-4 whitespace-nowrap text-base'}>
									{item[key] === 'balance' ? (
										<GreenBadge>{PaymentMethod[item[key]]}</GreenBadge>
									) : (
										<RedBadge>{PaymentMethod[item[key]]}</RedBadge>
									)}
								</td>
							);
						}

						if (key === 'status') {
							return (
								<td key={'td' + index} className={'px-3 py-4 whitespace-nowrap '}>
									{item[key] === 'pending' ? (
										<GreyBadge>{OrderStatus[item[key]]}</GreyBadge>
									) : item[key] === 'approved' ? (
										<GreenBadge>{OrderStatus[item[key]]}</GreenBadge>
									) : (
										<RedBadge>{OrderStatus[item[key]]}</RedBadge>
									)}
								</td>
							);
						}
						if (key === 'isPaid') {
							return (
								<td key={'td' + index} className={'px-3 py-4 whitespace-nowrap '}>
									{item[key] ? (
										<GreenBadge>Đã thanh toán</GreenBadge>
									) : (
										<RedBadge>Chưa thanh toán</RedBadge>
									)}
								</td>
							);
						}
						if (key === 'confirmed') {
							return (
								<td key={'td' + index} className={'px-3 py-4 whitespace-nowrap '}>
									{item[key] ? (
										<GreenBadge>Đã xác nhận</GreenBadge>
									) : (
										<RedBadge>Chưa xác nhận</RedBadge>
									)}
								</td>
							);
						}

						if (key === 'userId') {
							return (
								<td key={'td' + index} className={'px-3 py-4 whitespace-nowrap text-gray-600 '}>
									<UidElement id={item[key] as string} userName={item.userName} />
									{/*{item[key]}*/}
								</td>
							);
						}

						if (key === 'price') {
							return (
								<td
									key={'td' + index}
									className={'px-3 py-4 whitespace-nowrap text-base font-semibold'}>
									{formatCurrencyWithDot((item[key] || 0).toString())}
									.000đ
								</td>
							);
						}

						if (key === 'image') {
							return (
								<td
									key={'td' + index}
									className={'px-3 py-4 flex justify-center items-center text-base'}>
									<Image
										shadow='sm'
										radius='lg'
										width='100%'
										alt={item[key]}
										className='object-cover h-[50px] w-[50px] rounded-lg'
										src={item[key]}
									/>
								</td>
							);
						}

						if (key === 'orderVolume') {
							return (
								<td
									key={'td' + index}
									className={'px-3 py-4 whitespace-nowrap text-base font-semibold'}>
									{formatCurrency((item[key] || 0).toString())}đ
								</td>
							);
						}

						if (key === 'discount') {
							return (
								<td key={'td' + index} className={'px-3 py-4 whitespace-nowrap text-base '}>
									{item[key] || 0}%
								</td>
							);
						}

						if (actions[index] === 'formatDate') {
							return (
								<td key={'td' + index} className={'px-3 py-4 whitespace-nowrap text-base'}>
									{formatISODate(item[key])}
								</td>
							);
						}

						if (actions[index] === 'clamp2') {
							return (
								<td key={'td' + index} className={'px-3 py-4  text-base line-clamp-2'}>
									<div className={'line-clamp-2'}>{item[key]}</div>
								</td>
							);
						}

						return (
							<td
								key={'td' + index}
								className={'px-3 py-4 whitespace-break-spaces text-base max-w-xl '}>
								{actions[index] === 'formatCurrency' ? (
									<span className={'font-semibold'}>
										{formatCurrency((item[key] || 0).toString())}đ
									</span>
								) : (
									item[key]
								)}
							</td>
						);
					})}
				</tr>
			))}
		</tbody>
	);
}

export default TableBody;
