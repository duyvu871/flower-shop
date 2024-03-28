"use client";
import NextUiSidebar from "./NextUISidebar";
import React from "react";

interface BaseLayoutProps {
    children: React.ReactNode
};


const BaseLayout = ({ children }: BaseLayoutProps) => {
    return (
        <div className="layout">
            <NextUiSidebar />
            <main className="layout__main-content h-[100vh] overflow-x-hidden overflow-y-auto">{children}</main>
        </div>
    );
};

export default BaseLayout;