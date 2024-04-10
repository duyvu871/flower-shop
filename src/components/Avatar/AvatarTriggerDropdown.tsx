import React, { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { CiSettings } from 'react-icons/ci';
import { TbMoneybag, TbReport } from 'react-icons/tb';
import { RiCustomerService2Line } from 'react-icons/ri';
import { FaSignOutAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { useLiveChatWidget } from '@/hooks/useLiveChatWidget';
import store from '@/redux/store';
import { GrTransaction } from 'react-icons/gr';
import { UserInterface } from 'types/userInterface';
import { tw } from '@/ultis/tailwind.ultis';
import { formatCurrency } from '@/ultis/currency-format';

interface AvatarTriggerDropdownProps {
	avatarIcon: React.ReactNode;
	userData: UserInterface;
}

function AvatarTriggerDropdown({ avatarIcon, userData }: AvatarTriggerDropdownProps) {
	const { openWidget } = useLiveChatWidget();
	const [isNegativeBalance, setIsNegativeBalance] = React.useState<boolean>(false);
	useEffect(() => {
		if (userData) {
			setIsNegativeBalance(userData.balance <= 0);
		}
	}, [userData]);
	return (
		<Dropdown placement='bottom-end'>
			<DropdownTrigger>{avatarIcon}</DropdownTrigger>
			<DropdownMenu aria-label='Profile Actions' variant='flat'>
				<DropdownItem key='profile' className='h-14 gap-2 ' showDivider>
					<p className='font-semibold'>Đăng nhập với:</p>
					<p className='font-semibold'>{userData.email}</p>
					<div className={'flex justify-start items-center w-full'}>
						<p className={'font-semibold'}>Số dư:</p>
						<p
							className={tw('font-semibold', isNegativeBalance ? 'text-danger-500' : 'text-success-500')}>
							{isNegativeBalance
								? '-' + formatCurrency(userData.virtualVolume.toString())
								: formatCurrency(userData.balance.toString())}
							đ
						</p>
					</div>
				</DropdownItem>
				<DropdownItem key='profile-direct' endContent={<CgProfile size={20} />} href={'/profile'}>
					Thông tin của tôi
				</DropdownItem>
				<DropdownItem
					key='analytics'
					endContent={<TbReport size={20} className={'text-gray-500'} />}
					onClick={() => store.dispatch({ type: 'OPEN_CART_MODAL' })}>
					Đơn hàng
				</DropdownItem>
				<DropdownItem
					key='payment-history'
					endContent={<GrTransaction size={20} className={'text-gray-500'} />}
					href={'/profile/order-history'}>
					Lịch sử thanh toán
				</DropdownItem>
				<DropdownItem
					key='debit-margin'
					endContent={<TbMoneybag size={20} className={'text-gray-500'} />}
					href={'/profile/debit-margin'}>
					Ký quỹ nợ
				</DropdownItem>
				<DropdownItem
					key='customer-service'
					endContent={<RiCustomerService2Line size={20} className={'text-gray-500'} />}
					onClick={openWidget}>
					Liên hệ cskh
				</DropdownItem>
				<DropdownItem key='settings' showDivider endContent={<CiSettings size={20} />}>
					Cài đặt
				</DropdownItem>
				<DropdownItem
					key='logout'
					color='danger'
					className={'text-danger'}
					endContent={<FaSignOutAlt />}
					onClick={() => signOut()}>
					Đăng xuất
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}

export default AvatarTriggerDropdown;
