"use client";
import React, {useContext, useEffect} from 'react';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
    Image,
    Button
} from "@nextui-org/react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/reducers";
import {MenuDataContext} from "@/contexts/MenuDataContext";
import {MenuItemType} from "types/order";
import {ObjectId} from "mongodb";
import store from "@/redux/store";
import {closeOrderModal} from "@/redux/action/openOrderModal";
import {isNumber} from "@/ultis/validate.ultis";
import {calculateDiscount} from "@/ultis/currency-format";
import {Textarea} from "@nextui-org/input";
import {useMenuData} from "@/hooks/useMenuData";
import {storeToLocalStorage} from "@/ultis/storeToLocalStorage";
import {useRouter} from "next/navigation";

interface OrderModalProps {

};

function OrderModal({}: OrderModalProps) {
    // const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {push } = useRouter();
    const { findItem, addToCart, getItemById, storeItemToLocalStorage} = useMenuData();
    const {isOrderModalOpen, orderId} = useSelector((state: RootState) => state.orderModal);
    const [totalOrder, setTotalOrder] = React.useState<number>(1);
    const [price, setPrice] = React.useState<number>(0);
    const [takeNote, setTakeNote] = React.useState<string>("");
    const orderValueRef = React.useRef<HTMLInputElement>(null);
    const [orderInfo, setOrderInfo] = React.useState<MenuItemType>({
        _id: "" as unknown as ObjectId,
        name: "",
        image: "",
        price: 0,
        description: "",
        total_sold: 0,
        address: "",
        discount: 0,
        type: "morning-menu",
        // category: "",
    });
    const handleAddToCart = () => {
        addToCart(orderInfo, totalOrder, takeNote);
        store.dispatch(closeOrderModal());
    }
    const handleImmediately =() => {
        storeToLocalStorage("order-immediately", {
            ...orderInfo,
            totalOrder,
            takeNote
        });
        store.dispatch(closeOrderModal());
        push("/order?immediately=true&order_id=" + orderInfo._id + "&total_order=" + totalOrder + "&take_note=" + takeNote);
    }
    useEffect(() => {
        if (orderValueRef.current) {
            orderValueRef.current.value = totalOrder.toString();
        }
        if (!isOrderModalOpen) {
            setTotalOrder(1);
        }

    }, [totalOrder, isOrderModalOpen]);

    useEffect(() => {
        const item = findItem(orderId as NonNullable<string>);
        if (item) {
            setOrderInfo(item);
        } else {
           if (orderId) {
               getItemById([orderId] as string[])
                   .then((item) => {
                       // console.log(item)
                       if (item) {
                           setOrderInfo(item[0]);
                           storeItemToLocalStorage(item[0]);
                       }
                   });
           }
        }
    }, [orderId]);

    useEffect(() => {
        setPrice(
            Math.floor(
                orderInfo.price
                - Number(
                    calculateDiscount(
                        String(orderInfo.price),
                        orderInfo.discount || 10
                    )
                )
            )
        );
    }, [orderInfo]);

    return (
       <Modal
           isOpen={isOrderModalOpen}
           onClose={() => store.dispatch(closeOrderModal())}
           placement={'auto'}
           onOpenChange={() => {}}
           className={"z-[999]"}
       >
           <ModalContent>
               {(onClose) => (
                   <>
                       <ModalHeader className={"flex flex-col gap-1"}>
                           Thông tin món
                       </ModalHeader>
                       <ModalBody className={"flex flex-col gap-1"}>
                           <Image
                               shadow="sm"
                               radius="lg"
                               width="100%"
                               alt={orderInfo.name}
                               className="w-full object-cover h-[200px]"
                               src={orderInfo.image}
                           />
                           <div className={"flex flex-col gap-1 border-gray-200 border-b-[5px]"}>
                               <p className={"font-semibold"}>{orderInfo.name}</p>
                               <div className={"flex flex-row justify-between my-1"}>
                                   <div className={"flex flex-col"}>
                                       <p className={"text-default-900 font-semibold text-xl"}>{price}.000đ</p>
                                       <div className={"flex flex-row gap-2 mb-2"}>
                                           <p className={"line-through text-gray-400 text-sm"}>{orderInfo.price}.000đ</p>
                                           <p className={"text-gray-400 text-sm"}>{orderInfo.total_sold} đã bán</p>
                                       </div>
                                   </div>
                                   <div className={"rounded-lg flex flex-row justify-center items-center"}>
                                       <button
                                           onClick={() => setTotalOrder((prev) => {
                                               if (prev === 2 || prev === 1) return 1;
                                               return prev - 1;
                                           })}
                                           className={"rounded text-orange-600 border-orange-600 border-2  w-fit text-xl px-3"}
                                       >-
                                       </button>
                                       <input
                                           className={"w-10 text-center outline-none"}
                                           type={"text"}
                                           ref={orderValueRef}
                                           value={totalOrder}
                                           onChange={(e) => {
                                               const value = e.target.value;
                                               if (isNumber(value) && Number(value) >= 1) {
                                                   setTotalOrder(Number(value));
                                                   //@ts-ignore
                                                   orderValueRef.current.value = totalOrder;
                                               } else {
                                                   //@ts-ignore
                                                   orderValueRef.current.value = totalOrder;
                                               }
                                           }}/>
                                       <button
                                           onClick={() => setTotalOrder((prev) => prev + 1)}
                                           className={"rounded bg-orange-600 border-orange-600 border-2 text-white w-fit text-xl px-3"}
                                       >+
                                       </button>
                                   </div>
                               </div>

                               {/*<p className={"text-gray-500 text-sm mb-2"}>{orderInfo.address}</p>*/}
                           </div>
                           <div className={"flex flex-col my-2"}>
                               <Textarea
                                   variant={"flat"}
                                   // label="Ghi chú"
                                   labelPlacement="outside"
                                   placeholder="Ghi chú thêm cho món ăn của bạn (không bắt buộc)"
                                   color={"default"}
                                   onChange={(e) => setTakeNote(e.target.value)}
                                   className="col-span-12 md:col-span-6 mb-6 md:mb-0 border-orange-600 outline-none"
                               />
                           </div>
                       </ModalBody>
                       <ModalFooter>
                           <div className={"flex flex-row gap-2"}>
                               <Button className={"bg-orange-600 text-white"} onClick={handleAddToCart}>Thêm vào giỏ hàng</Button>
                               <Button className={""} onClick={handleImmediately}>Đặt ngay</Button>
                           </div>
                       </ModalFooter>
                   </>
               )}
           </ModalContent>
       </Modal>
    );
}

export default OrderModal;