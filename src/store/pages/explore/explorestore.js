import { useUserId } from "@/hook/useUserId";
import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  user: [],
  postById: {},
  FolowUser:[],
  f:false,
  fechUser: async () => {
    try {
      let res = await axiosRequest.get(`/Post/get-posts?PageSize=10000`, {});
      set({ user: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  getUsersFollow: async (id) => {
    try {
      const res = await axiosRequest.get(
        `/FollowingRelationShip/get-subscriptions?UserId=${id}`
      );
      console.log(res.data)
      set({FolowUser:res.data});
    } catch (err) {
      console.error(err);
    }
  },
  getPostById: async (id) => {
    try {
      let { data } = await axiosRequest.get(`Post/get-post-by-id?id=${id}`);
      set((state) => ({
        postById: {
          ...data,
          data: {
            ...data.data,
            isFollowing:state.FolowUser?.data?.some(e => e.userShortInfo.userId==data.data.userId)
          },
        }
      }));
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

  Follow: async (FollowId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Токен не найден");

      const currentPost = get().postById;
      if (!currentPost?.data) return;
 
      set({
        postById: {
          ...currentPost,
          data: {
            ...currentPost.data,
            isFollowing: true,
            subscribersCount: (currentPost.data.subscribersCount || 0) + 1,
          },
        },
        f:true
      });

      await fetch(
        `http://37.27.29.18:8003/FollowingRelationShip/add-following-relation-ship?followingUserId=${FollowId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
    } catch (err) {
      console.error("Follow error", err);
      set({ postById: get().postById });
    }
  },

  unfollowUser: async (UnfollowId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Токен не найден");

      const currentPost = get().postById;
      if (!currentPost?.data) return;
 
      set({
        postById: {
          ...currentPost,
          data: {
            ...currentPost.data,
            isFollowing: false,
            subscribersCount: Math.max(
              (currentPost.data.subscribersCount || 0) - 1,
              0
            ),
          },
        },
        f:false
      });

      await fetch(
        `http://37.27.29.18:8003/FollowingRelationShip/delete-following-relation-ship?followingUserId=${UnfollowId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
    } catch (err) {
      console.error("Unfollow error", err);
      set({ postById: get().postById });
    }
  },

  likePost: async (postId) => {
    const prevPosts = get().user;
    const prevPostById = get().postById;

    set((state) => ({
      user: {
        ...state.user,
        data: state.user.data.map((post) =>
          post.postId === postId
            ? {
                ...post,
                postLike: !post.postLike,
                postLikeCount: post.postLike
                  ? post.postLikeCount - 1
                  : post.postLikeCount + 1,
              }
            : post
        ),
      },
      postById:
        prevPostById?.data?.postId === postId
          ? {
              ...prevPostById,
              data: {
                ...prevPostById.data,
                postLike: !prevPostById.data.postLike,
                postLikeCount: prevPostById.data.postLike
                  ? prevPostById.data.postLikeCount - 1
                  : prevPostById.data.postLikeCount + 1,
              },
            }
          : prevPostById,
    }));

    try {
      await axiosRequest.post(`/Post/like-post?postId=${postId}`, {});
    } catch (error) {
      console.error("Error in Like", error);
      set({ user: prevPosts, postById: prevPostById });
    }
  },
}));
