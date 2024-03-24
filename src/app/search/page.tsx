import React from 'react';
import SearchScreen from "@/containers/HomePage/SearchScreen";
import MenuBar from "@/components/Menu";
import HomePage from "@/containers/HomePage";
import OrderModal from "@/components/Modal/OrderModal";
import CartModal from "@/components/Modal/CartModal";
import {LiveChatWidgetProvider} from "@/contexts/liveChatWidgetContext";

interface PageProps {

};

function Page({}: PageProps) {
    return (
        <>
            <LiveChatWidgetProvider>
                <MenuBar/>
                <SearchScreen />
                <OrderModal/>
                <CartModal/>
            </LiveChatWidgetProvider>
        </>
    );
}

export default Page;