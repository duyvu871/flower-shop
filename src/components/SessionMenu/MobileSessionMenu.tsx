import React, {useContext, useEffect, useLayoutEffect} from 'react';
import {Spinner} from "@nextui-org/react";
import {AllMenuType, MenuDataContext} from "@/contexts/MenuDataContext";
import {MenuItemType} from "types/order";
import ItemList from "@/components/SessionMenu/ItemList";
import InfiniteScroll from "@/components/InfiniteScroll";
import {useMenuData} from "@/hooks/useMenuData";
import {GetMenuListType} from "@/lib/order";

interface MobileSessionMenuProps {

};

function MobileSessionMenu({}: MobileSessionMenuProps) {
    const {getMenuData, allMenuType, getAllTypeMenu, updateAllMenuType} = useMenuData();
    const [menuData, setMenuData] = React.useState<AllMenuType>({
        morning: {} as GetMenuListType,
        afternoon: {} as GetMenuListType,
        evening: {} as GetMenuListType,
        other: {} as GetMenuListType
    });
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
    const [currentPagination, setCurrentPagination] = React.useState<number>(1);
    const [totalItems, setTotalItems] = React.useState<number>(0);
    const [isPreventFetch, setIsPreventFetch] = React.useState<boolean>(true);

    useLayoutEffect(() => {
        (async () => {
            // console.log("prevent fetch", isPreventFetch)
            if (!isPreventFetch) return;
            const data = await getAllTypeMenu();
            if (data) {
                setIsLoaded(true);
                setTotalItems(data.other.count);
                updateAllMenuType(data);
            }
            if (allMenuType.other.data.length === totalItems && totalItems !== 0) {
                setIsPreventFetch(false);
            }
        })();
        // console.log(allMenuType)
    }, []);

    useEffect(() => {

        (async () => {
            // console.log("prevent fetch", isPreventFetch)
            if (!isLoaded) return;
            if (!isPreventFetch) return;
            const data = await getMenuData(currentPagination, 10, "other");
            if (data) {
                const combinedOtherData = {
                    data: [...allMenuType.other.data, ...data.data],
                    count: data.count,
                    page: data.page,
                    limit: data.limit,
                    perPage: data.perPage
                }
                const dataCombined = {
                    ...allMenuType,
                    other: combinedOtherData
                }
                setIsLoaded(true);
                setTotalItems(data.count);
                updateAllMenuType(dataCombined);
                if (allMenuType.other.data.length === totalItems && totalItems !== 0) {
                    setIsPreventFetch(false);
                }
            }
        })();
        // console.log(allMenuType.other.data.length, totalItems, isPreventFetch)

    }, [currentPagination, isLoaded]);

    return (
        <>
            <div className={"w-full flex flex-col justify-center items-center gap-1 mobile:px-10"}>
                <div className={"text-2xl font-bold text-start w-full p-2"}>
                    <h1>Menu sáng</h1>
                </div>
                <div className={"w-full grid grid-cols-2 sm:grid-cols-4 md:gap-4 my-2"}>
                    <ItemList menuData={allMenuType.morning.data as MenuItemType[]}/>
                </div>
            </div>
            <div className={"w-full flex flex-col justify-center items-center gap-1 mobile:px-10"}>
                <div className={"text-2xl font-bold text-start w-full p-2"}>
                    <h1 >Menu chiều</h1>
                </div>
                <div className={"grid grid-cols-2 sm:grid-cols-4 md:gap-4 my-2"}>
                    <ItemList menuData={allMenuType.afternoon.data as MenuItemType[]}/>
                </div>
            </div>
            <div className={"w-full flex flex-col justify-center items-center gap-1 mobile:px-10"}>
                <div className={"text-2xl font-bold text-start w-full p-2"}>
                    <h1>Menu tối</h1>
                </div>
                <div className={"w-full grid grid-cols-2 sm:grid-cols-4 md:gap-4 my-2"}>
                    <ItemList menuData={allMenuType.evening.data as MenuItemType[]}/>
                </div>
            </div>
            <InfiniteScroll
                className={"w-full flex flex-col justify-center items-center gap-4 mobile:px-10"}
                fetchMore={() => {
                    setCurrentPagination((prev) => prev + 1);
                }}
                hasMore={isPreventFetch}
                loader={<Spinner label="Loading..." color="warning"/>}
                endMessage={<div></div>}
            >
                <div className={"text-2xl font-bold text-start w-full p-2"}>
                    <h1>Các món khác</h1>
                </div>
                <div className={"w-full grid grid-cols-2 sm:grid-cols-4 md:gap-4"}>
                    <ItemList menuData={allMenuType.other.data as MenuItemType[]}/>
                </div>
            </InfiniteScroll>
        </>
    );
}

export default MobileSessionMenu;