
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - Boxful",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
