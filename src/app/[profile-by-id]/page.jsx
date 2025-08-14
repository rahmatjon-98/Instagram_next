'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useProfileByIdStore } from "@/store/pages/profile/profile-by-id/store"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useRef } from "react"
import defaultUser from '../../assets/img/pages/profile/profile/instauser (2).jpg'
import { RxHamburgerMenu } from 'react-icons/rx'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader, Search, User, X, XCircle } from "lucide-react"
import { usegetUserStore } from "@/store/pages/search/store"
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import Skeleton from '@mui/material/Skeleton'

import './style.css'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 560,
	bgcolor: 'background.paper',
	border: 'none',
	boxShadow: 24,
	borderRadius: "20px",
	padding: "8px",
	height: '400px'
}

const ProfileById = () => {
	const { 'profile-by-id': profileId } = useParams()
	let { users: suggestedUser, getUsers } = usegetUserStore()
	let sixUsers = suggestedUser?.data?.slice(0, 12)
	const getProfileById = useProfileByIdStore(state => state.getProfileById)
	const users = useProfileByIdStore(state => state.users)
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const [focused, setFocused] = useState(false)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [filteredUsers, setFilteredUsers] = useState([])
	let router = useRouter()

	let user = users?.data

	const containerRef = useRef(null)
	let width = 320

	const scrollRight = () => {
		containerRef.current.scrollBy({ left: width, behavior: 'smooth' });
	}

	const scrollLeft = () => {
		containerRef.current.scrollBy({ left: -width, behavior: 'smooth' });
	}

	const SkeletonRow = () => (
		<Stack direction="row" spacing={2} alignItems="center" className="p-3">
			<Skeleton variant="circular" width={44} height={44} />
			<Stack spacing={0.5} flex={1}>
				<Skeleton variant="text" width="60%" height={14} />
				<Skeleton variant="text" width="40%" height={12} />
			</Stack>
		</Stack>
	)

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
		}, 500)

		return () => clearTimeout(delayDebounce)
	}, [search, users])


	useEffect(() => {
		if (profileId) {
			getProfileById(profileId)
		}
	}, [profileId, getProfileById])

	useEffect(() => { getUsers() }, [])
	return (
		<div className='pl-[8%] p-[8%]'>
			<section className='flex gap-[20px] '>
				<div className='hidden md:flex'>
					<Image
						src={user?.image ? `http://37.27.29.18:8003/images/${user?.image}` : defaultUser}
						alt='profile picture'
						width={500}
						height={500}
						className={`w-[160px] h-[160px] rounded-[50%] overflow-hidden`}
					/>
				</div>
				<div className='flex flex-col gap-[20px]'>
					<div className='flex items-center gap-[40px]'>
						<h1 className='font-bold text-[#1E293B] text-[20px]'>
							{user?.userName}
						</h1>
						<div className='flex items-center gap-[10px]'>
							<button
								className='text-[#334155] bg-[#F3F4F6] text-[12px] md:text-[16px] px-[10px] md:px-[20px] py-[5px] md:py-[10px] rounded-xl md:rounded-2xl'
							>
								Follow
							</button>
							<button className='text-[#334155] bg-[#F3F4F6] text-[12px] md:text-[16px] px-[10px] md:px-[20px] py-[5px] md:py-[10px] rounded-xl md:rounded-2xl'>
								View archive
							</button>
							<button>
								<RxHamburgerMenu size={20} />
							</button>
						</div>
					</div>
					<div className='flex items-center gap-[20px]'>
						<Modal
							keepMounted
							open={open}
							onClose={handleClose}
							aria-labelledby="keep-mounted-modal-title"
							aria-describedby="keep-mounted-modal-description"
						>
							<Box sx={style}>
								<div className="flex pb-2 border-b-1 border-gray-300 items-center justify-between">
									<div></div>
									<h3 className='font-semibold text-[18px]'>Followers</h3>
									<button onClick={handleClose}><X /></button>
								</div>
								<div className="relative mt-5">
									{!focused && (
										<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
									)}
									<input
										type="text"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder="Search"
										className={`py-2 w-full rounded-lg bg-[rgb(239,239,239)] pr-10 ${!focused ? 'pl-10' : 'pl-4'}`}
										onFocus={() => setFocused(true)}
										onBlur={() => setFocused(false)}
									/>

									{loading ? (
										<Loader className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 animate-spin" size={18} />
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
								<div className="flex flex-col">
									{search ? (
										loading ? (
											Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
										) : filteredUsers.length > 0 ? (
											filteredUsers.map(e => (
												<div onClick={() => addUserHistory(e.id)} key={e.id}>
													<div onClick={() => linkToProfile(e.id)} className='flex hover:bg-[#eeeeee] rounded p-3 items-center gap-5'>
														{e.avatar == '' ? <User size={44} /> : <Image src={`http://37.27.29.18:8003/images/${e.avatar}`} width={44} height={44} alt="avatar" />}
														<div>
															<p>{e.userName}</p>
															<p>{e.fullName}</p>
														</div>
													</div>
												</div>
											))
										) : (
											<p className="text-center text-gray-500 py-5">No users found with this name</p>
										)
									) : ("")}
								</div>
							</Box>
						</Modal>
						<div className='flex md:hidden'>
							<Image
								src={user?.image ? `http://37.27.29.18:8003/images/${user?.image}` : defaultUser}
								alt='profile picture'
								width={500}
								height={500}
								className={`w-[160px] h-[160px] rounded-[50%] overflow-hidden`}
							/>
						</div>
						<p className='text-[#1E293B] block md:flex'>
							{user?.postCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px]'>
								{' '}
								posts
							</span>
						</p>
						<p onClick={handleOpen} className='text-[#1E293B] block md:flex'>
							{user?.subscribersCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px]'>{' '}followers{' '}</span>
						</p>
						<p className='text-[#1E293B] block md:flex'>
							{user?.subscriptionsCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px]'>
								{' '}
								following
							</span>
						</p>
					</div>
					<div className='flex'>
						<p className='font-bold text-[#1E293B] text-[20px]'>
							{user?.firstName}
						</p>
						{user?.lastName && (
							<p className='font-bold text-[#1E293B] text-[20px]'>
								{user?.userName}
							</p>
						)}
					</div>
				</div>
			</section>
			<section className="mt-15">
				<div className="flex mb-10 justify-between">
					<h3 className="font-medium text-[18px]">Suggested for you</h3>
					<button className="text-[#4262ff]">See all</button>
				</div>
				<div className="flex items-center gap-5">
					<button onClick={scrollLeft}><ArrowLeft /></button>
					<div ref={containerRef} className="flex items-stretch gap-2.5 mb-10 overscroll-x-none overflow-x-scroll hide-scrollbar">
						{sixUsers?.map(e => (
							<div key={e.id}>
								<div onClick={() => router.push(`/${e.id}`)} className='flex rounded-t text-center h-[165px] w-[155px] border-1 border-gray-300 flex-col items-center hover:bg-[#eeeeee] p-3'>
									{e.avatar == '' ? <Image alt='image' src={defaultUser} className="rounded-full w-[74px] object-cover h-[74px]" width={74} height={74} /> : <Image src={`http://37.27.29.18:8003/images/${e.avatar}`} width={74} height={74} className="rounded-full w-[74px] object-cover h-[74px]" alt="avatar" />}
									<p className="font-semibold">{e.userName}</p>
									<p>{e.fullName}</p>
								</div>
								<div className="border-1 border-gray-300 rounded-b border-t-0 flex justify-center p-3">
									<button>Follow</button>
								</div>
							</div>
						))}
					</div>
					<button onClick={scrollRight}><ArrowRight /></button>
				</div>
			</section>
		</div>
	);
}

export default ProfileById;
