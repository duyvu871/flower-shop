import NextAuth, { DefaultSession } from "next-auth"
import {UserSessionPayload} from "@/services/interface.authenticate";
import {ObjectId} from "mongodb";

declare module "next-auth" {
    interface Session {
        user: UserSessionPayload
            & DefaultSession["user"]
    }
    interface NextAuthUser extends UserSessionPayload, DefaultSession["user"] {}
}