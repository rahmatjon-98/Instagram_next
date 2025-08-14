'use client'
import { useProfileStore } from '@/store/pages/profile/profile/store'
import React, { useEffect } from 'react'
import defaultUser from '../../assets/img/pages/profile/profile/instauser (2).jpg'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

const Editprofile = () => {
	let { user, getProfileData } = useProfileStore()

	useEffect(() => {
		getProfileData()
		console.log(user ? user : 'error')
	}, [])

	const [open, setOpen] = React.useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

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
	}

	return (
		<div className='pt-[5vh]'>
			<section className='flex flex-col gap-[3vh] w-[80%] m-auto'>
				<h1 className='text-[#2563EB] font-bold text-[25px]'>
					Profile
					<span className='text-[#1E293B]'>{' > '} Edit profile</span>
				</h1>
				<div className='bg-[#F3F4F6] rounded-2xl p-[20px] gap-y-[5vh] flex flex-col md:flex-row items-center justify-between'>
					<aside className='flex items-center gap-[10px]'>
						<div>
							<Image
								src={`http://37.27.29.18:8003/images/${user.image}`}
								alt='profile picture'
								width={500}
								height={500}
								className={`${
									user.image ? 'flex' : 'hidden'
								} w-[100px] md:w-[160px] h-[100px] md:h-[160px] rounded-[50%] overflow-hidden`}
							/>
							<Image
								src={defaultUser}
								alt='default user'
								className={`${
									user.image ? 'hidden' : 'flex'
								} w-[100px] md:w-[160px] h-[100px] md:h-[160px] rounded-[50%]`}
							/>
						</div>
						<div>
							<div>
								<h1 className='font-bold text-[#1E293B] text-[22px]'>
									{user.userName}
								</h1>
							</div>
							<div>
								<p className='font-normal text-[#64748B] text-[20px]'>
									{user.firstName}
								</p>
								{user.lastName && (
									<p className='font-normal text-[#64748B] text-[20px]'>
										{user.userName}
									</p>
								)}
							</div>
						</div>
					</aside>
					<aside className='flex gap-[20px] text-[#FFFFFF]'>
						<button
							className=' rounded-[10px] px-[10px] md:px-[20px] py-[5px] text-[14px] md:text-[16px] md:py-[10px] bg-red-500'
							onClick={handleOpen}
						>
							Delete photo
						</button>
						<button className=' rounded-[10px] px-[10px] md:px-[20px] py-[5px] text-[14px] md:text-[16px] md:py-[10px] bg-blue-500'>
							Change photo
						</button>
					</aside>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby='modal-modal-title'
						aria-describedby='modal-modal-description'
					>
						<Box sx={style}>
							<Typography id='modal-modal-title' variant='h6' component='h2'>
								Are you sure ?
							</Typography>
							<Typography id='modal-modal-description' sx={{ mt: 2 }}>
								Your profile photo will be delete and no return actions can be done
							</Typography>
							<button className=' rounded-[10px] px-[10px] md:px-[20px] py-[5px] text-[14px] md:text-[16px] md:py-[10px] bg-red-500 text-[#FFFFFF] mt-[20px]'>
								Yes, delete
							</button>
						</Box>
					</Modal>
				</div>
			</section>
		</div>
	)
}

export default Editprofile
