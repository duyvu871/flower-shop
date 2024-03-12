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

interface OrderModalProps {

};

function OrderModal({}: OrderModalProps) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { menuData, findItem,  } = useContext(MenuDataContext);
    const {isOrderModalOpen, orderId} = useSelector((state: RootState) => state.orderModal);
    const [totalOrder, setTotalOrder] = React.useState<number>(1);
    const orderValueRef = React.useRef<HTMLInputElement>(null);
    const [orderInfo, setOrderInfo] = React.useState<MenuItemType>({
        _id: "" as unknown as ObjectId,
        name: "",
        image: "",
        price: 0,
        description: "",
        total_sold: 0,
        address: "",
        // category: "",
    });

    useEffect(() => {
        if (orderValueRef.current) {
            orderValueRef.current.value = totalOrder.toString();
        }
    }, [totalOrder]);

    useEffect(() => {
        const item = findItem(orderId);
        if (item) {
            setOrderInfo(item);
        }
    }, [orderId]);

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
                               <div className={"flex flex-row justify-between my-2"}>
                                   <p className={"text-default-900 font-semibold text-xl"}>{orderInfo.price}.000đ</p>
                                   <div className={"rounded-lg flex flex-row justify-center items-center"}>
                                       <button
                                           onClick={() => setTotalOrder((prev) => {
                                                  if (prev ==12) return 1;
                                                  return prev - 1;
                                           })}
                                           className={"rounded text-orange-600 border-orange-600 border-2 w-fit text-xl px-3"}
                                       >-</button>
                                       <input
                                           className={"w-10 text-center outline-none"}
                                           type={"number"}
                                           ref={orderValueRef}
                                           value={totalOrder}
                                           onChange={(e) => {
                                               const value = e.target.value;
                                               if (isNumber(value) && Number(value) > 1) {
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
                                       >+</button>
                                   </div>
                               </div>
                               <p className={"text-gray-500 text-sm"}>{orderInfo.address}</p>
                           </div>

                           <div></div>
                       </ModalBody>
                       <ModalFooter>
                           <div className={"flex flex-row gap-2"}>

                               <Button className={"bg-orange-600 text-white"}>Thêm vào giỏ hàng</Button>
                               <Button className={""}>Đặt ngay</Button>
                           </div>
                       </ModalFooter>
                   </>
               )}
           </ModalContent>
       </Modal>
    );
}

export default OrderModal;