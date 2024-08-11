import { GeistSans } from "geist/font/sans";


import "./globals.css";
import AuthButton from "@/components/AuthButton";
import { SideBar } from "@/components/SideBar";
import MobileMenu from "@/components/MobileMenu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Name from "@/components/Name";


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
          <nav className="sticky top-0 z-50 flex h-16 w-full  border-b border-b-foreground/10 bg-white">
            <div className="flex w-full items-center justify-between px-2 text-sm sm:px-10">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="sm:hidden">
                    <Menu className="size-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>

                </SheetTrigger>
                <Name />
                <MobileMenu />
              </Sheet>
              <AuthButton />
            </div>
          </nav>
          <SideBar />
          <div className="mb-10 w-full grow px-2 sm:px-10">
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
