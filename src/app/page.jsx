'use client'
import { useHome } from '@/store/pages/home/store'
import { Skeleton } from '@mui/material'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Keyboard, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import image2 from '../assets/img/pages/home/image 69.svg'
import userIMG from '../assets/img/pages/home/userDefault.png'
import './globals.css'
import { useRealsStore } from './reels/store'

export default function Main() {
	const videoRefs = useRef({});
	let {
		getUserStories,
		data,
		isLoading,
		posts,
		getUserPosts,
		isLoading2,
		likePost,
	} = useHome()
	let {} = useRealsStore()
	const [mutedMap, setMutedMap] = useState({})
	const [stopMap, setStopMap] = useState({})
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
	let [muted, setMuted] = useState(true)
	let [comment, setComment] = useState('')
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
			{stories && (
				<section className='fixed inset-0 p-[20px] w-[100%] z-[20] h-[100vh] bg-white'>
					<svg
						onClick={() => setStories(false)}
						className=' absolute right-[20px]'
						xmlns='http://www.w3.org/2000/svg'
						width='32'
						height='32'
						viewBox='0 0 32 32'
						fill='none'
					>
						<line
							x1='0'
							y1='0'
							x2='32'
							y2='32'
							stroke='black'
							strokeWidth='3'
						/>
						<line
							x1='32'
							y1='0'
							x2='0'
							y2='32'
							stroke='black'
							strokeWidth='3'
						/>
					</svg>
					<Image src={image2} className='w-auto' alt='' />
				</section>
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
										onClick={() => setStories(!stories)}
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
								<div className='py-[16px] flex flex-col'>
									<Skeleton
										variant='text'
										sx={{ fontSize: '20px' }}
										width={'100%'}
									/>
									<Skeleton
										variant='text'
										sx={{ fontSize: '20px' }}
										width={'30%'}
									/>
								</div>
							</div>
						))) || (
						<>
							{posts?.data?.map((e, i) => {
								const muted = mutedMap[e.postId] ?? true
								const stop = stopMap[e.postId] ?? true
								console.log(e)

								const toggleMuted = () => {
									setMutedMap(prev => ({
										...prev,
										[e.postId]: !muted,
									}))
								}
								const toggleStop = postId => {
									const video = videoRefs.current[postId]
									if (!video) return

									setStopMap(prev => {
										const isPlaying = !prev[postId]
										if (isPlaying) {
											video.play()
										} else {
											video.pause()
										}
										return {
											...prev,
											[postId]: !prev[postId],
										}
									})
								}
								return (
									<div className='flex py-[10px] flex-col' key={e.postId || i}>
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
										{e.images[0].endsWith('.mp4') ? (
											<div className='flex bg-black rounded-2xl justify-end items-baseline-last'>
												<svg
													className={`my-[18%] mx-[22%] ${stopMap[e.postId] ? 'hidden' : "inline"} duration-1000 absolute`}
													xmlns='http://www.w3.org/2000/svg'
													width='76'
													height='76'
													viewBox='0 0 76 76'
													fill='none'
												>
													<path
														d='M38 0.5C17.3 0.5 0.5 17.3 0.5 38C0.5 58.7 17.3 75.5 38 75.5C58.7 75.5 75.5 58.7 75.5 38C75.5 17.3 58.7 0.5 38 0.5ZM30.5 54.875V21.125L53 38L30.5 54.875Z'
														fill='#F3F4F6'
													/>
												</svg>
												<video
													ref={el => (videoRefs.current[e.postId] = el)}
													src={`http://37.27.29.18:8003/images/${e.images[0]}`}
													muted={mutedMap[e.postId] ?? true}
													loop
													playsInline
													onClick={() => toggleStop(e.postId)}
													className='h-[85vh] m-auto'
												/>
												<svg
													className={`absolute mb-[10px]  ${
														!muted ? 'hidden' : 'inline'
													}`}
													onClick={toggleMuted}
													xmlns='http://www.w3.org/2000/svg'
													width='40'
													height='40'
													viewBox='0 0 40 40'
													fill='none'
												>
													<rect
														width='40'
														height='40'
														rx='20'
														fill='black'
														fillOpacity='0.7'
													/>
													<g clipPath='url(#clip0_8_2846)'>
														<path
															d='M13.6167 12.4417L12.4417 13.6167L16.075 17.25L15.8333 17.5H12.5V22.5H15.8333L20 26.6666V21.175L23.4833 24.6583C22.9417 25.0667 22.3333 25.3917 21.6666 25.5833V27.3C22.7833 27.05 23.8083 26.5333 24.675 25.8417L26.3833 27.55L27.5583 26.375L13.6167 12.4417ZM18.3333 22.6417L16.525 20.8333H14.1667V19.1666H16.525L17.2583 18.4333L18.3333 19.5083V22.6417ZM25.8333 20C25.8333 20.6833 25.7083 21.3417 25.4916 21.95L26.7667 23.225C27.2333 22.25 27.5 21.1583 27.5 20C27.5 16.4333 25.0083 13.45 21.6666 12.6917V14.4083C24.075 15.125 25.8333 17.3583 25.8333 20ZM20 13.3333L18.4333 14.9L20 16.4667V13.3333ZM23.75 20C23.75 18.525 22.9 17.2583 21.6666 16.6417V18.1333L23.7333 20.2C23.7416 20.1333 23.75 20.0666 23.75 20Z'
															fill='white'
														/>
													</g>
													<defs>
														<clipPath id='clip0_8_2846'>
															<rect
																width='20'
																height='20'
																fill='white'
																transform='translate(10 10)'
															/>
														</clipPath>
													</defs>
												</svg>
												<div
													className={`absolute mb-[10px]  bg-[#000000B2] size-[40px] ${
														muted ? 'hidden' : 'flex'
													} rounded-full  justify-center items-center`}
													onClick={toggleMuted}
													xmlns='http://www.w3.org/2000/svg'
												>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='20'
														height='20'
														viewBox='0 0 24 24'
														fill='none'
													>
														<g clipPath='url(#clip0_2_11496)'>
															<path
																d='M3 8.99998V15H7L12 20V3.99998L7 8.99998H3ZM10 8.82998V15.17L7.83 13H5V11H7.83L10 8.82998ZM16.5 12C16.5 10.23 15.48 8.70998 14 7.96998V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.22998V5.28998C16.89 6.14998 19 8.82998 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.71998 18.01 4.13998 14 3.22998Z'
																fill='#FFFFFF'
															/>
														</g>
														<defs>
															<clipPath id='clip0_2_11496'>
																<rect width='24' height='24' fill='white' />
															</clipPath>
														</defs>
													</svg>
												</div>
											</div>
										) : (
											<>
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
											</>
										)}
										<div className='flex items-center py-[16px] justify-between'>
											<div className='flex items-start w-[120px] justify-between'>
												<button
													onClick={async () => {
														await likePost(e.postId)
													}}
													style={{ cursor: 'pointer' }}
													className='cursor-pointer'
												>
													<Heart
														fill={e.postLike ? 'red' : 'none'}
														stroke={e.postLike ? 'red' : 'black'}
													/>
												</button>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='24'
													height='24'
													viewBox='0 0 24 24'
													fill='none'
												>
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
											<svg
												xmlns='http://www.w3.org/2000/svg'
												width='14'
												height='18'
												viewBox='0 0 14 18'
												fill={e.postLike ? '#1E293B' : 'none'}
											>
												<path
													d='M12 0H2C0.9 0 0.0100002 0.9 0.0100002 2L0 18L7 15L14 18V2C14 0.9 13.1 0 12 0ZM12 15L7 12.82L2 15V2H12V15Z'
													fill='#1E293B'
												/>
											</svg>
										</div>
										<div className='flex flex-col gap-[8px] w-[100%]'>
											<div className='flex items-center gap-[8px]'>
												{(e.userImage == '' && (
													<Image
														draggable={false}
														className='size-[24px] object-cover bg-white rounded-full p-[2px]'
														src={userIMG}
														alt=''
														width={24}
														height={24}
													/>
												)) || (
													<Image
														draggable={false}
														className='size-[24px] rounded-full bg-white p-[2px] object-cover'
														src={`http://37.27.29.18:8003/images/${e.userImage}`}
														alt=''
														width={24}
														height={24}
													/>
												)}
												<p>
													{`${
														e.postLike ? e.postLikeCount + 1 : e.postLikeCount
													} Likes`}
												</p>
											</div>
											{e.content != null && (
												<div className='flex items-center gap-[10px]'>
													<p className='text-[#1E293B] font-bold'>
														{e.userName}
													</p>
													{(e.content.length > 90 && (
														<p className='text-[#262626] text-[14px] font-[400]'>
															{e.content.slice(0, 87)}...
														</p>
													)) || (
														<p className='text-[#262626] text-[14px] font-[400]'>
															{e.content}
														</p>
													)}
													{e.content.length > 90 && (
														<p className='text-[#94A3B8] text-[14px] hover:underline font-[400]'>
															more
														</p>
													)}
												</div>
											)}
											{e.commentCount != 0 && (
												<p className='text-[#94A3B8] text-[14px] hover:underline font-[400]'>
													View all {e.commentCount} comments
												</p>
											)}
											<div className='flex w-[100%] items-center justify-between'>
												<input type='text' value={comment} onChange={(e) => setComment(e.target.value)} className='w-[90%] outline-none text-black text-[15px] placeholder:text-[16px]' placeholder='Add a comment...' />
												<p className='hover:underline text-[16px] text-[#64748B]'>
													public
												</p>
											</div>
										</div>
									</div>
								)
							})}
						</>
					)}
				</div>
			</div>
			<div className='w-[30%] h-[100vh] right-0 py-[28px] hidden md:flex flex-col gap-[20px] sticky top-0'></div>
		</div>
	)
}
