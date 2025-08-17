'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCube, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cube'
import Stories from 'react-insta-stories'
import { useHome } from '@/store/pages/home/store'
import Image from 'next/image'
import endImage from '../../../assets/img/pages/home/image 75.svg'
import Link from 'next/link'

export default function SwiperStories({ indexUser = 0 }) {
  const { data } = useHome()
  const [currentUserIndex, setCurrentUserIndex] = useState(indexUser)
  const [paused, setPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // новое состояние для звука
  const swiperRef = useRef(null)

  const storiesData = useMemo(() => {
    if (!data) return []
    return data.map(user =>
      user.stories.map(stor => {
        const isVideo = stor.fileName.endsWith('.mp4')
        return {
          url: `http://37.27.29.18:8003/images/${stor.fileName}`,
          type: isVideo ? 'video' : 'image',
          header: {
            heading: user.userName,
            profileImage: `http://37.27.29.18:8003/images/${user.userImage}`,
          },
          duration: 3000,
          ...(isVideo ? { muted: isMuted } : {}),
        }
      })
    )
  }, [data, isMuted])

  if (!storiesData.length) return null

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(indexUser)
    }
  }, [indexUser])

  const handleAllStoriesEnd = () => {
    setTimeout(() => {
      setCurrentUserIndex(prev => {
        const next = prev + 1
        swiperRef.current?.slideTo(next)
        return next
      })
    }, 0)
  }

  return (
    <div
      className='w-full h-[600px] flex justify-center items-center relative'
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <Swiper
        effect='cube'
        cubeEffect={{ shadow: false, slideShadows: false }}
        modules={[EffectCube, Keyboard]}
        onSwiper={swiper => (swiperRef.current = swiper)}
        allowTouchMove={false}
        className='w-[320px] h-[600px] rounded-2xl overflow-hidden shadow-lg'
      >
        {storiesData.map((stories, index) => (
          <SwiperSlide key={index}>
            <Stories
              key={currentUserIndex}
              stories={stories}
              width={320}
              height={600}
              loop={false}
              keyboardNavigation={true}
              isPaused={paused}
              onAllStoriesEnd={handleAllStoriesEnd}
            />
          </SwiperSlide>
        ))}

        <SwiperSlide
          key={storiesData.length + 1}
          className='bg-white shadow-2xl shadow-white w-full text-center py-[50%] gap-[8px] h-auto flex flex-col justify-center items-center'
        >
          <Image alt='w' src={endImage} className='m-auto' />
          <div className='text-center w-full'>
            <p className='text-[16px] font-[500]'>You're all caught up</p>
            <p className='text-[12px] font-[400]'>
              You've seen all new posts from the past 3 days.
            </p>
          </div>
          <Link
            href={'/'}
            className='text-[#3B82F6] hover:underline text-[14px] font-[500]'
          >
            View older posts
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
