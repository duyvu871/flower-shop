"use client";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {NextAuthUser} from "next-auth"
import { signOut } from "next-auth/react";

export const useAuth = () => {
    const session = useSession();
    const {data} = session;
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [user, setUser] = useState<NextAuthUser>();

    const logout = () => {
        signOut();
    }

    useEffect(() => {
        if (data) {
            setIsLogin(true);
            setUser(data.user);
        } else {
            setIsLogin(false);
            setUser(undefined);
        }
    }, [session]);

    return {isLogin, user, logout};
}