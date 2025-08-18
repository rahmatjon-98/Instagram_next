"use client";

import {
    Loader2,
    Send,
    User,
    X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import { useMyProfile } from "@/store/pages/chat/layout/store";
import { useUserId } from "@/hook/useUserId";
import { usegetUserStore } from "@/store/pages/search/store";
import { Skeleton, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import useDarkSide from "@/hook/useDarkSide";
import Link from "next/link";

const ModalUsers = () => {

    const router = useRouter();
    const userId = useUserId();

    const { chats, get, loadingChat } = useDefaultChat();
    const {
        getMyProfil,
        createChat,
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
            await get();

            const chat = useDefaultChat
                .getState()
                .chats?.data?.find(
                    (e) => e.receiveUserId === id || e.sendUserId === id
                );

            setOpenModalUsers(false);

            console.log(chats?.chatId);

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






    return (
        <div>
            <button
                type="button"
                onClick={() => setOpenModalUsers((s) => !s)}
                aria-label="New message"
                className="cursor-pointer hover:text-blue-500 text-gray-500"
            >
                <Send />

            </button>
            <div className={` bg-white text-black`}>
                {openModalUsers && (
                    <section
                        style={{ backdropFilter: "blur(6px)" }}
                        className="fixed inset-0 z-20 flex items-center justify-center bg-[rgba(0,0,0,0.6)]"
                    >
                        <article className="w-[600px] bg-white rounded-2xl space-y-2.5 shadow py-5">
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

                            <div className="flex flex-col overflow-y-auto h-[50vh] py-3">
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
                                        chats.data?.map((e) => (
                                            <Link
                                                key={e.chatId}
                                                href={`/chats/${e.chatId}`}
                                                onClick={() => setLocale(e)}
                                            >
                                                <div className="flex items-center gap-1 hover:bg-gray-200 p-2">
                                                    {(
                                                        e.receiveUserId === userId
                                                            ? e.sendUserImage
                                                            : e.receiveUserImage
                                                    ) ? (
                                                        <Image
                                                            alt=""
                                                            src={`http://37.27.29.18:8003/images/${e.receiveUserId === userId
                                                                    ? e.sendUserImage
                                                                    : e.receiveUserImage
                                                                }`}
                                                            width={40}
                                                            height={40}
                                                            className="w-10 h-10 rounded-full object-cover object-center"
                                                            priority
                                                        />
                                                    ) : (
                                                        <Image
                                                            alt=""
                                                            src={img}
                                                            width={40}
                                                            height={40}
                                                            className="w-10 h-10 rounded-full object-cover"
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
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* <div className="flex justify-center">
                <button
                  className="w-9/10 text-center bg-blue-500 mx-5 text-white rounded py-1"
                  onClick={() => setOpenModalUsers(false)}
                >
                  Close
                </button>
              </div> */}
                        </article>
                    </section>
                )}
            </div>
        </div>
    )
}

export default ModalUsers






