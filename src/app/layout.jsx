"use client";

import { useEffect, useState, useMemo } from "react";
import "./globals.css";
import BottomNavigation from "@/components/layout/bottom-navigation/bottom-navigation";
import MiniSideBar from "@/components/layout/mini-side-bar/mini-side-bar";
import SideBar from "@/components/layout/side-bar/side-bar";
import { usePathname } from "next/navigation";
import TranslatorProvider from "@/components/providers/translator-provider";
import ThemeWrapper from "@/components/providers/theme-provider";

export default function RootLayout({ children }) {
  const [windowWidth, setWindowWidth] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const barType = useMemo(() => {
    if (windowWidth <= 767) return "bottom";
    if (
      windowWidth <= 1279 ||
      pathname === "/search" ||
      pathname.includes("chat")
    )
      return "minibar";
    return "bar";
  }, [windowWidth, pathname]);

  // Список путей, где НЕ нужно показывать сайдбар
  const noSidebarPaths = ["/login", "/registration"];

  const shouldShowSidebar = !noSidebarPaths.includes(pathname);

  const wrapWithBar = (content) => {
    switch (barType) {
      case "bottom":
        return <BottomNavigation>{content}</BottomNavigation>;
      case "minibar":
        return <MiniSideBar>{content}</MiniSideBar>;
      default:
        return <SideBar>{content}</SideBar>;
    }
  };

  return (
    <div>
      <TranslatorProvider>
        <ThemeWrapper>
          {shouldShowSidebar ? wrapWithBar(children) : children}
        </ThemeWrapper>
      </TranslatorProvider>
    </div>
  );
}