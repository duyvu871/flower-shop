import React, {useEffect} from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";
import {RxCounterClockwiseClock} from "react-icons/rx";
import {IoMdSearch} from "react-icons/io";

interface SearchHistoryProps {
    
};

function SearchHistory({}: SearchHistoryProps) {
    const [searchHistory, setSearchHistory] = useLocalStorage<string[]>("searchHistory", []);
    useEffect(() => {
        if (searchHistory.length > 4) {
            setSearchHistory(searchHistory.slice(0, 4));
        }
    }, [searchHistory]);
    return (
        <div className={"flex flex-row justify-start items-center gap-4 pb-2 w-full"}>
            {searchHistory.map((item, index) => (
                <div key={"search-history-"+index} className={"flex justify-center items-center gap-3"}>
                    {index === 0 ? <IoMdSearch />: <RxCounterClockwiseClock />}
                    <p className={"text-sm"}>{item}</p>
                </div>
            ))}
        </div>
    );
}

export default SearchHistory;