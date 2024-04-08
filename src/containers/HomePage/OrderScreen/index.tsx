'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { calculateDiscount, formatCurrency, formatCurrencyWithDot } from '@/ultis/currency-format';
import {
	Button,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from '@nextui-org/react';
import { useMenuData } from '@/hooks/useMenuData';
import { useOrder } from '@/hooks/useOrder';
import { FaLocationDot } from 'react-icons/fa6';
import { FaCheckCircle, FaLocationArrow, FaUser } from 'react-icons/fa';
// import store from "@/redux/store";
// import {closeOrderModal} from "@/redux/action/openOrderModal";
// import {isNumber} from "@/ultis/validate.ultis";
import { Textarea } from '@nextui-org/input';
// import {useUserData} from "@/hooks/useUserData";
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserData } from '@/hooks/useUserData';
import { useToast } from '@/hooks/useToast';
import store from '@/redux/store';
import { CartItemType } from '@/contexts/MenuDataContext';
import { MdCreditCard } from 'react-icons/md';
import { tw } from '@/ultis/tailwind.ultis';
import Link from 'next/link';
// import {MenuItemType} from "types/order";

interface OrderScreenProps {}

const icon = {
	balance: <MdCreditCard size={26} />,
	virtualVolume: <MdCreditCard size={26} />,
};

function OrderScreen({}: OrderScreenProps) {
	const isImmediately = useSearchParams().get('immediately');
	const OrderID = useSearchParams().get('order_id');
	const totalOrder = useSearchParams().get('total_order');
	const takeNoteFromSearchParams = useSearchParams().get('take_note');
	const { cart, clearCart, getItemById, findItem, updateCart } = useMenuData();
	const { userData, updateUserData } = useUserData();
	const { createOrder } = useOrder();
	const { data } = useSession();
	const { push } = useRouter();
	const { success, error } = useToast();
	const router = useRouter();
	const [totalPrice, setTotalPrice] = React.useState<number>(0);
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [location, setLocation] = React.useState<string>('');
	const [takeNote, setTakeNote] = React.useState<string>('');
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [cartTemp, setCartTemp] = React.useState<CartItemType[]>([]);
	const [isPayAll, setIsPayAll] = React.useState<boolean>(false);
	const [isLocationValid, setIsLocationValid] = React.useState<boolean>(true);
	const [isTakeNoteValid, setIsTakeNoteValid] = React.useState<boolean>(true);
	const [owner, setOwner] = React.useState<string>('');
	const [isOwnerValid, setIsOwnerValid] = React.useState<boolean>(true);

	const [isOpenConfirmUsingVirtualVolume, setIsOpenConfirmUsingVirtualVolume] =
		React.useState<boolean>(false);
	const [currentPaymentMethod, setCurrentPaymentMethod] = React.useState<
		'balance' | 'virtualVolume'
	>('balance');
	const handleOrder = async () => {
		let isValid = true;
		if (!data) {
			return push('/auth/signin');
		}
		// if (!location) {
		//     setIsLocationValid(false);
		//     let isValid = false;
		// } else {
		//     setIsLocationValid(true);
		// }
		if (!takeNote) {
			setIsTakeNoteValid(false);
			isValid = false;
		} else {
			setIsTakeNoteValid(true);
		}
		// if (!owner) {
		//     setIsOwnerValid(false);
		//     isValid = false;
		// } else {
		//     setIsOwnerValid(true);
		// }

		if (!isValid) return;
		// const cartSelected = window.localStorage.getItem("");
		setIsLoading(true);
		// console.log(cart)
		// @ts-ignore
		const selectedItems = cartTemp.filter(item => item.delete_or_select);
		// console.log(selectedItems)
		const response = await createOrder(
			selectedItems.length !== 0 ? selectedItems : cartTemp,
			location || userData.address,
			takeNote,
			owner,
			currentPaymentMethod === 'virtualVolume',
		);
		setIsLoading(false);
		if (response.status !== 200) {
			error(response.error);
			if (
				response.error === 'Số dư chính không đủ' ||
				response.error === 'Số dư không đủ, vui lòng nạp thêm'
			) {
				setIsOpenConfirmUsingVirtualVolume(true);
			}
			return;
		}
		if (isImmediately) {
			localStorage.removeItem('order-immediately');
		} else {
			if (selectedItems.length !== 0) {
				// @ts-ignore
				updateCart(cart.filter(item => !item?.delete_or_select));
				// console.log(cart.filter(item => !item?.delete_or_select))
			} else {
				const uniqueItems = cart.filter(item1 => !selectedItems.some(item2 => item2._id === item1._id));
				// console.log(uniqueItems);
				// clearCart(true);
				updateCart(uniqueItems);
			}
		}
		success(response.message);
		updateUserData({ balance: response.balance }, 'balance');
		// console.log(response)
		success(
			'Đã trừ ' + formatCurrency(response.orderData.orderVolume.toString()) + 'đ từ tài khoản của bạn',
		);
		setIsOpen(false);
		setCartTemp([]);
	};
	const handleClearCart = () => {
		if (!isImmediately) {
			// clearCart(false);
			setCartTemp([]);
		} else {
			localStorage.removeItem('order-immediately');
			push('/');
		}
	};

	useEffect(() => {
		if (data) {
			setLocation(userData.address);
		}
	}, [userData]);

	useLayoutEffect(() => {
		setIsPayAll(localStorage.getItem('isPayAll') === 'true');
	}, []);

	useEffect(() => {
		let total = 0;
		const selectedItems = cartTemp.filter(item => item.delete_or_select);
		if (selectedItems.length !== 0) {
			selectedItems.forEach(item => {
				total +=
					Math.floor(Number(item.price) - Number(calculateDiscount(String(item.price), item.discount))) *
					item.totalOrder;
			});
		} else {
			cartTemp.forEach(item => {
				total +=
					Math.floor(Number(item.price) - Number(calculateDiscount(String(item.price), item.discount))) *
					item.totalOrder;
			});
		}
		setTotalPrice(total);
		// console.log(total)
		// console.log(cartTemp)
	}, [cartTemp]);

	useEffect(() => {
		// store.dispatch({type: "CLOSE_CART_MODAL"});
		if (!isImmediately) {
			// @ts-ignore
			const selectedItems = cart.filter(item => item.delete_or_select);
			console.log(selectedItems);
			if (selectedItems.length !== 0) {
				setCartTemp(selectedItems);
			} else {
				if (!isImmediately && !isPayAll) {
					setCartTemp([]);
				} else {
					// console.log(cartTemp);
					setCartTemp(cartTemp);
				}
			}
		} else {
			// const order = localStorage.getItem('order-immediately');
			// if (!order) {
			// }
			// setCartTemp(isImmediately.toString() === 'true' ? (order ? [JSON.parse(order)] : []) : cart);
		}
		// const isPayAll = ;
	}, [cart]);

	useEffect(() => {
		console.log(isImmediately, OrderID, totalOrder, takeNoteFromSearchParams);
		const getItem = async () => {
			const item = await getItemById([OrderID as string]);
			if (item) {
				setCartTemp([
					{
						...item[0],
						totalOrder: Number(totalOrder),
						takeNote: takeNoteFromSearchParams,
					},
				]);
			} else {
				setCartTemp([]);
			}
		};
		if (isImmediately) {
			const order = localStorage.getItem('order-immediately');

			if (!order) {
				if (OrderID) {
					getItem();
				}
			} else {
				const parsedOrder = JSON.parse(order) as CartItemType;
				if ((parsedOrder._id as unknown as string) === (OrderID as string)) {
					setCartTemp(isImmediately.toString() === 'true' ? [parsedOrder] : cart);
				} else {
					getItem();
				}
			}
		}
	}, [isImmediately, OrderID]);

	useEffect(() => {
		store.dispatch({ type: 'CLOSE_CART_MODAL' });
	}, []);

	return (
		<div
			className={
				'w-full h-full flex flex-col justify-center items-center md:pt-[50px] md:flex-row md:justify-around md:items-start gap-4'
			}>
			<div className={'flex flex-col justify-center items-center p-3 max-w-xl'}>
				{cartTemp.map((item, index) => {
					// console.log(item);
					const price = Math.floor(
						Number(item.price) - Number(calculateDiscount(String(item.price), item.discount)),
					);
					// //@ts-ignore
					// if (
					//     // @ts-ignore
					//     !item.delete_or_select
					//     // && isPayAll
					// ) return null;

					return (
						<div key={index} className={'w-full flex flex-row justify-between items-start gap-2 my-1 '}>
							<div className={'flex flex-row justify-center items-start gap-2 w-[70%]'}>
								<div className={'w-[30%] overflow-hidden'}>
									<Image
										src={item.image}
										width={200}
										height={200}
										alt={item.name}
										className={'object-cover aspect-square'}
										radius={'none'}
									/>
								</div>
								<div className={'flex flex-col gap-1 w-[60%]'}>
									<span className={'text-sm font-semibold line-clamp-2'}>{item.name}</span>
									<span className={'font-bold'}>
										{formatCurrencyWithDot(price)}
										.000đ
									</span>
								</div>
							</div>
							<div className={' h-full flex flex-col gap-1 w-[25%] justify-end items-end'}>
								<span className={'text-sm font-semibold'}>Số lượng: {item.totalOrder}</span>
							</div>
						</div>
					);
				})}
			</div>
			<div
				className={tw(
					'flex flex-col justify-start items-start gap-4 md:justify-center w-full px-[25px] md:w-fit',
				)}>
				<div
					className={tw(
						'flex flex-col justify-start items-start max-w-xl gap-2',
						totalPrice > 0 ? '' : 'hidden',
					)}>
					<div className={'w-full text-start text-lg font-semibold'}>Phương thức thanh toán</div>
					<div className={'w-full flex flex-col justify-start items-center gap-2'}>
						{['balance', 'virtualVolume'].map((item, index) => (
							<div
								key={index}
								className={tw(
									'w-full flex justify-start items-center gap-1 rounded-md p-2 cursor-pointer transition-all',
									currentPaymentMethod === item ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600',
								)}
								onClick={() => setCurrentPaymentMethod(item as 'balance' | 'virtualVolume')}>
								{icon[item]}
								<div>{item === 'balance' ? 'Thanh toán bằng tiền mặt' : 'Thanh toán bằng số dư ảo'}</div>
								{currentPaymentMethod === item ? (
									<FaCheckCircle
										className={tw(
											currentPaymentMethod === item
												? 'bg-orange-600-500 text-white'
												: 'bg-gray-200 text-gray-600',
										)}
									/>
								) : null}
							</div>
						))}
					</div>
				</div>
				<div className={'flex flex-col justify-center items-center gap-2 pb-[90px]'}>
					<div className={''}>
						{totalPrice > 0 ? (
							<span className={'text-xl font-bold'}>
								Tổng cộng: {formatCurrency(totalPrice.toString())}
								,000đ
							</span>
						) : (
							'Không có sản phẩm nào trong giỏ hàng'
						)}
					</div>
					<div className={'flex flex-row justify-center items-center gap-2'}>
						{totalPrice > 0 ? (
							<>
								<Button
									className={'bg-green-500 text-white rounded-md p-2'}
									onClick={() => {
										setIsOpen(true);
									}}>
									Đặt món
								</Button>
								<Button
									className={'bg-red-500 text-white rounded-md p-2'}
									onClick={() => {
										handleClearCart();
									}}>
									Hủy đơn hàng
								</Button>
							</>
						) : (
							''
						)}
					</div>
				</div>
			</div>
			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement={'auto'}
				onOpenChange={() => {}}
				className={'z-[999]'}>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader className={'flex flex-col gap-1'}>
								{data ? (
									<span className={'text-xl font-bold'}>Xác nhận đơn hàng</span>
								) : (
									<span className={'text-xl font-bold'}>Đăng nhập để đặt hàng</span>
								)}
							</ModalHeader>
							<ModalBody className={'flex flex-col gap-1'}>
								{data ? (
									<div className={'flex flex-col gap-2'}>
										{/*<Input*/}
										{/*    type="text"*/}
										{/*    label="Tên người nhận"*/}
										{/*    placeholder="Tên nhận hàng"*/}
										{/*    // defaultValue={location}*/}
										{/*    labelPlacement="outside"*/}
										{/*    startContent={*/}
										{/*        <FaUser className="text-xl text-orange-600 pointer-events-none flex-shrink-0" />*/}
										{/*    }*/}
										{/*    onChange={(e) =>*/}
										{/*        setOwner(e.target.value)*/}
										{/*    }*/}
										{/*    isInvalid={!isOwnerValid}*/}
										{/*    errorMessage={*/}
										{/*        isOwnerValid*/}
										{/*            ? ""*/}
										{/*            : "Tên người nhận không được để trống"*/}
										{/*    }*/}
										{/*/>*/}
										{/*<Input*/}
										{/*    type="text"*/}
										{/*    label="Vị trí"*/}
										{/*    defaultValue={location}*/}
										{/*    placeholder="1 Hùng Vương, Điện Biên, Ba Đình, Hà Nội"*/}
										{/*    labelPlacement="outside"*/}
										{/*    startContent={*/}
										{/*        <FaLocationDot className="text-xl text-orange-600 pointer-events-none flex-shrink-0" />*/}
										{/*    }*/}
										{/*    onChange={(e) =>*/}
										{/*        setLocation(e.target.value)*/}
										{/*    }*/}
										{/*    isInvalid={!isLocationValid}*/}
										{/*    errorMessage={*/}
										{/*        isLocationValid*/}
										{/*            ? ""*/}
										{/*            : "Vị trí không được để trống"*/}
										{/*    }*/}
										{/*/>*/}
										<Textarea
											onChange={e => setTakeNote(e.target.value)}
											label='Ghi chú'
											placeholder='Tên người nhận - địa chỉ giao hàng - nhận xét về dịch vụ'
											labelPlacement='outside'
											defaultValue={takeNote}
											isInvalid={!isTakeNoteValid}
											errorMessage={isTakeNoteValid ? '' : 'Ghi chú không được để trống'}
										/>
									</div>
								) : null}
								{/*<p className={"italic text-gray-500 text-sm"}>Nếu không có thông tin gì thì vị trí sẽ được lấy theo thông tin của người dùng</p>*/}
								<button
									className={
										'w-full bg-orange-600 text-white mt-4 p-3 rounded-md flex flex-row justify-center items-center gap-2'
									}
									onClick={handleOrder}
									disabled={isLoading}>
									{isLoading ? <Spinner size={'sm'} color={'white'} /> : ''}
									<span>Xác nhận</span>
									<FaLocationArrow />
								</button>
							</ModalBody>
							<ModalFooter></ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal
				isOpen={isOpenConfirmUsingVirtualVolume}
				onClose={() => setIsOpenConfirmUsingVirtualVolume(false)}
				placement={'auto'}
				onOpenChange={() => {}}
				className={'z-[999]'}>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader className={'flex flex-col gap-2'}>
								<span className={'text-xl font-semibold'}>
									Tài khoản của quý khách hiện đang không đủ để thanh toán đơn hàng, quý khách có muốn sử
									dụng dịch vụ số dư nợ của chúng tôi không?
								</span>
								<span className={'text-md font-semibold'}>
									Vui lòng xác nhận để được tư vấn về dịch vụ công nợ của chúng tôi
								</span>
							</ModalHeader>
							<ModalBody className={'flex flex-col gap-1'}>
								<div className={'flex flex-row w-full justify-center items-center gap-2'}>
									<Link href={'https://t.me/menucommanau'} target={'_blank'}>
										<Button
											className={'bg-green-500 text-white rounded-md p-2'}
											onClick={() => {
												setCurrentPaymentMethod('virtualVolume');
												// setIsOpenConfirmUsingVirtualVolume(false);
											}}>
											Đồng ý
										</Button>
									</Link>
									<Button
										className={'bg-red-500 text-white rounded-md p-2'}
										onClick={() => {
											setIsOpenConfirmUsingVirtualVolume(false);
										}}>
										Hủy
									</Button>
								</div>
							</ModalBody>
							<ModalFooter></ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}

export default OrderScreen;
