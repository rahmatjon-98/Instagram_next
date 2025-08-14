'use client'
import { FiMoreVertical } from 'react-icons/fi'
import { useTodoAsyncStore } from '@/store/pages/notification/store'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function UsersList() {
	const { users, getUsers, toggleFollow, deleteUser, loading, error } = useTodoAsyncStore()
	const [openMenuId, setOpenMenuId] = useState(null)

	useEffect(() => {
		getUsers()
	}, [])

	if (loading) return <p>Загрузка...</p>
	if (error) return <p>Ошибка: {error}</p>

	const toggleMenu = userId =>
		setOpenMenuId(openMenuId === userId ? null : userId)

	return (
		<div className='p-10 bg-[#FFF7F7FF] '>
			<h1 className='text-4xl font-bold mb-10'>На этой неделе</h1>
			{users.map(user => (
				<div
					key={user.id}
					className='shadow py-2 px-4 my-7 rounded-2xl bg-white transition-transform duration-200 hover:scale-101 relative'
				>
					<div className='flex gap-3 my-5 items-center justify-between'>
						<div className='flex items-center gap-2'>
							<Image
								src={
									user.avatar
										? `http://37.27.29.18:8003/images/${user.avatar}`
										: '/profile_default.png'
								}
								alt={user.fullName || 'User Avatar'}
								width={100}
								height={100}
								className='rounded-full items-center w-[60px] h-[60px]'
							/>
							<div>
								<div className='flex items-center gap-2'>
									<h3 className='font-bold text-xl cursor-pointer'>
										{user.userName}
									</h3>
									<p>Подписался(-ась) на ваши обновления</p>
								</div>
								<h3 className='font-medium'>{user.fullName}</h3>
							</div>
						</div>

						<div className='flex gap-4 items-center relative'>
							<button
								className={`font-medium px-8 py-2 rounded-sm ${
									user.isFollowed
										? 'bg-gray-400'
										: 'bg-blue-500 hover:bg-blue-600'
								} text-white`}
								onClick={() => toggleFollow(user.userId)}
							>
								{user.isFollowed ? 'Unfollow' : 'Follow'}
							</button>

							<FiMoreVertical
								className='text-4xl hover:bg-gray-300 p-2 rounded-full cursor-pointer'
								onClick={() => toggleMenu(user.id)}
							/>

							{openMenuId === user.id && (
								<div className='absolute top-9 right-5 bg-white shadow-lg rounded-md border z-10 w-32'>
									<button className='pl-4 py-2'
										onClick={() => {
											deleteUser(user.userId)
											setOpenMenuId(null)
										}}
									>
										Delete
									</button>
									
									<button
										onClick={() => setOpenMenuId(null)}
										className='block w-full text-left px-4 py-2 hover:bg-gray-100'
									>
										Cancel
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
