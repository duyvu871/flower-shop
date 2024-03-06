

// declare module "order-types" {
    import {ObjectId} from "mongodb";

    export interface OrderType {
        _id: ObjectId;
        userId: ObjectId;
        type: "withdrawal" | "refill";
        volume: number;
        promotions: number;
        status: "pending" | "approved" | "rejected";
        isHandled: boolean;
        handlerId: ObjectId;
        receive: number;
        createdAt: Date;
        updatedAt: Date;
    }
    export enum OrderStatus {
        'pending' = 'Chờ xử lý',
        'approved' = 'Đã xử lý',
        'rejected' = 'Từ chối'
    }
    export type OrderStatusType = keyof typeof OrderStatus;
    export interface BetResult {
        _id: ObjectId;
        userId: ObjectId;
        orderId: ObjectId;
        bet: number;
        win: number;
        createdAt: Date;
    }
// }
