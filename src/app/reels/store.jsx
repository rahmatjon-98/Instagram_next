import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";
import { comment } from "postcss";

export const useRealsStore = create((set, get) => ({
  rels: [],
  currentIdx: 0,
  currentUserName: "",
  currentUserImage: "",
  setCurrentIdx: (idx) => set({ currentIdx: idx }),

  setCurrentUserInfo: ({ name, image }) =>
    set({
      currentUserName: name,
      currentUserImage: image,
    }),

  getRels: async (pageNumber = 1, pageSize = 100) => {
    try {
      let response = await axiosRequest.get("/Post/get-reels", {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      set({
        rels: response.data.data.map((reel) => ({
          ...reel,
          isLiked: reel.postLike,
          images: reel.images || "",
          userImage: reel.userImage || "",
          comments: reel.comments || [],
        })),
      });
    } catch (error) {
      console.error(error);
    }
  },

  likeReals: async (postId) => {
    try {
      const response = await axiosRequest.post(
        `/Post/like-post?postId=${postId}`,
        {}
      );
      if (response.data.statusCode === 200) {
        set((state) => ({
          rels: state.rels.map((reel) =>
            reel.postId === postId
              ? {
                  ...reel,
                  isLiked: !reel.isLiked,
                  postLikeCount: reel.isLiked
                    ? reel.postLikeCount - 1
                    : reel.postLikeCount + 1,
                }
              : reel
          ),
        }));
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  },

  followUser: async (id) => {
    try {
      await axiosRequest.post(
        `/FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`
      );
      set((state) => ({
        rels: state.rels.map((reel) => {
          if (reel.userId === id) {
            return {
              ...reel,
              isSubscriber: true,
              subscribersCount: reel.subscribersCount
                ? reel.subscribersCount + 1
                : 1,
            };
          }
          return reel;
        }),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  unfollowUser: async (id) => {
    try {
      await axiosRequest.delete(
        `/FollowingRelationShip/delete-following-relation-ship?followingUserId=${id}`
      );
      set((state) => ({
        rels: state.rels.map((reel) => {
          if (reel.userId === id) {
            return {
              ...reel,
              isSubscriber: false,
              subscribersCount: reel.subscribersCount
                ? reel.subscribersCount - 1
                : 0,
            };
          }
          return reel;
        }),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  addNewComent: async ({ postId, commentText }) => {
    const { currentUserName, currentUserImage } = get(); // ← БИНЕД: get() истифода шуд

    try {
      const response = await axiosRequest.post("/Post/add-comment", {
        comment: commentText,
        postId: postId,
      });

      if (response?.data?.statusCode === 200) {
        const savedComment = response.data.data;
        if (!savedComment) {
          console.warn("Комментарияи баргардондашуда маълумот надорад");
          return;
        }

        set((state) => {
          const updatedRels = state.rels.map((reel) => {
            if (reel.postId === postId) {
              return {
                ...reel,
                comments: [...(reel.comments || []), {
                  comment:commentText,
                  currentUserImage:currentUserImage,
                  currentUserName:currentUserName
                }],
                commentCount: (reel.commentCount || 0) + 1,
              };
            }
            return reel;
          });

          return { rels: updatedRels };
        });
      }
    } catch (error) {
      console.log("Хатогӣ ҳангоми иловаи коммент:", error);
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      const response = await axiosRequest.delete(
        `/Post/delete-comment?commentId=${commentId}&postId=${postId}`,
        {}
      );

      if (response?.data?.statusCode === 200 && response?.data?.data === true) {
        set((state) => {
          const idx = state.currentIdx;
          const reel = state.rels[idx];
          if (!reel || reel.postId !== postId) return state;

          return {
            rels: state.rels.map((r) =>
              r.postId === postId
                ? {
                    ...r,
                    comments: (r.comments || []).filter(
                      (c) => c.commentId !== commentId
                    ),
                    commentCount: Math.max((r.commentCount || 0) - 1, 0),
                  }
                : r
            ),
          };
        });
      }
    } catch (error) {
      console.error("Ошибка при удалении комментария:", error);
    }
  },
}));
