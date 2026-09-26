import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
    const session = await auth();
    if (session) redirect("/dashboard");

    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
            <Logo iconSize={32} />
            <LoginForm />
        </main>
    );
}
