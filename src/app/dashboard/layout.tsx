import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <Sidebar />
            <div className="flex flex-1 flex-col lg:pl-[20rem]">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-8 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
