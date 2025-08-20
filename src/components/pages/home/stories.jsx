'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCube } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cube'
import Stories from 'react-insta-stories'
import { useHome } from '@/store/pages/home/store'
import Image from 'next/image'
import Link from 'next/link'
import userIMG from '../../../assets/img/pages/home/userDefault.png'
import endImage from '../../../assets/img/pages/home/image 75.svg'
import { Heart } from 'lucide-react'

export default function SwiperStories({ indexUser = 0 }) {
	const { data, LikeStory } = useHome()
	const [paused, setPaused] = useState(false)
	const [isMuted, setIsMuted] = useState(true)
	const [activeIndex, setActiveIndex] = useState(indexUser)
	const swiperRef = useRef(null)
	let [theme, setTheme] = useState(
		typeof window !== 'undefined' ? localStorage.getItem('theme') : ''
	)

	useEffect(() => {
		const handleStorageChange = event => {
			if (event.key === 'theme') {
				setTheme(event.newValue)
			}
		}
		window.addEventListener('storage', handleStorageChange)
		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [])

	const storiesData = useMemo(() => {
		if (!data) return []

		return data
			?.filter(e => e?.stories?.length > 0)
			.map(user => ({
				userName: user.userName,
				stories: user?.stories?.map(stor => {
					const isVideo = stor.fileName?.endsWith('.mp4')
					return {
						url: `http://37.27.29.18:8003/images/${stor.fileName}`,
						type: isVideo ? 'video' : 'image',
						muted: isVideo ? isMuted : undefined,
						duration: isVideo ? 0 : 4000,
						header: {
							heading: user.userName,
							profileImage: user.userImage
								? `http://37.27.29.18:8003/images/${user.userImage}`
								: userIMG.src,
						},
						seeMore: ({ close }) => (
							<div className='p-2 flex relative top-[545px]  gap-2 rounded-md shadow-md w-[95%] m-auto'>
								<input
									type='text'
									placeholder='Type your message...'
									className='border-2 rounded-full px-[10px] text-white border-white placeholder:text-white p-1 text-sm w-full'
								/>
								<button
									onClick={async () => {
										await LikeStory(stor.id)
										close()
									}}
									className='flex flex-col gap-2 text-white items-center justify-center cursor-pointer'
								>
									<Heart
										size={22}
										color='#ffffff'
										fill={stor.likeCount > 0 ? 'red' : 'none'}
										stroke={stor.likeCount > 0 ? 'red' : 'white'}
									/>
									<p className='text-white text-sm'>{stor.likeCount}</p>
								</button>
							</div>
						),
					}
				}),
			}))
	}, [data, isMuted])

	if (!storiesData.length) return null

	useEffect(() => {
		if (swiperRef.current) {
			swiperRef.current.slideTo(indexUser)
			setActiveIndex(indexUser)
		}
	}, [indexUser])

	return (
		<div className='w-full h-[600px] flex justify-center items-center relative'>
			<Swiper
				effect='cube'
				cubeEffect={{ shadow: false, slideShadows: false }}
				modules={[EffectCube]}
				onSwiper={swiper => (swiperRef.current = swiper)}
				onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
				allowTouchMove={false}
				className='w-[320px] h-[600px] rounded-2xl overflow-hidden shadow-lg'
			>
				{storiesData.map((user, index) => (
					<SwiperSlide key={index}>
						{activeIndex === index ? (
							<Stories
								stories={user.stories}
								width={320}
								height={600}
								loop={false}
								isPaused={paused}
								onAllStoriesEnd={() => {
									setTimeout(() => {
										swiperRef.current?.slideTo(index + 1)
									}, 0)
								}}
							/>
						) : (
							<div className='w-[320px] h-[600px] bg-black' />
						)}
					</SwiperSlide>
				))}

				{/* Экран "You're all caught up" */}
				<SwiperSlide
					key={storiesData.length + 1}
					className='bg-white shadow-2xl shadow-white w-full text-center py-[50%] gap-[8px] h-auto flex flex-col justify-center items-center'
				>
					<Image alt='w' src={endImage} className='m-auto' />
					<div className='text-center w-full'>
						<p className='text-[16px] font-[500]'>You're all caught up</p>
						<p className='text-[12px] font-[400]'>
							You've seen all new posts from the past 3 days.
						</p>
					</div>
					<Link
						href={'/'}
						className='text-[#3B82F6] hover:underline text-[14px] font-[500]'
					>
						View older posts
					</Link>
				</SwiperSlide>
			</Swiper>
		</div>
	)
}
