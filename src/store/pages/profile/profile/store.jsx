import { create } from 'zustand'
import axiosRequest from '@/lib/axiosRequest'
import { jwtDecode } from 'jwt-decode'

let api = 'http://37.27.29.18:8003'

export const useProfileStore = create((set, get) => ({
	user: {},
	// decodeToken: {},
	// jwtDecode: () => {
	// 	try {
	// 		let token = localStorage.getItem('access_token')
	// 		set({ decodeToken: jwtDecode(token) })
	// 		console.log(decodeToken)
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// },
	getProfileData: async () => {
		try {
			const { data } = await axiosRequest.get(
				`${api}/UserProfile/get-my-profile`
			)
			set({ user: data.data })
		} catch (error) {
			console.error('failed to get', error)
		}
	},
}))
