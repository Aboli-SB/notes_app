"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <AuthProvider>{children}</AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}



