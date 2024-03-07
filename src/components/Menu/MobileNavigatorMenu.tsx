"use client";
import React, {ReactElement} from 'react';
import {extractProperties} from "@/helpers/extractProperties";
import FeatureItem from "@/components/Menu/FeatureItem";
//icons import
import {IoIosSearch, IoMdHome, IoMdReorder} from "react-icons/io";
import {MdAccountCircle} from "react-icons/md";
import {BiSolidFoodMenu} from "react-icons/bi";

interface MobileNavigatorMenuProps {
    
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

function MobileNavigatorMenu({}: MobileNavigatorMenuProps) {
    // const MenuFeatures = ["home", "search", "order", "account"] as const;

    return (
        <div className={"flex flex-row justify-between items-center fixed bottom-0 w-full"}>
            {Icons.map((item , index) =>
                <FeatureItem title={item.title} customIcon={item.icon} key={"feature-item-" + item.title}/>
            )}
        </div>
    );
}

export default MobileNavigatorMenu;