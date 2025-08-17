"use client"
import { useUserId } from '@/hook/useUserId'
import { useProfileByIdStore } from '@/store/pages/profile/profile-by-id/store'
import { Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const FollowFollowers = ({ id }) => {
    const userId = useUserId()

    const { followers, follow, unfollow } = useProfileByIdStore()

    const [changeFollow, setChangeFollow] = useState(
        followers?.data?.some(e => e?.userShortInfo?.userId === userId) || false
    )
    const getFollowers = followers?.data?.map(e => e?.userShortInfo?.userId)

    console.log(getFollowers);


    const [isLoading, setIsLoading] = useState(false)

    async function handleFollow() {
        try {
            setIsLoading(true)
            if (changeFollow) {
                await unfollow(id)
                setChangeFollow(false)
            }
            else {
                await follow(id)
                setChangeFollow(true)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (followers?.data) {
            setChangeFollow(
                followers.data.some(e => e?.userShortInfo?.userId === userId)
            )
        }
    }, [followers, userId])

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`${changeFollow ? "bg-[#F3F4F6]" : "bg-[#4a5df9] text-white"} py-[7px] px-4 rounded-lg`}>
            {isLoading ? (
                <Loader className="animate-spin w-4 h-4" />
            ) : changeFollow ? (
                "Unfollow"
            ) : "Follow"
            }
        </button>
    )
}

export default FollowFollowers