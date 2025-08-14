import { create } from 'zustand'

export let useTodoAsyncStore = create(set => ({
  users: [],
  loading: false,
  error: null,

  get: async () => {
    try {
      set({ loading: true, error: null })
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
      if (!token) throw new Error('Токен не найден. Авторизуйтесь.')

      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentUserId = payload.sid 

      let response = await fetch(`http://37.27.29.18:8003/FollowingRelationShip/get-subscribers?UserId=${currentUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
      })

      let data = await response.json()
      
      if (!data.data) throw new Error('Не удалось получить данные подписчиков')
      
      const subscribers = data.data.map(item => ({
        id: item.id,
        userId: item.userShortInfo?.userId,
        userName: item.userShortInfo?.userName || 'Неизвестный пользователь',
        fullName: item.userShortInfo?.fullname || '',
        avatar: item.userShortInfo?.userPhoto || ''
      }))
      
      set({ users: subscribers, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))