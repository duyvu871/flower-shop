"use client";
import React, {ReactElement} from 'react';
import {extractProperties} from "@/helpers/extractProperties";
import { FeatureItemMobile } from "@/components/Menu/FeatureItem";
//icons import
import {IoIosSearch, IoMdHome, IoMdReorder} from "react-icons/io";
import {MdAccountCircle} from "react-icons/md";
import {BiSolidFoodMenu} from "react-icons/bi";
import {tw} from "@/ultis/tailwind.ultis";

interface MobileNavigatorMenuProps {
    isShow: boolean;
};



const Icons = [
    {
        title: 'home',
        icon: <IoMdHome />,
    },
    {
        title: "search",
        icon: <IoIosSearch />
    },
    {
        title: "order",
        icon: <BiSolidFoodMenu />
    },
    {
        title: "profile",
        icon: <MdAccountCircle />
    },
] as const;

function MobileNavigatorMenu({isShow}: MobileNavigatorMenuProps) {
    // const MenuFeatures = ["home", "search", "order", "account"] as const;

    return (
        <div className={tw(
            "flex flex-row justify-between items-center fixed bottom-0 w-full",
            isShow ? "" : "hidden"
        )}>
            {Icons.map((item , index) =>
                <FeatureItemMobile
                    title={item.title}
                    customIcon={item.icon}
                    key={"feature-item-" + item.title}/>
            )}
        </div>
    );
}

export default MobileNavigatorMenu;