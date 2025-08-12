import axiosRequest from "@/lib/axiosRequest";
// import axios from "axios";
import { create } from "zustand";
// let api = "http://37.27.29.18:8003";

export const useUserStore = create((set, get) => ({
  user: [],
  postById:{},
  fechUser: async () => {
    // const token = localStorage.getItem("accessToken")
    try {
      let res = await axiosRequest.get(`/Post/get-posts?PageSize=10000`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      set({ user: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  getPostById:async(id)=>{
    try {
     let {data}= await axiosRequest.get(`Post/get-post-by-id?id=${id}`)
      set({postById:data})
    } catch (error) {
      console.error(error);
      
    }
  }

}));
