import "./globals.css";
import { Manrope } from "next/font/google";
import { Suspense } from "react";
import LayoutWrapper from "./components/LayoutWrapper";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "OFFANIMI Admin",
  description: "Admin For the OffaNIMI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        <Suspense>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Suspense>
      </body>
    </html>
  );
}
