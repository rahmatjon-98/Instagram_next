'use client'
import { useRealsStore } from "@/api/pages/reels/store";
import React, { useEffect } from "react";


const Reals = () => {
  

  let {rels, getRels} = useRealsStore()

  useEffect(() => {
    getRels()
  },[])

  return <>

<div className="border w-[45%] h-[100%] m-auto p-[15px]">
      {rels.length === 0 && <p>Loading videos...</p>}
      {rels.map((e) => (
        <div key={e.postId} className="w-[100%] my-[25px] rounded-md border h-[95vh]">
          {/* <h2>{e.userName}</h2> */}
          <video 
            src={`http://37.27.29.18:8003/images/${e.images}`}
            controls
          className="w-[100%] bg-black h-[700px] rounded-md"
            onError={() => console.log("Video not loading:", e.images)}
          >
            Your browser does not support the video tag.
          </video>
          {/* {e.content && <p>{e.content}</p>} */}
        </div>
      ))}
    </div>

  </>;
};

export default Reals;
