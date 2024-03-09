
interface UserInterface {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: "user"|"admin";
    balance: number;
    id_index: number;
    uid: string;
    virtualVolume: number;
    total_request_withdraw: number;
    address: string;
    cart: string[]; // Update with the actual type for the 'cart' property
    orderHistory: string[]; // Update with the actual type for the 'orderHistory' property
    transactions: string[]; // Update with the actual type for the 'transactions' property
    actionHistory: string[]; // Update with the actual type for the 'actionHistory' property
    withDrawHistory: string[]; // Update with the actual type for the 'withDrawHistory' property
    bankingInfo: {
        bank: string;
        accountNumber: string;
        accountName: string;
    };
}

interface UserPayload {
    username: string;
    email: string;
    bankMethod: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    }
    role: "user"|"admin";
}

export type {UserInterface, UserPayload};