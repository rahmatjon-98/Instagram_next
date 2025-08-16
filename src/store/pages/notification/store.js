'use client'
import { create } from 'zustand'
import axios from 'axios'

export const useTodoAsyncStore = create(set => ({
	users: [],
	comments: [],
	loading: false,
	error: null,

	getUsers: async () => {
		try {
			set({ loading: true, error: null })

			const token = localStorage.getItem('access_token')
			if (!token) throw new Error('Токен не найден')

			const payload = JSON.parse(atob(token.split('.')[1]))
			const currentUserId = payload.sid

			// подписчики
			const subsRes = await fetch(
				`http://37.27.29.18:8003/FollowingRelationShip/get-subscribers?UserId=${currentUserId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						accept: '*/*',
					},
				}
			)
			const subsData = await subsRes.json()
			const subscribers = subsData.data || []

			// подписки
			const followingRes = await fetch(
				`http://37.27.29.18:8003/FollowingRelationShip/get-subscriptions?UserId=${currentUserId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						accept: '*/*',
					},
				}
			)
			const followingData = await followingRes.json()
			const followingIds =
				followingData.data?.map(f => f.userShortInfo?.userId) || []

			// объединяем
			const merged = subscribers.map(sub => ({
				id: sub.id,
				userId: sub.userShortInfo?.userId,
				userName: sub.userShortInfo?.userName || '',
				fullName: sub.userShortInfo?.fullname || '',
				avatar: sub.userShortInfo?.userPhoto || '',
				isFollowed: followingIds.includes(sub.userShortInfo?.userId),
			}))

			set({ users: merged, loading: false })
		} catch (err) {
			set({ error: err.message, loading: false })
		}
	},

	getComments: async () => {
		set({ loading: true, error: null })
		try {
			const token = localStorage.getItem('access_token')
			if (!token) throw new Error('Токен не найден')

			// Получаем ID текущего пользователя из токена
			const payload = JSON.parse(atob(token.split('.')[1]))
			const currentUserId = payload.sid

			// Запрашиваем посты
			const response = await fetch(
				'http://37.27.29.18:8003/Post/get-reels?PageNumber=1',
				{
					headers: {
						Authorization: `Bearer ${token}`,
						accept: '*/*',
					},
				}
			)

			if (!response.ok) throw new Error('Ошибка при получении данных')

			const data = await response.json()

			// Фильтруем посты, оставляя только посты текущего пользователя
			const myPosts = data.data.filter(post => post.userId === currentUserId)

			// Собираем все комментарии из постов текущего пользователя
			const myComments = myPosts.flatMap(post => post.comments || [])

			set({ comments: myComments, loading: false })
		} catch (err) {
			set({ error: err.message, loading: false })
		}
	},

	toggleFollow: async userId => {
		try {
			const token = localStorage.getItem('access_token')
			if (!token) throw new Error('Токен не найден')

			const state = useTodoAsyncStore.getState()
			const user = state.users.find(u => u.userId === userId)
			if (!user) throw new Error('Пользователь не найден')

			if (user.isFollowed) {
				// Отписка
				await fetch(
					`http://37.27.29.18:8003/FollowingRelationShip/delete-following-relation-ship?followingUserId=${userId}`,
					{
						method: 'DELETE',
						headers: {
							Authorization: `Bearer ${token}`,
							accept: '*/*',
						},
					}
				)
				set(state => ({
					users: state.users.map(u =>
						u.userId === userId ? { ...u, isFollowed: false } : u
					),
				}))
			} else {
				// Подписка
				await fetch(
					`http://37.27.29.18:8003/FollowingRelationShip/add-following-relation-ship?followingUserId=${userId}`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${token}`,
							accept: '*/*',
						},
					}
				)
				set(state => ({
					users: state.users.map(u =>
						u.userId === userId ? { ...u, isFollowed: true } : u
					),
				}))
			}
		} catch (err) {
			set({ error: err.message })
		}
	},

	deleteUser: async userId => {
		try {
			set(state => ({
				users: state.users.filter(u => u.userId !== userId),
			}))
		} catch (error) {
			set({ error: error.message })
		}
	},
}))
