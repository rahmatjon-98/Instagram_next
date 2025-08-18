"use client"
import { useUserStore } from "@/store/pages/explore/explorestore"
import Image from "next/image"
import { useEffect } from "react"
import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { Bookmark, CircleUserRound, Heart, MessageCircleMore, Send, SendHorizontal, Smile, Volume2, VolumeX, X } from "lucide-react"
import CommentInput from "@/components/pages/explore/Emogi"
import { useUserId } from "@/hook/useUserId"
import { useRouter } from "next/navigation"
import { useTodoAsyncStore } from "@/store/pages/notification/store"
import ModalUsers from "@/components/pages/explore/ModalUsers"
import BasicModal from "@/components/pages/explore/BasicModal"

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '100%',          // адаптивная ширина
	maxWidth: 900,         // максимум как у тебя было
	color: "white",
	maxHeight: '90vh',     // ограничение по высоте для маленьких экранов
	overflow: 'hidden',    // чтобы не вылазило
	borderRadius: '5px',
	'@media (max-width:768px)': {
		top: 0,
		transform: 'translate(-50%, 0)', // чтобы не сдвигалось
		height: '100vh',                // на мобилке — во всю высоту
		maxHeight: '100vh',             // убираем ограничение
		borderRadius: 0,                // по желанию, как в Instagram
	},
};

const mediaStyle = {
	width: 'full',
	height: 'full',
	objectFit: 'cover',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: '#f5f5f5',
}
const mediaStyleModal = {
	width: '100%',
	// height: '85vh',
	objectFit: 'cover',
	borderRadius: '2px',
	cursor: 'pointer',
	backgroundColor: '#f5f5f5',
}



export default function Explore() {
	let { postSaved, user, fechUser, postById, getPostById, deletComit, AddComit, unfollowUser, Follow, getUsersFollow, FolowUser, likePost, f } = useUserStore()
	console.log(postById)
	const [open, setOpen] = React.useState(false)
	let cnt = 3
	let router = useRouter()

	async function RemoveComit(postCommentId) {
		await deletComit(postCommentId)
	}

	useEffect(() => {
		fechUser()
		const saved = JSON.parse(localStorage.getItem("bookmarks")) || []
		setwishLix(saved)
	}, [])


	const handleOpen = async (id) => {
		// подтягиваем пост
		const isFollowed = FolowUser?.data?.some(e => e.userShortInfo.userId == postById.data?.userId);
		console.log(isFollowed)
		await getPostById(id);
		// убедимся, что список подписок свежий
		try {
			await getUsersFollow(userId);
		} catch (err) {
			// если getUsersFollow может упасть — всё равно продолжаем
			console.error("Ошибка при обновлении списка подписок в handleOpen:", err);
		}
		// вычисляем, подписаны ли на автора поста
		setFollow(Boolean(isFollowed));
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false)
	}
	const [isMuted, setIsMuted] = React.useState(false);
	const videoRef = React.useRef(null);
	const toggleMute = () => {
		const video = videoRef.current;
		if (video) {
			video.muted = !video.muted;
			setIsMuted(video.muted);
		}
	};

	let [newcomit, setnewComit] = React.useState("")
	const handleAddComment = async () => {
		if (newcomit.trim() === "") return;
		await AddComit(newcomit, postById.data?.postId);
		await getPostById(postById.data?.postId);
		setnewComit("");
	};

	const [likedComments, setLikedComments] = React.useState({});


	const handleLikeComment = (commentId) => {
		setLikedComments(prev => ({
			...prev,
			[commentId]: !prev[commentId]
		}));
	};

	let [wishLix, setwishLix] = React.useState([])

	function AddwishLix(postId) {
		let upDated;
		if (wishLix.includes(postId)) {
			upDated = wishLix.filter(id => id != postId)
		}
		else {
			upDated = [...wishLix, postId]
		}
		setwishLix(upDated)
		localStorage.setItem("bookmarks", JSON.stringify(upDated))
	}
	let userId = useUserId()
	let [follow, setFollow] = React.useState(false)

	// console.log();
	useEffect(() => {
		getUsersFollow(userId)

	}, [])
	// console.log(FolowUser);


	// console.log(follow);


	// console.log(FolowUser?.data[0]?.userShortInfo.userId);


	async function HendlFollow(id) {
		// вычислим текущее состояние подписки из стора
		const currentlyFollowed = FolowUser?.data?.some(e => e.userShortInfo.userId == id);

		try {
			if (currentlyFollowed) {
				await unfollowUser(id);
				setFollow(true);


			} else {
				await Follow(id);
				setFollow(false);

			}

			// Обновляем список подписок, чтобы стор стал актуальным
			try {
				await getUsersFollow(userId);
			} catch (err) {
				console.error("Ошибка при getUsersFollow в HendlFollow:", err);
			}

			// Теперь пересчитаем follow исходя из обновлённого FolowUser
			const updatedFollow = FolowUser?.data?.some(e => e.userShortInfo.userId == id);
			// setFollow(updatedFollow ? false : true);



			// setFollow(e=> !e)

		} catch (error) {
			console.error("Ошибка при подписке/отписке:", error);
		}
	}


	return (
		<div>

			<div className="lg:hidden">
				<BasicModal />
			</div>
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={style}>
					<div className="flex flex-col lg:flex-row gap-[20px] h-[85vh] bg-[#272727]">
						{postById ? (

							<div className="lg:flex w-full gap-[20px]">
								<div className="lg:w-[47%] ">
									{postById.data?.images?.[0] && (() => {
										const el = postById.data.images[0];
										const mediaUrl = `http://37.27.29.18:8003/images/${el}`;
										return (
											<div key={el}>
												<div className=" flex justify-end pr-4">

													<button className="cursor-pointer lg:hidden absolute z-10 top-[10px] text-red-500" onClick={() => setOpen(false)}>
														<X size={30} />
													</button>
												</div>
												{el.endsWith('.mp4') ? (
													<div>
														<video
															ref={videoRef}
															src={mediaUrl}
															className="w-full lg:h-[85vh] h-[50vh] object-cover"
															playsInline
															autoPlay
															muted={isMuted}
															loop
														/>
														<div className=" flex justify-end pr-4">
															<button
																onClick={toggleMute}
																className="absolute z-10 mt-[-40px]  text-white"
															>
																{isMuted ? <VolumeX size={30} /> : <Volume2 size={30} />}
															</button>
														</div>
													</div>
												) : (
													<img src={mediaUrl} alt={`Post by ${el.userName}`} className="lg:h-[85vh] h-[50vh]" style={mediaStyleModal} />
												)}
											</div>
										);
									})()}

								</div>
								<div className="lg:w-[51%] lg:p-[20px] ">
									<div className="lg:p-0 p-[20px]">
										<div className="flex  w-full justify-between pb-[20px]  items-center">
											<div className="flex gap-[20px]">
												<div>
													<img src={`http://37.27.29.18:8003/images/${postById.data?.userImage}`} className="w-[40px] h-[40px] rounded-full" alt="test" />
												</div>

												<p onClick={() => router.push(`/${postById.data?.userId}`)} className="font-medium cursor-pointer  min-w-20 max-w-40 text-[20px] lg:text-[25px] truncate">{postById.data?.userName}</p> <br />
											</div>
											<button
												className="px-3 py-1 ml-4 text-sm cursor-pointer text-black bg-white rounded-full"
												onClick={() => HendlFollow(postById.data?.userId)}
											>
												{postById?.data?.isFollowing ? "Вы подписаны" : "Подписаться"}
											</button>

											<button className="cursor-pointer lg:block hidden" onClick={() => setOpen(false)}>
												<X />
											</button>

										</div>
										<div className="overflow-y-auto overflow-x-hidden break-words select-none max-h-[53vh] space-y-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
											{postById.data?.comments?.length > 0 ? (
												postById.data.comments.map(comment => (
													<div key={comment.id} className="flex items-center justify-between">
														<div className="flex  gap-3 items-center flex-1 min-w-0">
															{comment.userImage
																? (
																	<img
																		src={comment.userImage ? `http://37.27.29.18:8003/images/${comment.userImage}` : "https://via.placeholder.com/40"}
																		alt={comment.userName}
																		className="w-8 h-8 border border-gray-300 rounded-full"
																	/>
																)
																: (
																	<div>
																		<CircleUserRound className="cursor-pointer" size={34} onClick={() => router.push(`/${comment.userId}`)} color="#ffffff" />

																	</div>
																)
															}
															<div className="min-w-120">
																<p className="text-[15px]  w-[90%] ">{comment.comment}</p>
																{comment.dateCommented && (

																	<span className="text-[10px] text-gray-400 leading-0 self-end">
																		{new Date(comment.dateCommented).toLocaleString([], {
																			year: "numeric",
																			month: "2-digit",
																			day: "2-digit",
																			hour: "2-digit",
																			minute: "2-digit"
																		})}
																	</span>
																)}

															</div>
														</div>
														{
															comment.userId == useUserId() ?
																<div className="flex gap-[10px]">

																	<button className="cursor-pointer hover:text-red-500" onClick={() => RemoveComit(comment.postCommentId)}>
																		<X />
																	</button>
																	<Heart
																		className="cursor-pointer"
																		onClick={() => handleLikeComment(comment.postCommentId)}
																		size={20}
																		color="#ffffff"
																		fill={likedComments[comment.postCommentId] ? 'red' : 'nane'}
																		stroke={likedComments[comment.postCommentId] ? 'red' : 'white'}
																	/>
																</div>
																: <Heart
																	className="cursor-pointer"
																	onClick={() => handleLikeComment(comment.postCommentId)}
																	size={20}
																	color="#ffffff"
																	fill={likedComments[comment.postCommentId] ? 'red' : 'none'}
																	stroke={likedComments[comment.postCommentId] ? 'red' : 'white'}
																/>
														}
													</div>
												))
											) : (
												<p className="text-gray-400">Нет комментариев</p>
											)}
										</div>
									</div>

									<div className="border-t fixed bottom-0 bg-[#272727] h-[120px] z-10 lg:w-[47%] w-[100%] lg:p-0 p-[20px] mt-[300px] pt-[10px]">
										<div className="flex justify-between mb-2 pt-[10px]">
											<div className="flex gap-4">
												<button
													onClick={async () => await likePost(postById.data?.postId)}
													className="cursor-pointer"
												>
													<Heart
														size={24}
														color="#ffffff"
														fill={postById.data?.postLike ? 'red' : 'none'}
														stroke={postById.data?.postLike ? 'red' : 'white'}
													/>
												</button>
												<MessageCircleMore size={24} color="#ffffff" />
												<div>
													<ModalUsers />
												</div>
											</div>
											<button onClick={() => {
												postSaved(postById.data?.postId);
												// AddwishLix(postById.data?.postId);
											}}>
												<Bookmark
													fill={postById.data?.postFavorite ? "white" : "none"}
													size={24}
													color="#ffffff"
												/>
											</button>
										</div>

										<div className="mb-2">
											<span className="font-bold">
												{postById.data?.postLikeCount} отметок "Нравится"
											</span>
										</div>

										<div className="flex gap-2">
											<CommentInput
												value2={newcomit}
												onChange2={(e) => setnewComit(e.target.value)}
											/>
											<button
												onClick={handleAddComment}
												disabled={!newcomit.trim()}
												className="text-blue-500 disabled:text-gray-500"
											>
												<SendHorizontal size={24} />
											</button>
										</div>
									</div>

								</div>
							</div>

						) : (
							<div>
								<p>Загрузка...</p>
							</div>
						)
						}


					</div>
				</Box>
			</Modal>


			<div className="flex justify-center lg:pt-0 pt-[50px]">
				<div className="grid grid-cols-3 gap-2 md:gap-4 my-[10px] mx-[10px]  max-w-[1240px]">
					{user?.data?.map((el, i) => {
						if (i == 15) {
							cnt = 4;
						}
						let isFifth = (i + 1) % cnt === 0;
						if (i == 22) {
							isFifth = true
						}
						if (i == 23) {
							isFifth = false
						}
						if (i == 25) { isFifth = true }
						if (i == 31) { isFifth = false }
						if (i == 32) { isFifth = true }
						if (i == 35) { isFifth = true }
						if(i==42){ isFifth=true}
						if ((i + 1) % cnt === 0) {
							if (i == 11) {
								cnt = cnt + 1
								isFifth = false
							} else {
								cnt += cnt
							}
						}
						return (
							<div key={el.postId} className={`relative ${isFifth ? "row-span-2 h-[100%] min-w-[100%] max-w-[53%]" : ""} group aspect-square w-[100%] overflow-hidden rounded  bg-black cursor-pointer`} onClick={() => handleOpen(el.postId)}>
								{el.images[0].endsWith(".mp4") ? (
									<div>
										<div className="z-[10] absolute top-2 left-2 text-white  rounded-full p-1">
											<svg
												className='x1lliihq x1n2onr6 x5n08af'
												fill='currentColor'
												height='24'
												role='img'
												viewBox='0 0 24 24'
												width='24'
											>
												<title>Reels</title>
												<line
													fill='none'
													stroke='currentColor'
													strokeLinejoin='round'
													strokeWidth='2'
													x1='2.049'
													x2='21.95'
													y1='7.002'
													y2='7.002'
												></line>
												<line
													fill='none'
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													x1='13.504'
													x2='16.362'
													y1='2.001'
													y2='7.002'
												></line>
												<line
													fill='none'
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													x1='7.207'
													x2='10.002'
													y1='2.11'
													y2='7.002'
												></line>
												<path
													d='M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z'
													fill='none'
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
												></path>
												<path
													d='M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z'
													fillRule='evenodd'
												></path>
											</svg>
										</div>
										<video
											src={`http://37.27.29.18:8003/images/${el.images[0]}`}
											className={`  ${isFifth ? "h-[1000px]" : ""}  w-full object-cover transition-transform duration-500 group-hover:scale-101`}
											muted
											loop
											playsInline
										/>
									</div>
								) : (
									<Image
										src={`http://37.27.29.18:8003/images/${el.images[0]}`}
										alt={`Post by ${el.userName}`}
										width={500}
										height={500}
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-101"
									/>
								)}

								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>

								<div className="absolute inset-0 hidden lg:flex items-center justify-center gap-2 lg:gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white z-10">
									<div className="flex gap-2 items-center font-bold text-xl">
										<Heart size={28} color="white" />
										<span>{el.postLikeCount}</span>
									</div>
									<div className="flex gap-2 items-center font-bold text-xl">
										<MessageCircleMore size={28} color="white" />
										<span>{el.commentCount}</span>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>

		</div>
	)
}
