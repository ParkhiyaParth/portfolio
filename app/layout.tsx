import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Portfolio - AI/ML Professional",
    description: "Modern portfolio website showcasing AI/ML expertise, projects, and professional experience",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navigation />
                <main className="pt-16">{children}</main>
            </body>
        </html>
    );
}
