import axiosRequest from '@/lib/axiosRequest'
import { useEffect } from 'react'
import { create } from 'zustand'

export const useHome = create((set, get) => ({
	data: [],
	posts:[],
	isLoading: false,
	isLoading2: false,
	getUserStories: async () => {
		try {
			set({ isLoading: true })
			let { data: data2 } = await axiosRequest('Story/get-stories')
			set(state => ({ data: [...state.data, ...data2] }))
		} catch (error) {
			console.error(error)
			set({ isLoading: true })
		} finally {
			set({ isLoading: false })
		}
	},
	getUserPosts: async () => {
		try {
			set({ isLoading2: true })
			let { data: data3 } = await axiosRequest('Post/get-posts')
			set({ posts: data3 })
		} catch (error) {
			console.error(error)
			set({ isLoading2: true })
		} finally {
			set({ isLoading2: false })
		}
	},
}))
