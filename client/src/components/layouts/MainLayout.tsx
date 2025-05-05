import React from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import MobileNavigation from "../MobileNavigation";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useMobile();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background pt-16">
        {!isMobile && <Sidebar />}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default MainLayout;
