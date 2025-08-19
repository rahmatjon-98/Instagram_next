'use client'
import React, { useState } from 'react'
import { useProfileStore } from '@/store/pages/profile/profile/store'
import Image from 'next/image'
import { useEffect } from 'react'
import defaultUser from '../../assets/img/pages/profile/profile/instauser (2).jpg'
import { RxHamburgerMenu } from 'react-icons/rx'
import { usePathname, useRouter } from 'next/navigation'
import { MdOutlineGridOn } from 'react-icons/md'
import { FaRegBookmark } from 'react-icons/fa'
import { MdOutlinePhotoCameraFront } from 'react-icons/md'
import useDarkSide from '@/hook/useDarkSide'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import toast from 'react-hot-toast'
import { useMediaQuery } from '@mui/material'

const Layout = ({ children }) => {
	let { user, getProfileData } = useProfileStore()

	let router = useRouter()
	let pathname = usePathname()

	const isMobile = useMediaQuery('(max-width:768px)')
	// const [mounted, setMounted] = useState(false)

	useEffect(() => {
		getProfileData()
	}, [])

	const [theme, setTheme] = useDarkSide()

	const style = {
		position: 'absolute',
		top: isMobile ? '25%' : '34%',
		left: isMobile ? '50%' : '79%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		width: 300,
		boxShadow: 10,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'baseline',
		borderRadius: '10px',
		overflow: 'hidden',
		outline: '0',
	}

	const [open, setOpen] = React.useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const logOut = () => {
		localStorage.removeItem('access_token')
		router.push('/login')
		toast('Logged out!')
	}

	return (
		<div className='pl-[8%] pt-[8%]'>
			<section className='flex gap-[5%] m-auto lg:w-[80%] justify-center'>
				<div className='hidden md:flex overflow-hidden items-center justify-center w-[100px] md:w-[160px] h-[100px] md:h-[160px] rounded-[50%]'>
					<Image
						src={`http://37.27.29.18:8003/images/${user.image}`}
						alt='profile picture'
						width={500}
						height={500}
						className={`${user.image ? 'flex' : 'hidden'} `}
					/>
					<Image
						src={defaultUser}
						alt='default user'
						className={`${
							user.image ? 'hidden' : 'flex'
						} w-[160px] h-[160px] rounded-[50%]`}
					/>
				</div>
				<div className='flex flex-col gap-[20px]'>
					<div className='flex items-center md:gap-[40px]'>
						<h1 className='font-bold text-[#1E293B] text-[20px] w-[120px] md:w-[220px] overflow-hidden text-ellipsis whitespace-nowrap '>
							{user.userName}
						</h1>
						<div className='flex items-center gap-[5px] md:gap-[10px]'>
							<button
								className={` text-[10px] md:text-[16px] px-[10px] md:px-[20px] py-[5px] md:py-[10px] rounded-xl md:rounded-2xl active:scale-95 transition-transform duration-100 ease-in ${
									theme == 'light'
										? 'bg-[#F0F2F5] text-[#334155] hover:bg-gray-200'
										: 'bg-[#25292E] text-[#F4F4F4] hover:bg-gray-800'
								}`}
								onClick={() => router.push('/editprofile')}
							>
								Edit profile
							</button>
							<button
								className={`hover:bg-gray-200 text-[10px] md:text-[16px] px-[10px] md:px-[20px] py-[5px] md:py-[10px] rounded-xl md:rounded-2xl active:scale-95 transition-transform duration-100 ease-in
								${
									theme == 'light'
										? 'bg-[#F0F2F5] text-[#334155] hover:bg-gray-200'
										: 'bg-[#25292E] text-[#F4F4F4] hover:bg-gray-800'
								}`}
							>
								View archive
							</button>
							<button onClick={handleOpen} className='outline-0'>
								<RxHamburgerMenu
									size={20}
									className='active:scale-95 transition-transform duration-100 ease-in'
								/>
							</button>
							<Modal
								open={open}
								onClose={handleClose}
								aria-labelledby='modal-modal-title'
								aria-describedby='modal-modal-description'
							>
								<Box sx={style}>
									<button className='p-[12px] bg-white hover:bg-gray-200 w-full text-start'>
										QR code
									</button>
									<button
										className='p-[12px] bg-white hover:bg-gray-200 w-full text-start'
										onClick={() => router.push('/notification')}
									>
										Notification
									</button>
									<button
										className='p-[12px] bg-white hover:bg-gray-200 w-full text-start'
										onClick={() => router.push('/setting/pro')}
									>
										Settings and privacy
									</button>
									<button
										className='text-[#EF4444] p-[12px] bg-white hover:bg-gray-200 w-full text-start'
										onClick={logOut}
									>
										Log out
									</button>
								</Box>
							</Modal>
						</div>
					</div>
					<div className='flex items-center gap-[20px]'>
						<div className='flex md:hidden overflow-hidden  items-center justify-center w-[100px] md:w-[160px] h-[100px] md:h-[160px] rounded-[50%]'>
							<Image
								src={`http://37.27.29.18:8003/images/${user.image}`}
								alt='profile picture'
								width={500}
								height={500}
								className={`${user.image ? 'flex' : 'hidden'}`}
							/>
							<Image
								src={defaultUser}
								alt='default user'
								className={`${
									user.image ? 'hidden' : 'flex'
								} w-[70px] rounded-[50%]`}
							/>
						</div>
						<p
							className='text-[#1E293B] block md:flex cursor-pointer'
							onClick={() => router.push('/profile')}
						>
							{user.postCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px] text-[12px] lg:text-[18px]'>
								{' '}
								posts
							</span>
						</p>
						<p className='text-[#1E293B] block md:flex'>
							{user.subscribersCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px] text-[12px] lg:text-[18px]'>
								{' '}
								followers{' '}
							</span>
						</p>
						<p className='text-[#1E293B] block md:flex'>
							{user.subscriptionsCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px] text-[12px] lg:text-[18px]'>
								{' '}
								following
							</span>
						</p>
					</div>
					<div className='flex'>
						<p className='font-bold text-[#1E293B] text-[20px]'>
							{user.firstName}
						</p>
						{user.lastName && (
							<p className='font-bold text-[#1E293B] text-[20px]'>
								{user.userName}
							</p>
						)}
					</div>
				</div>
			</section>
			<section className='h-[70px] md:h-[100px] w-[95%] md:w-[80%] overflow-x-hidden flex m-auto'></section>
			<div className='border-t-[#E2E8F0] border-t w-[95%] md:w-[80%] flex justify-center gap-[10px] md:gap-[50px] m-auto'>
				<button
					className='flex items-center gap-[10px] py-[10px] cursor-pointer '
					style={{
						color: pathname === '/profile' ? '#2563EB' : '#64748B',
						borderTop: pathname === '/profile' ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push('/profile')}
				>
					<MdOutlineGridOn size={20} />
					<p className='text-[16px] md:text-[22px]'>Posts</p>
				</button>
				<button
					className='flex items-center gap-[10px] py-[10px] cursor-pointer '
					style={{
						color: pathname === '/profile/saved' ? '#2563EB' : '#64748B',
						borderTop:
							pathname === '/profile/saved' ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push('/profile/saved')}
				>
					<FaRegBookmark size={20} />
					<p className='text-[16px] md:text-[22px]'>Saved</p>
				</button>
				<button
					className='flex items-center gap-[10px] py-[10px] cursor-pointer '
					style={{
						color: pathname === '/profile/tagged' ? '#2563EB' : '#64748B',
						borderTop:
							pathname === '/profile/tagged' ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push('/profile/tagged')}
				>
					<MdOutlinePhotoCameraFront size={20} />
					<p className='text-[16px] md:text-[22px]'>Tagged</p>
				</button>
			</div>
			<section className='w-[95%] md:w-[80%] flex m-auto'>{children}</section>
		</div>
	)
}

export default Layout
