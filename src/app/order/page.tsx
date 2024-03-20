import React from 'react';
import OrderScreen from '@/containers/HomePage/OrderScreen';
import MenuBar from "@/components/Menu";
import SearchScreen from "@/containers/HomePage/SearchScreen";
import OrderModal from "@/components/Modal/OrderModal";
import CartModal from "@/components/Modal/CartModal";
interface PageProps {

};

function Page({}: PageProps) {
    return (
        <>
            <MenuBar/>
            <OrderScreen />
            <OrderModal/>
            <CartModal/>
        </>
    );
}

export default Page;