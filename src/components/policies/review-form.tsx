"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Client, Policy, ExtractedData } from "@/types/domain"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { savePolicy } from "@/app/actions/policy-import"
import { Loader2 } from "lucide-react"

// Schema definition matching our Domain Types
const formSchema = z.object({
    client: z.object({
        type: z.enum(["Física", "Moral"]),
        first_name: z.string().min(1, "Requerido"), // Used as Razon Social for Moral
        last_name: z.string().optional(),
        rfc: z.string().min(10, "RFC inválido"),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional(),
        address: z.object({
            street: z.string().optional(),
            exteriorNumber: z.string().optional(),
            neighborhood: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
        }).optional(),
    }),
    policy: z.object({
        policy_number: z.string().min(1, "Requerido"),
        company: z.string().min(1, "Requerido"),
        type: z.string().min(1, "Requerido"),
        start_date: z.string().min(1, "Requerido"),
        end_date: z.string().min(1, "Requerido"),
        payment_frequency: z.enum(["Mensual", "Trimestral", "Semestral", "Anual", "Pago Único"]),
        financial_data: z.object({
            netPremium: z.coerce.number().min(0),
            taxAmount: z.coerce.number().min(0),
            totalPremium: z.coerce.number().min(0),
            currency: z.enum(["MXN", "USD", "EUR", "UDIS"]),
        }),
    }),
})

interface ReviewFormProps {
    initialData: ExtractedData;
    fileInfo?: { buffer: Buffer; fileName: string; fileType: string } | null;
    onCancel: () => void;
    onSuccess: () => void;
}

export function ReviewForm({ initialData, fileInfo, onCancel, onSuccess }: ReviewFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [showDebug, setShowDebug] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            client: {
                type: initialData.client.type || "Física",
                first_name: initialData.client.first_name || "",
                last_name: initialData.client.last_name || "",
                rfc: initialData.client.rfc || "",
                email: initialData.client.email || "",
                phone: initialData.client.phone || "",
                address: initialData.client.address || {},
            },
            policy: {
                policy_number: initialData.policy.policy_number || "",
                company: initialData.policy.company || "",
                type: initialData.policy.type || "",
                start_date: initialData.policy.start_date || "",
                end_date: initialData.policy.end_date || "",
                payment_frequency: initialData.policy.payment_frequency || "Anual",
                financial_data: {
                    netPremium: initialData.policy.financial_data?.netPremium || 0,
                    taxAmount: initialData.policy.financial_data?.taxAmount || 0,
                    totalPremium: initialData.policy.financial_data?.totalPremium || 0,
                    currency: initialData.policy.financial_data?.currency || "MXN",
                },
            },
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true);
        try {
            console.log("=== SUBMITTING POLICY ===");
            console.log(JSON.stringify(values, null, 2));
            
            const result = await savePolicy({
                ...values,
                pdfFile: fileInfo
            } as any); 
            
            console.log("=== SAVE RESULT ===");
            console.log(result);
            
            if (result.success) {
                onSuccess();
            } else {
                console.error("Save failed:", result.error);
                alert("Error al guardar: " + result.error);
            }
        } catch (e) {
            console.error("Submit error:", e);
            alert("Error desconocido al guardar");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Debug Panel */}
                <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Modo Debug</span>
                        {initialData.confidence_score !== undefined && (
                            <span className="text-xs text-muted-foreground">
                                Confianza: {(initialData.confidence_score * 100).toFixed(0)}%
                            </span>
                        )}
                    </div>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowDebug(!showDebug)}
                    >
                        {showDebug ? "Ocultar" : "Ver JSON Raw"}
                    </Button>
                </div>

                {showDebug && (
                    <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto max-h-60 text-xs font-mono">
                        <pre>{JSON.stringify(initialData, null, 2)}</pre>
                    </div>
                )}
                
                {/* Datos del Contratante */}
                <div className="rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-4">
                    <h3 className="mb-4 text-lg font-semibold text-primary">Datos del Contratante</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="client.type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Persona</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Física">Física</SelectItem>
                                            <SelectItem value="Moral">Moral</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="client.first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre / Razón Social</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="client.rfc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>RFC</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="client.address.street"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Calle</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="client.address.city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ciudad</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="client.address.zipCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>C.P.</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Información de la Póliza */}
                <div className="rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-4">
                    <h3 className="mb-4 text-lg font-semibold text-primary">Información de la Póliza</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="policy.policy_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No. Póliza</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="policy.company"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Aseguradora</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="policy.type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ramo</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="policy.start_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inicio Vigencia</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="policy.end_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fin Vigencia</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="policy.payment_frequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Frecuencia</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {["Mensual", "Trimestral", "Semestral", "Anual", "Pago Único"].map(f => (
                                                <SelectItem key={f} value={f}>{f}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="policy.financial_data.netPremium"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prima Neta</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="policy.financial_data.taxAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>IVA</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="policy.financial_data.totalPremium"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prima Total</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Póliza
                    </Button>
                </div>
            </form>
        </Form>
    )
}
