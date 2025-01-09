import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    if (request.method !== 'POST') {
        return NextResponse.json("Method not allowed", { status: 405 });
    }

    const data = await request.json();
    console.log('Received URL: ' + data.url);
    return NextResponse.json({ message: "Webhook received" });
}