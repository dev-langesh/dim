import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { ToastContainer } from "react-toastify";

import ReduxProvider from "@/redux/ReduxProvider";
import Header from "@/components/common/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DIM",
  description: "Deploy your application faster with DIM",
};

export default function RootLayout({ children }) {
  return (
    <html className="" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground w-screen h-screen overflow-hidden`}
      >
        <ReduxProvider>
          <AuthProvider>
            <Header />
            <main className="h-full overflow-x-hidden overflow-y-auto">{children}</main>
          </AuthProvider>
        </ReduxProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
