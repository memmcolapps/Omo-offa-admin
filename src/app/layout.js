import localFont from "next/font/local";
import "./globals.css";
import { Manrope } from "next/font/google";
import Navbar from "./components/common/navbar";

// Import Manrope from Google Fonts
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify the font weights you're using
});

export const metadata = {
  title: "OFFANIMI Admin",
  description: "Admin For the OffaNIMI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
