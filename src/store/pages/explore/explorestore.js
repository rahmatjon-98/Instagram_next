import { useUserId } from "@/hook/useUserId";
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
  postById: {},
  fechUser: async () => {
    try {
      let res = await axiosRequest.get(`/Post/get-posts?PageSize=10000`, {});
      set({ user: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  getPostById: async (id) => {
    try {
      let { data } = await axiosRequest.get(`Post/get-post-by-id?id=${id}`);
      set({ postById: data });
    } catch (error) {
      console.error(error);
    }
  },

  deletComit: async (commentId) => {
    try {
      await axiosRequest.delete(`/Post/delete-comment?commentId=${commentId}`);

      const currentPost = get().postById;

      if (currentPost?.data?.comments) {
        const updatedComments = currentPost.data.comments.filter(
          (c) => c.postCommentId !== commentId
        );

        set({
          postById: {
            ...currentPost,
            data: {
              ...currentPost.data,
              comments: updatedComments,
            },
          },
        });
      }
      
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  },

  AddComit: async (comment, postId) => {
    try {
      const res = await axiosRequest.post("/Post/add-comment", {
        comment,
        postId,
      });

      const currentPost = get().postById;
      const users = get().user.data;
      set({
        postById: {
          ...currentPost,
          data: {
            ...currentPost.data,
            comments: [
              ...currentPost.data.comments,
              {
                postCommentId: Date.now(),
                userId: useUserId(),
                dateCommented: Date.now(),
                comment,
              },
            ],
          },
        },
      });
      const findPost = users.find((e) => e.postId == postId);
      findPost.commentCount += 1;
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  },

  // Follow:async(FollowId)=>{
  //   try {
  //     await axiosRequest.post(`/FollowingRelationShip/add-following-relation-ship?followingUserId=${FollowId}`)
  //     set(state=>({
  //       user:state.user.map(el=>el.userId==FollowId?{...el,}:null)
  //     }))
  //   } catch (error) {
  //     console.error(error);
      
  //   }
  // }
}));
