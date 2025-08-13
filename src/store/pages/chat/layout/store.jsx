import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useMyProfile = create((set) => ({
  myProfile: [],
  getChatById: async () => {
    try {
      const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
      set({ myProfile: data.data });
    } catch (error) {
      console.error(error);
    }
  },

  sendMessage: async (mes) => {
    await axiosRequest.post(`/Chat/send-message`, mes);
  },
}));
