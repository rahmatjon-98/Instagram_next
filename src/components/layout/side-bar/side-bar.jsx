"use client";
import Modal from "../Modal";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Profile from "@/assets/icon/layout/instagramDefaultProfile.jpg";
import { Divider, Menu, MenuItem } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  homeIcon,
  homeIconActive,
  searchIcon,
  searchIconActive,
  compas,
  compasActive,
  video,
  videoActive,
  message,
  messageActive,
  like,
  likeActive,
  action,
  setting,
  savedIcon,
  problemIcon,
  threads,
} from "@/assets/icon/layout/svg";
import { Bookmark, CircleUserRound, LogOut, Settings } from "lucide-react";

const NavLink = ({ href, icon, activeIcon, label, isActive }) => (
  <Link
    href={href}
    className={`flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 ${isActive(
      href
    )}`}
  >
    {isActive(href) ? activeIcon : icon}
    <p className="text-lg">{label}</p>
  </Link>
);

export default function SideBar({ children }) {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function logOut() {
    localStorage.removeItem('access_token')
    router.push('/login')
  }

  const isActive = (path) => (pathname === path ? "font-bold" : "font-normal")

  let [openModal, setOpenModal] = useState(null)

  return (
    <div>
      <section className="w-[320px] h-[100%] fixed  border-r-2 border-gray-300">
        <div className="sideBar h-full pb-[100px]">
          <div className="m-auto pt-[20px] ml-[20px] flex pb-[10px] mt-[20px]">
            {homeIcon}
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2 mt-4">
              <NavLink
                href="/"
                icon={homeIcon}
                activeIcon={homeIconActive}
                label={t("layout.home")}
                isActive={isActive}
              />
              <button onClick={() => {
                setOpenModal(!openModal)
                setAnchorEl(null)
              }}>
                <NavLink
                  href="#"
                  icon={searchIcon}
                  activeIcon={searchIconActive}
                  label={t("layout.search")}
                  isActive={isActive}
                />
              </button>
              <NavLink
                href="/explore"
                icon={compas}
                activeIcon={compasActive}
                label={t("layout.explore")}
                isActive={isActive}
              />
              <NavLink
                href="/reels"
                icon={video}
                activeIcon={videoActive}
                label={t("layout.reels")}
                isActive={isActive}
              />
              <NavLink
                href="/chats"
                icon={message}
                activeIcon={messageActive}
                label={t("layout.message")}
                isActive={isActive}
              />
              <NavLink
                href="/notification"
                icon={like}
                activeIcon={likeActive}
                label={t("layout.notification")}
                isActive={isActive}
              />

              <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100">
                {action}
                <p className="text-lg">{t("layout.create")}</p>
              </div>

              <NavLink
                href="/profile"
                icon={
                  <Image
                    className={`${pathname === "/profile"
                      ? "border-2 border-black rounded-full"
                      : ""
                      } h-10 w-10`}
                    src={Profile}
                    alt="Profile"
                  />
                }
                label={t("layout.profile")}
                isActive={isActive}
              />
            </div>

            <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100">
              {threads}
              <p className="text-lg">{t("layout.threads")}qdw</p>
            </div>

            <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100">
              <button onClick={handleClick} className="flex gap-5">
                {setting}
                <p className="text-lg">{t("layout.more")}</p>
              </button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    mt: 1.5,
                    borderRadius: "12px",
                    boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
                    minWidth: 200,
                    "& .MuiMenuItem-root": {
                      fontSize: "14px",
                      fontWeight: 500,
                      padding: "10px 16px",
                      color: "#262626",
                      fontFamily: "'Segoe UI', Arial, sans-serif",
                    },
                    "& .MuiMenuItem-root:hover": {
                      backgroundColor: "#fafafa",
                    },
                  },
                }}
              >
                <Link href={'/setting'}><MenuItem onClick={handleClose}> <div className="flex gap-[20px]"><Settings /> Settings</div></MenuItem></Link>
                <MenuItem onClick={handleClose}> <div className="flex gap-[20px]"><Bookmark /> Saved</div></MenuItem>
                <MenuItem onClick={handleClose}> <div className="flex gap-[20px]"><CircleUserRound /> Switch account</div></MenuItem>
                <Divider />
                <MenuItem
                  onClick={handleClose}
                  sx={{ color: "#ed4956", fontWeight: 600 }}
                >
                  <div onClick={() => logOut()} className="flex gap-[20px]"><LogOut /> Log out</div>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </section>
      {openModal && (
        <Modal />
      )}
      <div className="ml-[320px]">{children}</div>
    </div>
  );
}
