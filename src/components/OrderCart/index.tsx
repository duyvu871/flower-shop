import React, {useContext, useEffect, useRef} from 'react';
import {FaShoppingCart} from "react-icons/fa";
import {MenuDataContext} from "@/contexts/MenuDataContext";
import {useRouter} from "next/navigation";
import {useMenuData} from "@/hooks/useMenuData";
import store from "@/redux/store";

interface OrderCartProps {

};

function OrderCart({}: OrderCartProps) {
    const {cart} = useMenuData();
    const { push } = useRouter()
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
    }, [cart]);
    return (
        <div className={"text-white relative cart"} ref={cartRef} onClick={() => {
            store.dispatch({type: 'OPEN_CART_MODAL'})
        }}>
            <div className={"absolute top-[-10px] right-[-10px] text-xs bg-navbar bg-orange-50 rounded-full py-[2px] px-[5px] "}>
                {cart.length}
            </div>
            <FaShoppingCart className={"text-2xl"}/>
        </div>
    );
}

export default OrderCart;