import localFont from "next/font/local";
import "./globals.css";
import { Manrope } from "next/font/google";
import { Suspense } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { CustomSidebar } from "./components/common/sidebar";
import Navbar from "./components/common/navbar";
import MaxContainer from "./components/common/maxcontainer";

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
  const loggedInUser = {
    email: "moshood988@gmail.com",
  };
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        <Suspense>
          <SidebarProvider>
            <div className="flex h-screen overflow-hidden w-full">
              <CustomSidebar />
              <div className="flex-1 flex flex-col">
                <Navbar loggedInUser={loggedInUser} />
                <main className="flex-1 overflow-auto pt-4">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </Suspense>
      </body>
    </html>
  );
}
