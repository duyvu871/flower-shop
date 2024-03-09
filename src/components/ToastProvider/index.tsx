"use client"
import React from 'react';
import {Toaster} from "@/ultis/component_default_props.ultis";
import {ToastContainer, ToastContainerProps} from "react-toastify";

interface ToastProviderProps {
    children: React.ReactNode;
};

function ToastProvider({children}: ToastProviderProps) {
    return (
        <>
            {children}
            <ToastContainer{...Toaster as ToastContainerProps}/>
        </>
    );
}

export default ToastProvider;