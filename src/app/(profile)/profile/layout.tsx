import React from 'react';
import {getServerAuthSession} from "@/lib/nextauthOptions";
import {redirect} from "next/navigation";

interface LayoutProps {
    children: React.ReactNode;
};

async function ProfileLayout({children}: LayoutProps) {
    const session = await getServerAuthSession();
    if (!session) {
        return redirect("/auth/signin");
    }
    return (
        <>{children}</>
    );
}

export default ProfileLayout;