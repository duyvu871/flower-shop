import React, { useEffect } from 'react';
import {
	Avatar,
	// Button,
	// Image,
	// Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	// Switch,
} from '@nextui-org/react';
import { useUserData } from '@/hooks/useUserData';
import { formatCurrency, formatCurrencyWithDot } from '@/ultis/currency-format';
import { FaEye, FaEyeSlash, FaMedal } from 'react-icons/fa';
import { tw } from '@/ultis/tailwind.ultis';
import { useSession } from 'next-auth/react';
// import store from '@/redux/store';
// import { closeOrderModal } from '@/redux/action/openOrderModal';
// import { isNumber } from '@/ultis/validate.ultis';
// import { Textarea } from '@nextui-org/input';

interface ProfileCardProps {}

function ProfileCard({}: ProfileCardProps) {
	const session = useSession();
	const status = session.status;
	const { userData } = useUserData();
	const [isShowVirtualVolume, setIsShowVirtualVolume] = React.useState<boolean>(false);
	const [isShowBalance, setIsShowBalance] = React.useState<boolean>(false);
	const [isNegativeBalance, setIsNegativeBalance] = React.useState<boolean>(false);
	const [isLoyalCustomer, setIsLoyalCustomer] = React.useState<boolean>(false);
	const [isPopupOpen, setIsPopupOpen] = React.useState<boolean>(false);
	useEffect(() => {
		// if (!userData) {
		//     setIsS
		// };
		if (userData.balance <= 0 && userData.virtualVolume > 0) {
			setIsShowVirtualVolume(true);
			setIsNegativeBalance(true);
			setIsPopupOpen(true);
		} else {
			setIsNegativeBalance(false);
			setIsShowVirtualVolume(false);
		}
		setIsLoyalCustomer(userData.isLoyalCustomer);
	}, [userData]);
	return (
		<>
			<div className={'w-full'}>
				<div
					className={
						'relative mx-auto my-8 sm:left-0 w-[300px] min-h-[250px] h-auto bg-white p-8 border-gray-400 border-[1px] rounded-xl'
					}>
					<div className={'w-full flex flex-col justify-center items-center gap-3'}>
						<div className={'w-full flex flex-col justify-center items-center gap-4'}>
							<Avatar
								showFallback
								isBordered
								color='warning'
								// size="lg"
								// name={userData.fullName}
								src={userData.avatar}
								className={'text-white text-2xl font-bold uppercase cursor-pointer w-20 h-20'}
							/>
							<div className={'flex flex-col justify-center items-center gap-2'}>
								<p className={'font-bold text-xl'}>{userData.fullName || ''}</p>
								{isLoyalCustomer ? (
									<span
										className={
											'flex flex-row justify-center items-center gap-1 bg-gray-200 rounded-full p-1 px-2 text-xs'
										}>
										Khách hàng thân thiết
										<FaMedal className={'text-gray-600'} />
									</span>
								) : (
									''
								)}
							</div>
						</div>
						<div className={'w-full flex flex-col justify-center items-center gap-1'}>
							{status === 'authenticated' ? (
								<>
									{/*<Switch*/}
									{/*	isSelected={isShowVirtualVolume}*/}
									{/*	onValueChange={setIsShowVirtualVolume}*/}
									{/*	color={'warning'}*/}
									{/*	className={'w-full'}>*/}
									{/*	{isShowVirtualVolume ? 'Ẩn' : 'Hiện'} số dư nợ*/}
									{/*</Switch>*/}
									{/*{isShowVirtualVolume ? (*/}
									{/*	<div className={'flex flex-col justify-center items-center'}>*/}
									{/*		<p className={'text-sm text-gray-400'}>Số nợ cho phép</p>*/}
									{/*		<p className={'text-2xl font-bold flex gap-1'}>*/}
									{/*			<span className={'text-red-500'}>*/}
									{/*				{formatCurrency(userData.allowDebitLimit.toString())}*/}
									{/*			</span>*/}
									{/*			<span>vnđ</span>*/}
									{/*		</p>*/}
									{/*	</div>*/}
									{/*) : null}*/}
									{/*<h1 className={"text-md font-semibold"}>{userData.fullName}</h1>*/}
									<p className={'text-sm text-gray-400'}>Số dư hiện tại</p>
									<div className={'flex flex-row justify-start items-center gap-2'}>
										<span onClick={() => setIsShowBalance(!isShowBalance)}>
											{isShowBalance ? (
												<FaEyeSlash className={'text-xl'} />
											) : (
												<FaEye className={'text-xl'} />
											)}
										</span>
										<p className={'text-2xl font-bold flex gap-1'}>
											{isShowBalance ? (
												<span
													className={tw(isShowVirtualVolume ? 'text-red-500' : 'text-green-500')}>
													{formatCurrency(
														(isShowVirtualVolume
															? -userData.virtualVolume
															: userData.balance
														).toString(),
													)}
												</span>
											) : (
												<span>******</span>
											)}
											<span>vnđ</span>
										</p>
									</div>

									{isNegativeBalance ? (
										<span className={'bg-red-500 rounded-full px-2 p-1 text-white text-xs'}>
											Đang nợ
										</span>
									) : (
										''
									)}
								</>
							) : null}
						</div>
					</div>
				</div>
			</div>
			<Modal
				isOpen={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
				placement={'center'}
				onOpenChange={() => {}}
				className={'z-[999] mx-4 '}>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader className={'flex flex-col gap-1'}></ModalHeader>
							<ModalBody className={'flex flex-col justify-center items-center gap-1'}>
								<h1 className={'font-bold'}>
									Quý khách hiện đang nợ, hãy thanh toán số nợ sớm nhất có thể{' '}
								</h1>
							</ModalBody>
							<ModalFooter></ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export default ProfileCard;
