'use client'
import { useProfileStore } from '@/store/pages/profile/profile/store'
import Image from 'next/image'
import React, { useEffect } from 'react'
import savedIcon from '@/assets/img/pages/profile/profile/image_78-removebg-preview.png'
import { BookmarkIcon, Heart } from 'lucide-react'
import { FaComments } from 'react-icons/fa'
import useDarkSide from '@/hook/useDarkSide'

const Saved = () => {
	let { favorites, getFavorites } = useProfileStore()

	const [theme] = useDarkSide()

	useEffect(() => {
		getFavorites()
		console.log(favorites)
	}, [])

	return (
		<div className='w-full'>
			<div className='flex flex-wrap gap-[0.5%] gap-y-[1vh] pb-[10vh] pt-[5vh] w-full'>
				{favorites?.data?.length > 0 ? (
					favorites.data.map((e, i) => (
						// <div
						// 	key={i}
						// 	style={{
						// 		backgroundImage: `url(http://37.27.29.18:8003/images/${e.images[0]})`,
						// 	}}
						// 	className=' w-[30%] h-[150px] lg:h-[300px]'
						// >
						// 	hello
						// </div>
						<div
							key={i}
							className='group relative w-[33%] h-[150px] lg:h-[400px] overflow-hidden flex items-center'
							style={{ backgroundColor: theme === 'dark' ? 'white' : 'black' }}
						>
							<div className='absolute top-2 right-2 z-10 p-1 text-black rounded-full'>
								<BookmarkIcon className='text-white w-5 h-5' />{' '}
							</div>
							{e.images[0].endsWith('.mp4') ? (
								<video src={`http://37.27.29.18:8003/images/${e.images[0]}`} />
							) : (
								<Image
									src={`http://37.27.29.18:8003/images/${e.images[0]}`}
									alt='post'
									width={300}
									height={300}
								/>
							)}
							<div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300'></div>

							<div className='absolute inset-0 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-semibold'>
								<div className='flex items-center gap-1'>
									<Heart fill='white' /> {e.postLikeCount}
								</div>
								<div className='flex items-center gap-1'>
									<FaComments /> {e.commentCount}
								</div>
							</div>
						</div>
					))
				) : (
					<div className='flex flex-col gap-[10px] text-center items-center py-[10px] m-auto'>
						<Image src={savedIcon} alt='savedIcon' />
						<h1 className='text-[#1E293B] text-[18px] font-bold'>Your saved</h1>
						<p className='text-[#64748B]'>Only you can see what you've saved</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Saved
