import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-6 p-16 text-center">
            <Logo iconSize={40} />
            <p className="max-w-md text-[var(--color-text-secondary)]">
                Персональный трекер здоровья и AI-разбор анализов. В разработке.
            </p>
            <div className="flex gap-3">
                <Link href="/login">
                    <Button variant="secondary">Войти</Button>
                </Link>
                <Link href="/register">
                    <Button>Зарегистрироваться</Button>
                </Link>
            </div>
        </main>
    );
}
