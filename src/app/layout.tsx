import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Manrope } from "next/font/google"
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme";
import ReactQueryProvider from "@/react-query";
import { ReactProvider } from "@/redux/provider";
import { Toaster } from "sonner";

const manrope=Manrope({
  subsets:['latin']
})

export const metadata: Metadata = {
  title: "Opal",
  description: "Share AI Powered videos with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${manrope.className} bg-[#171717] antialiased`}
      >
        <ClerkProvider>
        
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ReactProvider>
            <ReactQueryProvider>{children} <Toaster/></ReactQueryProvider>
            </ReactProvider>
        
        </ThemeProvider>
        
        </ClerkProvider>
      </body>
    </html>
  );
}
