import axios from "axios";
import { create } from "zustand";
let api = "http://37.27.29.18:8003";

export const useUserStore = create((set, get) => ({
  user: [],
  fechUser: async () => {
    const token = localStorage.getItem("accessToken")
    try {
      let res = await axios.get(`${api}/Post/get-posts?PageSize=10000`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ user: res.data });
    } catch (error) {
      console.error(error);
    }
  },
}));
