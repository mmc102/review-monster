import { GeistSans } from "geist/font/sans";
import "./globals.css";
import AuthButton from "@/components/AuthButton";

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
          <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
            <div className="flex w-3/4 items-center justify-between p-3 text-sm">
              <h1>Review Monster</h1>
              <AuthButton />
            </div>
          </nav>
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
