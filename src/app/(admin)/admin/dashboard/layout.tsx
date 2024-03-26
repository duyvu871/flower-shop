import React from 'react';
import {SidebarProvider} from "@/contexts/SidebarContext";
import BaseLayout from "@/components/AdminPageComponent/BaseLayout";
import NavBarWrapper from "@/components/AdminPageComponent/Dashboard/NavBarWrapper";
import DialogProvider from "@/components/AdminPageComponent/Dashboard/Dialog/DialogProvider";

interface LayoutProps {
    children: React.ReactNode
};

function Layout({children}: LayoutProps) {
    return (
        <SidebarProvider>
            <BaseLayout>
                <NavBarWrapper>
                    <DialogProvider>
                        {children}
                    </DialogProvider>
                </NavBarWrapper>
            </BaseLayout>
        </SidebarProvider>
    );
}

export default Layout;