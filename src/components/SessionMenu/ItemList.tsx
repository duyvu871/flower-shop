import {MenuItemType} from "types/order";
import React from "react";
import ShopItemCard from "@/components/Card/ShopItemCard";

const ItemList = ({menuData}: {menuData: MenuItemType[]})  => {
    // console.log(menuData)
    return (
        <>
            {menuData.map((item, index) => (
                <ShopItemCard
                    title={item.name}
                    img={item.image}
                    location={item.address}
                    price={String(item.price)}
                    dishID={item._id as unknown as string}
                    totalSold={item.total_sold}
                    discount={String(item.discount)}
                    key={index}
                />
            ))}
        </>
    )
}
export default ItemList;