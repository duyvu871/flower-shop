import React from 'react';
import NextUIProvider from "@/app/NextuiProvider";
import ReduxProviders from "@/app/ReduxProviders";
import {LiveChatWidgetProvider} from "@/contexts/liveChatWidgetContext";
import {UserDataProvider} from "@/contexts/UserDataContext";
import {MenuDataProvider} from "@/contexts/MenuDataContext";
import MenuBar from "@/components/Menu";
import OrderModal from "@/components/Modal/OrderModal";
import CartModal from "@/components/Modal/CartModal";
import NextauthSessionProviders from "@/components/NextauthSessionProviders";
import {usePathname} from "next/navigation";
import {headers} from "next/headers";

interface ProviderLayoutProps {
    children: React.ReactNode;
};

function ProviderLayout({children}: ProviderLayoutProps) {
    return (
        <NextauthSessionProviders>
            <NextUIProvider>
                <ReduxProviders>
                    <LiveChatWidgetProvider>
                        <UserDataProvider>
                            <MenuDataProvider>
                                {children}
                            </MenuDataProvider>
                        </UserDataProvider>
                    </LiveChatWidgetProvider>
                </ReduxProviders>
            </NextUIProvider>
        </NextauthSessionProviders>
    );
}
export default ProviderLayout;