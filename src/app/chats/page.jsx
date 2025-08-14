"use client";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import Image from "next/image";
import { useEffect } from "react";
import img from "../../assets/img/pages/chat/pages/chat-by-id/icon.png";

export default function DefaultChat() {
  return (
    <div className="w-[1000px] flex items-center justify-center">
      <div className="w-[400px] text-center flex flex-col items-center justify-center">
        <Image
          src={img.src}
          alt="image"
          width={1000}
          height={1000}
          className="w-30 h-30"
          priority
        />
        <p className="font-medium text-[#1E293B]">Your messages</p>
        <p className="text-[#64748B] text-xs">
          Send private photos and messages to a friend or group
        </p>
      </div>
    </div>
  );
}
