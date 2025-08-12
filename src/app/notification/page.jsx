'use client'

import { useTodoAsyncStore } from '@/store/pages/notification/store'
import { useEffect, useState } from 'react'

export default function UsersList() {
  let { users, get, loading, error } = useTodoAsyncStore()
  const [tokenReady, setTokenReady] = useState(false)

  useEffect(() => {
    localStorage.setItem(
      'access_token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiJiYTIwOWZhMi1lZWNjLTQ0MGQtOWU2ZC1hMzcyYzY3Y2RlZmEiLCJuYW1lIjoiX25vcm92c2tpeV8iLCJlbWFpbCI6Im5vcm92c2tpeUBnbWFpbC5jb20iLCJzdWIiOiIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzU1MDc5NjQ0LCJpc3MiOiJpbnN0YWdyYW0tZ3JvdXAiLCJhdWQiOiJpbnN0YWdyYW0tYXBpIn0.W9VcDImjN7-9UxslWoRk1GH0lR1ePF4vr_pVcgjbIg0'
    )
    setTokenReady(true)
  }, [])

  useEffect(() => {
    if (tokenReady) {
      get()
    }
  }, [tokenReady])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>Ошибка: {error}</p>

  return (
    <div>
      {users.map(user => (
        <p key={user.id}>{user.fullName}</p>
      ))}
    </div>
  )
}
