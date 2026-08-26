import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://portfolio.129-154-244-125.sslip.io";
const title = "Parth Parkhiya — AI/ML Engineer & LLM/RAG Developer";
const description =
    "Portfolio of Parth Parkhiya, an AI/ML Engineer specializing in Retrieval-Augmented Generation, LLM applications, and practical machine learning systems.";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: ["Parth Parkhiya", "AI/ML Engineer", "RAG", "LLM", "Machine Learning", "Portfolio"],
    authors: [{ name: "Parth Parkhiya", url: siteUrl }],
    openGraph: {
        title,
        description,
        url: siteUrl,
        siteName: "Parth Parkhiya — Portfolio",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ScrollProgress />
                <Navigation />
                <main className="pt-16">{children}</main>
                <BackToTop />
            </body>
        </html>
    );
}
