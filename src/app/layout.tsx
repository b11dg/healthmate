import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const manrope = Manrope({
    variable: "--font-heading",
    subsets: ["latin"],
    weight: ["700", "800"],
});

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "HealthMate",
    description: "Персональный трекер здоровья и AI-разбор анализов",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="ru"
            className={`${manrope.variable} ${inter.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
