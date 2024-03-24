// app/create-admin/route.ts
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function GET() {
    const client = await clientPromise;
    const adminCollection = client.db(process.env.DB_NAME).collection("admin");

    const admin = await adminCollection.findOne({ email: "admin@role.com" });
    if (admin) {
        return NextResponse.json({ success: false, message: "Admin already exists" });
    }

    const password = bcrypt.hashSync("adminrole", 10);
    await adminCollection.insertOne({
        email: "admin@role.com",
        password: password,
        role: "admin",
    });

    return NextResponse.json({ success: true });
}
