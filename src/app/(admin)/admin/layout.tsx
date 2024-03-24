import React from 'react';
import {getServerAuthSession} from "@/lib/nextauthOptions";
import {redirect} from "next/navigation";

interface LayoutProps {
    children: React.ReactNode;
};

async function RootLayout({children}: LayoutProps) {
    // const session = await getServerAuthSession();
    //
    // if (!session) {
    //     return redirect('/');
    // }
    //
    // if (!session.user.role.includes("admin")) {
    //     return redirect('/');
    // }

    return (
       <>{children}</>
    );
}

export default RootLayout;