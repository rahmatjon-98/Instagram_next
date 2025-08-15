"use client";

import img from "@/assets/img/pages/chat/pages/default-chat/userFoto.jpg";
import { useUserId } from "@/hook/useUserId";
import { useChatById } from "@/store/pages/chat/pages/chat-by-id/store";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import { Box, Button, Drawer, Skeleton, Stack } from "@mui/material";
import {
  EllipsisVertical,
  Loader2,
  Mic,
  SendHorizontal,
  Trash,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";

export default function ChatById() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  const { "chat-by-id": id } = useParams();
  const userId = useUserId();

  const {
    messages,
    deleteChat,
    getChatById,
    sendMessage,
    deleteMessage,
    loadingDelChat,
  } = useChatById();

  const { get, loadingChat } = useDefaultChat();

  const [profilId, setprofilId] = useState(null);

  const intervalRef = useRef(null);
  const pollingInProgressRef = useRef(false);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(async () => {
      if (!id) return;
      if (pollingInProgressRef.current) return;
      try {
        pollingInProgressRef.current = true;
        await getChatById(id);
      } catch (err) {
        console.error("polling error", err);
      } finally {
        pollingInProgressRef.current = false;
      }
    }, 2000);
  }, [id, getChatById]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    startPolling();
    getChatById(id);

    return () => {
      stopPolling();
    };
  }, [id, getChatById, startPolling, stopPolling]);

  const [inpMessage, setinpMessage] = useState("");
  const [inpFile, setinpFile] = useState(null);
  const [openImg, setOpenImg] = useState(null);
  const [openIsVideo, setOpenIsVideo] = useState(false);
  const [delMesModal, setdelMesModal] = useState(null);

  useEffect(() => {
    return () => {
      if (openImg && openImg.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(openImg);
        } catch {}
      }
      stopPolling();
    };
  }, []);

  let router = useRouter();

  async function handleDelChat(chatId) {
    try {
      router.push("/chats");
      await deleteChat(chatId);
      await get();
      setdelMesModal(null);
    } catch (error) {
      console.error(error);
    }
  }

  const isVideoFileName = (name) =>
    /\.(mp4|webm|ogg|mov)$/i.test(String(name || ""));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (openImg && openImg.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(openImg);
      } catch {}
    }

    setinpFile(file);
    const objectUrl = URL.createObjectURL(file);
    setOpenImg(objectUrl);
    setOpenIsVideo(
      !!(file.type?.startsWith("video/") || isVideoFileName(file.name))
    );
  };

  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inpMessage && !inpFile) return;

    const formData = new FormData();
    formData.append("ChatId", id);
    formData.append("MessageText", inpMessage || "");
    if (inpFile) formData.append("File", inpFile);

    setLoading(true);
    try {
      await sendMessage(formData);
      await getChatById(id);
      setinpMessage("");
      setinpFile(null);
      setOpenImg(null);
      setOpenIsVideo(false);
      setOpenEmoji(false);
    } catch (err) {
      console.error("sendMessage error:", err);
    } finally {
      setLoading(false);
    }
  };

  async function handleDelMessage(mesId) {
    setLoading(true);
    try {
      await deleteMessage(mesId);
      await getChatById(id);
    } catch (error) {
      console.error("sendMessage error:", error);
    } finally {
    }
    setLoading(false);
    setdelMesModal(null);
  }

  const toggleDelModal = (mesId) =>
    setdelMesModal((e) => (e === mesId ? null : mesId));

  const closePreview = () => {
    setinpFile(null);
    setOpenImg(null);
    setOpenIsVideo(false);
  };

  const onEmojiClick = (emojiData) => {
    setinpMessage((prev) => prev + emojiData.emoji);
  };

  let [openEmoji, setOpenEmoji] = useState(false);

  let userData = JSON.parse(localStorage.getItem("userData")) || {};

  const SkeletonRow = () => (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      className="p-3 w-[50%]"
    >
      <Skeleton variant="circular" width={44} height={44} />
      <Stack spacing={0.5} flex={1}>
        <Skeleton variant="text" width="60%" height={14} />
        <Skeleton variant="text" width="40%" height={12} />
      </Stack>
    </Stack>
  );

  const SkeletonChat = () => (
    <div>
      <Stack direction="row" spacing={2} alignItems="center" className="p-3">
        <Stack spacing={0.5} flex={1}>
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="50%" height={14} />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" className="p-3 ">
        <Stack spacing={0.5} flex={1} className="flex flex-col items-end">
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="50%" height={14} />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" className="p-3">
        <Stack spacing={0.5} flex={1}>
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="50%" height={14} />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" className="p-3 ">
        <Stack spacing={0.5} flex={1} className="flex flex-col items-end">
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="50%" height={14} />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" className="p-3">
        <Stack spacing={0.5} flex={1}>
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="50%" height={14} />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" className="p-3 ">
        <Stack spacing={0.5} flex={1} className="flex flex-col items-end">
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="50%" height={14} />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" className="p-3">
        <Stack spacing={0.5} flex={1}>
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="50%" height={14} />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" className="p-3 ">
        <Stack spacing={0.5} flex={1} className="flex flex-col items-end">
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="50%" height={14} />
        </Stack>
      </Stack>
    </div>
  );

  return (
    <div className="w-full">
      <div className="fixed shadow w-[80%] z-10 bg-white p-2 flex justify-between">
        {loadingChat ? (
          <SkeletonRow />
        ) : (
          <div className="flex items-center gap-2">
            {!userData.receiveUserImage ? (
              <Image
                src={img}
                width={500}
                height={500}
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <Image
                src={`http://37.27.29.18:8003/images/${userData.receiveUserImage}`}
                width={500}
                height={500}
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
            )}

            <div>
              <p>{userData.receiveUserName}</p>
              <p>{}</p>
            </div>
          </div>
        )}
        <Button onClick={toggleDrawer(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </Button>
      </div>

      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          className="flex flex-col justify-end p-5"
        >
          <div>
            <button
              type="button"
              onClick={() => handleDelChat(id)}
              className="text-red-500  p-2 rounded flex items-center justify-between gap-2 w-full"
            >
              Remove Chat <Trash size={18} />
            </button>
          </div>
        </Box>
      </Drawer>

      <div className="w-full mx-auto p-4 h-[85vh] overflow-y-auto flex flex-col-reverse gap-2">
        { loadingDelChat ? (
          <SkeletonChat />
        ) : (
          messages &&
          messages.map((e) => {
            const isCurrentUser = e.userId === userId;
            return (
              <div
                key={e.messageId}
                className={`flex items-center justify-center gap-3  p-3 rounded-lg group${
                  isCurrentUser
                    ? " self-end rounded-tr-none flex-row-reverse"
                    : " self-start rounded-tl-none "
                }`}
              >
                <div
                  className={`flex flex-col  ${
                    isCurrentUser ? " self-end " : " self-start "
                  }`}
                >
                  {e.file && isVideoFileName(e.file) ? (
                    <div
                      className={`w-1/2 ${
                        isCurrentUser ? " self-end" : " self-start "
                      }`}
                    >
                      <video
                        src={`http://37.27.29.18:8003/images/${e.file}`}
                        controls
                        preload="metadata"
                        playsInline
                        crossOrigin="anonymous"
                        className="pb-2 rounded-xl"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  ) : e.file ? (
                    <div
                      className={`w-[70%] ${
                        isCurrentUser ? " self-end" : " self-start "
                      }`}
                    >
                      <Image
                        src={`http://37.27.29.18:8003/images/${e.file}`}
                        alt="image"
                        width={1000}
                        height={1000}
                        className="pb-2 rounded-xl"
                        priority
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                      />
                    </div>
                  ) : null}

                  <div
                    className={`rounded-lg  ${
                      isCurrentUser
                        ? "bg-blue-500 text-white self-end rounded-tr-none p-1.5 px-3"
                        : "bg-gray-100 text-[#475569] self-start rounded-tl-none p-1.5 px-3"
                    }`}
                  >
                    <p className="">{e.messageText}</p>
                    <span
                      className={`text-[10px] self-end ${
                        isCurrentUser ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {new Date(e.sendMassageDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleDelModal(e.messageId)}
                  className="hidden group-hover:block"
                >
                  <EllipsisVertical />
                </button>
                {delMesModal === e.messageId && (
                  <div
                    className={`flex items-center justify-center fixed inset-0 mt-5  z-5  bg-[rgba(0,0,0,0.5)`}
                  >
                    <div className="flex flex-col justify-center items-center gap-2 shadow rounded bg-white w-[350px]">
                      <button
                        type="button"
                        onClick={() => handleDelMessage(e.messageId)}
                        className="text-red-500 p-2 rounded"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                          <p className="flex items-center gap-2">
                            Delete messege <Trash size={18} />
                          </p>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setdelMesModal(null)}
                        className="p-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="border-2 min-h-12 max-h-12 m-4 p-2 rounded-xl border-[#E2E8F0] flex justify-between gap-1 items-center">
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => setOpenEmoji((e) => !e)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-[#475569]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
          </svg>
        </button>
        {openEmoji && (
          <div className="absolute mb-130">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <form
          onSubmit={handleSend}
          className="w-full flex justify-between items-center"
        >
          <input
            type="text"
            className="w-full outline-none px-2"
            placeholder="Write your message..."
            value={inpMessage}
            onChange={(e) => setinpMessage(e.target.value)}
          />

          {!inpMessage ? (
            <div className="flex items-center gap-2">
              <Mic />
              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFile}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </label>
            </div>
          ) : (
            <button
              type="submit"
              className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <SendHorizontal />
              )}
            </button>
          )}
        </form>

        {openImg && (
          <div
            style={{ backdropFilter: "blur(6px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)]"
          >
            <div className="w-[400px] bg-white rounded-xl shadow p-5">
              {openIsVideo ? (
                <video
                  src={openImg}
                  controls
                  preload="metadata"
                  className="max-h-64 mx-auto mb-4"
                  style={{ width: "100%", height: "auto" }}
                  onError={(ev) => console.error("preview video error:", ev)}
                  onPlay={() => pausePolling()}
                  onPause={() => resumePolling()}
                  onEnded={() => resumePolling()}
                />
              ) : (
                <img
                  src={openImg}
                  alt="preview"
                  className="max-h-64 mx-auto mb-4"
                  style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                />
              )}

              <div className="flex justify-between border-t-2 border-gray-300 pt-3">
                <button
                  type="button"
                  onClick={closePreview}
                  className="text-red-500 px-7 py-2 rounded  bg-red-100"
                >
                  <X />
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSend}
                    className="px-7 py-2 rounded mr-2 bg-blue-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <SendHorizontal />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
