'use client'
import { FiMoreVertical } from 'react-icons/fi'
import { useTodoAsyncStore } from '@/store/pages/notification/store'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'
import getComment from '@/components/getComment/page'

export default function Likes() {
  const {
    users,
    getUsers,
    toggleFollow,
    deleteUser,
    comments,
    getComments,
    loading,
    error,
  } = useTodoAsyncStore()
  const [openMenuId, setOpenMenuId] = useState(null)

  useEffect(() => {
    getUsers()
    getComments()
  }, [])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>Ошибка: {error}</p>

  const toggleMenu = userId => {
    setOpenMenuId(openMenuId === userId ? null : userId)
  }

  return (
    <div className='p-10  min-h-screen'>
      <h1 className='text-4xl font-bold mb-10'>На этой неделе</h1>

      {users.length === 0 ? (
        <div className='flex flex-col items-center '>
          <h1 className='text-2xl font-medium text-gray-500'>
            Пользователей нет
          </h1>
        </div>
      ) : (
        users.map(user => (
          <div
            key={user.id}
            className='shadow py-2 px-4 my-7 rounded-2xl bg-white transition-transform duration-200 hover:scale-[1.01]'
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
                    <p className='text-gray-600 text-sm'>подписался(-ась)</p>
                  </div>
                  <h3 className='font-medium text-gray-700'>{user.fullName}</h3>
                </div>
              </div>

              <div className='flex gap-4 items-center relative'>
                <button
                  className={`font-medium px-6 py-2 rounded-lg transition ${
                    user.isFollowed
                      ? 'bg-gray-400 hover:bg-gray-500'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                  onClick={() => toggleFollow(user.userId)}
                >
                  {user.isFollowed ? 'Unfollow' : 'Follow'}
                </button>

                <FiMoreVertical
                  className='text-4xl hover:bg-gray-200 p-2 rounded-full cursor-pointer'
                  onClick={() => toggleMenu(user.id)}
                />

                {openMenuId === user.id && (
                  <div className='absolute top-12 right-2 bg-white shadow-lg rounded-md border z-10 w-32'>
                    <button
                      className='w-full text-left px-4 py-2 hover:bg-gray-100'
                      onClick={() => {
                        deleteUser(user.userId)
                        setOpenMenuId(null)
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setOpenMenuId(null)}
                      className='w-full text-left px-4 py-2 hover:bg-gray-100'
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      <div className='mt-10'>
        <h2 className='text-2xl font-bold mb-6'>Комментарии к моим постам</h2>
        {comments.length === 0 ? (
          <p className='text-gray-500'>Пока нет комментариев к вашим постам</p>
        ) : (
          <div className='space-y-4'>
            {comments.map(comment => (
              <div
                key={comment.postCommentId}
                className='p-4 bg-white rounded-lg shadow'
              >
                <div className='flex items-start gap-3'>
                  <Image
                    src={
                      comment.userImage
                        ? `http://37.27.29.18:8003/images/${comment.userImage}`
                        : '/profile_default.png'
                    }
                    alt={comment.userName}
                    width={48}
                    height={48}
                    className='rounded-full w-12 h-12 object-cover'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <p className='font-semibold'>{comment.userName}</p>
                      <span className='text-gray-500 text-sm'>
                        {new Date(comment.dateCommented).toLocaleString()}
                      </span>
                    </div>
                    <p className='mt-1'>{comment.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
