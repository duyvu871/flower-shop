import React from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Link,
    Input, Select, SelectItem
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

interface DesktopNavigatorMenuProps {
    isShow: boolean;
};

const pages = ["home", "order", "menu"] as const;

const BonusTranslateIconName = {
    ...TranslateIconName,
    menu: "Thực đơn",
} as const;

function DesktopNavigatorMenu({isShow}: DesktopNavigatorMenuProps) {
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
    return (
       <Navbar shouldHideOnScroll className={tw(isShow ? "hidden" : "", 'p-3 bg-white')} >
           <NavbarContent justify="start">
               <NavbarBrand onClick={logoAction} className={"cursor-pointer"}>
                   <Logo size={50}/>
                   <p className={"text-xl font-bold text-inherit"}>NgonNgon</p>
               </NavbarBrand>
           </NavbarContent>
           <NavbarContent justify="center">
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
               <NavbarItem>
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
                    <Link href={"/cart"}>
                        <OrderCart/>
                    </Link>
                </NavbarItem>
               <NavbarItem className={"hidden lg:flex "}>
                     <Link href={"/auth/signin"}>
                         <Button className={"bg-orange-600 text-white"}>Đăng nhập</Button>
                     </Link>
               </NavbarItem>
           </NavbarContent>
       </Navbar>
    );
}

export default DesktopNavigatorMenu;