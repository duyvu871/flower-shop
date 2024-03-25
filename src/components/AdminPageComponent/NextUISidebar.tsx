"use client";

import React, {useEffect, useLayoutEffect, useState} from 'react';
// import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { TiContacts } from "react-icons/ti";
import { FiMail } from "react-icons/fi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
import { useContext } from "react";
import { SidebarContext } from "@/contexts/SidebarContext";
import { useRouter, usePathname } from "next/navigation";
import "./style.css";
import AppLogo from "@/components/Logo";
import {BiFoodMenu} from "react-icons/bi";

const sidebarItems = [
    {
        name: "Quản lý đơn hàng",
        href: "/admin/dashboard/order-management",
        icon: FiMail,
    },
    {
        name: "Quản lý người dùng",
        href: "/admin/dashboard/user-management",
        icon: BsPeople,
    },
    {
        name: "Quản lý món ăn",
        href: "/admin/dashboard/product-management",
        icon: BiFoodMenu,
    },
    {
        name: "Quản lý đơn nạp tiền",
        href: "/admin/dashboard/deposit-management",
        icon: AiOutlineHome,
    },
    {
        name: "Quản lý đơn rút tiền",
        href: "/admin/dashboard/withdrawal-management",
        icon: TiContacts,
    }
];

interface NextUiSidebarProps {
    // hideSidebar: boolean;
    // setHideSidebar: (value: boolean) => void;
};

function NextUiSidebar({
                           // hideSidebar, setHideSidebar
}: NextUiSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isCollapsed, toggleSidebarCollapse } = useContext(SidebarContext);


    return (
        <div className="sidebar__wrapper">
            <button className="btn" onClick={toggleSidebarCollapse}>
                {isCollapsed ? <MdKeyboardArrowRight/> : <MdKeyboardArrowLeft/>}
            </button>
            <aside className="sidebar flex flex-col items-center" data-collapse={isCollapsed}>
                <div className="sidebar__top ">
                    <AppLogo size={60}/>
                    <p className="sidebar__logo-name p-5 tt-xl">Trang quản lí</p>
                </div>
                <ul className="sidebar__list w-full">
                    {sidebarItems.map(({name, href, icon: Icon}) => {
                        return (
                            <li className="sidebar__item" key={name}>
                                <div
                                    className={`sidebar__link flex justify-start items-center cursor-pointer ${
                                        pathname === href ? "sidebar__link--active" : ""
                                    }`}
                                    onClick={() => {router.push(href)}}
                                >
                                    <span className="sidebar__icon"><Icon/></span>
                                    <span className="sidebar__name">{name}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </aside>
        </div>
    );
}

export default NextUiSidebar;