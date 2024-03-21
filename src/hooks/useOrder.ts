import {MenuItemType, OrderType, PurchaseOrderType} from "types/order";
import {useLayoutEffect, useState} from "react";
import {routePaths} from "@/ultis/api-route.ultis";
import {useSession} from "next-auth/react";

export function useOrder() {
    const session = useSession();
    const [userId, setUserId] = useState("");
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const getPurchaseOrders = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(routePaths.purchaseOrder + `?page=1&id=${id}`);
            const data = await response.json();
            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }
            setOrders(data.data);
            setLoading(false);
            return data as {
                data: PurchaseOrderType[],
                page: number,
                limit: number,
                perPage: number
            }
        } catch (e: any) {
            setError(e.message as string);
            setLoading(false);
        }
    }

    const createPurchaseOrder = async (amount: number, userId: string, isPaid: boolean, items: {id: string, quantity: number}[]) => {
        setLoading(true);
        try {
            const response = await fetch(routePaths.purchaseOrder, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({amount, userId, isPaid, items})
            });
            const data = await response.json();
            if (data.error) {
                setError(data.error);
                setLoading(false);
                return data as {
                    error: string
                };
            }
            setSuccess(true);
            setLoading(false);
            return data as {
                data: PurchaseOrderType,
                message: string
            };
        } catch (e: any) {
            setError(e.message as string);
            setLoading(false);
            return {
                error: e.message
            };
        }
    }

    const createOrder = async (cart: MenuItemType[], location: string, takeNote: string) => {
        const response = await fetch(routePaths.createOrder, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({cart, location, takeNote})
        });
        return await response.json();
    }
    const getOrders = async (uid: string) => {
        const response = await fetch(routePaths.getOrder + `?id=${uid}`);
        return await response.json();
    }

    useLayoutEffect(() => {
        if (session.data) {
            setUserId(session.data.user._id);
        }
    }, [session.data]);

    return {
        getOrders,
        createOrder,
        createPurchaseOrder,
        getPurchaseOrders,
        orders,
        setOrders,
        loading,
        setLoading,
        error,
        setError,
        success,
        setSuccess,
    }
}