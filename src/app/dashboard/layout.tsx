import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-transparent">
            <Sidebar />
            <div className="flex flex-1 min-h-0 flex-col lg:pl-72">
                <Header />
                <main className="flex flex-1 min-h-0 flex-col overflow-y-auto overflow-x-hidden px-6 py-4 lg:px-10 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
