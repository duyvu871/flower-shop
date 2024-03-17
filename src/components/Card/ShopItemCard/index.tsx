import React from 'react';
import {Button, Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import {FaCartPlus} from "react-icons/fa";
import store from "@/redux/store";
import {openOrderModal} from "@/redux/action/openOrderModal";
import {calculateDiscount} from "@/ultis/currency-format";

interface ShopItemCardProps {
    title: string;
    img: string;
    price: string;
    location: string;
    dishID: string;
    totalSold: number;
    discount: string;
};

function ShopItemCard({title, img, price, location, dishID, totalSold, discount}: ShopItemCardProps) {

    return (
        <Card
            shadow="sm"
            isPressable
            onPress={() => {
                store.dispatch(openOrderModal(dishID))
                // console.log(dishID)
            }}
            className={"m-2"}
            key={dishID}
        >
          <CardBody className="overflow-visible p-0 sendtocart">
              <Image
                   shadow="sm"
                   radius="lg"
                   width="100%"
                   alt={title}
                   className="w-full object-cover h-[140px]"
                   src={img}
              />
              <div
                  className={"absolute right-0 p-3 text-xl text-white bg-orange-600 z-[20] rounded-bl-xl hover:bg-orange-500"}
                  onClick={() => console.log("add to cart", dishID)}
              >
                  <FaCartPlus />
              </div>
          </CardBody>
            <CardFooter className="text-small flex-col justify-start items-start">
                <b className={"text-start line-clamp-2 h-[40px]"}>{title}</b>
                <p className={"line-clamp-3 text-gray-500 text-start my-1 h-[60px]"}>{location}</p>
                <div className={"flex justify-between w-full"}>
                    <p className="text-default-900 font-semibold my-1">{Math.floor(Number(price) - Number(calculateDiscount(String(price), discount)))}.000đ</p>
                    <p className="text-default-500 my-1">{totalSold} đã bán</p>
                </div>
                <div className={"cart-item"}></div>
            </CardFooter>
        </Card>
    );
}

export const ShopItemCardMemo = React.memo(ShopItemCard);
export default ShopItemCard;

