import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import {LiveChatWidgetProvider} from "@/contexts/liveChatWidgetContext";
// import ReduxProviders from "@/app/ReduxProviders";
// import NextauthSessionProviders from "@/components/NextauthSessionProviders";
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import { Toaster } from '@/ultis/component_default_props.ultis';
// import {UserDataProvider} from "@/contexts/UserDataContext";
// import NextUIProvider from "@/app/NextuiProvider";
// import MenuBar from "@/components/Menu";
// import ToastProvider from "@/components/ToastProvider";
import 'react-multi-carousel/lib/styles.css';
// import {MenuDataProvider} from "@/contexts/MenuDataContext";
// import OrderModal from "@/components/Modal/OrderModal";
// import CartModal from "@/components/Modal/CartModal";
import React from 'react';
import ProviderLayout from '@/components/ProviderLayout';
// import { Suspense } from 'react';
// import {tw} from "@/ultis/tailwind.ultis";
// import {Spinner} from "@nextui-org/react";
import LoadingScreen from '@/components/LoadingScreen';
import { headers } from 'next/headers';
import { getServerAuthSession } from '@/lib/nextauthOptions';
// import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['vietnamese'] });

export const metadata: Metadata = {
	title: 'Cơm má nấu, ngon như má nấu',
	description: '',
	// viewport: 'width=device-width, initial-scale=1',
	keywords: [
		'mon ngon',
		'dich vu nau an',
		'commanau',
		'commanau.vn',
		'commanau.com',
		'cơm má nấu',
		'cơm',
		'má nấu',
		'cơm má nấu',
	],
	applicationName: 'Cơm má nấu',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const header = headers();
	const pathname = header.get('x-pathname');
	const session = getServerAuthSession();
	const data = await session;

	if (pathname.includes('/admin')) {
		return (
			<html lang='en'>
				<body className={inter.className + ''}>
					{/*<Suspense>*/}
					<ProviderLayout>{children}</ProviderLayout>
					{/*</Suspense>*/}
					<ToastContainer {...(Toaster as ToastContainerProps)} />
				</body>
			</html>
		);
	} else {
		if (data) {
			if (data.user.role === 'admin') {
				return (
					<html lang='en'>
						<body className={inter.className + ''}>
							<h1>
								Hãy quay lại trang admin và đăng xuất để sử dụng tính năng này, hoặc có thể sử dụng
								trình duyệt khác để sử dụng, Điều này cần thiết để đảm bảo an toàn cho hệ thống
							</h1>
						</body>
					</html>
				);
			}
		}
	}
	return (
		<html lang='en'>
			<body className={inter.className + ''}>
				<ProviderLayout>
					<LoadingScreen />
					{children}
				</ProviderLayout>
				<ToastContainer {...(Toaster as ToastContainerProps)} />
			</body>
		</html>
	);
}
