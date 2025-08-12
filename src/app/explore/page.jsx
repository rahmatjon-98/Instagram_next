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
import { Heart, MessageCircle } from "lucide-react"

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 800,
	p: 4,
	backgroundColor: "#000",
	color: "white"

}

const mediaStyle = {
	width: '100%',
	height: '300px',
	objectFit: 'cover',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: '#f5f5f5',
}
const mediaStyleModal = {
	width: '100%',
	height: '300px',
	objectFit: 'cover',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: '#f5f5f5',
}

export default function Explore() {
	let { user, fechUser, postById, getPostById } = useUserStore()
	const [open, setOpen] = React.useState(false)


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

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="flex gap-[40px] bg-black text-white ">
						{postById ? (
							<div className="flex gap-[20px]">
								<div className="w-[85%]">
									{postById.data?.images.map(el => {
										const mediaUrl = `http://37.27.29.18:8003/images/${el}`
										return (
											<div key={el.id}>
												{el.endsWith('.mp4') ? (
													<video src={mediaUrl} style={mediaStyleModal} controls />
												) : (
													<Image src={mediaUrl} alt={`Post by ${el.userName}`} width={300} height={300} style={mediaStyleModal} />
												)}
											</div>
										)
									})}
								</div>
								<div>
									<div className="flex gap-[20px] items-center">
										<img src={`http://37.27.29.18:8003/images/${postById.data?.userImage}`} className="w-[40px] h-[40px] rounded-full" alt="test" />
										<p className="font-bold text-2xl">{postById.data?.userName}</p>

									</div>
										<div className="mt-4 space-y-2">
											{postById.data?.comments?.length > 0 ? (
												postById.data.comments.map(c => (
													<div key={c.id} className="text-white">
														{c.comment}
													</div>
												))
											) : (
												<p className="text-gray-400">Нет комментариев</p>
											)}
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

			<div className="grid grid-cols-3 gap-[20px]">
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
			</div>
		</div>
	)
}