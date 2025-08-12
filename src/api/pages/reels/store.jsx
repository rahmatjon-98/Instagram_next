import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";


export const useRealsStore = create((set,get) => ({
    rels : [],

    getRels : async (pageNumber = 1, pageSize = 100) => {

        let token = localStorage.getItem('access_token')

        try {
            let response = await axiosRequest.get("http://37.27.29.18:8003/Post/get-reels", {
                headers : {
                    Authorization : `Bearer ${token}` 
                },
                params : {
                    pageNumber : pageNumber,
                    pageSize : pageSize
                }
            })

            set ({rels : response.data.data})

        } catch (error) {
            console.error(error);
        }
    }

}))