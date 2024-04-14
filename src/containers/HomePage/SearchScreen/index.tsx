'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { MenuItemType, TranslateMenuType } from 'types/order';
import { IoIosSearch } from 'react-icons/io';
import { Image, Input, Spinner } from '@nextui-org/react';
import { useDebounce } from '@uidotdev/usehooks';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useMenuData } from '@/hooks/useMenuData';
import MenuOrderList from '@/components/MenuOrder/MenuOrderList';
import store from '@/redux/store';
import { openOrderModal } from '@/redux/action/openOrderModal';
import SearchHistory from '@/containers/HomePage/SearchScreen/SearchHistory';
import { calculateDiscount, formatCurrencyWithDot } from '@/ultis/currency-format';

interface SearchScreenProps {}

function SearchScreen({}: SearchScreenProps) {
	const [searchHistory, setSearchHistory] = useState<string[]>([]);
	const { searchItem, storeItemToLocalStorage } = useMenuData();
	const [searchValue, setSearchValue] = React.useState<string>('');
	const [searchResult, setSearchResult] = React.useState<Record<string, MenuItemType[]>>({
		'morning-menu': [],
		'afternoon-menu': [],
		'evening-menu': [],
		'other-menu': [],
	});
	const [isSearching, setIsSearching] = React.useState<boolean>(false);
	const debouncedSearchValue = useDebounce(searchValue, 800);
	const searchRef = React.useRef<HTMLInputElement>(null);
	useEffect(() => {
		const search = async () => {
			let result = {};
			if (debouncedSearchValue) {
				const searchHistory = localStorage.getItem('searchHistory');
				if (searchHistory) {
					const history = JSON.parse(searchHistory) as string[];
					if (!history.includes(debouncedSearchValue)) {
						const storeHistory = [debouncedSearchValue, ...history].slice(0, 4);
						localStorage.setItem('searchHistory', JSON.stringify(storeHistory));
						setSearchHistory(storeHistory);
					}
				} else {
					localStorage.setItem('searchHistory', JSON.stringify([debouncedSearchValue]));
					setSearchHistory([debouncedSearchValue]);
				}
				setIsSearching(true);
				const searchResponse = await searchItem(debouncedSearchValue);
				if (searchResponse) {
					result = searchResponse;
					setSearchResult(result);
				}
				// setTimeout(() => {
				setIsSearching(false);
				searchRef.current?.blur();
				// }, 2000)
			}
		};
		search();
	}, [debouncedSearchValue]);

	useEffect(() => {
		const searchHistory = localStorage.getItem('searchHistory');
		if (searchHistory) {
			setSearchHistory(JSON.parse(searchHistory) as string[]);
		}
	}, []);

	return (
		<div className={'w-full h-full flex flex-col justify-center items-center px-4 pb-[90px]'}>
			<Input
				classNames={{
					base: 'max-w-full sm:max-w-[12rem] h-10',
					mainWrapper: 'h-full',
					input: 'text-small',
					inputWrapper:
						'h-full font-normal outline-none text-default-500 bg-default-400/20 dark:bg-default-500/20',
				}}
				className={'w-full outline-none'}
				placeholder='Tìm kiếm món ăn...'
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
			<MenuOrderList />
			<SearchHistory searchHistory={searchHistory} setSearchValue={setSearchValue} />
			<div className={'flex flex-col justify-center items-center overflow-auto w-full'}>
				{isSearching && (
					<div className={'flex flex-col justify-center items-center'}>
						<Spinner color={'warning'} />
						<p>Đang tìm kiếm...</p>
					</div>
				)}
				<div className={' w-full'}>
					{Object.keys(searchResult).map((key, index) => (
						<div
							key={'search-' + key}
							className={'flex flex-col justify-center items-start sm:items-center cursor-pointer'}>
							<p className={'text-xl font-semibold text-center'}>
								{searchResult[key].length ? TranslateMenuType[key] : ''}
							</p>
							<div className={'flex flex-col justify-center items-center pl-2'}>
								{searchResult[key].map((item, index) => {
									storeItemToLocalStorage(item);
									return (
										<div
											key={'search-item-' + index}
											className={'flex flex-row justify-between items-center w-full my-2'}
											onClick={() => {
												// console.log(item._id)
												store.dispatch(openOrderModal(item._id as unknown as string));
											}}>
											<div className={'flex flex-row justify-start items-start'}>
												<div className={'flex justify-center items-center'}>
													<Image
														shadow='sm'
														radius='lg'
														width='100%'
														alt={item.name}
														className='object-cover h-[70px] w-[70px] rounded-lg'
														src={item.image}
													/>
												</div>
												<div className={'flex flex-col justify-start items-start px-2 w-[70%]'}>
													<h1 className={'text-sm font-semibold line-clamp-2'}>{item.name}</h1>
													<p className={'text-xs text-default-500 line-clamp-2'}>
														{item.description}
													</p>
												</div>
											</div>
											<div className={'flex flex-row justify-center items-center'}>
												<p className={'text-sm font-semibold'}>
													{formatCurrencyWithDot(
														Math.floor(
															item.price -
																Number(calculateDiscount(String(item.price), item.discount || 0)),
														),
													)}
													.000đ
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default SearchScreen;
