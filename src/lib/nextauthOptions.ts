import CredentialsProvider from "next-auth/providers/credentials";
import {AuthOptions, getServerSession} from "next-auth";
import {signIn} from "@/lib/auth/signin";
// import {UserPayload} from "@/types/userInterface";
// import {extractProperties} from "@/helpers/extractProperties";
import {UserSessionPayload} from "@/services/interface.authenticate";

// @ts-ignore
export const nextauthOptions: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge:  24 * 60 * 60, // 24 hours
    },
    providers: [
        CredentialsProvider({
            type: "credentials",
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
                role: {
                    type: "text",
                    optional: true,
                }
            },
            // @ts-ignore
            async authorize(credentials: Record<"password"|"username"|"role", string>) {
                //@ts-ignore
                return await signIn(credentials) as UserSessionPayload;
            }
        }),
        // ...add more providers here
    ],
    pages: {
        signIn: "/auth/signin",
        newUser: "/auth/signup",
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