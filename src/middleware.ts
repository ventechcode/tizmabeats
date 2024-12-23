import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/utils/crypto";

export async function middleware(req: NextRequest) {
    if (await isAuthenticated(req) === false) {
        return new NextResponse("Unauthroized", { status: 401 , headers: { "WWW-Authenticate": "Basic" }});
    } 
}

async function checkPassword(password: string) {
    const hashedPassword = await hashPassword(password);
    return process.env.ADMIN_PASSWORD === hashedPassword;
}

async function isAuthenticated(req: NextRequest) {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader) return false;

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    const [username, password] = credentials.split(":");
    return username === "admin" && (await checkPassword(password));
}

export const config = {
    matcher: "/admin/:path*",
}