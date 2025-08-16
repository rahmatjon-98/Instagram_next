import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

let api = 'http://37.27.29.18:8003/'

export const useProfileByIdStore = create((set, get) => ({
    users: [],
    chats: [],
    posts: [],
    getProfileById: async (id) => {
        try {
            let { data } = await axiosRequest.get(`${api}UserProfile/get-user-profile-by-id?id=${id}`)
            set({ users: data })
        } catch (error) {
            console.error(error)
        }
    },
    getChats: async () => {
        let { data } = await axiosRequest.get(`Chat/get-chats`)
        set({ chats: data })
    },
    addChats: async (id) => {
        await axiosRequest.post(`Chat/create-chat?receiverUserId=${id}`)
        await get().getChats()
    },
    getPostById: async (id) => {
        let { data } = await axiosRequest.get(`Post/get-post-by-id?id=${id}`)
        set({ posts: data })
    },
}))