"use client";
import { useChatById } from "@/api/pages/chat/pages/chat-by-id/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ChatById() {
  let { "chat-by-id": id } = useParams();
  let { messages, getChatById } = useChatById();

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (id) {
      getChatById(id);
    }
  }, [id, getChatById]);

  return (
    <div className="w-[1000px] mx-auto p-4 h-[80vh] overflow-y-auto flex flex-col-reverse gap-2">
      {messages &&
        messages.map((e) => {
          const isCurrentUser = e.userId === currentUserId;

          return (
            <div
              key={e.messageId}
              className={`flex flex-col max-w-[70%] p-3 rounded-lg ${
                isCurrentUser
                  ? "bg-blue-500 text-white self-end rounded-tr-none"
                  : "bg-[#F8FAFC] text-[#475569] self-start rounded-tl-none"
              }`}
            >
              <p>{e.messageText}</p>
              {/* {e.file && <Image src={`${e.file}`} />} */}
              <span className="text-xs mt-1 text-gray-300 self-end">
                {new Date(e.sendMassageDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
    </div>
  );
}
