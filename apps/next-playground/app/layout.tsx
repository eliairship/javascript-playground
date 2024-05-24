import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Dashboard, Home, Signin } from "../routes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

// TODO: Add middleware to handle routing
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <Home.Link>Home</Home.Link>
          <Signin.Link>Sign in</Signin.Link>
          <Dashboard.Link>Dashboard</Dashboard.Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
