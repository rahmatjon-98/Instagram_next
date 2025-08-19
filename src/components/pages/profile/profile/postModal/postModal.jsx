'use client'
import { useProfileStore } from '@/store/pages/profile/profile/store'
import { useState } from 'react'
import toast from 'react-hot-toast'

const PostModal = () => {
	let { addPost } = useProfileStore()

	let [title, setTitle] = useState('')
	let [content, setContent] = useState('')
	let [file, setFile] = useState([])

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			let formData = new FormData()
			if (title) {
				formData.append('Title', title)
			}
			if (content) {
				formData.append('Content', content)
			}
			if (file) {
				for (let i = 0; i < file.length; i++) {
					formData.append(`Images`, file[i])
				}
			}
			await addPost(formData)
			console.log(file)
			e.target.reset()
		} catch (error) {
			console.error(error)
			toast.error('Something went wrong!')
		}
	}

	const handleFileChange = e => {
		e.preventDefault()
		setFile(Array.from(e.target.files || []))
	}

	return (
		<div>
			<form action='' onSubmit={handleSubmit} >
				<div>
					<label htmlFor=''>Title {'(can be empty)'}</label>
					<input
						type='text'
						placeholder='Title'
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor=''>Content {'(can be empty)'}</label>
					<input
						type='text'
						placeholder='Content'
						value={content}
						onChange={e => setContent(e.target.value)}
					/>
				</div>
				<div>
					<input type='file' multiple onChange={handleFileChange} />
					{/* {file.length > 0 && (
						<div>
							<p>Selected files:</p>
							<ul>
								{files.map((file, index) => (
									<li key={index}>{file.name}</li>
								))}
							</ul>
						</div>
					)} */}
				</div>
				<div>
					<button type='button'>Cancel</button>
					<button type='submit'>Share</button>
				</div>
			</form>
		</div>
	)
}

export default PostModal
