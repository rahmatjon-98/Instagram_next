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
    } catch (error) {
      console.error(error);
    }
  },

  sendMessage: async (formData) => {
    await axiosRequest.put(`/Chat/send-message`, formData);
  },

  deleteMessage: async (id) => {
    await axiosRequest.delete(`/Chat/delete-message?massageId=${id}`);
  },

  deleteChat: async (id) => {
    await axiosRequest.delete(`/Chat/delete-chat?chatId=${id}`);
  },
}));
