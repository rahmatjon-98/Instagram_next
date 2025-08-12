import axios from "axios";
import { create } from "zustand";

const API = "http://37.27.29.18:8003";
export const useRegisterStore = create((set) => ({
  users: [],
  addUser: async (newUser) => {
    try {
      const res = await axios.post(`${API}/Account/register`, newUser);
      set((state) => ({
        users: [...state.users, res.data],
      }));
      console.log("User registered:", res.data);
      return { success: true, data: res.data }; 
    } catch (error) {
      console.error("Registration failed:", error.response || error.message || error);
      return { success: false, error: error.response || error.message || error }; 
    }
  },
}));
