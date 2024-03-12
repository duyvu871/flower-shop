import React, {useContext, useEffect} from 'react';
import {Spinner} from "@nextui-org/react";
import {MenuDataContext} from "@/contexts/MenuDataContext";
import {MenuItemType} from "types/order";
import ItemList from "@/components/SessionMenu/ItemList";
import {InfiniteScrollMemo} from "@/components/InfiniteScroll";

interface MobileSessionMenuProps {

};

function MobileSessionMenu({}: MobileSessionMenuProps) {
    const { getMenuData, updateMenuData} = useContext(MenuDataContext);
    const [menuData, setMenuData] = React.useState<MenuItemType[]>([]);
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
    const [currentPagination, setCurrentPagination] = React.useState<number>(1);
    const [totalItems, setTotalItems] = React.useState<number>(0);
    const [isPreventFetch, setIsPreventFetch] = React.useState<boolean>(false);

    useEffect(() => {
        (async () => {
            // console.log("prevent fetch", isPreventFetch)
            if (isPreventFetch) return;
            const data = await getMenuData(currentPagination, 10);
            if (data) {
                setMenuData([...menuData, ...data.data as MenuItemType[]]);
                setIsLoaded(true);
                setTotalItems(data.count);
                // console.log("menu data", menuData.length);
                // console.log("total items", totalItems);
                // console.log("total items", data.count);
                // console.log("has more", menuData.length < totalItems)
                if (menuData.length === totalItems && totalItems !== 0) {
                    setIsPreventFetch(true);
                }
            }
        })();
    }, [currentPagination]);
    return (
        <InfiniteScrollMemo
            className={" flex flex-col justify-center items-center gap-4 mobile:px-10"}
            fetchMore={() => {
                setCurrentPagination((prev) => prev + 1);
            }}
            hasMore={menuData.length < totalItems}
            loader={<Spinner label="Loading..." color="warning"/>}
            endMessage={<div></div>}
        >
            <div className={"grid grid-cols-2 sm:grid-cols-4 md:gap-4"}>
                <ItemList menuData={menuData}/>
            </div>
        </InfiniteScrollMemo>
    );
}

export default MobileSessionMenu;