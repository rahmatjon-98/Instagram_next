// "use client"
// import { useUserStore } from '@/store/pages/explore/explorestore'
// import React from 'react'
// import Box from '@mui/material/Box'
// import Modal from '@mui/material/Modal'
// import CommentInput from "@/components/pages/explore/Emogi"
// import { useUserId } from "@/hook/useUserId"
// import { useRouter } from "next/navigation"
// import { useMediaQuery } from '@mui/material'
// import { Bookmark, CircleUserRound, Heart, MessageCircle, Send, SendHorizontal, Smile, Volume2, VolumeX, X } from "lucide-react"

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 900,
//   color: "white"
// }

// const mediaStyleModal = {
//   width: '100%',
//   height: '85vh',
//   objectFit: 'cover',
//   borderRadius: '2px',
//   cursor: 'pointer',
//   backgroundColor: '#f5f5f5',
// }

// const BasicModal = ({ open, onClose }) => {
//   const { postById, getPostById, deletComit, AddComit, unfollowUser, Follow, likePost } = useUserStore()
//   const [isMuted, setIsMuted] = React.useState(false)
//   const videoRef = React.useRef(null)
//   const [newcomit, setnewComit] = React.useState("")
//   const [likedComments, setLikedComments] = React.useState({})
//   const [wishLix, setwishLix] = React.useState([])
//   const router = useRouter()
//   const userId = useUserId()
//   const isMobile = useMediaQuery('(max-width:1024px)')

//   React.useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("bookmarks")) || []
//     setwishLix(saved)
//   }, [])

//   const toggleMute = () => {
//     const video = videoRef.current
//     if (video) {
//       video.muted = !video.muted
//       setIsMuted(video.muted)
//     }
//   }
  
//   const handleAddComment = async () => {
//     if (newcomit.trim() === "") return
//     await AddComit(newcomit, postById.data?.postId)
//     await getPostById(postById.data?.postId)
//     setnewComit("")
//   }

//   const handleLikeComment = (commentId) => {
//     setLikedComments(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId]
//     }))
//   }

//   const AddwishLix = (postId) => {
//     let upDated
//     if (wishLix.includes(postId)) {
//       upDated = wishLix.filter(id => id != postId)
//     } else {
//       upDated = [...wishLix, postId]
//     }
//     setwishLix(upDated)
//     localStorage.setItem("bookmarks", JSON.stringify(upDated))
//   }

//   const HendlFollow = async () => {
//     try {
//       if (!postById?.data) return

//       const { userId, isFollowing } = postById.data

//       if (isFollowing) {
//         await unfollowUser(userId)
//       } else {
//         await Follow(userId)
//       }

//       await getPostById(postById.data.postId)

//     } catch (error) {
//       console.error("Ошибка при подписке/отписке:", error)
//     }
//   }

//   const RemoveComit = async (postCommentId) => {
//     await deletComit(postCommentId)
//     await getPostById(postById.data?.postId)
//   }

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//       sx={isMobile ? {
//         '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
//         '& .MuiBox-root': {
//           width: '100%',
//           maxWidth: '100%',
//           height: '100%',
//           maxHeight: '100%',
//           top: 0,
//           left: 0,
//           transform: 'none',
//           borderRadius: 0
//         }
//       } : {}}
//     >
//       <Box sx={isMobile ? {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         width: '100%',
//         height: '100%',
//         bgcolor: '#000',
//         overflow: 'auto'
//       } : style}>
//         {isMobile ? (
//           // Мобильная версия
//           <div className="h-full w-full bg-black text-white">
//             {/* Заголовок */}
//             <div className="flex justify-between items-center p-4 border-b border-gray-700">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={`http://37.27.29.18:8003/images/${postById.data?.userImage}`}
//                   className="w-8 h-8 rounded-full"
//                   alt="profile"
//                 />
//                 <span className="font-semibold">{postById.data?.userName}</span>
//               </div>
//               <button onClick={onClose}>
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Контент */}
//             <div className="relative w-full aspect-square">
//               {postById.data?.images?.[0] && (() => {
//                 const el = postById.data.images[0]
//                 const mediaUrl = `http://37.27.29.18:8003/images/${el}`
//                 return el.endsWith('.mp4') ? (
//                   <div className="relative h-full w-full">
//                     <video
//                       ref={videoRef}
//                       src={mediaUrl}
//                       className="w-full h-full object-cover"
//                       playsInline
//                       autoPlay
//                       muted={isMuted}
//                       loop
//                     />
//                     <button
//                       onClick={toggleMute}
//                       className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-full p-2"
//                     >
//                       {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
//                     </button>
//                   </div>
//                 ) : (
//                   <img
//                     src={mediaUrl}
//                     alt={`Post by ${postById.data?.userName}`}
//                     className="w-full h-full object-cover"
//                   />
//                 )
//               })()}
//             </div>

//             {/* Действия */}
//             <div className="p-4">
//               <div className="flex justify-between mb-4">
//                 <div className="flex gap-4">
//                   <button onClick={async () => await likePost(postById.data?.postId)}>
//                     <Heart
//                       size={24}
//                       fill={postById.data?.postLike ? 'red' : 'none'}
//                       color={postById.data?.postLike ? 'red' : 'white'}
//                     />
//                   </button>
//                   <button>
//                     <MessageCircle size={24} color="white" />
//                   </button>
//                   <button>
//                     <Send size={24} color="white" />
//                   </button>
//                 </div>
//                 <button onClick={() => AddwishLix(postById.data?.postId)}>
//                   <Bookmark
//                     size={24}
//                     fill={wishLix.includes(postById.data?.postId) ? "white" : "none"}
//                     color="white"
//                   />
//                 </button>
//               </div>

//               {/* Лайки */}
//               <div className="mb-2">
//                 <span className="font-bold">{postById.data?.postLikeCount} отметок "Нравится"</span>
//               </div>

//               {/* Подпись */}
//               <div className="mb-4">
//                 <span className="font-semibold mr-2">{postById.data?.userName}</span>
//                 <span>{postById.data?.caption}</span>
//               </div>

//               {/* Комментарии */}
//               <div className="mb-4 max-h-40 overflow-y-auto">
//                 {postById.data?.comments?.map(comment => (
//                   <div key={comment.id} className="flex justify-between items-start mb-3">
//                     <div className="flex gap-2">
//                       <span className="font-semibold">{comment.userName}</span>
//                       <span>{comment.comment}</span>
//                     </div>
//                     {comment.userId === userId && (
//                       <button onClick={() => RemoveComit(comment.postCommentId)}>
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Добавление комментария */}
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={newcomit}
//                   onChange={(e) => setnewComit(e.target.value)}
//                   placeholder="Добавьте комментарий..."
//                   className="flex-1 bg-transparent border-none outline-none text-white"
//                 />
//                 <button
//                   onClick={handleAddComment}
//                   disabled={!newcomit.trim()}
//                   className={`font-semibold ${newcomit.trim() ? 'text-blue-500' : 'text-blue-300'}`}
//                 >
//                   Опубликовать
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           // Десктопная версия
//           <div className="flex gap-[40px] h-[85vh] bg-[#272727]">
//             {postById ? (
//               <div className="flex w-full gap-[20px]">
//                 <div className="w-[47%]">
//                   {postById.data?.images?.[0] && (() => {
//                     const el = postById.data.images[0]
//                     const mediaUrl = `http://37.27.29.18:8003/images/${el}`
//                     return (
//                       <div key={el}>
//                         {el.endsWith('.mp4') ? (
//                           <div>
//                             <video
//                               ref={videoRef}
//                               src={mediaUrl}
//                               className="w-full h-[85vh] object-cover"
//                               playsInline
//                               autoPlay
//                               muted={isMuted}
//                               loop
//                             />
//                             <button
//                               onClick={toggleMute}
//                               className="absolute z-10 mt-[-40px] ml-[380px] text-white"
//                             >
//                               {isMuted ? <VolumeX size={30} /> : <Volume2 size={30} />}
//                             </button>
//                           </div>
//                         ) : (
//                           <img src={mediaUrl} alt={`Post by ${el.userName}`} style={mediaStyleModal} />
//                         )}
//                       </div>
//                     )
//                   })()}
//                 </div>
//                 <div className="w-[51%] p-[20px]">
//                   <div className="flex  w-full justify-between pb-[20px]  items-center">
//                     <div className="flex gap-[20px]">
//                       <div>
//                         <img src={`http://37.27.29.18:8003/images/${postById.data?.userImage}`} className="w-[40px] h-[40px] rounded-full" alt="test" />
//                       </div>

//                       <p onClick={() => router.push(`/${postById.data?.userId}`)} className="font-medium cursor-pointer  min-w-20 max-w-40 text-[25px] truncate">{postById.data?.userName}</p> <br />
//                     </div>
//                     <button
//                       className="px-3 py-1 ml-4 text-sm cursor-pointer text-black bg-white rounded-full"
//                       onClick={HendlFollow}
//                     >
//                       {postById?.data?.isFollowing ? "Вы подписаны" : "Подписаться"}
//                     </button>

//                     <button className="cursor-pointer" onClick={() => setOpen(false)}>
//                       <X />
//                     </button>

//                   </div>
//                   <div className="overflow-y-auto overflow-x-hidden break-words select-none max-h-[43vh] space-y-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//                     {postById.data?.comments?.length > 0 ? (
//                       postById.data.comments.map(comment => (
//                         <div key={comment.id} className="flex items-center justify-between">
//                           <div className="flex  gap-3 items-center flex-1 min-w-0">
//                             {comment.userImage
//                               ? (
//                                 <img
//                                   src={comment.userImage ? `http://37.27.29.18:8003/images/${comment.userImage}` : "https://via.placeholder.com/40"}
//                                   alt={comment.userName}
//                                   className="w-8 h-8 border border-gray-300 rounded-full"
//                                 />
//                               )
//                               : (
//                                 <div>
//                                   <CircleUserRound className="cursor-pointer" size={34} onClick={() => router.push(`/${comment.userId}`)} color="#ffffff" />

//                                 </div>
//                               )
//                             }
//                             <div className="min-w-120">
//                               <p className="text-[15px]  w-[90%] ">{comment.comment}</p>
//                               {comment.dateCommented && (

//                                 <span className="text-[10px] text-gray-400 leading-0 self-end">
//                                   {new Date(comment.dateCommented).toLocaleString([], {
//                                     year: "numeric",
//                                     month: "2-digit",
//                                     day: "2-digit",
//                                     hour: "2-digit",
//                                     minute: "2-digit"
//                                   })}
//                                 </span>
//                               )}

//                             </div>
//                           </div>
//                           {
//                             comment.userId == useUserId() ?
//                               <div className="flex gap-[10px]">

//                                 <button className="cursor-pointer hover:text-red-500" onClick={() => RemoveComit(comment.postCommentId)}>
//                                   <X />
//                                 </button>
//                                 <Heart
//                                   className="cursor-pointer"
//                                   onClick={() => handleLikeComment(comment.postCommentId)}
//                                   size={20}
//                                   color="#ffffff"
//                                   fill={likedComments[comment.postCommentId] ? 'red' : 'nane'}
//                                   stroke={likedComments[comment.postCommentId] ? 'red' : 'white'}
//                                 />
//                               </div>
//                               : <Heart
//                                 className="cursor-pointer"
//                                 onClick={() => handleLikeComment(comment.postCommentId)}
//                                 size={20}
//                                 color="#ffffff"
//                                 fill={likedComments[comment.postCommentId] ? 'red' : 'none'}
//                                 stroke={likedComments[comment.postCommentId] ? 'red' : 'white'}
//                               />
//                           }
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-400">Нет комментариев</p>
//                     )}
//                   </div>
//                   <div className="border-t fixed bottom-0 bg-[#272727] h-[180px] z-10 w-[47%] mt-[300px] pt-[10px]">
//                     <div className="flex justify-between">
//                       <div className="flex gap-[20px]">
//                         <button
//                           onClick={async () => {
//                             await likePost(postById.data?.postId)
//                           }}
//                           style={{ cursor: 'pointer' }}
//                           className='cursor-pointer'
//                         >
//                           <Heart size={25} color="#ffffff"
//                             fill={postById.data?.postLike ? 'red' : 'none'}
//                             stroke={postById.data?.postLike ? 'red' : 'white'}
//                           />
//                         </button>
//                         <button className="cursor-pointer">
//                           <MessageCircle size={25} color="#ffffff" />
//                         </button>
//                         <button className="cursor-pointer">
//                           <Send size={25} color="#ffffff" />
//                         </button>
//                       </div>
//                       <button className="cursor-pointer" onClick={() => AddwishLix(postById.data?.postId)}>
//                         <Bookmark fill={wishLix.includes(postById.data?.postId) ? "white" : "none"} size={25} color="#ffffff" />
//                       </button>
//                     </div>
//                     <div>
//                       <span className="font-bold text-[18px]">
//                         {postById.data?.postLikeCount}  <span className="text-[15px]">отметок "Нравится"</span>
//                       </span>
//                     </div>
//                     <div className="border-2 h-12 mt-[40px] p-2 rounded border-[#E2E8F0] flex justify-between gap-1 items-center">
//                       <CommentInput value2={newcomit} onChange2={(e) => setnewComit(e.target.value)} />
//                       <button onClick={handleAddComment}>
//                         <SendHorizontal />
//                       </button>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             ) : (
//               <div><p>Загрузка...</p></div>
//             )}
//           </div>
//         )}
//       </Box>
//     </Modal>
//   )
// }

// export default BasicModal





