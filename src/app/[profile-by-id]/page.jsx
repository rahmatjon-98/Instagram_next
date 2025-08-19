'use client'

import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useProfileByIdStore } from '@/store/pages/profile/profile-by-id/store'
import { usegetUserStore } from '@/store/pages/search/store'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { FaCamera, FaComments } from 'react-icons/fa'
import { useUserStore } from "@/store/pages/explore/explorestore"
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { Bookmark, Camera, CircleUserRound, Copy, Heart, MessageCircle, SendHorizontal, Volume2, VolumeX, X } from "lucide-react"
import CommentInput from "@/components/pages/explore/Emogi"
import { useUserId } from "@/hook/useUserId"
import DefaultUser from "@/assets/img/pages/profile/profile/instauser (2).jpg"
import Reel from '../../../public/reel.png'
import { useRealsStore } from '../reels/store';

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
    height: 550,
    overflow: 'hidden'
}

const mediaStyleModal = {
    width: '100%',
    objectFit: 'cover',
    borderRadius: '2px',
    cursor: 'pointer',
    backgroundColor: '#f5f5f5',
    // height: 100%
}

const Posts = () => {
    const { 'profile-by-id': profileId } = useParams()
    const { getPosts, posts } = useProfileByIdStore()
    const { getUsers } = usegetUserStore()
    const { fechUser, postById, getPostById, deletComit, AddComit, likePost, likedPosts, likeComent } = useUserStore()
    const userId = useUserId()

    const [open, setOpen] = useState(false)
    const [newComit, setNewComit] = useState("")
    const [isMuted, setIsMuted] = useState(true)
    const videoRef = useRef(null)
    const { postSaved } = useRealsStore();


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
        if (!newComit.trim()) return
        await AddComit(newComit, postById.data?.postId)
        setNewComit("")
        await getPostById(postById.data?.postId)
    }

    const removeComment = async (commentId) => {
        await deletComit(commentId)
        await getPostById(postById.data?.postId)
    }

    const handleLike = async () => {
        await likePost(postById.data?.postId)
        await getPostById(postById.data?.postId)
    }

    const handleBookmark = () => {
        console.log('Toggle bookmark for post', postById.data?.postId)
    }

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            await getPosts(profileId);
            setLoading(false);
        };

        if (profileId) fetchPosts();
    }, [profileId, getPosts]);


    useEffect(() => { if (profileId) getPosts(profileId) }, [profileId, getPosts])
    useEffect(() => { getUsers() }, [getUsers])
    useEffect(() => { fechUser() }, [])

    return (
        <>
            <div className="grid grid-cols-3 gap-1">
                {loading ? (
                    Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="relative md:w-[310px] h-[190px] w-[113px] md:h-[414px] overflow-hidden rounded-lg">
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                sx={{ width: '100%', height: '100%', bgcolor: 'grey.900' }}
                            />
                        </div>
                    ))
                ) : posts?.data?.length ? (
                    posts.data
                        .slice()
                        .sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished))
                        .map(post => {
                            const reels = post?.images?.find(media => media.endsWith(".mp4"));
                            return (
                                <div
                                    key={post?.postId}
                                    className="relative overflow-hidden group cursor-pointer h-[190px] w-[113px] md:h-[414px] object-cover md:w-[310px]"
                                    onClick={() => handleOpen(post?.postId)}
                                >
                                    {post?.images?.map((media, i) =>
                                        media.endsWith(".mp4") ? (
                                            <video
                                                key={i}
                                                src={`http://37.27.29.18:8003/images/${media}`}
                                                className="h-full md:w-[310px] w-[113px] object-cover"
                                                muted
                                                controls
                                            />
                                        ) : (
                                            <Image
                                                key={i}
                                                src={`http://37.27.29.18:8003/images/${media}`}
                                                alt="image"
                                                height={414}
                                                width={310}
                                                className="h-full md:w-[310px] w-[113px] object-cover"
                                            />
                                        )
                                    )}

                                    <div className="absolute inset-0 hover:bg-[#000000b3] bg-opacity-40 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center gap-1 text-white">
                                            <Heart fill="white" /> {post.postLikeCount}
                                        </div>
                                        <div className="flex items-center gap-1 text-white">
                                            <FaComments /> {post.commentCount}
                                        </div>
                                    </div>

                                    {reels ? (
                                        <div className="top-3 right-3 absolute">
                                            <Image src={Reel} alt="reel icon" width={20} height={20} />
                                        </div>
                                    ) : (
                                        <div className="top-3 right-3 absolute">
                                            <Copy size={20} />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                ) : (
                    <div className="col-span-3 flex flex-col font-extrabold items-center gap-5 text-center text-[30px] py-10">
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#f0f0f0',
                            }}
                        >
                            <FaCamera size={62} color="#333" />
                        </div>
                        <h1>No Posts Yet</h1>
                    </div>
                )}

                <Modal open={open} onClose={handleClose}>
                    <Box sx={style} className="flex flex-col md:flex-row h-full">

                        <div className="md:w-2/5 w-full bg-black flex items-center justify-center relative">
                            {postById.data?.images?.[0] && (() => {
                                const media = postById.data.images[0]
                                const mediaUrl = `http://37.27.29.18:8003/images/${media}`
                                return (
                                    <div className="relative w-full h-full">
                                        {media.endsWith('.mp4') ? (
                                            <div className="relative w-full h-[50vh] lg:h-[85vh]">
                                                <video
                                                    ref={videoRef}
                                                    src={mediaUrl}
                                                    className="w-full h-full object-cover"
                                                    autoPlay
                                                    loop
                                                    muted={isMuted}
                                                    playsInline
                                                />
                                                <button
                                                    onClick={toggleMute}
                                                    className="absolute bottom-4 right-4 bg-black bg-opacity-40 p-2 rounded-full"
                                                >
                                                    {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                                                </button>
                                            </div>
                                        ) : (
                                            <Image src={mediaUrl} width={348} height={463} alt="Post" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                )
                            })()}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-white lg:hidden"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div className="md:w-3/5 w-full flex flex-col p-4 overflow-hidden bg-[#1f1f1f]">

                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`http://37.27.29.18:8003/images/${postById?.data?.userImage}`}
                                        alt="user"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <p className="font-semibold text-lg">{postById?.data?.userName}</p>
                                </div>
                                <button className="text-blue-500 font-bold">Follow</button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                {postById?.data?.comments?.length ? (
                                    postById?.data?.comments?.map(c => (
                                        <div key={c.postCommentId} className="flex justify-between items-start">
                                            <div className="flex items-start gap-3">
                                                {c.userImage ? (
                                                    <img
                                                        src={`http://37.27.29.18:8003/images/${c.userImage}`}
                                                        alt="comment-user"
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                ) : (
                                                    <CircleUserRound size={40} color="white" />
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
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => likeComent(c.postCommentId)}>
                                                    <Heart fill={c.likedByUser ? 'red' : 'white'} size={20} />
                                                </button>
                                                {c.userId === userId && (
                                                    <button onClick={() => removeComment(c.postCommentId)}>
                                                        <X size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center mt-4">Нет комментариев</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 border-t border-gray-700 pt-2">
                                <CommentInput value2={newComit} onChange2={e => setNewComit(e.target.value)} />
                                <button onClick={handleAddComment}><SendHorizontal /></button>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <div className="flex gap-3">
                                    <button onClick={handleLike}>
                                        <Heart fill={likedPosts?.[postById?.data?.postId] ? 'red' : 'white'} />
                                    </button>
                                    <MessageCircle />
                                    <SendHorizontal />
                                </div>
                                <button
                                    onClick={() => {
                                        postSaved(postById?.data?.postId);
                                    }}
                                >
                                    <Bookmark
                                        fill={postById?.data?.postFavorite ? "white" : "none"}
                                        stroke="white"
                                        size={25}
                                    />
                                </button>
                            </div>
                            <p className="mt-2 font-bold">{postById?.data?.postLikeCount} отметок "Нравится"</p>
                            <p className="text-sm text-gray-400">
                                {new Date(postById?.data?.datePublished).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>

                        </div>
                    </Box>
                </Modal>

            </div >
        </>

    )
}

export default Posts
