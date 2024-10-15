import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/common/navbar";

export const metadata = {
  title: "OFFANIMI Admin",
  description: "Admin For the OffaNIMI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
