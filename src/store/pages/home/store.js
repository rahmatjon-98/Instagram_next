import axiosRequest from '@/lib/axiosRequest'
import { create } from 'zustand'

export const useHome = create(set => ({
	data: [],
	getUserStories: async () => {
		try {
			let { data: data2 } = await axiosRequest('Story/get-stories', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('acces_token')}`, // токен подставляем динамически
					'Content-Type': 'application/json',
				},
			})
			set(state => ({ data: [...state.data, ...data2] }))
		} catch (error) {
			console.error(error)
		}
	},
	removeAllBears: () => set({ bears: 0 }),
	updateBears: newBears => set({ bears: newBears }),
}))
