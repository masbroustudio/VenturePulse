import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Masthead } from "@/components/layout/Masthead";
import { SwissFooter } from "@/components/layout/SwissFooter";
import { Toast } from "@/components/ui/Toast";
import { LookbookModal } from "@/components/modals/LookbookModal";
import { ProofArenaModal } from "@/components/modals/ProofArenaModal";
import { TelemetryDrawer } from "@/components/modals/TelemetryDrawer";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { SkillsModal } from "@/components/modals/SkillsModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VENTURE PULSE // Qloo Taste Graph & Multi-Agent Venture Architecture",
  description:
    "Enterprise multi-agent venture design system powered by Qloo's 250M+ entity Taste Graph, cyclic LangGraph council, and physical co-brand deal desk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-paper dark:bg-darkPaper text-ink dark:text-darkInk font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-terracotta selection:text-white">
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Masthead />
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
              {children}
            </main>
            <SwissFooter />
          </div>

          {/* Global Modals & Notifications */}
          <Toast />
          <LookbookModal />
          <ProofArenaModal />
          <TelemetryDrawer />
          <CommandPalette />
          <SkillsModal />
        </QueryProvider>
      </body>
    </html>
  );
}
