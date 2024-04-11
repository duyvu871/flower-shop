'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
// import Image from "next/image";
import { AiOutlineHome } from 'react-icons/ai';
import { BsPeople } from 'react-icons/bs';
import { TiContacts } from 'react-icons/ti';
import { FiMail } from 'react-icons/fi';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import Link from 'next/link';
import { useContext } from 'react';
import { SidebarContext } from '@/contexts/SidebarContext';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import './style.css';
import AppLogo from '@/components/Logo';
import { BiFoodMenu } from 'react-icons/bi';
import { IoIosLogOut } from 'react-icons/io';

const sidebarItems = [
	{
		name: 'Quản lý đơn hàng',
		notifyAction: 'order',
		href: '/admin/dashboard/order-management',
		icon: FiMail,
	},
	{
		name: 'Quản lý người dùng',
		notifyAction: 'user',
		href: '/admin/dashboard/user-management',
		icon: BsPeople,
	},
	{
		name: 'Quản lý món ăn',
		notifyAction: 'product',
		href: '/admin/dashboard/product-management',
		icon: BiFoodMenu,
	},
	{
		name: 'Quản lý đơn nạp tiền',
		notifyAction: 'deposit',
		href: '/admin/dashboard/deposit-management',
		icon: AiOutlineHome,
	},
	{
		name: 'Đăng xuất',
		href: '/admin/dashboard/withdrawal-management',
		type: 'logout',
		icon: IoIosLogOut,
	},
];

interface NextUiSidebarProps {
	// hideSidebar: boolean;
	// setHideSidebar: (value: boolean) => void;
}

function NextUiSidebar(
	{
		// hideSidebar, setHideSidebar
	}: NextUiSidebarProps,
) {
	const router = useRouter();
	const pathname = usePathname();
	const { isCollapsed, toggleSidebarCollapse } = useContext(SidebarContext);

	return (
		<div className='sidebar__wrapper fixed left-0 top-0'>
			<button className='btn' onClick={toggleSidebarCollapse}>
				{isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
			</button>
			<aside className='sidebar flex flex-col items-center' data-collapse={isCollapsed}>
				<div
					className='sidebar__top cursor-pointer'
					onClick={() => {
						router.push('/admin/dashboard');
					}}>
					<AppLogo size={60} />
					<p className='sidebar__logo-name p-5 tt-xl'>Trang quản lí</p>
				</div>
				<ul className='sidebar__list w-full'>
					{sidebarItems.map(({ name, href, icon: Icon, type }) => {
						if (type === 'logout') {
							return (
								<li className='sidebar__item' key={name}>
									<div
										className={`rounded-[0.8rem] px-[1rem] py-[0.8rem] flex justify-start items-center cursor-pointer text-danger bg-danger/10 hover:bg-danger/20`}
										onClick={() => {
											signOut({ callbackUrl: '/' });
										}}>
										<span className='sidebar__icon'>
											<Icon />
										</span>
										<span className='sidebar__name'>{name}</span>
									</div>
								</li>
							);
						}
						return (
							<li className='sidebar__item' key={name}>
								<div
									className={`sidebar__link flex justify-start items-center cursor-pointer ${
										pathname === href ? 'sidebar__link--active' : ''
									}`}
									onClick={() => {
										router.push(href);
									}}>
									<span className='sidebar__icon'>
										<Icon />
									</span>
									<span className='sidebar__name'>{name}</span>
								</div>
							</li>
						);
					})}
				</ul>
			</aside>
		</div>
	);
}

export default NextUiSidebar;
