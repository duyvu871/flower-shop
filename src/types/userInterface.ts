
interface UserInterface {
    username: string;
    role: "user"|"admin";
    password?: string;
    bankingInfo: {
        bank: string;
        accountNumber: string;
        accountName: string;
    }
    balance: number;
    uid: string;
    transactions: string[];
    actionHistory: string[];
    withDrawHistory: string[];
    // access_token: string;
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