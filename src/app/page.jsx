'use client'
import {useHome} from '@/store/pages/home/store'
import { useEffect } from 'react'

export default function Main() {
  let {getUserStories,data} = useHome()
  useEffect(() => {
    getUserStories()
  },[])
  console.log(data?.data)
	return (
		<div className='flex w-full items-start'>
			<div className='px-[40px] pt-[40px] w-[70%]'>
        <div className='pb-[20px] border-b border-b-[#E2E8F0] flex overflow-scroll w-[100%]'>
          
        </div>
      </div>
			<div className='w-[30%] h-[100vh] right-0 py-[28px] flex flex-col gap-[20px] sticky bg-amber-700 top-0'></div>
		</div>
	)
}
