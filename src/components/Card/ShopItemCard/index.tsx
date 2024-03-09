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
        <Card shadow="sm" isPressable onPress={() => console.log("item pressed")}>
          <CardBody className="overflow-visible p-0">
              <Image
                   shadow="sm"
                   radius="lg"
                   width="100%"
                   alt={title}
                   className="w-full object-cover h-[140px]"
                   src={img}
              />
          </CardBody>
           <CardFooter className="text-small justify-between">
               <b>{title}</b>
               <p className={"line-clamp-1 text-gray-500"}>{location}</p>
               <p className="text-default-500">{price}</p>
           </CardFooter>
        </Card>
    );
}

export default ShopItemCard;

