import React, {useLayoutEffect} from 'react';
import {Button, Image, Spinner} from "@nextui-org/react";
import {calculateDiscount, formatCurrency} from "@/ultis/currency-format";
import {CartItemType} from "@/contexts/MenuDataContext";
import {useToast} from "@/hooks/useToast";

interface OrderManagementProps {
_id: string;
};

function OrderManagement({_id}: OrderManagementProps) {
    const [cartTemp, setCartTemp] = React.useState<CartItemType[]>([]);
    const [totalPrice, setTotalPrice] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const {error, success} = useToast();
    useLayoutEffect(() => {
        setIsLoading(true);
        fetch('/api/v1/admin/order/get-order-details?id=' + _id).then(async (res) => {
            const data = await res.json();
            if (res.status !== 200) {
                error(data.error)
                return;
            }
            setCartTemp(data.data);
            let total = 0;
            data.data.forEach(item => {
                total += Math.floor(Number(item.price) - Number(calculateDiscount(String(item.price), item.discount))) * item.totalOrder;
            });
            setTotalPrice(total);
            setIsLoading(false);
        });
    }, [_id])

    return (
        <>
            {isLoading
                ? <Spinner size="lg" color={"primary"}/>
                : (
                    <div className={"flex flex-col justify-center items-center gap-4"}>
                        <div className={"w-full flex flex-col justify-center items-center p-5"}>
                            {cartTemp.map((item, index) => {
                                const price = Math.floor(Number(item.price) - Number(calculateDiscount(String(item.price), item.discount)));
                                //@ts-ignore
                                // if (!item.delete_or_select && isPayAll) return null;

                                return (
                                    <div key={index}
                                         className={"w-full flex flex-row justify-between items-start gap-2 my-1"}>
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
                                                <span
                                                    className={"text-sm font-semibold line-clamp-2"}>{item.name}</span>
                                                <span className={"font-bold"}>{price}.000đ</span>
                                            </div>
                                        </div>
                                        <div className={" h-full flex flex-col gap-1 w-[25%] justify-end items-end"}>
                                            <span className={"text-sm font-semibold"}>Số lượng: {item.totalOrder}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={"flex flex-row gap-2"}>
                            <div className={""}>
                                <span
                                    className={"text-xl font-bold"}>Tổng cộng: {formatCurrency(totalPrice.toString())},000đ</span>
                            </div>
                            {/*<Button className={"bg-blue-600 text-white"} onClick={() => {}}>Lưu</Button>*/}
                            {/*<Button className={"bg-red-500 text-white"} onClick={() => {}}>Xóa</Button>*/}
                        </div>
                    </div>
                )}
        </>
    );
}

export default OrderManagement;