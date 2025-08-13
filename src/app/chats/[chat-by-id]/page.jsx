"use client";
import { useUserId } from "@/hook/useUserId";
import { useChatById } from "@/store/pages/chat/pages/chat-by-id/store";
import { Mic } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ChatById() {
	let { 'chat-by-id': id } = useParams()
	let { messages, getChatById } = useChatById()

  const userId = useUserId();

	useEffect(() => {
		if (id) {
			getChatById(id)
		}
	}, [id, getChatById])

  return (
    <div>
      <div className="w-[1000px] mx-auto p-4 h-[85vh] overflow-y-auto flex flex-col-reverse gap-2">
        {messages &&
          messages.map((e) => {
            const isCurrentUser = e.userId === userId;

            return (
              <div
                key={e.messageId}
                className={`flex flex-col max-w-[70%] p-3 rounded-lg ${
                  isCurrentUser
                    ? "bg-blue-500 text-white self-end rounded-tr-none"
                    : "bg-[#F8FAFC] text-[#475569] self-start rounded-tl-none"
                }`}
              >
                {e.file && (
                  <Image
                    width={500}
                    height={500}
                    alt="image"
                    src={`http://37.27.29.18:8003/images/${e.file}`}
                  />
                )}
                <p>{e.messageText}</p>
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

      <div className="border-2 m-4 p-2 rounded-xl border-[#E2E8F0] flex justify-between items-center">
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
        <div className="flex items-center gap-2">
          <Mic />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
