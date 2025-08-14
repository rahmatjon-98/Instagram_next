"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Profile from "@/assets/icon/layout/instagramDefaultProfile.jpg";
import { Divider, Menu, MenuItem, Modal, Box, Button } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import frame168 from "../../../assets/img/pages/auth/registration/Frame 168.png";
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
  threads,
} from "@/assets/icon/layout/svg";
import { CircleUserRound, Settings, LogOut } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useRegisterStore } from "@/store/pages/auth/registration/registerStore";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { usegetUserStore } from "@/store/pages/search/store";

const NavLink = ({ href, icon, activeIcon, label, isActive }) => (
  <Link
    href={href}
    className={`flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 ${isActive(href)}`}
  >
    {isActive(href) ? activeIcon : icon}
    <p className="text-lg">{label}</p>
  </Link>
);

export default function SideBar({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSwitchModal, setOpenSwitchModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const addLogin = useRegisterStore((state) => state.addLogin);
  const isLoading = useRegisterStore((state) => state.isLoading);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null)

  let { openModal, setOpenModal } = usegetUserStore()

  const isActive = (path) => (pathname === path ? "font-bold" : "font-normal");

  const logOut = () => {
    localStorage.removeItem("access_token");
    router.push('/login');
    toast("Logged out!");
  };

  const onSubmit = async (data) => {
    const result = await addLogin({
      userName: data.userName,
      password: data.password,
    });

    if (result?.success) {
      reset();
      toast.success("Login successful!");
      if (typeof window != "undefined") {
        localStorage.setItem('access_token', result?.data?.data);
        localStorage.setItem('current_user', JSON.stringify({ userName: data.userName }));
      }
      setOpenSwitchModal(false);
      router.push("/profile");
    } else {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <Toaster />
      <section className="w-[320px] h-full fixed border-r border-gray-300">
        <div className="sideBar h-full pb-[100px]">
          <div className="m-auto pt-[20px] ml-[20px] flex pb-[10px] mt-[20px]">{homeIcon}</div>

          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2 mt-4">
              <NavLink href="/" icon={homeIcon} activeIcon={homeIconActive} label={t("layout.home")} isActive={isActive} />
              <button onClick={setOpenModal}>
                <NavLink href="#" icon={searchIcon} activeIcon={searchIconActive} label={t("layout.search")} isActive={isActive} />
              </button>
              <NavLink href="/explore" icon={compas} activeIcon={compasActive} label={t("layout.explore")} isActive={isActive} />
              <NavLink href="/reels" icon={video} activeIcon={videoActive} label={t("layout.reels")} isActive={isActive} />
              <NavLink href="/chats" icon={message} activeIcon={messageActive} label={t("layout.message")} isActive={isActive} />
              <NavLink href="/notification" icon={like} activeIcon={likeActive} label={t("layout.notification")} isActive={isActive} />
              <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100">
                {action}
                <p className="text-lg">{t("layout.create")}</p>
              </div>
              <NavLink
                href="/profile"
                icon={<Image className={`${pathname === "/profile" ? "border-2 border-black rounded-full" : ""} h-10 w-10`} src={Profile} alt="Profile" />}
                label={t("layout.profile")}
                isActive={isActive}
              />
            </div>

            <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100">
              {threads}
              <p className="text-lg">{t("layout.threads")}</p>
            </div>

            <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100">
              <button onClick={handleClick} className="flex gap-5">
                {setting}
                <p className="text-lg">{t("layout.more")}</p>
              </button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Link href={"/setting"}>
                  <MenuItem onClick={handleClose}>
                    <div className="flex gap-[20px]"><Settings /> Settings</div>
                  </MenuItem>
                </Link>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setOpenSwitchModal(true);
                  }}
                >
                  <div className="flex gap-[20px]"><CircleUserRound /> Switch account</div>
                </MenuItem>
                <Divider />
                <MenuItem sx={{ color: "#ed4956", fontWeight: 600 }}>
                  <div onClick={logOut} className="flex gap-[20px]"><LogOut /> Log out</div>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={openSwitchModal}
        onClose={() => setOpenSwitchModal(false)}
        BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.3)" } }}
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: "16px",
          width: 360,
          boxShadow: 24,
          p: 3
        }}>
          <Image src={frame168} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              type="text"
              placeholder="User Name"
              {...register("userName", { required: "This field is required" })}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
            {errors.userName && <p className="text-red-500 text-xs">{errors.userName.message}</p>}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer select-none">
                {showPassword ? <Eye /> : <EyeOff />}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-2 rounded-md transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>

            <Link href={'/registration'}>
              <p className="text-[#3B82F6] text-center">Forgot password?</p>
            </Link>
          </form>
        </Box>
      </Modal>

      <div className="ml-[320px]">{children}</div>
    </div>
  );
}
