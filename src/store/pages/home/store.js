import axiosRequest from '@/lib/axiosRequest'
import { useEffect } from 'react'
import { create } from 'zustand'

export const useHome = create((set, get) => ({
	data: [],
	isLoading: false,
	getUserStories: async () => {
		try {
			set({ isLoading: true })
			let { data: data2 } = await axiosRequest('Story/get-stories')
			set(state => ({ data: [...state.data, ...data2] }))
		} catch (error) {
			console.error(error)
			get().getUserStories()
			set({ isLoading: true })
		} finally {
			set({ isLoading: false })
		}
	},
	removeAllBears: () => set({ bears: 0 }),
	updateBears: newBears => set({ bears: newBears }),
}))
