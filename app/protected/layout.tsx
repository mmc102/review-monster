
import WithAuth from "@/components/WithAuth";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <WithAuth>{children}</WithAuth>
    )
}
