import { NextResponse } from "next/server";
import { createUser, UserAlreadyExistsError } from "@/lib/users";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (
        !email ||
        !password ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return NextResponse.json(
            { error: "Email and password are required" },
            { status: 400 },
        );
    }

    try {
        const user = await createUser(email, password);
        return NextResponse.json(
            { id: user.id, email: user.email },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 },
            );
        }
        console.error("POST /api/register failed", error);
        return NextResponse.json(
            { error: "Service temporarily unavailable" },
            { status: 503 },
        );
    }
}
