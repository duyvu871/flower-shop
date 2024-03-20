import React from 'react';
import ProfileScreen from "@/containers/HomePage/ProfileScreen";
import {getServerAuthSession} from "@/lib/nextauthOptions";
import {redirect} from "next/navigation";
import MenuBar from "@/components/Menu";
import OrderScreen from "@/containers/HomePage/OrderScreen";
import OrderModal from "@/components/Modal/OrderModal";
import CartModal from "@/components/Modal/CartModal";

interface PageProps {

};

async function Page({}: PageProps) {

    return (
        <>
            <MenuBar/>
            <ProfileScreen />
            <OrderModal/>
            <CartModal/>
        </>
    );
}

export default Page;