"use client"
import { useUserStore } from "@/store/pages/explore/explorestore"
import Image from "next/image"
import { useEffect } from "react"
import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { colors } from "@mui/material"
import axios from "axios"
import { CircleUserRound, Heart, MessageCircle, Send } from "lucide-react"

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1100,
	// height: "50vh",
	// backgroundColor: "#272727",
	color: "white"

}

const mediaStyle = {
	width: 'full',
	height: 'full',
	objectFit: 'cover',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: '#f5f5f5',
}
const mediaStyleModal = {
	width: '100%',
	height: '500px',
	objectFit: 'cover',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: '#f5f5f5',
}



export default function Explore() {
	let { user, fechUser, postById, getPostById, deletComit } = useUserStore()
	const [open, setOpen] = React.useState(false)
	let cnt = 3


	useEffect(() => {
		fechUser()
	}, [])

	const handleOpen = async (id) => {
		await getPostById(id);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false)
	}
	let [muted, setMuted] = React.useState(true);

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="flex gap-[40px] h-[80vh] bg-[#272727]">
						{postById ? (
							
								<div className="flex w-full gap-[20px]">
									<div className="w-[30%] ">
										{postById.data?.images.map(el => {
											const mediaUrl = `http://37.27.29.18:8003/images/${el}`
											return (
												<div key={el.id}>
													{el.endsWith('.mp4') ? (
														<video src={mediaUrl} style={{ width: "full%", height: '70vh' }} onClick={() => setMuted(!muted)}
															playsInline
															autoPlay
															muted={muted}
															loop />
													) : (
														<img src={mediaUrl} alt={`Post by ${el.userName}`} style={mediaStyleModal} />
													)}
												</div>
											)
										})}
									</div>
									<div className="w-[68%] p-[20px]">
										<div className="flex  w-full justify-between  items-center">
											<div className="flex gap-[20px]">
												<img src={`http://37.27.29.18:8003/images/${postById.data?.userImage}`} className="w-[40px] h-[40px] rounded-full" alt="test" />
												<p className="font-bold text-2xl">{postById.data?.userName}</p>
											</div>
											<button className="font-bold text-2xl text-blue-500 cursor-pointer hover:duration-500 hover:scale-120 ">Follow</button>

										</div>
										<div className="mt-4 space-y-2">
											{postById.data?.comments?.length > 0 ? (
												postById.data.comments.map(c => (
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															{c.userImage
																? (
																	<img src={`http://37.27.29.18:8003/images/${c.userImage}`} alt="" className="w-[40px] h-[40px] rounded-full border-2" />
																)
																: (
																	<CircleUserRound size={40} color="#ffffff" />
																)
															}
															<p>{c.comment}</p>
														</div>
														<button onClick={() => deletComit(c.id)}>
															<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
																<path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
															</svg>
														</button>
													</div>
												))
											) : (
												<p className="text-gray-400">Нет комментариев</p>
											)}
										</div>
										<div>
											<div className="">
												<button>
													<Heart size={34} color="#ffffff" />
												</button>
												<button>
													<MessageCircle size={34} color="#ffffff" />
												</button>
												<button>
													<Send size={34} color="#ffffff" />
												</button>
											</div>
										</div>
									</div>
								</div>
							
						) : (
							<div>
								<p>Загрузка...</p>
							</div>
						)
						}


					</div>
				</Box>
			</Modal>

			{/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4 mt-[10px]">
				{user && user?.data?.map(el => (
					<div className="bg-black rounded-2xl" key={el.postId}>
						{el.images.map((item, index) => {
							const mediaUrl = `http://37.27.29.18:8003/images/${item}`

							return (
								<div className=" hover:opacity-[50%] hover:duration-1000  relative group" key={index} style={mediaStyle} onClick={() => handleOpen(el.postId)} >
									<div className="absolute inset-0 flex items-center justify-center gap-[30px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
										<div className="flex gap-[10px] font-bold text-4xl items-center">
											<Heart size={46} color="#ffffff" />
											<span>{el.postLikeCount}</span>
										</div>
										<div className="flex gap-[10px] font-bold text-4xl items-center">
											<MessageCircle size={46} color="#ffffff" />
											<span>{el.commentCount}</span>
										</div>
									</div>
									{item.endsWith('.mp4') ? (
										<video src={mediaUrl} style={mediaStyle} controls />
									) : (
										<Image src={mediaUrl} alt={`Post by ${el.userName}`} width={300} height={300} style={mediaStyle} />
									)}
								</div>
							)
						})}
					</div>
				))}
			</div> */}

			<div className="grid grid-cols-2 relative right-0 sm:grid-cols-3 gap-2 md:gap-4 mt-[10px] mx-[10px]">
				{user?.data?.map((el, i) => {
					if (i == 15) {
						cnt = 4;
					}
					let isFifth = (i + 1) % cnt === 0;
					if (i == 22) {
						isFifth = true
					}
					if (i == 23) {
						isFifth = false
					}
					if ((i + 1) % cnt === 0) {
						if (i == 11) {
							cnt = cnt + 1
							isFifth = false
						} else {
							cnt += cnt
						}
					}
					return (
						<div key={el.postId} className={`relative ${isFifth ? "row-span-2 h-[680px] w-[333px]" : ""} group aspect-square overflow-hidden rounded-xl  bg-black cursor-pointer`} onClick={() => handleOpen(el.postId)}>
							{el.images[0].endsWith(".mp4") ? (
								<div>
									<div className="z-[10] absolute top-2 left-2 text-white  rounded-full p-1">
										<svg
											className='x1lliihq x1n2onr6 x5n08af'
											fill='currentColor'
											height='24'
											role='img'
											viewBox='0 0 24 24'
											width='24'
										>
											<title>Reels</title>
											<line
												fill='none'
												stroke='currentColor'
												strokeLinejoin='round'
												strokeWidth='2'
												x1='2.049'
												x2='21.95'
												y1='7.002'
												y2='7.002'
											></line>
											<line
												fill='none'
												stroke='currentColor'
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												x1='13.504'
												x2='16.362'
												y1='2.001'
												y2='7.002'
											></line>
											<line
												fill='none'
												stroke='currentColor'
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												x1='7.207'
												x2='10.002'
												y1='2.11'
												y2='7.002'
											></line>
											<path
												d='M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z'
												fill='none'
												stroke='currentColor'
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
											></path>
											<path
												d='M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z'
												fillRule='evenodd'
											></path>
										</svg>
									</div>
									<video
										src={`http://37.27.29.18:8003/images/${el.images[0]}`}
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										muted
										loop
										playsInline
									/>
								</div>
							) : (
								<Image
									src={`http://37.27.29.18:8003/images/${el.images[0]}`}
									alt={`Post by ${el.userName}`}
									width={500}
									height={500}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							)}

							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>

							<div className="absolute inset-0 flex items-center justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white z-10">
								<div className="flex gap-2 items-center font-bold text-xl">
									<Heart size={28} color="white" />
									<span>{el.postLikeCount}</span>
								</div>
								<div className="flex gap-2 items-center font-bold text-xl">
									<MessageCircle size={28} color="white" />
									<span>{el.commentCount}</span>
								</div>
							</div>
						</div>
					)
				})}
			</div>

		</div>
	)
}