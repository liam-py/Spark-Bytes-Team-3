"use client";

<<<<<<< HEAD
import type { Metadata } from "next";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GoogleOAuthProvider } from "@react-oauth/google";
=======
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/app/providers/AuthProvider";
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
import theme from "@/theme";
import Layout from "@/components/Layout";
import "./globals.css";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
<<<<<<< HEAD
            <Layout>{children}</Layout>
=======
              <AuthProvider>
                <Layout>{children}</Layout>
              </AuthProvider>
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
