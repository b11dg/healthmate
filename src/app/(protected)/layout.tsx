import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="flex min-h-full flex-1 flex-col">
            <SiteHeader />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
