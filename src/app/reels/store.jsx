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
    const { currentUserId, currentUserName, currentUserImage } = get();
    if (!currentUserId) return;

    const tempId = `temp_${Date.now()}`;
    const tempComment = {
      postCommentId: tempId,
      userId: currentUserId,
      userName: currentUserName,
      userImage: currentUserImage,
      dateCommented: new Date().toISOString(),
      comment: commentText,
    };

    // локально добавляем
    set((state) => ({
      rels: state.rels.map((r) =>
        r.postId === postId
          ? {
              ...r,
              comments: [...r.comments, tempComment],
              commentCount: (r.commentCount || 0) + 1,
            }
          : r
      ),
    }));

    try {
      const res = await axiosRequest.post("/Post/add-comment", {
        comment: commentText,
        postId,
      });
      const realId = res.data.data?.commentId;

      if (realId) {
        // заменяем tempId на реальный
        set((state) => ({
          rels: state.rels.map((r) =>
            r.postId === postId
              ? {
                  ...r,
                  comments: r.comments.map((c) =>
                    c.postCommentId === tempId
                      ? { ...c, postCommentId: realId }
                      : c
                  ),
                }
              : r
          ),
        }));
      }
    } catch (err) {
      console.error("Ошибка при добавлении комментария:", err.message);
      // убираем временный, если API упал
      set((state) => ({
        rels: state.rels.map((r) =>
          r.postId === postId
            ? {
                ...r,
                comments: r.comments.filter(
                  (c) => c.postCommentId !== tempId
                ),
                commentCount: Math.max((r.commentCount || 1) - 1, 0),
              }
            : r
        ),
      }));
    }
  },

 // В deleteComment: сравнение через String(...) и добавим логирование при отказе
 deleteComment: async (postId, commentId) => {
  const { rels, currentUserId } = get();
  const reel = rels.find((r) => String(r.postId) === String(postId));
  const comment = reel?.comments?.find(
    (c) => String(c.postCommentId) === String(commentId)
  );
  if (!reel || !comment) return;

  // если это временный коммент — удаляем только локально
  if (String(commentId).startsWith("temp_")) {
    set({
      rels: rels.map((r) =>
        r.postId === postId
          ? {
              ...r,
              comments: r.comments.filter(
                (c) => String(c.postCommentId) !== String(commentId)
              ),
              commentCount: Math.max((r.commentCount || 1) - 1, 0),
            }
          : r
      ),
    });
    return;
  }

  // удаляем из стора сразу
  set({
    rels: rels.map((r) =>
      r.postId === postId
        ? {
            ...r,
            comments: r.comments.filter(
              (c) => String(c.postCommentId) !== String(commentId)
            ),
            commentCount: Math.max((r.commentCount || 0) - 1, 0),
          }
        : r
    ),
  });

  try {
    await axiosRequest.delete(
      `/Post/delete-comment?commentId=${commentId}`
    );
  } catch (err) {
    console.error("Ошибка удаления комментария:", err.message);
    // откат — возвращаем коммент
    set({
      rels: rels.map((r) =>
        r.postId === postId
          ? {
              ...r,
              comments: [...r.comments, comment].sort(
                (a, b) =>
                  new Date(a.dateCommented) - new Date(b.dateCommented)
              ),
              commentCount: (r.commentCount || 0) + 1,
            }
          : r
      ),
    });
  }
},

  

  
}));