'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { EarIcon, Search, User, XCircle, X } from 'lucide-react'
import { usegetUserStore } from '@/store/pages/search/store'
import Link from 'next/link'
import Image from 'next/image'

const Modal = () => {
    const [focused, setFocused] = useState(false)
    const [search, setSearch] = useState('')


    let { users, getUsers, searchHistories, getSearchHistories, deleteUserHistory, addUserHistory, clearUserHistory } = usegetUserStore()
    const { t } = useTransition();

    useEffect(() => {
        getUsers()
        getSearchHistories();
    }, [])

    return (
        <div className="p-4 ml-13 z-30 h-full overflow-y-auto rounded-r-[16px] bg-white fixed shadow-xl w-[400px]">
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
                    className={`py-3 w-full rounded-lg bg-[rgb(239,239,239)] pr-10 ${!focused ? 'pl-10' : 'pl-4'
                        }`}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-7 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <XCircle size={18} />
                    </button>
                )}
            </div>
            <hr className='my-7' />
            <div className="py-7 flex justify-between items-center">
                <p className='font-semibold'>Recent</p>
                <button onClick={clearUserHistory} className='font-medium hover:underline cursor-pointer text-[rgb(125,161,255)]'>Clear All</button>
            </div>
            <div className="flex flex-col">
                {search && (
                    users?.data
                        ?.filter(e => e.userName.toLowerCase().includes(search.toLowerCase()))
                        ?.map(e => (
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
                        )))
                }
                {!search && (
                    searchHistories?.data?.users?.map(e => (
                        <div key={e.id} className="flex items-center cursor-pointer hover:bg-[#eeeeee] rounded p-3 w-full justify-between">
                            <div className='flex items-center gap-5'>
                                {e?.avatar == '' ? <User size={44} /> : <Image src={`http://37.27.29.18:8003/images/${e?.avatar}`} width={44} height={44} alt="avatar" />}
                                <div>
                                    <p>{e?.userName}</p>
                                    <p>{e?.fullName}</p>
                                </div>
                            </div>
                            <button onClick={() => deleteUserHistory(e.id)} className='cursor-pointer'>
                                <X />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div >
    )
}

export default Modal
