"use client";
import React, {useEffect} from 'react';
import {MenuItemType} from "types/order";
import {IoIosSearch} from "react-icons/io";
import {Image, Input, Spinner} from "@nextui-org/react";
import {useDebounce} from "@uidotdev/usehooks"
import {useMenuData} from "@/hooks/useMenuData";
import MenuOrderList from "@/components/MenuOrder/MenuOrderList";

interface SearchScreenProps {

};

function SearchScreen({}: SearchScreenProps) {
    const { searchItem } = useMenuData();
    const [searchValue, setSearchValue] = React.useState<string>("");
    const [searchResult, setSearchResult] = React.useState<MenuItemType[]>([]);
    const [isSearching, setIsSearching] = React.useState<boolean>(false);
    const debouncedSearchValue = useDebounce(searchValue, 800);
    const searchRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
       const search = async () => {
           let result = [];
           if (debouncedSearchValue) {
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
       }
       search();
    }, [debouncedSearchValue]);
    return (
        <div className={"w-full h-full flex flex-col justify-center items-center px-4 pb-[90px]"}>
            <Input
                classNames={{
                    base: "max-w-full sm:max-w-[12rem] h-10",
                    mainWrapper: "h-full",
                    input: "text-small",
                    inputWrapper: "h-full font-normal outline-none text-default-500 bg-default-400/20 dark:bg-default-500/20",
                }}
                className={"w-full outline-none"}
                placeholder="Tìm kiếm món ăn..."
                size="sm"
                startContent={<IoIosSearch size={18} />}
                type="search"
                ref={searchRef}
                onChange={(e) => setSearchValue(e.target.value)}
                // onKeyUp={(e) => {
                //     if (e.key === "Enter") {
                //         console.log(searchValue);
                //     }
                //     console.log(e.key)
                // }}
            />
            <MenuOrderList />
            <div className={"flex flex-col justify-center items-center overflow-auto"}>
                {isSearching && (
                    <div className={"flex flex-col justify-center items-center"}>
                        <Spinner color={"warning"}/>
                        <p>Đang tìm kiếm...</p>
                    </div>
                )}
                <div className={" w-full"}>
                    {searchResult.map((item, index) => (
                        <div
                            key={index}
                            className={"flex flex-row justify-between items-center w-full my-4"}
                            onClick={() => {

                            }}
                        >
                            <div className={"flex flex-row justify-start items-start"}>
                               <div className={"flex justify-center items-center"}>
                                   <Image
                                       shadow="sm"
                                       radius="lg"
                                       width="100%"
                                       alt={item.name}
                                       className="object-cover h-[70px] w-[70px] rounded-lg"
                                       src={item.image}
                                   />
                               </div>
                                <div className={"flex flex-col justify-start items-start px-2 w-[70%]"}>
                                    <h1 className={"text-sm font-semibold line-clamp-2"}>{item.name}</h1>
                                    <p className={"text-xs text-default-500 line-clamp-2"}>{item.description}</p>
                                </div>
                            </div>
                            <div className={"flex flex-row justify-center items-center"}>
                                <p className={"text-sm font-semibold"}>{item.price}.000đ</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchScreen;