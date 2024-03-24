import React, {useEffect, useState} from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input} from "@nextui-org/react";
import {CgProfile} from "react-icons/cg";
import {TbReport} from "react-icons/tb";
import store from "@/redux/store";
import {RiCustomerService2Line} from "react-icons/ri";
import {CiSettings} from "react-icons/ci";
import {FaSignOutAlt} from "react-icons/fa";
import {signOut} from "next-auth/react";
import {IoIosSearch} from "react-icons/io";
import {useMenuData} from "@/hooks/useMenuData";
import {MenuItemType} from "types/order";
import {useDebounce} from "@uidotdev/usehooks";
import {CollectionElement} from "@react-types/shared";

interface SearchDropdownProps {

};

function SearchDropdown({}: SearchDropdownProps) {

    const [isOpened, setIsOpened] = useState<boolean>(false);
    const {searchItem, storeItemToLocalStorage } = useMenuData();
    const [searchValue, setSearchValue] = React.useState<string>("");
    const [searchResult, setSearchResult] = React.useState<Record<string, MenuItemType[]>>({
        "morning-menu": [],
        "afternoon-menu": [],
        "evening-menu": [],
        "other-menu": []
    });
    const [isSearching, setIsSearching] = React.useState<boolean>(false);
    const debouncedSearchValue = useDebounce(searchValue, 800);
    const searchKey = Object.keys(searchResult);
    // const searchRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {

        const search = async () => {
            let result = {};
            if (debouncedSearchValue) {
                setIsSearching(true);
                const searchResponse = await searchItem(debouncedSearchValue);
                if (searchResponse) {
                    result = searchResponse;
                    setSearchResult(result);
                }
                // setTimeout(() => {
                setIsSearching(false);
                // searchRef.current?.blur();
                // }, 2000)
            }
        }
        search();
    }, [debouncedSearchValue]);

    return (
        <>

            </>
    );
}

export default SearchDropdown;