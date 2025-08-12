import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";


// import axios from "axios";
// let api = "http://37.27.29.18:8003";
// headers: {
//   Authorization: `Bearer ${token}`,
// },
// const token = localStorage.getItem("accessToken")



export const useUserStore = create((set, get) => ({
  user: [],
  postById:{},
  fechUser: async () => {
    try {
      let res = await axiosRequest.get(`/Post/get-posts?PageSize=10000`, {
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
