"use client"

import { usePathname } from "next/navigation"

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/producers": "Produtores Rurais",
  "/farms": "Propriedades Rurais",
  "/harvests": "Safras",
  "/crops": "Culturas",
}

export function Header() {
  const pathname = usePathname()
  const pageName = pageNames[pathname] || "Brain Agriculture"

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">{pageName}</h1>
      </div>
    </header>
  )
}
