import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
    const session = await auth();
    if (session) redirect("/dashboard");

    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
            <Logo iconSize={32} />
            <RegisterForm />
        </main>
    );
}
