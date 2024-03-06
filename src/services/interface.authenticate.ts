export interface BankingMethodUpdate {
    bank: string;
    accountNumber: string;
    accountName: string;
}

export interface UserPasswordUpdate {
    oldPassword: string;
    newPassword: string;
}

export interface UserSessionPayload {
    username: string;
    role: string;
    balance: number;
    uid: string;
    _id: string;
}