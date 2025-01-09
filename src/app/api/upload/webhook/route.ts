import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const data = await request.body;
    console.log(data);
    return NextResponse.json({ message: "Webhook received" });
}