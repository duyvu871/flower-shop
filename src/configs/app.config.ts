const AppConfig = {
    mainApiUrl: 'http://localhost:3000',
    url: {
        main: 'http://localhost:3000',
        pages: {
            dashboard: "/dashboard",
            home: "/",
        },
        path: {
            auth: {
                signIn: '/api/auth/signin',
                signUp: "/api/v1/auth/sign-up"
            },
            info: {
                userData: "/api/v1/info/get-user-data",
                withdrawalHistory: "/api/v1/info/get-withdrawal-history",
                search: "/api/v1/info/search-engine",
            },
            order: {
                withdraw: "/api/v1/order/withdraw",
                createOrder: "/api/v1/order/create-order",
            },
        }
    },
    liveChat: {
        license: 16898652
    }
}

export function combinePath(path: string) {
    return AppConfig.url.main + path;
}

export default AppConfig;