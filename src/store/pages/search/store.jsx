import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

let api = 'http://37.27.29.18:8003'

export const usegetUserStore = create((set, get) => ({
    users: [],
    searchHistories: [],
    openModal: false,
    setOpenModal: () => set((state) => ({ openModal: !state.openModal })),
    getUsers: async () => {
        try {
            let { data } = await axiosRequest.get(`/User/get-users?PageSize=${1000}`);
            set({ users: data })
        } catch (error) {
            console.error(error);
        }
    },
    getSearchHistories: async () => {
        try {
            let { data } = await axiosRequest.get('/User/get-user-search-histories')
            set({ searchHistories: data })
        } catch (error) {
            console.error("Error fetching search histories:", error)
        }
    },
    addUserHistory: async (id) => {
        try {
            await axiosRequest.post(`User/add-user-search-history?UserSearchId=${id}`)
            await get().getSearchHistories()
        } catch (error) {
            console.error(error)
        }
    },
    deleteUserHistory: async (id) => {
        try {
            await axiosRequest.delete(`User/delete-user-search-history?id=${id}`)
            await get().getSearchHistories()
        } catch (error) {
            console.error(error)
        }
    },
    clearUserHistory: async () => {
        try {
            await axiosRequest.delete(`/User/delete-user-search-histories`)
            await get().getSearchHistories()
        } catch (error) {
            console.error(error)
        }
    },
}))