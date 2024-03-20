import React from 'react';
import SignUpForm from "src/components/AuthComponent/SignUp";
import "@/app/(auth)/auth/style.css";
import {getServerAuthSession} from "@/lib/nextauthOptions";
import {redirect} from "next/navigation";
import MobileNavigatorMenu from "@/components/Menu/MobileNavigatorMenu";
import SignInForm from "@/components/AuthComponent/SignIn";
interface PageProps {

};

async function Page({}: PageProps) {
    const session = await getServerAuthSession();
    if (session) {
        return redirect("/");
    }
    return (
        <>
            <MobileNavigatorMenu isShow={true}/>
            <SignUpForm />
        </>
    );
}

export default Page;