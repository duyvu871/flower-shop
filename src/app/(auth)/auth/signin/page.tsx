import React from 'react';
import SignInForm from "src/components/AuthComponent/SignIn";
import "@/app/(auth)/auth/style.css";
import {getServerAuthSession} from "@/lib/nextauthOptions";
import {redirect} from "next/navigation";
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import DesktopNavigatorMenu from "@/components/Menu/DesktopNavigatorMenu";
import {LiveChatWidgetProvider} from "@/contexts/liveChatWidgetContext";
interface PageProps {

};

async function Page({}: PageProps) {
    const session = await getServerAuthSession();
    if (session) {
        return redirect("/");
    }
    return (
        <>
            <LiveChatWidgetProvider>
                <MobileNavigatorMenu isShow={true}/>
                <DesktopNavigatorMenu isShow={true}/>
                <SignInForm />
            </LiveChatWidgetProvider>
        </>
    );
}

export default Page;