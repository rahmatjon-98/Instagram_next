'use client'

import { useProfileByIdStore } from '@/store/pages/profile/profile-by-id/store'
import { usegetUserStore } from '@/store/pages/search/store'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { FaComments } from 'react-icons/fa'
import { useUserStore } from "@/store/pages/explore/explorestore"
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { Bookmark, CircleUserRound, Heart, MessageCircle, SendHorizontal, Volume2, VolumeX } from "lucide-react"
import BasicModal from "@/components/pages/explore/BasicModal"
import CommentInput from "@/components/pages/explore/Emogi"
import { useUserId } from "@/hook/useUserId"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 1000,
    bgcolor: '#272727',
    color: 'white',
    borderRadius: 4,
    overflow: 'hidden'
}

const Posts = () => {
    const { 'profile-by-id': profileId } = useParams()
    const { getProfileById, getPosts, posts } = useProfileByIdStore()
    const { users: infoUsers, getUsers } = usegetUserStore()
    const { user, fechUser, postById, getPostById, deletComit, AddComit } = useUserStore()

    const [open, setOpen] = useState(false)
    const [userPosts, setUserPosts] = useState([])
    const [newcomit, setnewComit] = useState("")
    const [isMuted, setIsMuted] = useState(false)
    const videoRef = useRef(null)

    const getId = infoUsers?.data?.find(e => e.id === profileId)?.id

    useEffect(() => {
        if (profileId) getProfileById(profileId)
    }, [profileId, getProfileById])

    useEffect(() => {
        getUsers()
        getPosts()
    }, [getUsers, getPosts])

    useEffect(() => {
        if (!getId || !Array.isArray(posts?.data) || posts.data.length === 0) return
        const filtered = posts.data.filter(p => p.userId === getId)
        setUserPosts(filtered)
    }, [posts?.data, getId])

    useEffect(() => {
        fechUser()
    }, [])

    const handleOpen = async (id) => {
        await getPostById(id)
        setOpen(true)
    }

    const handleClose = () => setOpen(false)

    const toggleMute = () => {
        const video = videoRef.current
        if (video) {
            video.muted = !video.muted
            setIsMuted(video.muted)
        }
    }

    const handleAddComment = async () => {
        if (newcomit.trim() === "") return
        await AddComit(newcomit, postById.data?.postId)
        setnewComit("")
    }

    const RemoveComit = async (postCommentId) => {
        await deletComit(postCommentId)
        fechUser()
    }

    if (!userPosts.length) return <p className="text-gray-500">No posts found for this user.</p>

    return (
        <div className="grid grid-cols-3 gap-[1px]">
            {userPosts.map(post => (
                <div key={post.postId}>
                    {post.images?.map((media, i) => (
                        <div
                            key={i}
                            className="relative overflow-hidden group cursor-pointer"
                            onClick={() => handleOpen(post.postId)}
                        >
                            {media.endsWith('.mp4') ? (
                                <video
                                    src={`http://37.27.29.18:8003/images/${media}`}
                                    className="h-[414px] w-full object-cover"
                                    muted
                                    controls
                                />
                            ) : (
                                <Image
                                    src={`http://37.27.29.18:8003/images/${media}`}
                                    alt={`Post media ${i}`}
                                    height={414}
                                    width={310}
                                    quality={100}
                                    className="h-[414px] w-full object-cover"
                                />
                            )}

                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

                            <div className="absolute inset-0 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-semibold">
                                <div className="flex items-center gap-1">
                                    <Heart fill="white" /> {post.postLikeCount}
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaComments /> {post.commentCount}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {postById?.data ? (
                        <div className="flex flex-col md:flex-row h-[80vh]">
                            <div className="md:w-2/5 w-full relative bg-black flex items-center justify-center">
                                {postById.data.images?.[0] && postById.data.images[0].endsWith('.mp4') ? (
                                    <div className="relative w-full h-full">
                                        <video
                                            ref={videoRef}
                                            src={`http://37.27.29.18:8003/images/${postById.data.images[0]}`}
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            muted={isMuted}
                                            loop
                                            playsInline
                                        />
                                        <button
                                            onClick={toggleMute}
                                            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full"
                                        >
                                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                        </button>
                                    </div>
                                ) : (
                                    <img
                                        src={`http://37.27.29.18:8003/images/${postById.data.images[0]}`}
                                        alt="Post"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="md:w-3/5 w-full flex flex-col p-4 overflow-hidden">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`http://37.27.29.18:8003/images/${postById.data.userImage}`}
                                            className="w-10 h-10 rounded-full"
                                            alt="user"
                                        />
                                        <p className="text-lg font-semibold">{postById.data.userName}</p>
                                    </div>
                                    <button className="text-blue-500 font-bold">Follow</button>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                    {postById.data.comments?.length > 0 ? (
                                        postById.data.comments.map(c => (
                                            <div key={c.postCommentId} className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    {c.userImage ? (
                                                        <img src={`http://37.27.29.18:8003/images/${c.userImage}`} className="w-10 h-10 rounded-full" />
                                                    ) : (
                                                        <CircleUserRound size={40} color="#ffffff" />
                                                    )}
                                                    <div>
                                                        <p className="text-sm">{c.comment}</p>
                                                        {c.dateCommented && (
                                                            <span className="text-[10px] text-gray-400">
                                                                {new Date(c.dateCommented).toLocaleString([], {
                                                                    year: "numeric",
                                                                    month: "2-digit",
                                                                    day: "2-digit",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {c.userId === useUserId() ? (
                                                    <button onClick={() => RemoveComit(c.postCommentId)}>
                                                        <Heart />
                                                    </button>
                                                ) : (
                                                    <Heart />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Нет комментариев</p>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center border-t border-gray-700 pt-2">
                                    <CommentInput value2={newcomit} onChange2={e => setnewComit(e.target.value)} />
                                    <button onClick={handleAddComment}>
                                        <SendHorizontal />
                                    </button>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <div className="flex gap-3">
                                        <BasicModal />
                                        <MessageCircle />
                                        <SendHorizontal />
                                    </div>
                                    <Bookmark />
                                </div>
                                <p className="mt-2 font-bold">{postById.data.postLikeCount} отметок "Нравится"</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-white p-4">Загрузка...</p>
                    )}
                </Box>
            </Modal>
        </div>
    )
}

export default Posts
