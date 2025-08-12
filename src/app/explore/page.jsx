"use client"
import { useUserStore } from "@/store/pages/explore/explorestore"
import Image from "next/image"
import { useEffect } from "react"
import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { colors } from "@mui/material"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  p: 4,
  backgroundColor:"#000",
  color:"white"

}

const mediaStyle = {
  width: '300px',
  height: '300px',
  objectFit: 'cover', 
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: '#f5f5f5',
}

export default function Explore() {
  let { user, fechUser ,postById,getPostById} = useUserStore()
  const [open, setOpen] = React.useState(false)
  const [selectedMedia, setSelectedMedia] = React.useState(null)

  useEffect(() => {
    fechUser()
  }, [])

  const handleOpen = (id) => {
    getPostById(id)

    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedMedia(null)
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
			<div className="flex gap-[40px] bg-black text-white ">
          {selectedMedia && (
            selectedMedia.endsWith('.mp4') ? (
              <video 
                src={selectedMedia} 
                controls 
                style={{ width: '40%', maxHeight: '80vh' }}
              />
            ) : (
              <Image
                src={selectedMedia}
                alt="Enlarged media"
                width={400}
                height={600}
                style={{ width: '40%', height: 'auto' }}
              />
            )
          )}
				<div>
		  			<p className="font-bold text-5xl">Hello</p>
				</div>
         
			</div>
        </Box>
      </Modal>

      <div className="grid grid-cols-3 gap-[20px]">
        {user && user?.data?.map(el => (
          <div key={el.id}>
            {el.images.map((item, index) => {
              const mediaUrl = `http://37.27.29.18:8003/images/${item}`
              
              return (
                <div key={index} style={mediaStyle} onClick={() => handleOpen(item.id)} >
                  {item.endsWith('.mp4') ? (
                    <video  src={mediaUrl} style={mediaStyle} controls/>
                  ) : (
                    <Image  src={mediaUrl} alt={`Post by ${el.userName}`}  width={300} height={300}  style={mediaStyle}/>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}