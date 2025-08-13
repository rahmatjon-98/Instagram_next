'use client'

import { useTodoAsyncStore } from '@/store/pages/notification/store'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function UsersList() {
	let { users, get, loading, error } = useTodoAsyncStore()
	const [tokenReady, setTokenReady] = useState(false)

	useEffect(() => {
		get()
	}, [])

	if (loading) return <p>Загрузка...</p>
	if (error) return <p>Ошибка: {error}</p>

	return (
		<div className='p-10'>
			<h1 className='text-4xl font-bold mb-10 '>На этой неделе</h1>
			{users.map(user => (
				<div className='' key={user.id}>
					<div className='flex gap-3 my-5'>
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
						<h3 className='font-medium my-5 '> {user.fullName}</h3>
					</div>
				</div>
			))}
		</div>
	)
}
