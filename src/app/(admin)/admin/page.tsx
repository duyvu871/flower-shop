import React from 'react';
import LoginForm from "@/containers/AdminPage/AdminLoginPage";
interface PageProps {
    
};

function Page({}: PageProps) {
    return (
        <div className="h-screen w-screen flex justify-center items-center bg-slate-100">
            <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12">
                <h1 className="font-semibold text-2xl">Login</h1>
                <LoginForm/>
            </div>
        </div>
    );
}

export default Page;