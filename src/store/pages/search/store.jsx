import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

let api = 'http://37.27.29.18:8003'

export const usegetUserStore = create((set) => ({
    users: [],
    getUsers: async () => {
        try {
            let { data } = await axiosRequest.get(`/User/get-users`)
            set({ users: data })
        } catch (error) {
            console.error(error)
        }
    },
}))