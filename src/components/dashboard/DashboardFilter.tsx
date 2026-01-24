"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

export function DashboardFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentAgent = searchParams.get("agent") || "all"

    const handleAgentChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === "all") {
            params.delete("agent")
        } else {
            params.set("agent", value)
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <Select value={currentAgent} onValueChange={handleAgentChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por agente" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los agentes</SelectItem>
                    <SelectItem value="Jorge Segoviano">Jorge Segoviano</SelectItem>
                    <SelectItem value="Marcela Segoviano">Marcela Segoviano</SelectItem>
                    <SelectItem value="José Luis Hurtado">José Luis Hurtado</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
