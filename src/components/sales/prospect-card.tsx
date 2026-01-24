"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, GripVertical } from "lucide-react"
import Link from "next/link"
import type { Prospect } from "@/types/sales"

interface ProspectCardProps {
    prospect: Prospect
    stageId: string
    isDragging?: boolean
}

export function ProspectCard({ prospect, stageId, isDragging = false }: ProspectCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ 
        id: prospect.id!,
        data: { prospect, stageId }
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className={`group relative cursor-grab active:cursor-grabbing border-0 shadow-sm transition-all hover:shadow-md ${isDragging ? 'shadow-xl ring-2 ring-primary/20 rotate-2' : 'bg-card'}`}>
                <CardContent className="p-3">
                    <div className="mb-2">
                        <Link 
                            href={`/dashboard/sales/${prospect.id}`}
                            className="block font-medium text-sm text-foreground hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()} // Prevent drag when clicking link
                        >
                            {prospect.first_name} {prospect.last_name}
                        </Link>
                        {prospect.company_name && (
                            <p className="text-[11px] text-muted-foreground truncate">{prospect.company_name}</p>
                        )}
                    </div>

                    {prospect.interested_in && prospect.interested_in.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {prospect.interested_in.slice(0, 2).map(product => (
                                <span key={product} className="inline-flex items-center rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                    {product}
                                </span>
                            ))}
                            {prospect.interested_in.length > 2 && (
                                <span className="inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    +{prospect.interested_in.length - 2}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        {prospect.priority === 'Alta' ? (
                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-normal">
                                Alta
                            </Badge>
                        ) : (
                            <div /> 
                        )}
                        
                        {prospect.next_followup_date && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground" title="Próximo seguimiento">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {new Date(prospect.next_followup_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
