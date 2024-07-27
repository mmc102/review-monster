import { GeistSans } from "geist/font/sans";

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import { SideBar } from "@/components/SideBar";
import {
  FileStack,
  PanelLeft,
  Home,
  LineChart,
  Settings,
  Users2,
} from "lucide-react"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Business Documents",
  description: "Easy forms for business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="flex min-h-screen flex-col items-center">
          <nav className="sticky top-0 flex h-16 w-full justify-center border-b border-b-foreground/10 bg-white z-50">
            <div className="flex w-3/4 items-center justify-between p-3 text-sm">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="size-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>

                </SheetTrigger>

                <h1>Review Monster</h1>
                <SheetContent side="left" className="sm:max-w-xs">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link
                      href="/protected/dashboard"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Home className="size-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/protected/dashboard"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Users2 className="size-5" />
                      Reviews
                    </Link>
                    <Link
                      href="/protected/review-queue"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <FileStack className="size-5" />
                      Review Queue
                    </Link>
                    <Link
                      href="/protected/analytics"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <LineChart className="size-5" />
                      Analytics
                    </Link>
                    <Link
                      href="/protected/settings"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="size-5" />
                      Settings
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
              <AuthButton />
            </div>
          </nav>
          <SideBar />
          <div className="mb-10 w-full grow px-10">
            {children}
          </div>
          <footer className="flex w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
            <p>Review Monster</p>
          </footer>
        </main>
      </body>
    </html>
  );
}
