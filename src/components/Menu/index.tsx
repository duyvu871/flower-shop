"use client";
import React, {useEffect, useState} from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import {tw} from "@/ultis/tailwind.ultis";
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import DesktopNavigatorMenu from "@/components/Menu/DesktopNavigatorMenu";
import {usePathname} from "next/navigation";

type MenuBarProps = {

}

const MenuComponents = {
    mobile: MobileNavigatorMenu,
    tablet: DesktopNavigatorMenu,
    desktop: DesktopNavigatorMenu
} as const;


export default function MenuBar({}: MenuBarProps) {

    return (
       <>
           <MobileNavigatorMenu isShow={true}/>
           <DesktopNavigatorMenu isShow={true}/>
       </>
    )

}