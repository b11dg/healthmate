import { Logo } from "@/components/logo";

export default function Home() {
    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-16 text-center">
            <Logo iconSize={40} />
            <p className="max-w-md text-[var(--color-text-secondary)]">
                Персональный трекер здоровья и AI-разбор анализов. В разработке.
            </p>
        </main>
    );
}
