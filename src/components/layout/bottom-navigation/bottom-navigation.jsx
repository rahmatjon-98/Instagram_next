"use client";
import Profile from "@/assets/icon/layout/instagramDefaultProfile.jpg";
import {
  add,
  compas,
  compasActive,
  homeIcon,
  homeIconActive,
  message,
  messageActive,
  video,
  videoActive,
} from "@/assets/icon/layout/svg";
import useDarkSide from "@/hook/useDarkSide";
import { useProfileStore } from "@/store/pages/profile/profile/store";
import { Box, Modal } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

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

export default function BottomNavigation({ children }) {
  const pathname = usePathname();

  // Define reusable classes
  const iconClass =
    "flex items-center gap-4 rounded-[8px] h-[52px] px-0 m-[0] justify-center";
  const profileClass = "w-[25px] h-[25px] rounded-[50%]";

  // Map of pathnames to icons
  const icons = {
    "/": { active: homeIcon, inactive: homeIconActive },
    "/explore": { active: compas, inactive: compasActive },
    "/reels": { active: video, inactive: videoActive },
    "/chats": { active: message, inactive: messageActive },
    "/profile": { active: Profile, inactive: Profile }, // No icon state, just border logic
  };

  const [theme] = useDarkSide();

  const [openPost, setOpenPost] = useState(false);
  const handleOpenPost = () => setOpenPost(true);
  const handleClosePost = () => (setOpenPost(false), setFile([]));

  let { addPost } = useProfileStore();

  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  let [file, setFile] = useState([]);

  async function handleSubmitPost(e) {
    e.preventDefault();
    if (file) {
      try {
        let formData = new FormData();
        if (title) {
          formData.append("Title", title);
        }
        if (content) {
          formData.append("Content", content);
        }
        if (file) {
          for (let i = 0; i < file.length; i++) {
            formData.append(`Images`, file[i]);
          }
        }
        await addPost(formData);
        toast("Successfuly added post");
        console.log(file);
        e.target.reset();
        setFile([]);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    } else {
      toast("Please fill image input");
    }
    handleClosePost();
  }

  const handleFileChangePost = (e) => {
    e.preventDefault();
    setFile(Array.from(e.target.files || []));
  };

  return (
    <div>
      {children}
      <section className="fixed w-[100%] z-[10] bottom-0">
        <div className="flex gap-[0.5rem] mt-4 align-bottom bg-white justify-evenly">
          {/* Home */}
          <Link className="block" href="/">
            <div className={iconClass}>
              {pathname === "/" ? icons["/"].active : icons["/"].inactive}
            </div>
          </Link>

          {/* Explore */}
          <Link href="/explore">
            <div className={iconClass}>
              {pathname === "/explore"
                ? icons["/explore"].active
                : icons["/explore"].inactive}
            </div>
          </Link>

          {/* Reels */}
          <Link href="/reels">
            <div className={iconClass}>
              {pathname === "/reels"
                ? icons["/reels"].active
                : icons["/reels"].inactive}
            </div>
          </Link>

          {/* Create Button */}
          <div onClick={() => setOpenPost((e) => !e)} className={iconClass}>
            {add}
          </div>

          {/* Chats */}
          <Link href="/chats">
            <div className={iconClass}>
              {pathname === "/chats"
                ? icons["/chats"].active
                : icons["/chats"].inactive}
            </div>
          </Link>

          {/* Profile */}
          <Link href="/profile">
            <div className={iconClass}>
              <Image
                className={`${
                  pathname === "/profile" ? "border-[2px]  border-[black]" : ""
                } ${profileClass}`}
                src={Profile}
                alt="Profile"
              />
            </div>
          </Link>
        </div>
      </section>
      {openPost && (
        <Modal
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
                    Content{" "}
                    <span className="text-gray-500">(can be empty)</span>
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
        </Modal>
      )}
    </div>
  );
}
