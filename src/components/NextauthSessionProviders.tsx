"use client";
import React from 'react';
import {SessionProvider, useSession} from 'next-auth/react';
import {useRouter} from "next/navigation";

interface NextauthSessionProvidersProps {
    children?: React.ReactNode;
};

function NextauthSessionProviders({children}: NextauthSessionProvidersProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}

export default NextauthSessionProviders;