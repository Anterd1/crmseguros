import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  data: T[] | null | undefined
  columns: Column<T>[]
  emptyMessage?: string
  getRowKey: (item: T) => string
  className?: string
  mobileCardRender?: (item: T) => ReactNode
}

export function DataTable<T>({
  data,
  columns,
  emptyMessage = "No hay datos disponibles.",
  getRowKey,
  className,
  mobileCardRender,
}: DataTableProps<T>) {
  const hasData = data && data.length > 0

  return (
    <>
      {/* Vista móvil con cards */}
      {mobileCardRender && (
        <div className="flex flex-col gap-4 md:hidden">
          {!hasData ? (
            <p className="text-center text-muted-foreground py-8 text-sm">{emptyMessage}</p>
          ) : (
            data.map((item) => (
              <div key={getRowKey(item)}>{mobileCardRender(item)}</div>
            ))
          )}
        </div>
      )}
      
      {/* Vista desktop con tabla */}
      <div className={cn("hidden md:block overflow-x-auto", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.headerClassName}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!hasData && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
            {data?.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
