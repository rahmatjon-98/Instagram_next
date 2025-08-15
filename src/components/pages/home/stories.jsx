'use client'
import { useHome } from '@/store/pages/home/store'
import React, { useEffect } from 'react'

import Stories from 'react-insta-stories'
const burakHeading = {
	heading: 'Umar',
	subheading: 'umar@gmail.com',
	profileImage: 'https://i.imgur.com/lq0DC3a.jpg',
}
const initialStories = [
	{
		url: 'https://i.imgur.com/QpUEcfi.jpg',
		type: 'image',
		header: burakHeading,
	},
	{
		url: 'https://i.imgur.com/in5Jr1h.jpg',
		type: 'image',
		header: burakHeading,
	},
	{
		url: 'https://i.imgur.com/Zo5Kpnd.mp4',
		type: 'video',
		header: burakHeading,
	},
	{
		url: 'https://i.imgur.com/LBRXhIq.jpg',
		type: 'image',
		header: burakHeading,
	},
	{
		url: 'https://i.imgur.com/ARMxyC4.png',
		type: 'image',
		header: burakHeading,
	},
]
const StoryComponent = ({idSoryUser}) => {
	let {getUserStories,data} = useHome()
	useEffect(()=>{})
	const [stories, setStories] = React.useState(initialStories)

	const onAllStoriesEndHandler = () => {
		console.log('stories ended')
	}

	const storyContent = {
		width: 'auto',
		maxWidth: '100%',
		maxHeight: '100%',
		margin: 'auto',
	}

	return (
		<React.Fragment>
			<Stories
				stories={stories}
				defaultInterval={2000}
				// width={'100%'}
				// height={'100%'}
				style={{
					display: 'flex',
					justifyContent: 'center',
					cursor: 'pointer',
					borderRadius: '20px',
				}}
				storyStyles={storyContent}
				loop={false}
				keyboardNavigation={true}
				isPaused={() => {}}
				currentIndex={() => {}}
				onStoryStart={() => {}}
				onStoryEnd={() => {}}
				onAllStoriesEnd={onAllStoriesEndHandler}
			/>
		</React.Fragment>
	)
}

export default StoryComponent
