'use client'
import { useHome } from '@/store/pages/home/store'
import { Chip, Skeleton } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import userIMG from '../assets/img/pages/home/userDefault.png'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard, Pagination, Navigation } from 'swiper/modules'
import Image from 'next/image'
import './globals.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export default function Main() {
	let { getUserStories, data, isLoading, posts, getUserPosts, isLoading2 } =
		useHome()
	useEffect(() => {
		getUserPosts()
	}, [])
	const scrollRef = useRef(null)
	let isDown = false
	let startX
	let scrollLeft
	useEffect(() => {
		getUserStories()
	}, [])
	let [stories, setStories] = useState(false)
	const onMouseDown = e => {
		isDown = true
		startX = e.pageX - scrollRef.current.offsetLeft
		scrollLeft = scrollRef.current.scrollLeft
	}
	const onMouseLeave = () => {
		isDown = false
	}
	const onMouseUp = () => {
		isDown = false
	}
	const onMouseMove = e => {
		if (!isDown) return
		e.preventDefault()
		const x = e.pageX - scrollRef.current.offsetLeft
		const walk = (x - startX) * 1.5 // скорость прокрутки
		scrollRef.current.scrollLeft = scrollLeft - walk
	}
	return (
		<div className='flex w-full items-start'>
			{!stories && (
				<section className='fixed w-[100%] z-[2000000000] h-[100vh] bg-amber-500'></section>
			)}
			<div className='px-[40px] pt-[40px] w-[100%] md:w-[70%]'>
				<div
					ref={scrollRef}
					onMouseDown={onMouseDown}
					onMouseLeave={onMouseLeave}
					onMouseUp={onMouseUp}
					onMouseMove={onMouseMove}
					className='pb-[20px] border-b border-b-[#E2E8F0] flex overflow-x-hidden overflow-y-hidden whitespace w-full select-none'
				>
					{(isLoading &&
						Array.from({ length: 9 }).map((_, i) => (
							<div
								key={`skeleton-${i}`}
								className='flex flex-col items-center px-[3px]'
							>
								<Skeleton
									variant='circular'
									width={66}
									className='mx-[6px]'
									height={66}
								/>
								<Skeleton variant='text' sx={{ fontSize: '12px' }} width={66} />
							</div>
						))) || (
							<div className='flex gap-[14px]'>
								{data?.map((e, i) => {
									return (
										<div
											key={e.id || `story-${i}`}
											className='size-[80px] flex flex-col items-center'
										>
											<div
												className='rounded-full size-[72px] p-[2.5px] flex items-center justify-center'
												style={{
													background:
														'linear-gradient(180deg, #DE0046 0%, #F7A34B 100%)',
												}}
											>
												{(e.userImage == '' && (
													<Image
														draggable={false}
														className='object-cover bg-white rounded-full p-[2.5px]'
														src={userIMG}
														alt=''
														width={66}
														height={66}
													/>
												)) || (
														<Image
															draggable={false}
															className='object-cover bg-white rounded-full p-[2.5px]'
															src={`http://37.27.29.18:8003/images/${e.userImage}`}
															alt=''
															width={66}
															height={66}
														/>
													)}
											</div>
											<p className='text-[#1F2937] text-[14px] font-[400]'>
												{e.userName}
											</p>
										</div>
									)
								})}
							</div>
						)}
				</div>
				<div className='w-[100%] flex flex-col'>
					{(isLoading2 &&
						Array.from({ length: 9 }).map((_, i) => (
							<div key={`skeleton-${i}`} className='flex flex-col px-[3px]'>
								<div className='flex items-center justify-between'>
									<div className='flex w-[100%] py-[12px] gap-[8px] items-center'>
										<Skeleton
											variant='circular'
											width={42}
											className=''
											height={42}
										/>
										<div>
											<Skeleton
												variant='text'
												sx={{ fontSize: '14px' }}
												width={75}
											/>
										</div>
									</div>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
									>
										<path
											d='M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z'
											fill='#262626'
										/>
										<path
											d='M6.5 13.5C7.32843 13.5 8 12.8284 8 12C8 11.1716 7.32843 10.5 6.5 10.5C5.67157 10.5 5 11.1716 5 12C5 12.8284 5.67157 13.5 6.5 13.5Z'
											fill='#262626'
										/>
										<path
											d='M17.5 13.5C18.3284 13.5 19 12.8284 19 12C19 11.1716 18.3284 10.5 17.5 10.5C16.6716 10.5 16 11.1716 16 12C16 12.8284 16.6716 13.5 17.5 13.5Z'
											fill='#262626'
										/>
									</svg>
								</div>
								<Skeleton
									variant='rectangular'
									className='rounded-2xl'
									height={400}
									width={'100%'}
								/>
							</div>
						))) || (
							<>
								{posts?.data?.map((e, i) => {
									return (
										<div className='flex py-[10px] flex-col' key={e.id || i}>
											<div className='flex items-center justify-between py-[12px]'>
												<div className='flex items-center gap-[8px]'>
													<div
														className='rounded-full size-[42px] p-[0.1px] flex items-center justify-center'
														style={{
															background:
																'linear-gradient(180deg, #DE0046 0%, #F7A34B 100%)',
														}}
													>
														{(e.userImage == '' && (
															<Image
																draggable={false}
																className='size-[36px] object-cover bg-white rounded-full p-[2px]'
																src={userIMG}
																alt=''
																width={37}
																height={37}
															/>
														)) || (
																<Image
																	draggable={false}
																	className='size-[37px] rounded-full bg-white p-[2px] object-cover'
																	src={`http://37.27.29.18:8003/images/${e.userImage}`}
																	alt=''
																	width={37}
																	height={37}
																/>
															)}
													</div>
													<div className='flex flex-col'>
														<p className='text-[#1E293B] font-[600] text-[14px]'>
															{e.userName}
														</p>
													</div>
												</div>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='24'
													height='24'
													viewBox='0 0 24 24'
													fill='none'
												>
													<path
														d='M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z'
														fill='#262626'
													/>
													<path
														d='M6.5 13.5C7.32843 13.5 8 12.8284 8 12C8 11.1716 7.32843 10.5 6.5 10.5C5.67157 10.5 5 11.1716 5 12C5 12.8284 5.67157 13.5 6.5 13.5Z'
														fill='#262626'
													/>
													<path
														d='M17.5 13.5C18.3284 13.5 19 12.8284 19 12C19 11.1716 18.3284 10.5 17.5 10.5C16.6716 10.5 16 11.1716 16 12C16 12.8284 16.6716 13.5 17.5 13.5Z'
														fill='#262626'
													/>
												</svg>
											</div>
											{(e.images.length <= 1 && (
												<>
													{e.images.map((image, i3) => {
														return (
															<Image
																key={i3}
																src={`http://37.27.29.18:8003/images/${image}`}
																width={900}
																height={200}
																style={{ width: '100%', height: 'auto' }}
																className='rounded-2xl'
																draggable={false}
																alt='omg sory'
															/>
														)
													})}
												</>
											)) || (
													<Swiper
														slidesPerView={1}
														pagination={{ clickable: true }}
														keyboard={{
															enabled: true,
														}}
														style={{
															'--swiper-pagination-bullet-inactive-color':
																'#6A6A6A',
															'--swiper-pagination-color': '#ffffff',
														}}
														modules={[Pagination, Keyboard]}
														className='w-full h-[300px] rounded-xl overflow-hidden'
													>
														{e.images.map((e, i) => (
															<SwiperSlide key={i}>
																<div className='relative w-full h-full'>
																	<Image
																		src={`http://37.27.29.18:8003/images/${e}`}
																		alt={`Slide ${i + 1}`}
																		fill
																		style={{ objectFit: 'cover' }}
																		priority={i === 0}
																	/>
																</div>
															</SwiperSlide>
														))}
													</Swiper>
												)}
											<div className='flex items-center py-[6px] justify-between'>
												<div className='flex items-center w-[120px] justify-between'>
													<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
														<g clipPath='url(#clip0_6_3270)'>
															<path
																d='M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C10.1782 22.0028 8.39054 21.5054 6.83201 20.562L3.80001 21.454C3.62593 21.5052 3.44126 21.5086 3.26543 21.4638C3.08959 21.4189 2.92908 21.3276 2.80077 21.1992C2.67246 21.0709 2.58108 20.9104 2.53625 20.7346C2.49142 20.5587 2.49479 20.3741 2.54601 20.2L3.43801 17.168C2.49497 15.6093 1.99759 13.8218 2.00001 12C2.00001 6.477 6.47701 2 12 2ZM12 4C10.5676 3.99974 9.16147 4.38406 7.92834 5.11281C6.69521 5.84157 5.68036 6.88804 4.98977 8.14294C4.29918 9.39784 3.95817 10.8151 4.00237 12.2468C4.04656 13.6785 4.47433 15.0721 5.24101 16.282C5.46801 16.639 5.54601 17.089 5.41801 17.522L4.97701 19.023L6.47801 18.582C6.91101 18.454 7.36101 18.532 7.71801 18.759C8.76634 19.4228 9.9547 19.8336 11.1892 19.959C12.4236 20.0844 13.6703 19.921 14.8307 19.4816C15.9911 19.0422 17.0334 18.3389 17.8752 17.4273C18.717 16.5157 19.3352 15.4208 19.6809 14.2291C20.0266 13.0374 20.0904 11.7817 19.8673 10.5611C19.6441 9.34053 19.14 8.1886 18.395 7.19638C17.65 6.20415 16.6843 5.39883 15.5744 4.84408C14.4645 4.28933 13.2408 4.00036 12 4Z'
																fill='#1E293B'
															/>
														</g>
														<defs>
															<clipPath id='clip0_6_3270'>
																<rect width='24' height='24' fill='white' />
															</clipPath>
														</defs>
													</svg>
													<div className='group cursor-pointer inline-block'>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															width={24}
															height={24}
															viewBox='0 0 24 24'
															fill='none'
															strokeWidth='2'
															strokeLinecap='round'
															strokeLinejoin='round'
														>
															<polygon
																points='2,9 11,13 22,2'
																className='transition-colors duration-200 fill-transparent group-hover:fill-gray-700'
															/>
															<polygon
																points='11,13 15,22 22,2'
																className='transition-colors duration-200 fill-transparent group-hover:fill-gray-500'
															/>
															<path
																d='M22 2L11 13'
																className='transition-colors duration-200 stroke-[#1E293B] group-hover:stroke-transparent'
															/>
															<path
																d='M22 2L15 22L11 13L2 9L22 2Z'
																className='transition-colors duration-200 stroke-[#1E293B] group-hover:stroke-transparent'
															/>
														</svg>
													</div>
												</div>
											</div>
										</div>
									)
								})}
							</>
						)}
				</div>
			</div>
			<div className='w-[30%] h-[100vh] right-0 py-[28px] hidden md:flex flex-col gap-[20px] sticky bg-amber-700 top-0'></div>
		</div>
	)
}
