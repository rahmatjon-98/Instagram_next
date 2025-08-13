'use client'
import { useHome } from '@/store/pages/home/store'
import { Chip, Skeleton } from '@mui/material'
import { useEffect, useRef } from 'react'
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
	console.log(posts, 1)
	const scrollRef = useRef(null)
	let isDown = false
	let startX
	let scrollLeft
	useEffect(() => {
		getUserStories()
	}, [])

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
			<div className='px-[40px] pt-[40px] w-[70%]'>
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
				<div
					style={{animationName:"flyAnimation",animationDuration:'3s'}}
					className='group cursor-pointer inline-block'
				>
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
															style={{ width: '100%', height: '500px' }}
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
																src={`${e}`}
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
												<div
													onClick={() => setAnimation(true)}
													style={{ Animation: 'flyAnimation' }}
													className='group cursor-pointer inline-block'
												>
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
			<div className='w-[30%] h-[100vh] right-0 py-[28px] flex flex-col gap-[20px] sticky bg-amber-700 top-0'></div>
		</div>
	)
}
