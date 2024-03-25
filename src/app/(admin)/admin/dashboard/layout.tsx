import React from 'react';
import {SidebarProvider} from "@/contexts/SidebarContext";
import BaseLayout from "@/components/AdminPageComponent/BaseLayout";

interface LayoutProps {
    children: React.ReactNode
};

function Layout({children}: LayoutProps) {
    return (
        <SidebarProvider>
            <BaseLayout>
                {children}
            </BaseLayout>
        </SidebarProvider>
    );
}

export default Layout;