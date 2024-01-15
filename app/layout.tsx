import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/components/providers/theme-provider";
import { ModalProvider } from "~/components/providers/modal-provider";
import { ContextProvider } from "~/components/providers/context-provider";
import { defaultContextValue } from "~/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "social media website",
  description: "this is a social media website tutorial"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <ContextProvider initialValue={defaultContextValue}>
          <ModalProvider />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
