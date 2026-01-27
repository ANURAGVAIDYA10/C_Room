import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<AppLayoutProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out  ${
          isExpanded || isHovered ? "xl:ml-[290px]" : "xl:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
          {children}
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent children={children} />
    </SidebarProvider>
  );
};

export default AppLayout;
