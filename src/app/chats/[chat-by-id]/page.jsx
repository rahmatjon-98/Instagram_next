"use client";
import { useUserId } from "@/hook/useUserId";
import { useChatById } from "@/store/pages/chat/pages/chat-by-id/store";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  EllipsisVertical,
  InboxIcon,
  MailIcon,
  Mic,
  SendHorizontal,
  Trash,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ChatById() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  let { "chat-by-id": id } = useParams();
  const userId = useUserId();

  let { messages, getChatById, sendMessage, deleteMessage } = useChatById();
  let { chats, get } = useDefaultChat();

  let [profilId, setprofilId] = useState(null);

  chats?.data?.map((e) => {
    if (e.id == id) {
      setprofilId(e.receiveUserId);
      console.log(e.receiveUserId);
      return e.receiveUserId;
    }
  });

  useEffect(() => {
    get();
    if (id) {
      setInterval(() => {
        getChatById(id);
      }, 3000);
    }
  }, [id, getChatById]);

  let [inpMessage, setinpMessage] = useState("");
  let [inpFile, setinpFile] = useState(null);
  let [openImg, setOpenImg] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setinpFile(file);
    setOpenImg(URL.createObjectURL(file));
  };

  const handleSend = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("ChatId", id);
    formData.append("MessageText", inpMessage);

    if (inpFile) {
      formData.append("File", inpFile);
    }

    await sendMessage(formData);
    getChatById(id);
    setinpMessage("");
    setinpFile(null);
    setOpenImg(null);
  };

  async function handleDelMessage(mesId) {
    await deleteMessage(mesId);
    getChatById(id);
  }

  let [delMesModal, setdelMesModal] = useState(null);

  function openDelModal(id) {
    setdelMesModal(delMesModal == id ? null : id);
  }

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
                  {e.file && (
                    <Image
                      className="pb-2 rounded-xl"
                      width={500}
                      height={500}
                      alt="image"
                      src={`http://37.27.29.18:8003/images/${e.file}`}
                      style={{ width: "100%", height: "auto" }}
                      priority
                    />
                  )}

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
                  onClick={() => openDelModal(e.messageId)}
                  className="hidden group-hover:block"
                >
                  <EllipsisVertical />
                </button>

                {delMesModal == e.messageId && (
                  <button
                    onClick={() => handleDelMessage(e.messageId)}
                    className="text-red-500 bg-red-100 p-2 rounded
                    "
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            );
          })}
      </div>

      <div className="border-2 min-h-12 max-h-12 m-4 p-2 rounded-xl border-[#E2E8F0] flex justify-between gap-1 items-center">
        <button>
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
            <form
              onSubmit={handleSend}
              className="w-[400px] bg-white rounded-xl shadow p-5"
            >
              <img
                src={openImg}
                alt="preview"
                className="max-h-64 mx-auto mb-4"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setinpFile(null);
                    setOpenImg(null);
                  }}
                  className=" text-red-500 px-4 py-2 rounded"
                >
                  <X />
                </button>

                <button type="submit" className=" px-4 py-2 rounded mr-2">
                  <SendHorizontal />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
