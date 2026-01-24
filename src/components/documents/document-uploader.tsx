"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Upload, Loader2, FileText, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface DocumentUploaderProps {
    clientId?: string;
    policyId?: string;
    claimId?: string;
    onUploadComplete?: () => void;
}

export function DocumentUploader({ clientId, policyId, claimId, onUploadComplete }: DocumentUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [documentType, setDocumentType] = useState("Otro")
    const [description, setDescription] = useState("")
    const supabase = createClient()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        setUploading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            // Upload file to storage
            const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('policy-documents')
                .upload(filePath, selectedFile)

            if (uploadError) throw uploadError

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('policy-documents')
                .getPublicUrl(filePath)

            // Create document record
            const { error: docError } = await supabase
                .from('documents')
                .insert({
                    client_id: clientId,
                    policy_id: policyId,
                    claim_id: claimId,
                    file_name: selectedFile.name,
                    file_type: selectedFile.type,
                    file_size: selectedFile.size,
                    file_url: urlData.publicUrl,
                    storage_path: filePath,
                    document_type: documentType,
                    description,
                    uploaded_by: user.id
                })

            if (docError) throw docError

            setSelectedFile(null)
            setDescription("")
            if (onUploadComplete) onUploadComplete()

        } catch (error) {
            console.error('Upload error:', error)
            alert('Error al subir el archivo')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label>Tipo de Documento</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Identificación">Identificación</SelectItem>
                        <SelectItem value="Comprobante">Comprobante de Domicilio</SelectItem>
                        <SelectItem value="Póliza">Póliza</SelectItem>
                        <SelectItem value="Factura">Factura</SelectItem>
                        <SelectItem value="CSF">Constancia Fiscal</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Descripción (opcional)</Label>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del documento..."
                />
            </div>

            <div className="grid gap-2">
                <Label>Archivo</Label>
                <input
                    type="file"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
            </div>

            {selectedFile && (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full"
            >
                {uploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subiendo...
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        Subir Documento
                    </>
                )}
            </Button>
        </div>
    )
}
