import React, {Suspense} from 'react';
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
    const header = headers();
    const pathname = header.get("x-pathname");
    if (pathname.includes("/admin")) {
        // console.log("Admin")
        return (
            <NextauthSessionProviders>
                <NextUIProvider>
                    {/*<ReduxProviders>*/}
                        <UserDataProvider>
                            <MenuDataProvider>
                                {children}
                            </MenuDataProvider>
                        </UserDataProvider>
                    {/*</ReduxProviders>*/}
                </NextUIProvider>
            </NextauthSessionProviders>
        );
    }
    return (
        <Suspense fallback={<div>Loading.....</div>}>
            <NextauthSessionProviders>
                <NextUIProvider>
                    <ReduxProviders>
                        <UserDataProvider>
                            <MenuDataProvider>
                                {children}
                            </MenuDataProvider>
                        </UserDataProvider>
                    </ReduxProviders>
                </NextUIProvider>
            </NextauthSessionProviders>
        </Suspense>
    );
}
export default ProviderLayout;