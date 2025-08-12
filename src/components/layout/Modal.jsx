'use client'
import React, { useEffect, useState } from 'react'
import { Search, XCircle } from 'lucide-react'
import { usegetUserStore } from '@/store/pages/search/store'

const Modal = () => {
    const [focused, setFocused] = useState(false)
    const [search, setSearch] = useState('')

    const clearInput = () => setSearch('')

    // let [users, setUsers] = useState([
    //     {
    //         userName: "Abdulloh",
    //         fullName: "aba",
    //         avatar: "./cr7.png",
    //         id: 1,
    //     },
    //     {
    //         userName: "Abubakr",
    //         fullName: "abu",
    //         avatar: "",
    //         id: 1,
    //     },
    // ])

    let { users, getUsers } = usegetUserStore()
    useEffect(() => { getUsers }, [])
    console.log(users);

    return (
        <div className="p-4 ml-[20%] z-10 rounded-r-[16px] bg-white fixed h-screen shadow-xl w-[400px]">
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
                        onClick={clearInput}
                        className="absolute right-3 top-7 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <button onClick={clearInput}><XCircle size={18} /></button>
                    </button>
                )}
            </div>
            <div className="">
                {users?.data.map(e => (
                    <div className="">
                        <img src={e.avatar} className='rounded-full w-[44px]' alt="avatar" />
                        <div className="">
                            <p>{e.userName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Modal
