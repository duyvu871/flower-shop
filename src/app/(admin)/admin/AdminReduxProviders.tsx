"use client";
import { Provider } from 'react-redux';
import store from "@/adminRedux/store";

export default function ReduxProviders({children}: {children: React.ReactNode}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}