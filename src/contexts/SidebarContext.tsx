"use client";

import React, { createContext, useState } from "react";

interface SidebarContextProps {
    isCollapsed: boolean;
    toggleSidebarCollapse: () => void;
}

interface SidebarProviderProps {
    children: React.ReactNode;
}

const initialValue = { isCollapsed: false, toggleSidebarCollapse: () => { } };

const SidebarContext = createContext<SidebarContextProps>(initialValue);

const SidebarProvider = ({ children }: SidebarProviderProps) => {
    const [isCollapsed, setCollapse] = useState(false);

    const toggleSidebarCollapse = () => {
        setCollapse((prevState) => !prevState);
    };

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebarCollapse }}>
            {children}
        </SidebarContext.Provider>
    );
};

export { SidebarContext, SidebarProvider };