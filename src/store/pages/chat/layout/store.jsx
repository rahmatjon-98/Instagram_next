import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useMyProfile = create((set) => ({
  myProfile: [],
  users: [],
  getChatById: async () => {
    try {
      const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
      set({ myProfile: data.data });
    } catch (error) {
      console.error(error);
    }
  },

  getUsers: async () => {
    try {
      let { data } = await axiosRequest.get(`/User/get-users`);
      set({ users: data });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  },

  createChat: async (id) => {
    try {
      await axiosRequest.post(`/Chat/create-chat?receiverUserId=${id}`);
    } catch (error) {
      console.error(error);
    }
  },
}));
