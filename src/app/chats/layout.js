'use client'

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import img from "../../assets/img/pages/chat/pages/default-chat/userFoto.jpg";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import { useMyProfile } from "@/store/pages/chat/layout/store";
import { useUserId } from "@/hook/useUserId";

export default function Layout({ children }) {
  const userId = useUserId();
  let { chats, get } = useDefaultChat();

  let { myProfile, getChatById } = useMyProfile();

  useEffect(() => {
    get();
    getChatById(userId);
  }, []);

  return (
    <div className="flex w-[]">
      <div className="p-5 border-r-2 h-[100vh] border-gray-300 w-[300px]">
        <section className="flex items-center justify-between gap-5 ">
          <div className="flex items-center gap-2 text-xl font-bold">
            {myProfile?.userName}
            <ChevronDown />
          </div>

					<span>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-6 text-[#2563EB]'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
							/>
						</svg>
					</span>
				</section>

				<section className='flex items-center justify-between font-medium text-sm py-5'>
					<p className='text-[#64748B]'>Messages</p>
					<button className='text-[#1780C2]'>Requests</button>
				</section>

        <section>
          {chats &&
            chats?.data?.map((e, i) => (
              <div key={i} className="flex items-center gap-1">
                {e.receiveUserImage ? (
                  <Image
                    alt=""
                    src={`http://37.27.29.18:8003/images/${e.receiveUserImage}`}
                    width={1000}
                    height={1000}
                    className="w-14 h-14 rounded-full object-cover object-center"
                  />
                ) : (
                  <Image
                    alt=""
                    src={img}
                    width={500}
                    height={500}
                    className="w-14 h-14 rounded-full"
                  />
                )}
                <Link href={`/chats/${e.chatId}`}>{e.receiveUserName}</Link>
              </div>
            ))}
        </section>
      </div>

			{children}
		</div>
	)
}
