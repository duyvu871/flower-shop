"use client"
import React, {useEffect} from 'react';
import {calculateDiscount, formatCurrency} from "@/ultis/currency-format";
import {
    Button,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner
} from "@nextui-org/react";
import {useMenuData} from "@/hooks/useMenuData";
import {useOrder} from "@/hooks/useOrder";
import {FaLocationDot} from "react-icons/fa6";
import {FaLocationArrow} from "react-icons/fa";
// import store from "@/redux/store";
// import {closeOrderModal} from "@/redux/action/openOrderModal";
// import {isNumber} from "@/ultis/validate.ultis";
import {Textarea} from "@nextui-org/input";
// import {useUserData} from "@/hooks/useUserData";
import {useSession} from "next-auth/react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useUserData} from "@/hooks/useUserData";
import {useToast} from "@/hooks/useToast";
import store from "@/redux/store";
import {CartItemType} from "@/contexts/MenuDataContext";

interface OrderScreenProps {

};

function OrderScreen({}: OrderScreenProps) {
    const isImmediately = useSearchParams().get("immediately");
    const {cart,clearCart} = useMenuData();
    const {userData, updateUserData} = useUserData();
    const {createOrder} = useOrder();
    const {data} = useSession();
    const {push} = useRouter();
    const {success, error} = useToast();
    const [totalPrice, setTotalPrice] = React.useState<number>(0);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [location, setLocation] = React.useState<string>("");
    const [takeNote, setTakeNote] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [cartTemp, setCartTemp] = React.useState<CartItemType[]>([]);
    const [isPayAll, setIsPayAll] = React.useState<boolean>(false);

    const handleOrder = async () => {
        if (!data) {
            return push("/auth/signin");
        }

        setIsLoading(true);
        const response = await createOrder(cartTemp, location||userData.address, takeNote);
        setIsLoading(false);
        if (response.status !== 200) {
            error(response.error);
            return;
        }
        success(response.message);
        updateUserData({balance: response.balance}, "balance");
        // console.log(response)
        success("Đã trừ "+ formatCurrency(response.orderData.orderVolume.toString()) + "đ từ tài khoản của bạn");
    }
    const handleClearCart = () => {
        if (!isImmediately) {
            clearCart();
        } else {
            localStorage.removeItem("order-immediately");
            push("/");
        }
    }

    useEffect(() => {
        if (data) {
            setLocation(userData.address);
        }
    }, [userData]);

    useEffect(() => {
        let total = 0;
        if (isPayAll) {
            cartTemp.forEach(item => {
                //@ts-ignore
                if (item.delete_or_select) {
                    total += Math.floor(Number(item.price) - Number(calculateDiscount(String(item.price), item.discount))) * item.totalOrder;
                }
            })
        } else {
            cartTemp.forEach(item => {
                total += Math.floor(Number(item.price) - Number(calculateDiscount(String(item.price), item.discount))) * item.totalOrder;
            });
        }
        setTotalPrice(total);
    }, [cartTemp]);
    useEffect(() => {
        store.dispatch({type: "CLOSE_CART_MODAL"});
        if (!isImmediately) {
            setCartTemp(cart);
        } else {
            setCartTemp(
                isImmediately.toString() === "true"
                    ? [JSON.parse(localStorage.getItem("order-immediately")||"{}")]
                    : cart);
        }
        const isPayAll = localStorage.getItem("isPayAll");
        setIsPayAll(isPayAll === "true");
    }, [cart]);
    return (
        <div className={"w-full h-full flex flex-col justify-center items-center"}>
           <div className={"flex flex-col justify-center items-center p-3"}>
               {cartTemp.map((item, index) => {
                   const price = Math.floor(Number(item.price) - Number(calculateDiscount(String(item.price), item.discount)));
                   //@ts-ignore
                   if (!item.delete_or_select && isPayAll) return null;

                   return (
                       <div key={index} className={"w-full flex flex-row justify-between items-start gap-2 my-1"}>
                           <div className={"flex flex-row justify-center items-start gap-2 w-[70%]"}>
                               <div className={"w-[30%] overflow-hidden"}>
                                   <Image
                                       src={item.image}
                                       width={200}
                                       height={200}
                                       alt={item.name}
                                       className={"object-cover aspect-square"}
                                       radius={"none"}
                                   />
                               </div>
                               <div className={"flex flex-col gap-1 w-[60%]"}>
                                   <span className={"text-sm font-semibold line-clamp-2"}>{item.name}</span>
                                   <span className={"font-bold"}>{price}.000đ</span>
                               </div>
                           </div>
                           <div className={" h-full flex flex-col gap-1 w-[25%] justify-end items-end"}>
                               <span className={"text-sm font-semibold"}>Số lượng: {item.totalOrder}</span>
                           </div>
                       </div>
                   )})}
           </div>
            <div className={"flex flex-col justify-center items-center gap-2 fixed bottom-[90px]"}>
                <div className={""}>
                    {totalPrice > 0 ? <span className={"text-xl font-bold"}>Tổng cộng: {formatCurrency(totalPrice.toString())},000đ</span> : "Không có sản phẩm nào trong giỏ hàng"}
                </div>
                <div className={"flex flex-row justify-center items-center gap-2"}>
                    {totalPrice > 0
                        ? <>
                            <Button className={"bg-green-500 text-white rounded-md p-2"} onClick={() => {setIsOpen(true)}}>Đặt món</Button>
                            <Button className={"bg-red-500 text-white rounded-md p-2"} onClick={handleClearCart}>Hủy đơn hàng</Button>
                        </>
                        : ""}
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                placement={'auto'}
                onOpenChange={() => {}}
                className={"z-[999]"}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={"flex flex-col gap-1"}>
                                {data ? <span className={"text-xl font-bold"}>Xác nhận đơn hàng</span> : <span className={"text-xl font-bold"}>Đăng nhập để đặt hàng</span>}
                            </ModalHeader>
                            <ModalBody className={"flex flex-col gap-1"}>
                                {data ? (
                                    <div className={"flex flex-col gap-2"}>
                                        <Input
                                            type="text"
                                            label="Vị trí"
                                            defaultValue={location}
                                            placeholder="1 Hùng Vương, Điện Biên, Ba Đình, Hà Nội"
                                            labelPlacement="outside"
                                            startContent={
                                                <FaLocationDot
                                                    className="text-xl text-orange-600 pointer-events-none flex-shrink-0"/>
                                            }
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        <Textarea
                                            onChange={(e) => setTakeNote(e.target.value)}
                                            label="Ghi chú"
                                            placeholder="Nhập ghi chú"
                                            labelPlacement="outside"
                                        />
                                    </div>
                                ) : null}
                                <p className={"italic text-gray-500 text-sm"}>Nếu không có thông tin gì thì vị trí sẽ được lấy theo thông tin của người dùng</p>
                                <button
                                    className={"w-full bg-orange-600 text-white mt-4 p-3 rounded-md flex flex-row justify-center items-center gap-2"}
                                    onClick={handleOrder}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Spinner size={"sm"} color={"white"}/> : ""}
                                    <span>Xác nhận</span>
                                    <FaLocationArrow/>
                                </button>
                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default OrderScreen;