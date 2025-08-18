import React from 'react'
import savedIcon from '@/assets/img/pages/profile/profile/image 78.svg'
import Image from 'next/image'

const Tagged = () => {
	return (
		<div className='flex flex-col gap-[10px] text-center items-center py-[10px] m-auto'>
			<Image src={savedIcon} alt='savedIcon' />
			<h1 className='text-[#1E293B] text-[18px] font-bold'>Your saved</h1>
			<p className='text-[#64748B]'>Only you can see what you've saved</p>
		</div>
	)
}

export default Tagged
