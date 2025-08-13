import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";


export const useRealsStore = create((set,get) => ({
    rels : [],
    currentIdx: 0,
    
    setCurrentIdx: (idx) => set({ currentIdx: idx }),

    getRels : async (pageNumber = 1, pageSize = 100) => {
        try {
            let response = await axiosRequest.get("/Post/get-reels", {
                params : {
                    pageNumber : pageNumber,
                    pageSize : pageSize
                }
            })

            set ({
              rels : response.data.data.map((reel) => ({
                ...reel,
                isLiked: reel.postLike, 
                images: reel.images || "", 
                userImage: reel.userImage || "",
              }))
            })

        } catch (error) {
            console.error(error);
        }
    },

    
    likeReals: async (postId) => {
      try {
        const response = await axiosRequest.post(`/Post/like-post?postId=${postId}`, {});
        if (response.data.statusCode === 200) {
          set((state) => ({
            rels: state.rels.map((reel) =>
              reel.postId === postId
                ? {
                    ...reel,
                    isLiked: !reel.isLiked, 
                    postLikeCount: reel.isLiked ? reel.postLikeCount - 1 : reel.postLikeCount + 1, // Тағйири postLikeCount
                  }
                : reel
            ),
          }));
        }
      } catch (error) {
        console.error("Error liking/unliking post:", error);
      }
    },


    
}))