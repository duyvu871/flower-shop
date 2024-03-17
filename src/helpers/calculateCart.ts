import {calculateDiscount} from "@/ultis/currency-format";
import {CartItemType} from "@/contexts/MenuDataContext";

export function calculateCart(cart: CartItemType[]) {
    return cart.reduce(
        (acc, item) =>
            acc
            + Math.floor(
                Number(item.price)
                - Number(
                    calculateDiscount(
                        String(item.price),
                        item.discount
                    )
                )
            )
            * item.totalOrder,
        0)
}