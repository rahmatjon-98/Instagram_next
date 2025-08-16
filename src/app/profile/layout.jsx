'use client'
import React from 'react'
import { useProfileStore } from '@/store/pages/profile/profile/store'
import Image from 'next/image'
import { useEffect } from 'react'
import defaultUser from '../../assets/img/pages/profile/profile/instauser (2).jpg'
import { RxHamburgerMenu } from 'react-icons/rx'
import { usePathname, useRouter } from 'next/navigation'
import { MdOutlineGridOn } from 'react-icons/md'
import { FaRegBookmark } from 'react-icons/fa'
import { MdOutlinePhotoCameraFront } from 'react-icons/md'

const Layout = ({ children }) => {
	let { user, getProfileData } = useProfileStore()

	let router = useRouter()
	let pathname = usePathname()

	useEffect(() => {
		getProfileData()
		// console.log(decodeToken);
		console.log(pathname)
		console.log(user ? user : 'error')
	}, [])
	return (
		<div className='pl-[8%] pt-[8%]'>
			<section className='flex gap-[20px] '>
				<div className='hidden md:flex'>
					<Image
						src={`http://37.27.29.18:8003/images/${user.image}`}
						alt='profile picture'
						width={500}
						height={500}
						className={`${
							user.image ? 'flex' : 'hidden'
						} w-[160px] h-[160px] rounded-[50%] overflow-hidden`}
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
					<div className='flex items-center gap-[40px]'>
						<h1 className='font-bold text-[#1E293B] text-[20px]'>
							{user.userName}
						</h1>
						<div className='flex items-center gap-[10px]'>
							<button
								className='text-[#334155] bg-[#F3F4F6] text-[10px] md:text-[16px] px-[10px] md:px-[20px] py-[5px] md:py-[10px] rounded-xl md:rounded-2xl'
								onClick={() => router.push('/editprofile')}
							>
								Edit profile
							</button>
							<button className='text-[#334155] bg-[#F3F4F6] text-[10px] md:text-[16px] px-[10px] md:px-[20px] py-[5px] md:py-[10px] rounded-xl md:rounded-2xl'>
								View archive
							</button>
							<button>
								<RxHamburgerMenu size={20} />
							</button>
						</div>
					</div>
					<div className='flex items-center gap-[20px]'>
						<div className='flex md:hidden'>
							<Image
								src={`http://37.27.29.18:8003/images/${user.image}`}
								alt='profile picture'
								width={500}
								height={500}
								className={`${
									user.image ? 'flex' : 'hidden'
								} w-[70px] h-[70px] rounded-[50%]`}
							/>
							<Image
								src={defaultUser}
								alt='default user'
								className={`${
									user.image ? 'hidden' : 'flex'
								} w-[70px] rounded-[50%]`}
							/>
						</div>
						<p className='text-[#1E293B] block md:flex'>
							{user.postCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px]'>
								{' '}
								posts
							</span>
						</p>
						<p className='text-[#1E293B] block md:flex'>
							{user.subscribersCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px]'>
								{' '}
								followers{' '}
							</span>
						</p>
						<p className='text-[#1E293B] block md:flex'>
							{user.subscriptionsCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px]'>
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
			<section className='h-[70px] md:h-[100px] w-[95%] md:w-[80%] overflow-x-hidden'></section>
			<div className='border-t-[#E2E8F0] border-t w-[95%] md:w-[80%] flex justify-center gap-[10px] md:gap-[50px]'>
				<button
					className='flex items-center gap-[10px] py-[10px]'
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
					className='flex items-center gap-[10px] py-[10px]'
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
					className='flex items-center gap-[10px] py-[10px]'
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
			<section className='w-[95%] md:w-[80%]'>{children}</section>
		</div>
	)
}

export default Layout
