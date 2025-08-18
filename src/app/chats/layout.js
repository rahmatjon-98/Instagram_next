"use client";

import {
  ChevronDown,
  EllipsisVertical,
  Loader2,
  Search,
  Trash,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import img from "@/assets/img/pages/chat/layout/userFoto.jpg";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import { useMyProfile } from "@/store/pages/chat/layout/store";
import { useUserId } from "@/hook/useUserId";
import { useChatById } from "@/store/pages/chat/pages/chat-by-id/store";
import { usegetUserStore } from "@/store/pages/search/store";
import { Skeleton, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import useDarkSide from "@/hook/useDarkSide";

export default function Layout({ children }) {
  const router = useRouter();
  const userId = useUserId();

  const { chats, get, loadingChat } = useDefaultChat();
  const {
    myProfile,
    getMyProfil,
    createChat,
    loadingMyProfil,
    loadingCreateChat,
  } = useMyProfile();

  const { users, getUsers, getSearchHistories } = usegetUserStore();

  const [openModalUsers, setOpenModalUsers] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    get();
    if (userId) getMyProfil(userId);
    getUsers();
    getSearchHistories();
  }, [userId]);

  const allUsers = useMemo(() => users?.data ?? [], [users]);

  useEffect(() => {
    if (!search || !search.trim()) {
      setFilteredUsers(allUsers);
      setLoading(false);
      return;
    }

    setLoading(true);
    const t = setTimeout(() => {
      const q = search.toLowerCase();
      const results = allUsers.filter((u) =>
        String(u.userName ?? "")
          .toLowerCase()
          .includes(q)
      );
      setFilteredUsers(results);
      setLoading(false);
    }, 500);

    return () => clearTimeout(t);
  }, [search, allUsers]);

  const SkeletonRow = () => (
    <Stack direction="row" spacing={2} alignItems="center" className="p-3">
      <Skeleton variant="circular" width={44} height={44} />
      <Stack spacing={0.5} flex={1}>
        <Skeleton variant="text" width="60%" height={14} />
        <Skeleton variant="text" width="40%" height={12} />
      </Stack>
    </Stack>
  );

  let [idx, setIdx] = useState(null);

  async function handleCreateChat(id) {
    try {
      setIdx(id);
      await createChat(id);
      setOpenModalUsers(false);
      await get();

      const chat = useDefaultChat
        .getState()
        .chats?.data?.find(
          (e) => e.receiveUserId === id || e.sendUserId === id
        );

      if (chat?.chatId) {
        router.push(`/chats/${chat.chatId}`);
      } else {
        console.error("Chat not found for this user");
      }

      setSearch("");
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  }

  const [theme] = useDarkSide();

  return (
    <div
      className={`flex ${
        theme == "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="lg:block hidden border-r-2 h-[100vh] border-gray-300 w-[40%]">
        <section className="flex items-center justify-between gap-5 pt-5 px-5">
          <div className="flex items-center gap-2 text-xl font-bold">
            {loadingMyProfil ? (
              <Skeleton variant="text" width={100} height={30} />
            ) : (
              myProfile?.userName
            )}
            <ChevronDown />
          </div>

          <button
            type="button"
            onClick={() => setOpenModalUsers((s) => !s)}
            aria-label="New message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-[#2563EB]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </section>

        <section
          className={`m-2 rounded p-2  flex items-center gap-2 my-3 ${
            theme == "dark" ? "bg-gray-600" : "bg-neutral-100"
          }`}
        >
          <Search className="text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className={` w-9/10 `}
          />
        </section>

        {openModalUsers && (
          <section
            style={{ backdropFilter: "blur(6px)" }}
            className="fixed inset-0 z-20 flex items-center justify-center bg-[rgba(0,0,0,0.3)] "
          >
            <article
              className={`w-[600px]  rounded-2xl space-y-2.5 shadow py-5 border-2 ${
                theme == "dark" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <div className="relative">
                <p className="text-center font-bold text-xl pb-5">
                  Новое сообщение
                </p>
                <button
                  type="button"
                  className="absolute right-5 top-2"
                  onClick={() => setOpenModalUsers(false)}
                >
                  <X />
                </button>

                <div className="flex items-center gap-5 border-y-2 border-gray-200 p-3">
                  <p className="text-[18px] font-bold">Кому:</p>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className={`outline-none w-9/10 `}
                  />
                </div>
              </div>

              <div className="flex flex-col overflow-y-auto h-[50vh] py-3 hidscrol">
                <p className="pb-2 px-5 text-left font-bold">Рекомендуемые</p>

                <div className="flex flex-col">
                  {loadingChat ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  ) : search && search.trim() ? (
                    filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className="hover:bg-[#eeeeee] rounded p-3 flex items-center justify-between cursor-pointer"
                          onClick={() => handleCreateChat(u.id)}
                        >
                          <div className="flex items-center gap-5">
                            {u.avatar ? (
                              <Image
                                src={`http://37.27.29.18:8003/images/${u.avatar}`}
                                width={44}
                                height={44}
                                alt="avatar"
                                className="rounded-full object-cover w-12 h-12"
                                priority
                              />
                            ) : (
                              <User size={44} />
                            )}
                            <div>
                              <p>{u.userName}</p>
                              <p>{u.fullName}</p>
                            </div>
                          </div>
                          {loadingCreateChat && idx == u.id && (
                            <Loader2 className="animate-spin w-5 h-5" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Пользователи не найдены
                      </div>
                    )
                  ) : (
                    allUsers.map((u) => (
                      <div
                        key={u.id}
                        className="hover:bg-[#eeeeee] rounded p-3 flex items-center justify-between cursor-pointer"
                        onClick={() => handleCreateChat(u.id)}
                      >
                        <div className="flex items-center gap-5">
                          {console.log(u.id)}
                          {u.avatar ? (
                            <Image
                              src={`http://37.27.29.18:8003/images/${u.avatar}`}
                              width={44}
                              height={44}
                              alt="avatar"
                              className="rounded-full object-cover w-12 h-12"
                              priority
                            />
                          ) : (
                            <User size={44} />
                          )}
                          <div>
                            <p>{u.userName}</p>
                            <p>{u.fullName}</p>
                          </div>
                        </div>
                        {loadingCreateChat && idx == u.id && (
                          <Loader2 className="animate-spin w-5 h-5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </article>
          </section>
        )}

        <section className="flex items-center justify-between font-medium text-sm px-5 py-3">
          <p className="text-[#64748B]">Messages</p>
          <button type="button" className="text-[#1780C2]">
            Requests
          </button>
        </section>

        <section className="overflow-y-scroll h-[75vh] hidscrol">
          {loadingChat
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : chats &&
              chats.data
                ?.filter((e) =>
                  (e.receiveUserId === userId
                    ? e.sendUserName
                    : e.receiveUserName
                  ).includes(search.toLowerCase())
                )
                .map((e) => (
                  <Link key={e.chatId} href={`/chats/${e.chatId}`}>
                    <div
                      className={`flex items-center gap-3  ${
                        theme == "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                      } p-2`}
                    >
                      {(
                        e.receiveUserId === userId
                          ? e.sendUserImage
                          : e.receiveUserImage
                      ) ? (
                        <Image
                          alt=""
                          src={`http://37.27.29.18:8003/images/${
                            e.receiveUserId === userId
                              ? e.sendUserImage
                              : e.receiveUserImage
                          }`}
                          width={40}
                          height={40}
                          className="w-14 h-14 rounded-full object-cover object-center"
                          priority
                        />
                      ) : (
                        <Image
                          alt=""
                          src={img}
                          width={40}
                          height={40}
                          className="w-14 h-14 rounded-full object-cover"
                          priority
                        />
                      )}

                      <div>
                        {e.receiveUserId === userId
                          ? e.sendUserName
                          : e.receiveUserName}
                      </div>
                    </div>
                  </Link>
                ))}
        </section>
      </div>

      {children}
    </div>
  );
}
