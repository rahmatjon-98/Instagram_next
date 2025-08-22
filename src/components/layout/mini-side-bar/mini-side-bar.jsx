"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Modal as MModal,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import Profile from "@/assets/icon/layout/instagramDefaultProfile.jpg";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import CustomModal from "../Modal";

import {
  add,
  compas,
  compasActive,
  homeIcon,
  homeIconActive,
  instagramMiniLogo,
  like,
  likeActive,
  message,
  messageActive,
  searchIcon,
  searchIconActive,
  video,
  videoActive,
} from "@/assets/icon/layout/svg";

import { usegetUserStore } from "@/store/pages/search/store";
import useDarkSide from "@/hook/useDarkSide";
import { useProfileStore } from "@/store/pages/profile/profile/store";
import { Toaster, toast } from "react-hot-toast";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "black",
    boxShadow: "0 0 5px 1px rgba(0,0,0, .0975)",
    fontSize: 11,
    ".MuiTooltip-arrow": {
      color: "white",
    },
  },
}));

const stylePost = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 3,
};

const MiniSideBar = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, setOpenModal } = usegetUserStore();
  const { t } = useTranslation();

  const renderIcon = (path, activeIcon, inactiveIcon) => {
    return pathname === path ? inactiveIcon : activeIcon;
  };

  const [theme] = useDarkSide();

  // Create post local state (MUI modal)
  const [openPost, setOpenPost] = useState(false);
  const handleOpenPost = () => setOpenPost(true);
  const handleClosePost = () => (setOpenPost(false), setFile([]));

  let { addPost } = useProfileStore();

  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  let [file, setFile] = useState([]);

  async function handleSubmitPost(e) {
    e.preventDefault();
    if (file && file.length > 0) {
      try {
        let formData = new FormData();
        if (title) formData.append("Title", title);
        if (content) formData.append("Content", content);
        for (let i = 0; i < file.length; i++)
          formData.append("Images", file[i]);
        await addPost(formData);
        toast("Successfuly added post");
        handleClosePost();
        e.target.reset();
        setFile([]);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    } else {
      toast("Please fill image input");
    }
  }

  const handleFileChangePost = (e) => {
    e.preventDefault();
    setFile([]);
    setFile(Array.from(e.target.files || []));
  };

  return (
    <div
      className={`flex ${
        theme == "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <Toaster />
      <section className="flex justify-center w-[50px] border-r-[2px] border-[#eee] h-[100vh]">
        <div className="sideBar h-full pb-[100px]">
          <div className="m-auto flex justify-center pb-[10px] mt-[20px]">
            {instagramMiniLogo}
          </div>
          <div className={`flex flex-col justify-between h-full `}>
            <div className="flex flex-col gap-[0.5rem] mt-4">
              <LightTooltip title={t("layout.home")} placement="right" arrow>
                <Link href="/" passHref>
                  <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                    {renderIcon("/", homeIconActive, homeIcon)}
                  </div>
                </Link>
              </LightTooltip>

              <button
                onClick={() =>
                  typeof setOpenModal === "function"
                    ? setOpenModal.length === 0
                      ? setOpenModal()
                      : setOpenModal(true)
                    : null
                }
              >
                <LightTooltip
                  title={t("layout.search")}
                  placement="right"
                  arrow
                >
                  <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                    {renderIcon("/search", searchIconActive, searchIcon)}
                  </div>
                </LightTooltip>
              </button>

              <LightTooltip title={t("layout.explore")} placement="right" arrow>
                <Link href="/explore" passHref>
                  <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                    {renderIcon("/explore", compasActive, compas)}
                  </div>
                </Link>
              </LightTooltip>

              <LightTooltip title={t("layout.reels")} placement="right" arrow>
                <Link href="/reels" passHref>
                  <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                    {renderIcon("/reels", videoActive, video)}
                  </div>
                </Link>
              </LightTooltip>

              <LightTooltip title={t("layout.message")} placement="right" arrow>
                <Link href="/chats" passHref>
                  <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                    {renderIcon("/chats", messageActive, message)}
                  </div>
                </Link>
              </LightTooltip>

              <LightTooltip
                title={t("layout.notification")}
                placement="right"
                arrow
              >
                <Link href="/notification" passHref>
                  <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                    {renderIcon("/notification", likeActive, like)}
                  </div>
                </Link>
              </LightTooltip>

              <LightTooltip title={t("layout.create")} placement="right" arrow>
                <div
                  onClick={handleOpenPost}
                  className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center"
                >
                  {add}
                </div>
              </LightTooltip>

              <LightTooltip title={t("layout.profile")} placement="right" arrow>
                <Link href="/profile" passHref>
                  <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                    <Image
                      className={`rounded-full ${
                        router.pathname === "/profile"
                          ? "border-[2px] border-[black] rounded-[50%]"
                          : "font-[400]"
                      } text-[16px] block w-[25px] h-[25px]`}
                      src={Profile}
                      alt="Profile"
                    />
                  </div>
                </Link>
              </LightTooltip>
            </div>
          </div>
        </div>
      </section>

      {openModal && <CustomModal />}

      <MModal
        open={openPost}
        onClose={handleClosePost}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={stylePost}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
            <form onSubmit={handleSubmitPost} className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create New Post
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title <span className="text-gray-500">(can be empty)</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content <span className="text-gray-500">(can be empty)</span>
                </label>
                <textarea
                  id="content"
                  placeholder="Enter content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        Multiple files supported
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChangePost}
                      className="hidden"
                    />
                  </label>
                </div>
                {file.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {file.length} file(s) selected
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleClosePost}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Share
                </button>
              </div>
            </form>
          </div>
        </Box>
      </MModal>

      <div className="ml-[0px] w-full">{children}</div>
    </div>
  );
};

export default MiniSideBar;
