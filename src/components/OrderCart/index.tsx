import React from 'react';
import {FaShoppingCart} from "react-icons/fa";

interface OrderCartProps {

};

function OrderCart({}: OrderCartProps) {
    const totalOrder = 0;
    return (
        <div className={"text-orange-600 relative"}>
            <div className={"absolute top-[-10px] right-[-10px] text-xs text-orange-400 bg-orange-50 rounded-full py-[2px] px-[5px] "}>
                {totalOrder}
            </div>
            <FaShoppingCart className={"text-2xl"}/>
        </div>
    );
}

export default OrderCart;