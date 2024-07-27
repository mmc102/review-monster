"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import {
    FileStack,
    PanelLeft,
    Home,
    LineChart,
    Settings,
    Users2,
} from "lucide-react"
import { usePathname } from "next/navigation"

export default function MobileMenu() {

    const route = usePathname()

    const isActive = (path: string) => {
        return route === path;
    }

    return (
        <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
                <SheetTrigger asChild>
                    <Link
                        href="/protected/dashboard"
                        className={`flex items-center gap-4 px-2.5 ${isActive('/protected/dashboard') ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                        <Users2 className="size-5" />
                        All Reviews
                    </Link>
                </SheetTrigger>

                <SheetTrigger asChild>
                    <Link
                        href="/protected/review-queue"
                        className={`flex items-center gap-4 px-2.5 ${isActive('/protected/review-queue') ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                        <FileStack className="size-5" />
                        Review Queue
                    </Link>
                </SheetTrigger>
                <SheetTrigger asChild>

                    <Link
                        href="/protected/analytics"
                        className={`flex items-center gap-4 px-2.5 ${isActive('/protected/analytics') ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                        <LineChart className="size-5" />
                        Analytics
                    </Link>

                </SheetTrigger>

                <SheetTrigger asChild>
                    <Link
                        href="/protected/settings"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Settings className="size-5" />
                        Settings
                    </Link>
                </SheetTrigger>
            </nav>
        </SheetContent>

    )
}