import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Assignment Automation POC",
  description: "Assignment automation proof of concept",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex gap-6">
          <a href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50">
            Home
          </a>
          <a href="/mentor/dashboard" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50">
            Mentor Dashboard
          </a>
          <a href="/student/assignments" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50">
            Student Assignments
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
