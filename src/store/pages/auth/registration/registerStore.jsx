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
  addLogin: async (newUser) => {
  try {
    const result = await axios.post(`${API}/Account/login`, newUser);
    const token = await result.data.token;
    
    set((state) => ({
      users: [...state.users, result.data],
    }));

    console.log("User logged in:",await result.data);
    return { success: true, token, data: await result.data }; 
  } catch (error) {
    console.error("Login failed:", error.response || error.message || error);
    return { success: false, error: error.response || error.message || error }; 
  }
}
}));
