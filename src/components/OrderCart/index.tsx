import React, {useEffect, useRef} from 'react';
import {FaShoppingCart} from "react-icons/fa";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/reducers";

interface OrderCartProps {

};

function OrderCart({}: OrderCartProps) {
    const totalOrders = useSelector((state: RootState) => state.cart.items.length);
    const cartRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (cartRef.current) {
            cartRef.current.style.setProperty("animation", "shake 0.5s");
            setTimeout(() => {
                cartRef.current?.style.removeProperty("animation");
            }, 500);
        }
        // return () => {
        //     if (cartRef.current) {
        //         cartRef.current.style.removeProperty("animation");
        //     }
        // }
    }, [totalOrders]);
    return (
        <div className={"text-orange-600 relative cart"} ref={cartRef}>
            <div className={"absolute top-[-10px] right-[-10px] text-xs text-orange-400 bg-orange-50 rounded-full py-[2px] px-[5px] "}>
                {totalOrders}
            </div>
            <FaShoppingCart className={"text-2xl"}/>
        </div>
    );
}

export default OrderCart;