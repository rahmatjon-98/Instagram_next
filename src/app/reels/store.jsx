import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useRealsStore = create((set, get) => ({
  rels: [],
  currentIdx: 0,
  currentUserName: "",
  currentUserImage: "",
  currentUserId: "",

  setCurrentIdx: (idx) => set({ currentIdx: idx }),

  extractUserFromToken: () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.warn("Токен ёфт нашуд! Илтимос, ворид шавед.");
      return null;
    }

    try {
      const payload = token.split('.')[1]; 
      const decodedPayload = atob(payload); 
      const parsed = JSON.parse(decodedPayload);

      return {
        userId: parsed.sid || "",
        userName: parsed.name || "Номаълум",
        userImage: parsed.sub || "",
      };
    } catch (error) {
      console.error("Хатогии декод кардани токен:", error.message);
      return null;
    }
  },


  initUserFromToken: () => {
    const userInfo = get().extractUserFromToken();
    if (userInfo) {
      set({
        currentUserId: userInfo.userId,
        currentUserName: userInfo.userName,
        currentUserImage: userInfo.userImage,
      });
    }
  },

  getRels: async (pageNumber = 1, pageSize = 100) => {
    get().initUserFromToken();
    try {
      let response = await axiosRequest.get("/Post/get-reels", {
        params: { pageNumber, pageSize },
      });

      set({
        rels: response.data.data.map((reel) => ({
          ...reel,
          isLiked: reel.postLike || false,
          images: reel.images || "",
          userImage: reel.userImage || "",
          comments: reel.comments || [],
        })),
      });
    } catch (error) {
      console.error("Хатогии гирифтани рилс:", error.message, error.response?.data);
    }
  },


  likeReals: async (postId) => {
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

    try {
      const response = await axiosRequest.post(
        `/Post/like-post?postId=${postId}`,
        {},
      );

      if (response.data.statusCode !== 200) {
        throw new Error("Like API error");
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error.message, error.response?.data);
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
  },

  followUser: async (id) => {
    set((state) => ({
      rels: state.rels.map((reel) =>
        reel.userId === id
          ? {
              ...reel,
              isSubscriber: true,
              subscribersCount: (reel.subscribersCount || 0) + 1,
            }
          : reel
      ),
    }));

    try {
      await axiosRequest.post(
        `/FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`,
        {},
      );
    } catch (error) {
      console.error("Хатогии пайравӣ кардан:", error.message, error.response?.data);
    }
  },

  unfollowUser: async (id) => {
    set((state) => ({
      rels: state.rels.map((reel) =>
        reel.userId === id
          ? {
              ...reel,
              isSubscriber: false,
              subscribersCount: Math.max(
                (reel.subscribersCount || 1) - 1,
                0
              ),
            }
          : reel
      ),
    }));

    try {
      await axiosRequest.delete(
        `/FollowingRelationShip/delete-following-relation-ship?followingUserId=${id}`,
      );
    } catch (error) {
      console.error("Хатогии қатъи пайравӣ:", error.message, error.response?.data);
    }
  },

  addNewComent: async ({ postId, commentText }) => {
    const { currentUserName, currentUserImage, currentUserId } = get();

    if (!currentUserId) {
      console.warn("Идентификатори корбар ёфт нашуд");
      return;
    }

    const tempCommentId = `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const newComment = {
      postCommentId: tempCommentId,
      userId: currentUserId,
      userName: currentUserName || "Номаълум",
      userImage: currentUserImage || "",
      dateCommented: new Date().toISOString(),
      comment: commentText,
    };

    set((state) => ({
      rels: state.rels.map((reel) =>
        reel.postId === postId
          ? {
              ...reel,
              comments: [...(reel.comments || []), newComment],
              commentCount: (reel.commentCount || 0) + 1,
            }
          : reel
      ),
    }));

    try {
      const response = await axiosRequest.post(
        "/Post/add-comment",
        {
          comment: commentText,
          postId,
        },
      );

      if (response.data.statusCode === 200) {
        const newCommentId = response.data.data?.commentId || tempCommentId;
        set((state) => ({
          rels: state.rels.map((reel) =>
            reel.postId === postId
              ? {
                  ...reel,
                  comments: (reel.comments || []).map((comment) =>
                    comment.postCommentId === tempCommentId
                      ? { ...comment, postCommentId: newCommentId }
                      : comment
                  ),
                }
              : reel
          ),
        }));
      } else {
        throw new Error(`Хатогии иловаи шарҳ: Status ${response.data.statusCode}`);
      }
    } catch (error) {
      console.error("Хатогии иловаи шарҳ:", error.message, error.response?.data);
      set((state) => ({
        rels: state.rels.map((reel) =>
          reel.postId === postId
            ? {
                ...reel,
                comments: (reel.comments || []).filter(
                  (c) => c.postCommentId !== tempCommentId
                ),
                commentCount: Math.max((reel.commentCount || 1) - 1, 0),
              }
            : reel
        ),
      }));
    }
  },

  deleteComment: async (postId, commentId) => {
    const { rels, currentUserId } = get();
    const reel = rels.find((r) => r.postId === postId);
    const comment = reel?.comments?.find((c) => c.postCommentId === commentId);

    if (!reel || !comment) {
      console.warn("Рил ё комментарий ёфт нашуд!");
      return;
    }

    if (comment.userId !== currentUserId && reel.userId !== currentUserId) {
      console.warn("Шумо иҷозати нест кардани ин комментарийро надоред!");
      return;
    }

    set({
      rels: rels.map((r) =>
        r.postId === postId
          ? {
              ...r,
              comments: r.comments.filter((c) => c.postCommentId !== commentId),
              commentCount: Math.max((r.commentCount || 0) - 1, 0),
            }
          : r
      ),
    });

    try {
      const response = await axiosRequest.delete(
        `/Post/delete-comment?commentId=${commentId}`,
      );

      if (response.data.statusCode !== 200 || !response.data.data) {
        throw new Error("Хатогии API барои нест кардани комментарий");
      }
    } catch (error) {
      console.error("Хатогии нест кардани комментарий:", error.message, error.response?.data);
      set({
        rels: rels.map((r) =>
          r.postId === postId
            ? {
                ...r,
                comments: [...r.comments, comment].sort(
                  (a, b) => new Date(a.dateCommented) - new Date(b.dateCommented)
                ),
                commentCount: (r.commentCount || 0) + 1,
              }
            : r
        ),
      });
    }
  },
}));