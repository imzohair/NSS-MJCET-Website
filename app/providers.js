"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import FloatingThemeToggle from "@/components/FloatingThemeToggle";
import MeshGradient from "@/components/MeshGradient";

export default function Providers({ children }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                <LanguageProvider>
                    <MeshGradient />
                    {children}
                    <FloatingThemeToggle />
                </LanguageProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
