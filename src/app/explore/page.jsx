"use client"
import { useUserStore } from "@/store/pages/explore/explorestore"
import Image from "next/image";
import { useEffect } from "react"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	bgcolor: "black",
	color: "white"
};

export default function Explore() {
	let { user, fechUser } = useUserStore()

	useEffect(() => {
		fechUser()
	}, [])



	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [selectedMedia, setSelectedMedia] = React.useState(null)


	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					{selectedMedia && (
						selectedMedia.endsWith('.mp4') ? (
							<video
								src={selectedMedia}
								controls
								style={{ width: '100%', maxHeight: '80vh' }}
							/>
						) : (
							<Image
								src={selectedMedia}
								alt="Enlarged media"
								width={600}
								height={600}
								style={{ width: '100%', height: 'auto' }}
							/>
						)
					)}
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						{selectedMedia || "No media selected"}
					</Typography>
				</Box>
			</Modal>

			<div className="grid grid-cols-3 gap-[20px] ">
				{user && user?.data?.map(el => {
					return (
						<div key={el.id}>
							{el.images.map((item, index) => {
								if (item.endsWith('.jpg') || item.endsWith('.png') || item.endsWith('.webp')) {
									return (
										<div key={index}>
											<Image
												src={`http://37.27.29.18:8003/images/${item}`}
												alt={`Post by ${el.userName}`}
												width={300}
												height={300}
												className="cursor-pointer w-[300px] h-[300px]"
												onClick={handleOpen}
											/>
										</div>
									)
								}
								else if (item.endsWith('.mp4')) {
									return (
										<div key={index}>
											<video
												src={`http://37.27.29.18:8003/images/${item}`}
												controls
												width="300"
												height="300"
												className="cursor-pointer w-[300px] h-[300px]"
												onClick={handleOpen}
											/>
										</div>
									)
								}
								return null;
							})}
						</div>
					)
				})}
			</div>
		</div>
	)
}