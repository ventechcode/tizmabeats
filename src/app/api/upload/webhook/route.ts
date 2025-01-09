import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const data = await request.json();
    console.log('Received URL: ' + data.url);
    return NextResponse.json({ message: "Webhook received" });
}