import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions";

const navLinks = [
    { href: "/dashboard", label: "Дашборд" },
    { href: "/labs", label: "Анализы" },
    { href: "/chat", label: "Чат" },
    { href: "/recommendations", label: "Рекомендации" },
    { href: "/profile", label: "Профиль" },
];

export function SiteHeader() {
    return (
        <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
            <Link href="/dashboard">
                <Logo iconSize={26} />
            </Link>
            <nav className="flex items-center gap-5">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
                    >
                        {link.label}
                    </Link>
                ))}
                <ThemeToggle />
                <form action={signOutAction}>
                    <Button type="submit" variant="ghost">
                        Выйти
                    </Button>
                </form>
            </nav>
        </header>
    );
}
