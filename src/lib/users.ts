import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export class UserAlreadyExistsError extends Error {}

export async function createUser(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new UserAlreadyExistsError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({ data: { email, hashedPassword } });
}
