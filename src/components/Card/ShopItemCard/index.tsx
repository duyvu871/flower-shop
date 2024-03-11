import React from 'react';
import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";

interface ShopItemCardProps {
    title: string;
    img: string;
    price: string;
    location: string;
};

function ShopItemCard({title, img, price, location}: ShopItemCardProps) {

    return (
        <Card
            shadow="sm"
            isPressable
            onPress={() => console.log("item pressed")}
            className={"m-2"}
        >
          <CardBody className="overflow-visible p-0">
              <Image
                   shadow="sm"
                   radius="lg"
                   width="100%"
                   alt={title}
                   className="w-full object-cover h-[140px]"
                   src={img}
              />
              <div className={""}></div>
          </CardBody>
           <CardFooter className="text-small flex-col justify-start items-start">
               <b className={"text-start line-clamp-2 h-[40px]"}>{title}</b>
               <p className={"line-clamp-3 text-gray-500 text-start my-1 h-[60px]"}>{location}</p>
               <p className="text-default-900 font-semibold my-1">{price}.000đ</p>
           </CardFooter>
        </Card>
    );
}

export default ShopItemCard;

