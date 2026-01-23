"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2, X } from "lucide-react"
import { ReviewForm } from "./review-form"
import { uploadAndExtract } from "@/app/actions/policy-import"
import { ExtractedData } from "@/types/domain"
import { cn } from "@/lib/utils"

export function ImportPolicyModal() {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<"upload" | "review">("upload")
    const [isExtracting, setIsExtracting] = useState(false)
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
    const [error, setError] = useState<string | null>(null)

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        
        const file = acceptedFiles[0];
        setIsExtracting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await uploadAndExtract(formData);

            if (result.success && result.data) {
                setExtractedData(result.data);
                setStep("review");
            } else {
                setError(result.error || "Error al procesar el archivo");
            }
        } catch (e) {
            console.error(e);
            setError("Error de conexión al procesar el archivo");
        } finally {
            setIsExtracting(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    });

    const reset = () => {
        setStep("upload");
        setExtractedData(null);
        setError(null);
    }

    const handleSuccess = () => {
        setOpen(false);
        reset();
        // Here we could trigger a toast notification
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) reset();
        }}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Lector IA
                </Button>
            </DialogTrigger>
            <DialogContent className={cn("max-h-[90vh] overflow-y-auto", step === "review" ? "max-w-4xl" : "max-w-md")}>
                <DialogHeader>
                    <DialogTitle>Importar Póliza</DialogTitle>
                    <DialogDescription>
                        {step === "upload" 
                            ? "Sube el PDF de la póliza para extraer los datos automáticamente." 
                            : "Revisa y corrige los datos extraídos antes de guardar."}
                    </DialogDescription>
                </DialogHeader>

                {step === "upload" && (
                    <div className="space-y-4">
                        <div 
                            {...getRootProps()} 
                            className={cn(
                                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[200px]",
                                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50",
                                isExtracting && "pointer-events-none opacity-50"
                            )}
                        >
                            <input {...getInputProps()} />
                            {isExtracting ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="font-medium text-sm text-muted-foreground">Procesando documento...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <FileText className="h-8 w-8 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium">
                                        {isDragActive ? "Suelta el archivo aquí" : "Arrastra tu PDF aquí o haz clic"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Soporta archivos PDF de aseguradoras (GNP, AXA, etc.)
                                    </p>
                                </>
                            )}
                        </div>

                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                                <X className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {step === "review" && extractedData && (
                    <ReviewForm 
                        initialData={extractedData} 
                        onCancel={() => setStep("upload")}
                        onSuccess={handleSuccess}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
