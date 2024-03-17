import React, {useContext, useLayoutEffect} from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Link,
    Input, Select, SelectItem,
    Avatar
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
import {UserDataContext} from "@/contexts/UserDataContext";
import AvatarTriggerDropdown from "@/components/Avatar/AvatarTriggerDropdown";
import {extractProperties} from "@/helpers/extractProperties";

interface DesktopNavigatorMenuProps {
    isShow: boolean;
};

const pages = ["home", "order", "menu"] as const;

const BonusTranslateIconName = {
    ...TranslateIconName,
    menu: "Thực đơn",
} as const;

function DesktopNavigatorMenu({isShow}: DesktopNavigatorMenuProps) {
    const {isLogin, user} = useAuth();
    const {userData} = useContext(UserDataContext);
    const screen = useSelector((state: RootState) => state.screen.currentScreen);
    const location = useSelector((state: RootState) => state.storeLocation.currentLocation);
    const {push} = useRouter();
    const pathname = usePathname();
    const logoAction = () => {
        if (pathname !== "/") {
            push("/");
        } else {
            store.dispatch(changeScreen("home"));
        }
    }
    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        store.dispatch(setStoreLocation(event.target.value as keyof typeof StoreLocation));
    }

    // useLayoutEffect(() => {
    //     if (!isLogin) {
    //         push("/auth/signin");
    //     }
    // }, [isLogin]);

    return (
       <Navbar shouldHideOnScroll className={tw(isShow ? "hidden" : "", 'p-3 bg-white ')} maxWidth={"full"}>
           <NavbarContent justify="start">
               <NavbarBrand onClick={logoAction} className={"cursor-pointer flex"}>
                   <Logo size={50}/>
                   <p className={"text-xl font-bold text-inherit hidden sm:block"}>NgonNgon</p>
               </NavbarBrand>

           </NavbarContent>
           <NavbarContent justify="center" className={""}>
               <NavbarItem>
                   <Select
                       items={Object.keys(StoreLocation).map((key) => ({
                           value: key,
                           label: StoreLocation[key as keyof typeof StoreLocation],
                       }))}
                       selectedKeys={[location]}
                       label="Chọn chi nhánh"
                       // placeholder="Chọn cửa hàng"
                       className="max-w-xs w-44"
                       onChange={handleSelectionChange}
                       variant={"bordered"}
                       color={"warning"}
                       showScrollIndicators={true}
                   >
                       {
                           (location) =>
                               <SelectItem key={location.value} value={location.value}>{location.label}</SelectItem>
                       }
                   </Select>
               </NavbarItem>
           </NavbarContent>
           <NavbarContent justify="center" className={"hidden md:flex"}>
               {pages.map((page: keyof typeof BonusTranslateIconName, index) => (
                   <NavbarItem
                       isActive={(screen === page)}
                       className={tw(
                           "cursor-pointer font-semibold",
                           (screen === page) ? "text-orange-600" : "")}
                       key={"navbar-item-" + page}

                       onClick={() => {store.dispatch(changeScreen(page))}}
                   >
                       <div>{BonusTranslateIconName[page]}</div>
                   </NavbarItem>
               ))}
           </NavbarContent>
           <NavbarContent justify="end">
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
                       startContent={<IoIosSearch size={18} />}
                       type="search"
                   />
               </NavbarItem>
                <NavbarItem className={"cursor-pointer"}>
                    {/*<Link href={"/cart"}>*/}
                        <OrderCart/>
                    {/*</Link>*/}
                </NavbarItem>
               <NavbarItem className={"hidden lg:flex"}>
                   {isLogin ? (
                       <AvatarTriggerDropdown
                            userData={extractProperties(userData, ["fullName", "email"])}
                            avatarIcon={
                                <Avatar
                                    showFallback
                                    isBordered
                                    color="warning"
                                    size="sm"
                                    name={userData.fullName}
                                    src={userData.avatar}
                                    className={"text-white font-bold uppercase cursor-pointer"}/>
                            }
                          />

                   ): (
                       <Link href={"/auth/signin"} >
                           <Button className={"bg-orange-600 text-white"}>Đăng nhập</Button>
                       </Link>
                   )}
               </NavbarItem>
           </NavbarContent>
       </Navbar>
    );
}

export default DesktopNavigatorMenu;