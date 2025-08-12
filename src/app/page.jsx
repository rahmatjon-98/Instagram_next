'use client'
import { useHome } from '@/store/pages/home/store'
import { Skeleton } from '@mui/material'
import { useEffect, useRef } from 'react'
import userIMG from '../assets/img/pages/home/userDefault.png'
import Image from 'next/image'

export default function Main() {
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(
				'access_token',
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI2OWYxMmJlMy05NWQwLTQwYTYtOGM3ZC03NTkxNGZhODY0ZjciLCJuYW1lIjoic3RyaW5nIiwiZW1haWwiOiJzdHJpbmciLCJzdWIiOiIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzU1MDc2Nzc1LCJpc3MiOiJpbnN0YWdyYW0tZ3JvdXAiLCJhdWQiOiJpbnN0YWdyYW0tYXBpIn0.9C8AWm9TUbMFHQjdQPPQLhPPzVBTf1gjjgvENHUQFs8'
			)
			getUserStories()
		}
	}, [])
	let { getUserStories, data, isLoading } = useHome()
	const scrollRef = useRef(null)
	let isDown = false
	let startX
	let scrollLeft
	useEffect(() => {
		getUserStories()
	}, [])
	console.log(data)

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
							<div key={`skeleton-${i}`} className='flex flex-col items-center px-[3px]'>
								<Skeleton variant='circular' width={66} height={66} />
								<Skeleton variant='text' sx={{ fontSize: '12px' }} width={66} />
							</div>
						))) || (
						<div className='flex gap-[14px]'>
							{data?.map((e,i) => {
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
													className='size-[66px] bg-white rounded-full p-[2.5px]'
													src={userIMG}
													alt=''
												/>
											)) || (
												<Image
													className='size-[66px]'
													src={`https://instagram-api.softclub.tj/images/${e.userImage}`}
													alt=''
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
			</div>
			<div className='w-[30%] h-[100vh] right-0 py-[28px] flex flex-col gap-[20px] sticky bg-amber-700 top-0'></div>
		</div>
	)
}
