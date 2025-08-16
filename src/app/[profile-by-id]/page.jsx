'use client'
import { useProfileByIdStore } from '@/store/pages/profile/profile-by-id/store'
import { usegetUserStore } from '@/store/pages/search/store'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const Posts = () => {
    const { 'profile-by-id': profileId } = useParams()
    const getProfileById = useProfileByIdStore(state => state.getProfileById)
    const users = useProfileByIdStore(state => state.users)

    const { users: infoUsers, getUsers } = usegetUserStore()

    const getId = infoUsers?.data?.find(e => e.id === profileId).id

    const { getPostById, posts } = useProfileByIdStore()

    console.log(posts)

    


    useEffect(() => {
        if (profileId) {
            getProfileById(profileId)
        }
    }, [profileId, getProfileById])

    useEffect(() => { getUsers(), getPostById(getId) }, [])

    return (
        <div>
            Posts
        </div>
    )
}

export default Posts