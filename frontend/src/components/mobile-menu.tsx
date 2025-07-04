"use client"

import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { Menu, X } from "lucide-react"

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger className="p-4 absolute right-0">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] [&>button]:hidden">
        <SheetTitle className="hidden" />
        <Sidebar />
        <SheetClose className="absolute top-4 right-4">
          <X className="h-6 w-6" />
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
