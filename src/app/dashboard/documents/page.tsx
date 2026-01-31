import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FileText, Download, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/molecules/page-header"
import { formatDate, formatFileSize } from "@/lib/utils/formatters"

export default async function DocumentsPage() {
    const supabase = await createClient()
    
    const { data: documents } = await supabase
        .from('documents')
        .select('*, clients(first_name, last_name), policies(policy_number)')
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Documentos"
                description="Gestión centralizada de todos tus documentos."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Todos los Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Relacionado a</TableHead>
                                    <TableHead>Tamaño</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents && documents.length > 0 ? (
                                    documents.map((doc: any) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                {doc.file_name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{doc.document_type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {doc.clients && `Cliente: ${doc.clients.first_name} ${doc.clients.last_name}`}
                                                {doc.policies && `Póliza: ${doc.policies.policy_number}`}
                                                {!doc.clients && !doc.policies && '-'}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatFileSize(doc.file_size)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(doc.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            No hay documentos registrados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
