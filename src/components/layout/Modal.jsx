'use client'
import React, { useEffect, useState } from 'react'
import { Search, User, XCircle, X, Loader2 } from 'lucide-react'
import { usegetUserStore } from '@/store/pages/search/store'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from "framer-motion"
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

const Modal = () => {
    const [focused, setFocused] = useState(false)
    const [search, setSearch] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [loading, setLoading] = useState(false)

    let { users, getUsers, searchHistories, getSearchHistories, deleteUserHistory, addUserHistory, clearUserHistory, openModal, setOpenModal } = usegetUserStore()

    useEffect(() => {
        getUsers()
        getSearchHistories()
    }, [])

    // Debounced search with loading spinner
    useEffect(() => {
        if (!search.trim()) {
            setFilteredUsers([])
            setLoading(false)
            return
        }

        setLoading(true)
        const delayDebounce = setTimeout(() => {
            const results = users?.data?.filter(u =>
                u.userName?.toLowerCase().includes(search.toLowerCase())
            ) || []
            setFilteredUsers(results)
            setLoading(false)
        }, 500) // debounce delay

        return () => clearTimeout(delayDebounce)
    }, [search, users])

    // Skeleton loader row
    const SkeletonRow = () => (
        <Stack direction="row" spacing={2} alignItems="center" className="p-3">
            <Skeleton variant="circular" width={44} height={44} />
            <Stack spacing={0.5} flex={1}>
                <Skeleton variant="text" width="60%" height={14} />
                <Skeleton variant="text" width="40%" height={12} />
            </Stack>
        </Stack>
    )

    return (
        <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-12 p-5 z-30 h-full w-[400px] bg-white shadow-xl rounded-r-[16px] overflow-y-auto"
        >
            <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
            >
                <X size={20} />
            </button>

            <h1 className="font-medium text-[28px]">Search</h1>
            <div className="relative mt-9">
                {!focused && (
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                )}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className={`py-3 w-full rounded-lg bg-[rgb(239,239,239)] pr-10 ${!focused ? 'pl-10' : 'pl-4'}`}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />

                {loading ? (
                    <Loader2 className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 animate-spin" size={18} />
                ) : (
                    search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <XCircle size={18} />
                        </button>
                    )
                )}
            </div>

            <hr className='my-7' />
            <div className="py-7 flex justify-between items-center">
                <p className='font-semibold'>Recent</p>
                <button onClick={clearUserHistory} className='font-medium hover:underline cursor-pointer text-[rgb(125,161,255)]'>Clear All</button>
            </div>

            <div className="flex flex-col">
                {search ? (
                    loading ? (
                        // Show skeletons while loading
                        Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : filteredUsers.length > 0 ? (
                        // Show search results
                        filteredUsers.map(e => (
                            <div onClick={() => addUserHistory(e.id)} key={e.id}>
                                <Link href={`/profile/${e.id}`}>
                                    <div className='flex hover:bg-[#eeeeee] rounded p-3 items-center gap-5'>
                                        {e.avatar == '' ? <User size={44} /> : <Image src={`http://37.27.29.18:8003/images/${e.avatar}`} width={44} height={44} alt="avatar" />}
                                        <div>
                                            <p>{e.userName}</p>
                                            <p>{e.fullName}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-5">No users found with this name</p>
                    )
                ) : (
                    searchHistories?.data?.map(e => (
                        <div key={e.id} className="flex items-center cursor-pointer hover:bg-[#eeeeee] rounded p-3 w-full justify-between">
                            <div className='flex items-center gap-5'>
                                {e?.users?.avatar == '' ? <User size={44} /> : <Image src={`http://37.27.29.18:8003/images/${e?.users?.avatar}`} width={44} height={44} alt="avatar" />}
                                <div>
                                    <p>{e?.users?.userName}</p>
                                    <p>{e?.users?.fullName}</p>
                                </div>
                            </div>
                            <button onClick={() => deleteUserHistory(e.id)} className='cursor-pointer'>
                                <X />
                            </button>
                        </div>
                    ))
                )}
            </div>

        </motion.div>
    )
}

export default Modal
