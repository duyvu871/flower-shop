import {MenuItemType} from "types/order";
import React from "react";
import {ShopItemCardMemo} from "@/components/Card/ShopItemCard";



const ItemList = ({menuData}: {menuData: MenuItemType[]})  => {
    return (
        <>
            {menuData.map((item, index) => (
                <ShopItemCardMemo
                    title={item.name}
                    img={item.image}
                    location={item.address}
                    price={String(item.price)}
                    dishID={item._id as unknown as string}
                    totalSold={item.total_sold}
                    key={index}
                />
            ))}
        </>
    )
}
export default ItemList;