import CredentialsProvider from "next-auth/providers/credentials";
import {AuthOptions, getServerSession} from "next-auth";
import {signIn} from "@/lib/auth/signin";
import {UserPayload} from "@/types/userInterface";
import {extractProperties} from "@/helpers/extractProperties";
import {UserSessionPayload} from "@/services/interface.authenticate";

export const nextauthOptions: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge:  30 * 60, // 30 minutes
    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: {
                    // label: "Username",
                    type: "text",
                },
                password: {
                    // label: "Password",
                    type: "password",
                },
            },
            // @ts-ignore
            async authorize(credentials) {
                return await signIn(credentials) as UserSessionPayload;
            },
        }),
        // ...add more providers here
    ],
    pages: {
        signIn: "",
        newUser: "",
    },
    callbacks: {
        async jwt({token, account, user}) {
            if (user) {
                token.user_data = user as unknown as UserSessionPayload;
            }
            return token;
        },
        async session({session, token}) {
            session.user = token.user_data as UserSessionPayload;
            return session;
        },
    }
};

export const getServerAuthSession = () => getServerSession(nextauthOptions)
export default nextauthOptions;