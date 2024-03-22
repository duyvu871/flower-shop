import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import {LiveChatWidgetProvider} from "@/contexts/liveChatWidgetContext";
import ReduxProviders from "@/app/ReduxProviders";
import NextauthSessionProviders from "@/components/NextauthSessionProviders";
import {ToastContainer, ToastContainerProps} from "react-toastify";
import { Toaster } from '@/ultis/component_default_props.ultis';
import {UserDataProvider} from "@/contexts/UserDataContext";
import NextUIProvider from "@/app/NextuiProvider";
import MenuBar from "@/components/Menu";
// import ToastProvider from "@/components/ToastProvider";
import 'react-multi-carousel/lib/styles.css';
import {MenuDataProvider} from "@/contexts/MenuDataContext";
import OrderModal from "@/components/Modal/OrderModal";
import CartModal from "@/components/Modal/CartModal";
import React from "react";
import ProviderLayout from "@/components/ProviderLayout";

const inter = Inter({ subsets: ['vietnamese'] })

export const metadata: Metadata = {
    title: 'Mon ngon den cho moi nha',
    description: '',
    // viewport: 'width=device-width, initial-scale=1',
    keywords: ["mon ngon", "dich vu nau an"]
}

export default function RootLayout({
                                     children
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={inter.className+ ""}>
            <ProviderLayout>
                {children}
            </ProviderLayout>
            <ToastContainer{...Toaster as ToastContainerProps}/>
        </body>
      </html>

  )
}
