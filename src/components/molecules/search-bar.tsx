"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface SearchBarProps {
  placeholder?: string
  paramName?: string
}

export function SearchBar({ placeholder = "Buscar...", paramName = "q" }: SearchBarProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set(paramName, term)
    } else {
      params.delete(paramName)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 text-sm h-9 sm:h-10"
        defaultValue={searchParams.get(paramName)?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
