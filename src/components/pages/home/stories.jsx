'use client'
import { useHome } from '@/store/pages/home/store'
import React, { useEffect, useState } from 'react'
import Stories from 'react-insta-stories'

const StoryComponent = ({ idStoryUser }) => {
  const { getUserStories, data } = useHome()
  const [stories, setStories] = useState([{ content: () => <div /> }])

  useEffect(() => {
    getUserStories()
  }, [])

  useEffect(() => {
    if (data && idStoryUser) {
      const user = data.find(u => u.userId === idStoryUser)
      if (user && user.stories?.length) {
        const burakHeading = {
          heading: user.username || 'User',
          subheading: user.email || '',
          profileImage: user.avatar || 'https://i.imgur.com/lq0DC3a.jpg',
        }

        const mappedStories = user.stories.map(el => ({
          url: `http://37.27.29.18:8003/images${el.fileName}`,
          type: el.fileName.endsWith('.mp4') ? 'video' : 'image',
          header: burakHeading,
        }))

        setStories(mappedStories)
      } else {
        // если сторис нет → безопасный пустой story
        setStories([{ content: () => <div style={{ background: '#000', height: '100%' }} /> }])
      }
    }
  }, [data, idStoryUser])

  const onAllStoriesEndHandler = () => {
    console.log('stories ended')
  }

  return (
    <div className="w-[380px] max-w-[380px] aspect-[9/16] flex justify-center">
      <Stories
        stories={stories}
        defaultInterval={2000}
        storyStyles={{ borderRadius: '20px' }}
        loop={false}ё
        onAllStoriesEnd={onAllStoriesEndHandler}
      />
    </div>
  )
}

export default StoryComponent