import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

let api = 'http://37.27.29.18:8003/'

export const useProfileByIdStore = create((set, get) => ({
    users: [],
    getProfileById: async (id) => {
        try {
            let { data } = await axiosRequest.get(`${api}UserProfile/get-user-profile-by-id?id=${id}`)
            set({ users: data })
        } catch (error) {
            console.error(error)
        }
    }
}))