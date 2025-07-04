"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, MapPin, Wheat, Sprout } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Produtores", href: "/producers", icon: Users },
  { name: "Fazendas", href: "/farms", icon: MapPin },
  { name: "Safras", href: "/harvests", icon: Wheat },
  { name: "Culturas", href: "/crops", icon: Sprout },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Wheat className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Brain Agriculture</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col px-4 pb-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                prefetch
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:text-green-700 hover:bg-green-50",
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                )}
              >
                <item.icon
                  className={cn(
                    pathname === item.href ? "text-green-700" : "text-gray-400 group-hover:text-green-700",
                    "h-6 w-6 shrink-0",
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
