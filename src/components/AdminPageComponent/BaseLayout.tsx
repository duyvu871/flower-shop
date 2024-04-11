'use client';
import NextUiSidebar from './NextUISidebar';
import React from 'react';
import AdminNavbar from '@/components/AdminPageComponent/AdminNavbar';

interface BaseLayoutProps {
	children: React.ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
	return (
		<div className='layout'>
			<NextUiSidebar />
			<main className='layout__main-content h-[100vh] overflow-x-hidden overflow-y-auto'>
				<AdminNavbar />
				{children}
			</main>
		</div>
	);
};

export default BaseLayout;
