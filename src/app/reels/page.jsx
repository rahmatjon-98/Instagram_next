'use client'
import { useRealsStore } from "@/api/pages/reels/store";
import React, { useEffect } from "react";


const Reals = () => {

  
  
  let [rellIdx,setRellIdx] = useState(0)
  let {rels, getRels} = useRealsStore()

  useEffect(() => {
    getRels()
  },[])

  // useEffect(() => {
  //   let handleKeyDown = (event) => {
      
  //   }
  // })

  return <>

<div className=" w-[45%] h-[100%] m-auto p-[15px]">
      {rels.length === 0 && <p>Loading videos...</p>}
      {rels.map((e) => (
        <div key={e.postId} className="w-[100%] relative my-[25px] rounded-md  h-[95vh]">
          <video 
            src={`http://37.27.29.18:8003/images/${e.images}`}
            controls autoPlay
          className="w-[100%] -z-0 bg-black h-[700px] rounded-md"
            onError={() => console.log("Video not loading:", e.images)}
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-[45%] flex flex-col items-center text-white left-[90%]">
            <button className="cursor-pointer "><svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg></button>
            <button></button>
            <button></button>
            <button></button>
          </div>
          <div className="absolute bottom-5 left-5 text-white z-10 w-[90%]">
  <div className="flex items-center mb-2">
    <img
      src={`http://37.27.29.18:8003/images/${e.userImage}`} // агар шумо акс доред
      alt={e.userName}
      className="w-10 h-10 rounded-full  mr-3 border border-white"
    />
    <span className="font-semibold">{e.userName}</span>
    {/* <button className="ml-4 px-3 py-1 bg-white text-black text-sm rounded-full">Follow</button> */}
  </div>
  
</div>

          {/* {e.content && <p>{e.content}</p>} */}
        </div>
      ))}
    </div>

  </>;
};

export default Reals;
