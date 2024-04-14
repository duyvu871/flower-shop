'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { RxCounterClockwiseClock } from 'react-icons/rx';
import { IoMdSearch } from 'react-icons/io';

interface SearchHistoryProps {
	searchHistory: string[];
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

function SearchHistory({ searchHistory, setSearchValue }: SearchHistoryProps) {
	return (
		<div
			className={
				'flex flex-wrap flex-row justify-start items-center gap-4 pb-2 w-full sm:justify-center'
			}>
			{searchHistory.map((item, index) => (
				<div
					key={'search-history-' + index}
					className={
						'flex justify-center items-center gap-3 hover:bg-gray-100 transition-all hover:rounded px-2 py-1'
					}
					onClick={() => setSearchValue(item)}>
					{index === 0 ? <IoMdSearch /> : <RxCounterClockwiseClock />}
					<p className={'text-sm'}>{item}</p>
				</div>
			))}
		</div>
	);
}

export default SearchHistory;
