'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import TableBody from './TableBody';
import { Input, Pagination, Select, SelectItem } from '@nextui-org/react';
import { tw } from '@/ultis/tailwind.ultis';
import { FaPlus, FaSort } from 'react-icons/fa';
import { UserInterface } from 'types/userInterface';
import { IoIosSearch } from 'react-icons/io';
import { orderTimeRangeSummary, TimeRangeLabel } from '@/ultis/timeFormat.ultis';
// import {UserInterface} from "types/userInterface";
// import {formatCurrency} from "@/ultis/currency-format";
// import store from "@/adminRedux/store";
// import {updateUsers} from "@/adminRedux/action/userData";
// import {RootState} from "@/adminRedux/reducers";
// import {useSelector} from "react-redux";

interface TableProps {
	totalPage: number;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	isLoading: boolean;
	headerTable: {
		title: string;
		key: string;
		action?: string;
		isSort?: boolean;
	}[];
	data: any[];
	type: string;
	title: string;
	addNew: {
		title: string;
		onClick: () => void;
		isHidden?: boolean;
	};
	listTitle: string;
	isShowSelect?: boolean;
	children: React.ReactNode;
	selectedItems: {
		key: string;
		value: boolean;
	}[];
	setSelectedItems: ({ key, value }?: { key: string; value: boolean }) => void;
	currentSort: {
		key: keyof any;
		order: 'asc' | 'desc';
	};
	setCurrentSort: (sort: { key: keyof UserInterface; order: 'asc' | 'desc' }) => void;
	defaultTableData: any;
	searchValue?: string;
	setSearchValue?: (value: string) => void;
	searchRef?: React.RefObject<HTMLInputElement>;
	summaryOption?: React.ReactNode;
}

function TableTemplate({
	totalPage,
	setCurrentPage,
	currentPage,
	headerTable,
	data,
	isLoading,
	type,
	listTitle,
	title,
	addNew,
	children,
	isShowSelect = false,
	selectedItems,
	setSelectedItems,
	currentSort,
	setCurrentSort,
	defaultTableData,
	searchValue,
	setSearchValue,
	searchRef,
	summaryOption,
}: TableProps) {
	const headers = isShowSelect
		? [
				{
					title: 'Select',
					key: 'selectAll',
				},
				...headerTable,
			]
		: headerTable;
	return (
		<div className={'p-6  w-full'}>
			<div className={'flex flex-row justify-between items-center py-4 w-full'}>
				<div className={'w-full'}>
					<h1 className={'text-2xl font-bold'}>{title}</h1>
				</div>
				<div className={'flex flex-row justify-end items-center gap-4 w-full'}>
					<button
						className={tw(
							'bg-primary text-white rounded-md px-4 py-2 flex justify-center items-center',
							addNew.isHidden ? 'hidden' : '',
						)}
						onClick={addNew.onClick}>
						<FaPlus className={'mr-2'} />
						{addNew.title}
					</button>
					{children}
				</div>
			</div>
			<div className={'grid grid-cols-1'}>
				<div className={'border rounded-lg border-default-200 bg-gray-50'}>
					<div className={'px-6 py-4 overflow-hidden flex flex-row justify-between items-center'}>
						<div className={'flex flex-row justify-between items-center'}>{listTitle}</div>
						<div className={'flex '}>
							{searchValue !== undefined && (
								<Input
									classNames={{
										base: 'min-w-[250px] max-w-[300px] h-10',
										mainWrapper: 'h-full',
										input: 'text-small',
										inputWrapper:
											'h-full font-normal outline-none text-default-500 bg-default-400/20 dark:bg-default-500/20',
									}}
									className={'w-full outline-none'}
									placeholder={'Tìm kiếm ' + listTitle.toLowerCase() + '...'}
									size='sm'
									value={searchValue}
									startContent={<IoIosSearch size={18} />}
									type='search'
									ref={searchRef}
									onChange={e => setSearchValue(e.target.value)}
									// onKeyUp={(e) => {
									//     if (e.key === "Enter") {
									//         console.log(searchValue);
									//     }
									//     console.log(e.key)
									// }}
								/>
							)}
						</div>
						<div className={'flex'}>{summaryOption}</div>
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
									<thead className={'bg-white '}>
										<tr className={'text-start'}>
											{headers.map((item, index) => {
												if (index === 0 && !isShowSelect) {
													return (
														<th
															key={index}
															className={
																'px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider whitespace-nowrap'
															}>
															{item.title}
														</th>
													);
												}

												if (item.title === 'Select') {
													return (
														<th key={index} className={'px-6 py-3 text-xs text-gray-500'}>
															<input
																type='checkbox'
																onChange={() => {
																	setSelectedItems();
																}}
															/>
														</th>
													);
												}
												if (item.key === 'orderList') {
													return (
														<>
															{Object.keys(orderTimeRangeSummary)
																.filter(timeLabel =>
																	// @ts-ignore
																	!item?.currentFilter ? true : item.currentFilter === timeLabel,
																)
																.map((key, index) => (
																	<th
																		key={index}
																		className={
																			'px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider whitespace-nowrap'
																		}>
																		{
																			orderTimeRangeSummary[
																				key as keyof typeof orderTimeRangeSummary
																			]
																		}
																	</th>
																))}
														</>
													);
												}
												if (item.key === 'takeNote') {
													return (
														<th
															key={index}
															className={'px-6 py-3 text-xs text-gray-500 min-w-[300px]'}>
															{item.title}
														</th>
													);
												}

												return (
													<th
														key={index}
														className={
															'px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]'
														}>
														<div className={'flex flex-row justify-start items-center gap-1'}>
															<span>{item.title}</span>
															{item.isSort && (
																<FaSort
																	className={'cursor-pointer hover:text-blue-600 hover:scale-110'}
																	onClick={() => {
																		if (
																			currentSort.key === item.key &&
																			defaultTableData[item.key] !== undefined
																		) {
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
												);
											})}
										</tr>
									</thead>
									{isLoading ? (
										<div>Loading...</div>
									) : (
										<TableBody
											keys={headerTable.map(item => item.key)}
											actions={headerTable.map(item => item.action)}
											page={currentPage - 1}
											rowsPerPage={10}
											data={data || []}
											type={type}
											isShowSelect={isShowSelect}
											selectedItems={selectedItems}
											setSelectedItems={setSelectedItems}
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

export default TableTemplate;
