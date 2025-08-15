"use client";
import { useUserId } from "@/hook/useUserId";
import { useChatById } from "@/store/pages/chat/pages/chat-by-id/store";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import { Box, Button, Drawer } from "@mui/material";
import { EllipsisVertical, Mic, SendHorizontal, Trash, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";

export default function ChatById() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState((s) => ({ ...s, [anchor]: open }));
  };

  let { "chat-by-id": id } = useParams();
  const userId = useUserId();

  let { messages, getChatById, sendMessage, deleteMessage } = useChatById();
  let { chats, get } = useDefaultChat();

  const [profilId, setprofilId] = useState(null);

  // set profilId from chats when chats or id changes (avoid setState in render)
  useEffect(() => {
    if (!chats?.data || !id) return;
    const found = chats.data.find((c) => String(c.id) === String(id));
    if (found) setprofilId(found.receiveUserId);
  }, [chats, id]);

  useEffect(() => {
    get();
    if (!id) return;

    // poll chat every 2s, cleanup on unmount / id change
    const interval = setInterval(() => {
      getChatById(id);
    }, 2000);

    // initial fetch
    getChatById(id);

    return () => clearInterval(interval);
  }, [id, getChatById, get]);

  let [inpMessage, setinpMessage] = useState("");
  let [inpFile, setinpFile] = useState(null);
  let [openImg, setOpenImg] = useState(null);
  let [openIsVideo, setOpenIsVideo] = useState(false);
  let [delMesModal, setdelMesModal] = useState(null);

  const videoRef = useRef(null);

  const isVideoFileName = (name) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(String(name || ""));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // revoke prev blob only when replacing (we will revoke on close too)
    if (openImg && openImg.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(openImg);
      } catch {}
    }

    setinpFile(file);
    const objectUrl = URL.createObjectURL(file);
    setOpenImg(objectUrl);

    const isVideo =
      file.type?.startsWith("video/") || isVideoFileName(file.name);
    setOpenIsVideo(!!isVideo);
  };

  // try to play video only after canplay, catch interruption
  useEffect(() => {
    if (!openImg || !openIsVideo) return;
    const v = videoRef.current;
    if (!v) return;

    const onCanPlay = () => {
      v.play?.().catch((err) => {
        // play may be blocked or interrupted — log and continue
        console.warn("video play interrupted or blocked:", err);
      });
    };

    v.addEventListener("canplay", onCanPlay, { once: true });

    return () => {
      v.removeEventListener("canplay", onCanPlay);
    };
  }, [openImg, openIsVideo]);

  const handleSend = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!inpMessage && !inpFile) return;

    const formData = new FormData();
    formData.append("ChatId", id);
    formData.append("MessageText", inpMessage || "");

    if (inpFile) formData.append("File", inpFile);

    try {
      await sendMessage(formData);
      await getChatById(id);
    } catch (err) {
      console.error("sendMessage error:", err);
    } finally {
      // cleanup blob only here if it's a blob (we'll close preview)
      if (openImg && openImg.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(openImg);
        } catch {}
      }
      setinpMessage("");
      setinpFile(null);
      setOpenImg(null);
      setOpenIsVideo(false);
    }
  };

  async function handleDelMessage(mesId) {
    await deleteMessage(mesId);
    await getChatById(id);
    setdelMesModal(null);
  }

  // toggle using functional update to avoid stale closure
  const toggleDelModal = useCallback((mesId) => {
    setdelMesModal((prev) => (prev === mesId ? null : mesId));
  }, []);

  // close preview helper
  const closePreview = useCallback(() => {
    if (openImg && openImg.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(openImg);
      } catch {}
    }
    setinpFile(null);
    setOpenImg(null);
    setOpenIsVideo(false);
  }, [openImg]);

  return (
    <div>
      <div>
        {["left", "right", "top", "bottom"].map((anchor) => (
          <React.Fragment key={anchor}>
            <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              <Box
                sx={{
                  width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
                }}
                role="presentation"
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}
                className=" flex flex-col justify-between"
              >
                <div>
                  <p>wdknca w</p>
                  <p>wdknca w</p>
                </div>
              </Box>
            </Drawer>
          </React.Fragment>
        ))}
      </div>

      <div className="w-[1020px] mx-auto p-4 h-[80vh] overflow-y-auto flex flex-col-reverse gap-2">
        {messages &&
          messages.map((e) => {
            const isCurrentUser = e.userId === userId;

            return (
              <div
                key={e.messageId}
                className={`flex items-end max-w-[100%] p-3 rounded-lg group ${
                  isCurrentUser
                    ? " self-end rounded-tr-none flex-row-reverse"
                    : " self-start rounded-tl-none "
                }`}
              >
                <div className={`flex flex-col `}>
                  {e.file &&
                    (isVideoFileName(e.file) ? (
                      <video
                        className="pb-2 rounded-xl max-w-full"
                        width={500}
                        style={{ height: "auto" }}
                        controls
                        preload="metadata"
                        src={`http://37.27.29.18:8003/images/${e.file}`}
                        onError={(ev) =>
                          console.error("video load error:", ev, e.file)
                        }
                      />
                    ) : (
                      <Image
                        className="pb-2 rounded-xl"
                        width={500}
                        height={500}
                        alt="image"
                        src={`http://37.27.29.18:8003/images/${e.file}`}
                        style={{ width: "100%", height: "auto" }}
                        priority
                      />
                    ))}

                  <div
                    className={` rounded-lg ${
                      isCurrentUser
                        ? "bg-blue-500 text-white self-end rounded-tr-none p-1.5 px-3"
                        : "bg-[#F8FAFC] text-[#475569] self-start rounded-tl-none  p-1.5 px-3"
                    }`}
                  >
                    <p className="leading-3">{e.messageText}</p>
                    <span
                      className={`text-[10px] leading-0  self-end ${
                        isCurrentUser ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {new Date(e.sendMassageDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>{" "}
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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelMessage(e.messageId)}
                      className="text-red-500 bg-red-100 p-2 rounded"
                    >
                      <Trash size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setdelMesModal(null)}
                      className="p-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="border-2 min-h-12 max-h-12 m-4 p-2 rounded-xl border-[#E2E8F0] flex justify-between gap-1 items-center">
        <button type="button">
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

        <form onSubmit={handleSend} className="w-full flex justify-between">
          <input
            type="text"
            className="w-1/1 outline-none"
            placeholder="Write your messege..."
            name="inpMessage"
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
                  name="inpImage"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
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
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 
                 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 
                 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 
                 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 
                 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 
                 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </label>
            </div>
          ) : (
            <button type="submit">
              <SendHorizontal />
            </button>
          )}
        </form>

        {openImg && (
          <div
            style={{ backdropFilter: "blur(6px)" }}
            className="fixed inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.3)]"
          >
            {/* modal is NOT a form to avoid nested forms */}
            <div className="w-[400px] bg-white rounded-xl shadow p-5">
              {openIsVideo ? (
                <video
                  ref={videoRef}
                  src={openImg}
                  controls
                  preload="metadata"
                  className="max-h-64 mx-auto mb-4"
                  style={{ width: "100%", height: "auto" }}
                  onError={(ev) => console.error("preview video error:", ev)}
                />
              ) : (
                <img
                  src={openImg}
                  alt="preview"
                  className="max-h-64 mx-auto mb-4"
                  style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                />
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closePreview}
                  className=" text-red-500 px-4 py-2 rounded"
                >
                  <X />
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // send and close preview after
                      handleSend();
                    }}
                    className=" px-4 py-2 rounded mr-2"
                  >
                    <SendHorizontal />
                  </button>
                  <button
                    type="button"
                    onClick={closePreview}
                    className=" px-4 py-2 rounded"
                  >
                    Close
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
