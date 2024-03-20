"use client";
import React, {useEffect} from 'react';
import {Button, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import store from "@/redux/store";
import {RootState} from "@/redux/reducers";
import {useSelector} from "react-redux";
import {useMenuData} from "@/hooks/useMenuData";
import {ObjectId} from "mongodb";
import {tw} from "@/ultis/tailwind.ultis";
import {calculateDiscount, formatCurrency} from "@/ultis/currency-format";
import {calculateCart} from "@/helpers/calculateCart";
import {useRouter} from "next/navigation";

interface CartModalProps {
    
};

function CartModal({}: CartModalProps) {
    const {push} = useRouter();
    const isCartModalOpen = useSelector((state: RootState) => state.orderModal.isCartModalOpen);
    const {cart, updateCart: updateCartState, removeFromCart} = useMenuData();
    const [deleteItems, setDeleteItems] = React.useState<Record<string, boolean>>({});
    const [orderQuantity, setOrderQuantity] = React.useState<Record<string, number>>({});
    const [totalPayment, setTotalPayment] = React.useState<number>(0);
    const [isPreventDelete, setIsPreventDelete] = React.useState<boolean>(true);
    const orderValueRef = React.useRef<HTMLInputElement>(null);

    const handlePayToBill = () => {
        push("/order");
        console.log("pay to bill");
    }
    const handleDeleteList = (itemId: string) => {
        setDeleteItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [itemId]: !prevCheckedItems[itemId],
        }));
    };
    const handleItemQuantity = (itemId: string, quantity: string) => {
        const parsedValue = parseInt(quantity);
        if (!isNaN(parsedValue) && parsedValue >= 1) {
            setOrderQuantity((prevInputValues) => ({
                ...prevInputValues,
                [itemId]: parsedValue,
            }));
        } else {
            setOrderQuantity((prevInputValues) => ({
                ...prevInputValues,
                [itemId]: 1,
            }));
        }
    }
    const handleRemoveFromCart = (itemIds: string[]) => {
        itemIds.forEach((id) => {
            removeFromCart(id);
        })
    }
    const minusTotalOrder = (_id: string) => {
        const findItem = cart.find(item => item._id === _id as unknown as ObjectId);
        if (!findItem) return;
        const newTotalOrder = findItem.totalOrder - 1;
        if (newTotalOrder < 1) return;
        updateCart('totalOrder', newTotalOrder, _id);
    }
    const plusTotalOrder = (_id: string) => {
        const findItem = cart.find(item => item._id === _id as unknown as ObjectId);
        if (!findItem) return;
        const newTotalOrder = findItem.totalOrder + 1;
        updateCart('totalOrder', newTotalOrder, _id);
    }

    const updateCart = (key: string, value: string | number, _id: ObjectId | string) => {
        const findItem = cart.find(item => item._id === _id);
        if (!findItem) return;
        const updatedItem = {...findItem, [key]: value};
        const updatedCart = cart.map(item => item._id === _id ? updatedItem : item);
        updateCartState(updatedCart);
    }

    useEffect(() => {
        setOrderQuantity((prev) => {
            return cart.reduce((acc, item) => {
                return {...acc, [item._id as unknown as string]: item.totalOrder};
            }, {});
        });
        setTotalPayment(calculateCart(cart));
    }, [cart]);

    useEffect(() => {
        const checkedItems = Object.entries(deleteItems).filter(([_, value]) => value).map(([key, _]) => key);
        if (checkedItems.length > 0) {
            setIsPreventDelete(false);
        } else {
            setIsPreventDelete(true);
        }
    }, [deleteItems]);

    return (
        <Modal
            isOpen={isCartModalOpen}
            onClose={() => store.dispatch({type: 'CLOSE_CART_MODAL'})}
            placement={'top-center'}
            onOpenChange={() => {
            }}
            className={"z-[999]"}
            closeButton={<></>}
            scrollBehavior={"inside"}
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                }
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className={"flex flex-col gap-1"}>
                            Giỏ hàng của bạn ({cart.length})
                        </ModalHeader>
                        <ModalBody className={"flex flex-col gap-1 px-5"}>
                            {cart.map((item, index) => {
                                const price = Math.floor(Number(item.price) - Number(calculateDiscount(String(item.price), item.discount)));
                                return (
                                <div key={index} className={"w-full flex flex-row justify-between items-start gap-2 my-1"}>
                                    <div className={"flex flex-row justify-center items-start gap-2 w-[70%]"}>
                                        <div>
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    handleDeleteList(item._id as unknown as string);
                                                }}
                                                checked={deleteItems[item._id as unknown as string]}
                                                className={"mr-1 p-1 w-5 aspect-square text-orange-600 bg-orange-600 accent-orange-600"}
                                            />
                                        </div>
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
                                        <div className={"flex flex-row justify-between"}>
                                            <button
                                                onClick={() => minusTotalOrder(item._id as unknown as string)}
                                                className={"rounded text-orange-600 border-orange-600 border-2  w-fit text-sm px-1"}
                                            >-
                                            </button>
                                            <input
                                                className={"w-8 text-center outline-none"}
                                                type={"text"}
                                                pattern={"[0-9]*"}
                                                inputMode={"numeric"}
                                                ref={orderValueRef}
                                                value={orderQuantity[item._id as unknown as string]}
                                                onChange={(e) => handleItemQuantity(item._id as unknown as string, e.target.value)
                                                }/>
                                            <button
                                                onClick={() => plusTotalOrder(item._id as unknown as string)}
                                                className={"rounded bg-orange-600 border-orange-600 border-2 text-white w-fit text-sm px-1"}
                                            >+
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </ModalBody>
                        <ModalFooter>
                            <div className={"flex flex-col justify-center items-start w-full gap-2"}>
                                <div className={"flex flex-row justify-between gap-2"}>
                                    <span className={"font-semibold"}>Tổng cộng:</span>
                                    <span
                                        className={"font-bold"}>{formatCurrency(totalPayment.toString()).replaceAll(",", ".")}.000đ</span>
                                </div>
                                <div className={"flex justify-between items-center w-full"}>
                                    <Button className={"bg-orange-600 text-white"} onClick={handlePayToBill}>Thanh toán</Button>
                                    <Button
                                        disabled={isPreventDelete}
                                        className={tw("bg-red-600 text-white", isPreventDelete ? "bg-gray-400 cursor-not-allowed" : "")}
                                        onClick={() => handleRemoveFromCart(Object.keys(deleteItems).filter((key) => deleteItems[key]))}
                                    >Xóa</Button>
                                </div>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default CartModal;