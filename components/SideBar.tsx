'use client'

import Link from "next/link"

import {
} from "lucide-react"
import {
    FileStack,
    Home,
    LineChart,
    Users2,
} from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { usePathname } from 'next/navigation'

export function SideBar() {

    const route = usePathname()

    const isActive = (path: string) => {
        return route === path;
    }
    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 py-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/protected/dashboard"
                                className={`flex size-9 items-center justify-center rounded-lg transition-colors md:size-8 ${isActive('/protected/dashboard') ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                                <Home className="hidden size-5" />
                                <span className="sr-only">Dashboard</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Dashboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/protected/dashboard"
                                className={`flex size-9 items-center justify-center rounded-lg transition-colors md:size-8 ${isActive('/protected/dashboard') ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                                <Users2 className="size-5" />
                                <span className="sr-only">Reviews</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Reviews</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/protected/review-queue"
                                className={`flex size-9 items-center justify-center rounded-lg transition-colors md:size-8 ${isActive('/protected/review-queue') ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                                <FileStack className="size-5" />
                                <span className="sr-only">Review Queue</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Review Queue</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/protected/analytics"
                                className={`flex size-9 items-center justify-center rounded-lg transition-colors md:size-8 ${isActive('/protected/analytics') ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                                <LineChart className="size-5" />
                                <span className="sr-only">Analytics</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Analytics</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
        </TooltipProvider>
    );
}