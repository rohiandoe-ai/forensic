import type { Metadata } from "next";
import { Orbitron, Roboto } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorBoundary from "@/components/ErrorBoundary";
import ClientHooks from "@/components/ClientHooks";
import OnboardingTour from "@/components/OnboardingTour";
import SessionTimeout from "@/components/SessionTimeout";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const orbitron = Orbitron({
    variable: "--font-orbitron",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
    title: "Smart Crime Scene Reconstruction System",
    description: "Advanced AI-powered forensic analysis, 3D visualization, and collaborative investigation platform for modern law enforcement.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${orbitron.variable} ${roboto.variable}`}>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#00a8ff" />
            </head>
            <body suppressHydrationWarning>
                <ClientHooks />
                <Navbar />
                <main style={{ paddingTop: "20px", minHeight: "calc(100vh - 200px)" }}>
                    <div className="container">
                        <Breadcrumbs />
                    </div>
                    <ErrorBoundary>
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </ErrorBoundary>
                </main>
                <Footer />
                <OnboardingTour />
                {/* SessionTimeout disabled for direct access */}
                {/* <SessionTimeout /> */}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#161b2a',
                            color: '#ffffff',
                            border: '1px solid #2a2f45',
                            fontFamily: 'Roboto, sans-serif',
                            borderRadius: '10px',
                        },
                    }}
                />
            </body>
        </html>
    );
}
