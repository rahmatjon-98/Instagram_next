'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useProfileByIdStore } from "@/store/pages/profile/profile-by-id/store"
import Image from "next/image"
import { useParams, usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import defaultUser from '../../assets/img/pages/profile/profile/instauser (2).jpg'
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { ArrowRight, Calendar, Loader, Search, User, UserPlusIcon, X, XCircle } from "lucide-react"
import Suggetions from '@/components/pages/profile/profile-by-id/Suggetions';
import { useRouter } from 'next/navigation'
import { usegetUserStore } from '@/store/pages/search/store';
import { MdOutlineGridOn, MdOutlinePhotoCameraFront } from 'react-icons/md';
import { FaRegBookmark } from 'react-icons/fa';
// import Loading from '@/components/pages/profile/profile-by-id/Loading';
import './style.css'
import { useRegisterStore } from '@/store/pages/auth/registration/registerStore';
import { useUserId } from '@/hook/useUserId'
import FollowUser from '@/components/pages/profile/profile-by-id/FollowUser';
import FollowFollowers from '@/components/pages/profile/profile-by-id/FollowFollowers';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 550,
	height: 400,
	bgcolor: 'background.paper',
	border: 'none',
	boxShadow: 24,
	borderRadius: "20px",
}

const style2 = {
	width: 600,
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	border: 'none',
	boxShadow: 24,
	borderRadius: "20px",
}

const ProfileById = ({ children }) => {
	const userId = useUserId()
	const { 'profile-by-id': profileId } = useParams()
	const getProfileById = useProfileByIdStore(state => state.getProfileById)
	const users = useProfileByIdStore(state => state.users)
	const [open, setOpen] = useState(false)
	const [focused, setFocused] = useState(false)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [filteredUsers, setFilteredUsers] = useState([])
	const [openSuggest, setOpenSuggest] = useState(null)
	const [openAccountModal, setOpenAccountModal] = useState(null)
	const [openFollowings, setOpenFollowings] = useState(null)

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	let user = users?.data

	let pathname = usePathname()
	const router = useRouter()

	const { users: infoUsers, getUsers } = usegetUserStore()

	const { addChats, getChats, followers, getFollowers, getFollowings, followings } = useProfileByIdStore()

	let getId = infoUsers?.data?.find(e => e.id === profileId).id

	async function createChat() {
		await addChats(getId)
		await getChats()

		const chat = useProfileByIdStore.getState().chats?.data?.find(e => e.receiveUserName === user.userName)

		if (chat?.chatId) {
			router.push(`/chats/${chat.chatId}`)
		} else {
			console.error("Chat not found for this user")
		}
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
			getFollowers(profileId)
			getFollowings(profileId)
		}
	}, [profileId, getProfileById, getFollowers, getFollowings])

	useEffect(() => {
		getChats()
		getUsers()
	}, [])

	return (
		<div className='pl-[8%] p-[8%]'>
			<section className='flex gap-[20px] '>
				<div className='hidden md:flex overflow-hidden items-center justify-center w-[100px] md:w-[160px] h-[100px] md:h-[160px] rounded-[50%]'>
					<Image
						src={user?.image ? `http://37.27.29.18:8003/images/${user?.image}` : defaultUser}
						alt='profile picture'
						width={500}
						height={500}
					/>
				</div>
				<div className='flex flex-col gap-[20px]'>
					<div className='flex items-center gap-[40px]'>
						<h1 onClick={() => setOpenAccountModal(true)}
							className='font-bold cursor-pointer text-[#1E293B] text-[20px]'>{user?.userName}</h1>
						<div className='flex items-center gap-[10px]'>
							<FollowUser />
							<button onClick={createChat} className='bg-[#F3F4F6] text-[12px] md:text-[14px] font-medium py-[7px] px-4 rounded-lg'>Message</button>
							<button onClick={() => setOpenSuggest(!openSuggest)} className='bg-[#F3F4F6] text-[12px] md:text-[14px] cursor-pointer font-medium py-[7px] px-3 rounded-lg'>
								<UserPlusIcon size={18} fill={`${openSuggest ? "black" : "none"}`} />
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
								<div className="">
									<div className="flex p-4 pb-2 border-b-1 border-gray-300 items-center justify-between">
										<div></div>
										<h3 className='font-semibold text-[18px]'>Followers</h3>
										<button onClick={handleClose}><X /></button>
									</div>
									<div className="relative m-4">
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
									<div className="flex h-[270px] overflow-y-scroll flex-col">
										{followers?.data?.map(e => (
											<div key={e.id} className='flex items-center justify-between hover:bg-[#eeeeee] rounded p-3'>
												<div onClick={() => router.push(`${e?.userShortInfo?.userId}`)} className='flex cursor-pointer items-center gap-5'>
													<Image src={e?.userShortInfo?.userPhoto ?
														`http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}` : defaultUser}
														className='object-cover w-[44px] h-[44px] rounded-full' width={44} height={44} alt="avatar" />
													<div>
														<p>{e?.userShortInfo?.userName}</p>
														<p>{e?.userShortInfo?.fullname}</p>
													</div>
												</div>
												<FollowFollowers id={e?.userShortInfo?.userId} />
											</div>
										))}
									</div>
								</div>
							</Box>
						</Modal>
						{user?.subscriptionsCount ?
							<Modal
								keepMounted
								open={openFollowings}
								onClose={() => setOpenFollowings(false)}
								aria-labelledby="keep-mounted-modal-title"
								aria-describedby="keep-mounted-modal-description"
							>
								<Box sx={style}>
									<div className="">
										<div className="flex p-4 pb-2 border-b-1 border-gray-300 items-center justify-between">
											<div></div>
											<h3 className='font-semibold text-[18px]'>Followings</h3>
											<button onClick={() => setOpenFollowings(false)}><X /></button>
										</div>
										<div className="relative m-4">
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
										<div className="flex h-[270px] overflow-y-scroll flex-col">
											{followings?.data?.map(e => (
												<div key={e.id} className='flex items-center justify-between hover:bg-[#eeeeee] rounded p-3'>
													<div onClick={() => router.push(`${e?.userShortInfo?.userId}`)} className='flex cursor-pointer items-center gap-5'>
														<Image src={e?.userShortInfo?.userPhoto ?
															`http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}` : defaultUser}
															className='object-cover w-[44px] h-[44px] rounded-full' width={44} height={44} alt="avatar" />
														<div>
															<p>{e?.userShortInfo?.userName}</p>
															<p>{e?.userShortInfo?.fullname}</p>
														</div>
													</div>
													<button>Follow</button>
												</div>
											))}
										</div>
									</div>
								</Box>
							</Modal> : null}
						{user?.subscribersCount ?
							<Modal
								keepMounted
								open={openAccountModal}
								onClose={() => setOpenAccountModal(false)}
								aria-labelledby="keep-mounted-modal-title"
								aria-describedby="keep-mounted-modal-description"
							>
								<Box sx={style2}>
									<div className='p-4 border-b-1 border-gray-300 justify-center flex'>About this account</div>
									<div className="flex flex-col gap-3 items-center text-center px-10 p-4">
										<Image
											src={user?.image ? `http://37.27.29.18:8003/images/${user?.image}` : defaultUser}
											alt='profile picture'
											width={78}
											height={78}
											className={`w-[78px] h-[78px] rounded-full overflow-hidden`}
										/>
										<h3 className='font-bold text-[18px]'>{user?.userName}</h3>
										<h4 className='text-[12px]'>To help keep our community authentic, we’re showing information about accounts on Instagram. See why this information is important.</h4>
									</div>
									<div className="flex flex-col p-4 pb-4 gap-[10px]">
										<div className="flex items-center gap-[10px]">
											<Calendar />
											<div>
												<h3>Date joined</h3>
												<h3 className='text-gray-400'>
													{user?.dob ? new Date(user.dob).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
												</h3>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-[10px]">
												<User />
												<h3>Former usernames</h3>
											</div>
											<div className="flex text-[gray] items-center gap-[10px]">
												<span>2</span>
												<ArrowRight size={18} />
											</div>
										</div>
									</div>
									<div onClick={() => setOpenAccountModal(false)} className='p-4 border-t-1 border-gray-300 active:bg-[#eeeeee] rounded-b-[20px] justify-center cursor-pointer flex'>Close</div>
								</Box>
							</Modal> : null}
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
							<span className='text-[#64748B] block md:flex md:ml-[2px]'> posts</span>
						</p>
						<p onClick={handleOpen} className='text-[#1E293B] block cursor-pointer md:flex'>
							{user?.subscribersCount}
							<span className='text-[#64748B] block active:text-[#ccc] md:flex md:ml-[2px]'>followers</span>
						</p>
						<p onClick={() => setOpenFollowings(true)} className='text-[#1E293B] block cursor-pointer md:flex'>
							{user?.subscriptionsCount}
							<span className='text-[#64748B] block active:text-[#ccc] md:flex md:ml-[2px]'>following</span>
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
			{openSuggest && (
				<Suggetions />
			)}
			<div className='w-[95%] mt-15 md:w-[80%] flex justify-center gap-[10px] md:gap-[50px]'>
				<button
					className='flex items-center gap-[10px] py-[10px]'
					style={{
						color: pathname === `/${profileId}` ? '#2563EB' : '#64748B',
						borderTop: pathname === `/${profileId}` ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push(`/${profileId}`)}
				>
					<MdOutlineGridOn size={20} />
					<p className='text-[16px] md:text-[22px]'>Posts</p>
				</button>
				<button
					className='flex items-center gap-[10px] py-[10px]'
					style={{
						color: pathname === `/${profileId}/saved` ? '#2563EB' : '#64748B',
						borderTop:
							pathname === `/${profileId}/saved` ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push(`/${profileId}/saved`)}
				>
					<FaRegBookmark size={20} />
					<p className='text-[16px] md:text-[22px]'>Saved</p>
				</button>
				<button
					className='flex items-center gap-[10px] py-[10px]'
					style={{
						color: pathname === `/${profileId}/tagged` ? '#2563EB' : '#64748B',
						borderTop:
							pathname === `/${profileId}/tagged` ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push(`/${profileId}/tagged`)}
				>
					<MdOutlinePhotoCameraFront size={20} />
					<p className='text-[16px] md:text-[22px]'>Tagged</p>
				</button>
			</div>
			<section className='w-[95%] md:w-[80%]'>{children}</section>
			{!user?.postCount && (
				<Suggetions />
			)}
		</div>
	);
}

export default ProfileById;
