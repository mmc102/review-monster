import { GeistSans } from "geist/font/sans";
import "./globals.css";
import AuthButton from "@/components/AuthButton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "KenzCare",
  description: "Easy forms for daycares",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
    <main className="min-h-screen flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-3/4 flex justify-between items-center p-3 text-sm">
              <h1>Daycare Forms</h1>
                <AuthButton />
            </div>
        </nav>
        <div className="w-full px-10 mb-10 flex-grow">
            {children}
        </div>
        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
            <p>Daycare Forms</p>
        </footer>
    </main>
</body>
    </html>
  );
}
