import Link from "next/link"

import {
} from "lucide-react"
import {
    FileStack,
    Home,
    LineChart,
    Settings,
    Users2,
} from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export function SideBar() {
    return (
        <TooltipProvider>

            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 py-4">

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/protected/dashboard"
                                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
                            >
                                <Home className="size-5" />
                                <span className="sr-only">Dashboard</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Dashboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/protected/dashboard"
                                className="flex size-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:size-8"
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
                                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
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
                                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
                            >
                                <LineChart className="size-5" />
                                <span className="sr-only">Analytics</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Analytics</TooltipContent>
                    </Tooltip>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/protected/settings"
                                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
                            >
                                <Settings className="size-5" />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>

        </TooltipProvider>
    )
}