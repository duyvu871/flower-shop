"use client";
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Link,
    Input, Select, SelectItem,
    Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Listbox, ListboxItem, ListboxSection
} from "@nextui-org/react";
import Logo from "@/components/Logo";
import {RootState} from "@/redux/reducers";
import {useSelector} from "react-redux";
import {tw} from "@/ultis/tailwind.ultis";
import {TranslateIconName} from "@/components/Menu/FeatureItem";
import store from "@/redux/store";
import {changeScreen} from "@/redux/action/activeMenuFeature";
import {IoIosSearch} from "react-icons/io";
import OrderCart from "@/components/OrderCart";
import StoreLocation from "@/ultis/location.ultis";
import {setStoreLocation} from "@/redux/action/setStoreLocation";
import {useRouter, usePathname} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
// import {UserDataContext} from "@/contexts/UserDataContext";
import AvatarTriggerDropdown from "@/components/Avatar/AvatarTriggerDropdown";
import {extractProperties} from "@/helpers/extractProperties";
import {useUserData} from "@/hooks/useUserData";
import {useLiveChatWidget} from "@/hooks/useLiveChatWidget";
import {RiCustomerService2Line} from "react-icons/ri";
// import SearchDropdown from "@/components/SearchContainer//SearchDropdown";
import {useMenuData} from "@/hooks/useMenuData";
import {MenuItemType, TranslateMenuType} from "types/order";
import {useDebounce} from "@uidotdev/usehooks";
import {openOrderModal} from "@/redux/action/openOrderModal";
// import {router} from "next/client";
import {Image} from "@nextui-org/react";
import {MdOutlineClose} from "react-icons/md";

interface DesktopNavigatorMenuProps {
    isShow: boolean;
};

const pages = ["home", "order", "introduce"] as const;

const BonusTranslateIconName = {
    ...TranslateIconName,
    menu: "Thực đơn",
    introduce: "Giới thiệu cửa hàng",
} as const;

function DesktopNavigatorMenu({isShow}: DesktopNavigatorMenuProps) {
    const {openWidget, closeWidget} = useLiveChatWidget();
    const {isLogin, user} = useAuth();
    const {userData, isLoaded} = useUserData();
    // const screen = useSelector((state: RootState) => state.screen.currentScreen);
    const location = useSelector((state: RootState) => state.storeLocation.currentLocation);
    const {push} = useRouter();
    const pathname = usePathname();

    const [isOpenChatWidget, setIsOpenChatWidget] = useState<boolean>(false);

    const logoAction = () => {
        if (pathname !== "/") {
            push("/");
        } else {
            window.scrollTo({top: 0, behavior: "smooth"});
        }
    }
    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        store.dispatch(setStoreLocation(event.target.value as keyof typeof StoreLocation));
    }

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
    const [isOpenSearchDropdown, setIsOpenSearchDropdown] = useState<boolean>(false);
    const searchKey = Object.keys(searchResult);
    // const searchRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {

        const search = async () => {
            let result = {};
            if (debouncedSearchValue) {
                setIsOpenSearchDropdown(true);
                setIsSearching(true);
                setIsOpenSearchDropdown(true);
                const searchResponse = await searchItem(debouncedSearchValue);
                if (searchResponse) {
                    result = searchResponse;
                    setSearchResult(result);
                    // console.log(searchKey)
                }
                // setTimeout(() => {
                setIsSearching(false);
                // searchRef.current?.blur();
                // }, 2000)
            }
        }
        search();
    }, [debouncedSearchValue]);

    // const [isDesktopShow, setIsDesktopShow] = useState<string>("");
    // useLayoutEffect(() => {
    //     if (pathname === "/profile") {
    //         setIsDesktopShow("hidden mobile:flex");
    //     }
    // }, []);

    return (
       <Navbar
           shouldHideOnScroll
           className={tw(isShow ? "" : "hidden", 'p-3 bg-white')}
           maxWidth={"full"}
           classNames={{
              wrapper: "px-2"
           }}
       >
           <NavbarContent justify="start">
               <NavbarBrand onClick={logoAction} className={"cursor-pointer flex gap-1"}>
                   <Logo size={50}/>
                   <p className={"text-xl font-bold text-inherit hidden sm:block"}>commanau</p>
               </NavbarBrand>
           </NavbarContent>
           <NavbarContent justify="center" className={""}>
               <NavbarItem>
                   {/*<Select*/}
                   {/*    items={Object.keys(StoreLocation).map((key) => ({*/}
                   {/*        value: key,*/}
                   {/*        label: StoreLocation[key as keyof typeof StoreLocation],*/}
                   {/*    }))}*/}
                   {/*    selectedKeys={[location]}*/}
                   {/*    label="Chọn chi nhánh"*/}
                   {/*    // placeholder="Chọn cửa hàng"*/}
                   {/*    className="max-w-xs w-44"*/}
                   {/*    onChange={handleSelectionChange}*/}
                   {/*    variant={"bordered"}*/}
                   {/*    color={"warning"}*/}
                   {/*    showScrollIndicators={true}*/}
                   {/*>*/}
                   {/*    {*/}
                   {/*        (location) =>*/}
                   {/*            <SelectItem key={location.value} value={location.value}>{location.label}</SelectItem>*/}
                   {/*    }*/}
                   {/*</Select>*/}
               </NavbarItem>
           </NavbarContent>
           <NavbarContent justify="center" className={"hidden md:flex"}>
               {pages.map((page: keyof typeof BonusTranslateIconName, index) => (
                   <NavbarItem
                       isActive={(pathname.includes(page) || pathname === "/")}
                       className={tw(
                           "cursor-pointer font-semibold",
                           (pathname.includes(page) || (page === "home" && pathname === "/")) ? "text-orange-600" : "")}
                       key={"navbar-item-" + page}
                       onClick={() => {push(`/${(page === "home" )? "/": page}`) }}
                   >
                       <div>{BonusTranslateIconName[page]}</div>
                   </NavbarItem>
               ))}
           </NavbarContent>
           <NavbarContent justify="center">
               <NavbarItem className={"hidden lg:flex"}>
                   <div className={tw("absolute top-[55px] bg-gray-100 rounded-xl p-5", isOpenSearchDropdown ? "" : "hidden")}>

                        {isSearching ?
                            <p className={"text-sm font-semibold"}>Đang tìm kiếm...</p>
                        :
                            <>
                                <div
                                    className={"absolute right-[15px] top-[15px] hover:text-orange-600 transition-all text-lg"}
                                    onClick={() => setIsOpenSearchDropdown(false)}
                                >
                                    <MdOutlineClose/>
                                </div>
                                {Object.keys(searchResult).map((key, index) => (
                                    <div key={"search-" + key} className={"flex flex-col justify-center items-start"}>
                                        <p className={"text-md font-semibold text-center"}>{searchResult[key].length ? TranslateMenuType[key] : ""}</p>
                                        <div className={"flex flex-col justify-center items-start pl-2"}>
                                            {searchResult[key].map((item, index) => {
                                                storeItemToLocalStorage(item);
                                                return (
                                                    <div
                                                        key={"search-item-" + index}
                                                        className={"flex flex-row justify-between items-center hover:bg-gray-200 transition-all p-2 rounded-lg w-full cursor-pointer"}
                                                        onClick={() => {
                                                            // console.log(item._id)
                                                            store.dispatch(openOrderModal(item._id as unknown as string))
                                                        }}
                                                    >
                                                        <div className={"flex flex-row justify-start items-center"}>
                                                            <div className={"flex justify-center items-center"}>
                                                                <Image
                                                                    shadow="sm"
                                                                    radius="lg"
                                                                    width="100%"
                                                                    alt={item.name}
                                                                    className="object-cover h-[40px] w-[40px] rounded-lg"
                                                                    src={item.image}
                                                                />
                                                            </div>
                                                            <div
                                                                className={"flex flex-col justify-start items-start px-2 w-[70%]"}>
                                                                <h1 className={"text-xs font-semibold w-44 whitespace-break-spaces"}>{item.name}</h1>
                                                                {/*<p className={"text-xs text-default-500 line-clamp-2"}>{item.description}</p>*/}
                                                                <p className={"text-xs font-semibold"}>{item.price}.000đ</p>
                                                            </div>
                                                        </div>
                                                        <div className={"flex flex-row justify-center items-center"}>
                                                            {/*<p className={"text-xs font-semibold"}>{item.price}.000đ</p>*/}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            }
                                        </div>
                                    </div>
                                ))}
                            </>
                        }
                   </div>
               </NavbarItem>
               <NavbarItem className={"hidden lg:flex"}>
                   <Input
                       classNames={{
                           base: "max-w-full sm:max-w-[12rem] h-10",
                           mainWrapper: "h-full",
                              input: "text-small",
                              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                          }}
                          placeholder="Tìm kiếm món ăn..."
                          size="sm"
                          startContent={<IoIosSearch size={18}/>}
                          type="search"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                      />
               </NavbarItem>
               <NavbarItem className={"cursor-pointer"}>
                   <Link href={"https://t.me/menucommanau"} isExternal={true}>
                       <RiCustomerService2Line
                           size={24}
                           className={"text-orange-600"}
                           onClick={() => {
                               // toggleWidget(!isOpened)
                               // setIsOpenChatWidget((isOpened) => !isOpened);
                               // if (isOpenChatWidget) {
                               //     openWidget();
                               // } else {
                               //     closeWidget();
                               // }
                               // openWidget();
                           }}/>
                   </Link>

               </NavbarItem>
                <NavbarItem className={"cursor-pointer"}>
                    {/*<Link href={"/cart"}>*/}
                    <OrderCart/>
                    {/*</Link>*/}
                </NavbarItem>
               <NavbarItem className={"hidden md:flex"}>
                   {isLogin ? (
                       <AvatarTriggerDropdown
                            userData={extractProperties(userData, ["fullName", "email"])}
                            avatarIcon={
                                <Avatar
                                    showFallback
                                    isBordered
                                    color="warning"
                                    size="sm"
                                    // name={userData.fullName}
                                    src={userData.avatar}
                                    className={"text-white font-bold uppercase cursor-pointer"}/>
                            }
                          />

                   ): (
                       <div className={"flex justify-center items-center gap-2"}>
                           <Link href={"/auth/signin"} >
                               <Button className={"bg-gray-400/10 text-orange-600"}>Đăng nhập</Button>
                           </Link>
                           <Link href={"/auth/signup"} >
                               <Button className={"bg-orange-600 text-white"}>Đăng Ký</Button>
                           </Link>
                       </div>
                   )}
               </NavbarItem>
           </NavbarContent>
       </Navbar>
    );
}

export default DesktopNavigatorMenu;