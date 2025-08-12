import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useChatById = create((set) => ({
  messages: [],
  getChatById: async (id) => {
    try {
      const { data } = await axiosRequest.get(
        `/Chat/get-chat-by-id?chatId=${id}`
      );
      set({ messages: data.data });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  },
}));
