"use client"

import { useState } from "react"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProspectCard } from "./prospect-card"
import { updateProspectStatus } from "@/app/dashboard/sales/actions"
import { useRouter } from "next/navigation"
import type { Prospect } from "@/types/sales"
import { PIPELINE_STAGES } from "@/lib/constants/design"

interface KanbanBoardProps {
    initialProspects: Prospect[]
}

export function KanbanBoard({ initialProspects }: KanbanBoardProps) {
    const [prospects, setProspects] = useState(initialProspects)
    const [activeId, setActiveId] = useState<string | null>(null)
    const router = useRouter()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
                delay: 100,
                tolerance: 5,
            },
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) {
            setActiveId(null)
            return
        }

        const prospectId = active.id as string
        const newStatus = over.id as string

        // Update local state optimistically
        setProspects(prev =>
            prev.map(p =>
                p.id === prospectId ? { ...p, status: newStatus as any } : p
            )
        )

        // Update in database via Server Action
        try {
            const result = await updateProspectStatus(prospectId, newStatus)

            if (!result.success) {
                throw new Error(result.error)
            }

            router.refresh()
        } catch (error) {
            console.error('Error updating prospect:', error)
            // Revert optimistic update on error
            setProspects(initialProspects)
        }

        setActiveId(null)
    }

    const getProspectsByStatus = (status: string) => {
        return prospects.filter(p => p.status === status)
    }

    const activeProspect = prospects.find(p => p.id === activeId)

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-[550px] gap-4 overflow-x-auto overflow-y-hidden pb-4 pr-4 overscroll-contain">
                {PIPELINE_STAGES.map(stage => {
                    const stageProspects = getProspectsByStatus(stage.id)

                    return (
                        <div key={stage.id} className="flex h-full w-[300px] min-w-[300px] flex-col rounded-xl bg-muted/50 p-3 shrink-0">
                            <div className="mb-3 flex items-center justify-between px-1">
                                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                                    {stage.label}
                                </span>
                                <Badge variant="secondary" className="bg-background text-xs h-5">
                                    {stageProspects.length}
                                </Badge>
                            </div>

                            <SortableContext
                                id={stage.id}
                                items={stageProspects.map(p => p.id!)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex-1 overflow-y-auto overflow-x-hidden px-0.5 space-y-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                                    {stageProspects.map(prospect => (
                                        <ProspectCard
                                            key={prospect.id}
                                            prospect={prospect}
                                            stageId={stage.id}
                                        />
                                    ))}
                                    {stageProspects.length === 0 && (
                                        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/10 text-xs text-muted-foreground/50">
                                            Arrastra aquí
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </div>
                    )
                })}
            </div>

            <DragOverlay>
                {activeId && activeProspect ? (
                    <div className="w-[290px] rotate-2 cursor-grabbing opacity-95 scale-105">
                        <ProspectCard prospect={activeProspect} stageId={activeProspect.status} isDragging />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
