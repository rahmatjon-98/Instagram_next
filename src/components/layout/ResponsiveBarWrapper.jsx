"use client";

import { useEffect, useState, useMemo } from "react";
import BottomNavigation from "@/components/layout/bottom-navigation/bottom-navigation";
import MiniSideBar from "@/components/layout/mini-side-bar/mini-side-bar";
import SideBar from "@/components/layout/side-bar/side-bar";
import { usePathname, useRouter } from "next/navigation";

export default function ResponsiveBarWrapper({ children }) {
  const [windowWidth, setWindowWidth] = useState(0);
  const pathname = usePathname();

  let router = useRouter();

  let token = typeof window !== "undefined" ? localStorage.getItem("access_token") : ""
  
  useEffect(() => {
    
    if (!token) {
      router.push("/login");
    }
  }, [router]);

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

  // Пути, где не показывать сайдбар
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

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return wrapWithBar(children);
}
