import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useDefaultChat = create((set) => ({
  chats: [],

  get: async () => {
    try {
      const { data } = await axiosRequest.get(`/Chat/get-chats`);
      set({ chats: data });
    } catch (error) {
      console.error(error);
    }
  },
}));
