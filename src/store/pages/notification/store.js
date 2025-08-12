import { create } from 'zustand'

let api = 'http://37.27.29.18:8003/User/get-users'

export let useTodoAsyncStore = create(set => ({
  users: [],
  loading: false,
  error: null,

  get: async () => {
    try {
      set({ loading: true, error: null })
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
      if (!token) throw new Error('Токен не найден. Авторизуйтесь.')

      let response = await fetch(api, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
      })

      let data = await response.json()
      set({ users: data.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))
