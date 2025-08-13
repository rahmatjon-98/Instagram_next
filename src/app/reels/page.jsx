'use client';
import React, { useEffect, useState, useRef } from "react";
import { Heart, MessageCircle, SendHorizontal, Play, Pause } from 'lucide-react';
import { useRealsStore } from "./store";
import { Volume2, VolumeX } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Reels = () => {
  const [rellIdx, setRellIdx] = useState(0);
  const { rels, getRels,likeReals,setCurrentIdx} = useRealsStore();
  const [fullText, setFullText] = useState({});
  const [isPlay, setIsPlay] = useState(false);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); 


  useEffect(() => {
    getRels();
  }, []);

  const truncateText = (text, maxlength) => {
    if (!text || text.length <= maxlength) return text || "";
    return text.slice(0, maxlength) + "...";
  };

  const toggleFullText = (postId) => {
    setFullText((prev) => ({
      ...prev,
      [postId]: !prev[postId] || false,
    }));
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().then(() => setIsPlay(true)).catch(err => {
          console.error("Video play error:", err);
          setIsPlay(false);
        });
      } else {
        video.pause();
        setIsPlay(false);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && rels[rellIdx]?.images) {
      video.src = `http://37.27.29.18:8003/images/${rels[rellIdx].images}`;
      video.load(); 
      video.play().then(() => {
        setIsPlay(true);
      }).catch((err) => {
        console.error("Video play error:", err);
        setIsPlay(false);
      });
    }
  }, [rellIdx, rels]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setRellIdx((prev) => (prev < rels.length - 1 ? prev + 1 : 0));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setRellIdx((prev) => (prev > 0 ? prev - 1 : rels.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rels.length]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };
  

  let handleLike = (postId) => {
    likeReals(postId);
  }

  useEffect(() => {
    setCurrentIdx(rellIdx); // Навсозии currentIdx дар store
  }, [rellIdx, setCurrentIdx]);



  return (
    <div className="w-[40%] h-screen overflow-hidden m-auto flex justify-center items-center">
      {rels.length === 0 && <Stack spacing={2}>
    <Skeleton variant="rectangular" width="100%" height={180} />
    <Skeleton variant="rectangular" width="100%" height={180} />
    <Skeleton variant="rectangular" width="100%" height={180} />
  </Stack>}
      {rels.length > 0 && rels[rellIdx] && (
        <div className="w-full relative rounded-md h-[95vh]">

  
          <video
            ref={videoRef}
            src={`http://37.27.29.18:8003/images/${rels[rellIdx].images}`}
            className="object-cover w-full h-full bg-black rounded-md"
            playsInline
            muted={isMuted}
            onClick={togglePlayPause}
          >
            Your browser does not support the video tag.
          </video>


          {!isPlay && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <Play className="w-20 h-20 p-4 text-white bg-black bg-opacity-50 rounded-full" />
            </div>
          )}

          <div className="absolute top-[50%] flex flex-col gap-[20px] items-center text-white left-[92%] z-30">
            <div className="flex flex-col items-center text-center">
              <button style={{'cursor' : 'pointer'}} onClick={() => handleLike(rels[rellIdx].postId)}  className="cursor-pointer"><Heart fill={rels[rellIdx].isLiked ? "red" : "none"} stroke={rels[rellIdx].isLiked ? "red" : "white"}/></button>
              <span>{rels[rellIdx].postLikeCount}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <button className="cursor-pointer"><MessageCircle /></button>
              <span>{rels[rellIdx].commentCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <button><SendHorizontal /></button>
            </div>
            <div className="flex flex-col items-center ">
              <button><svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg></button>
            </div>
            <div className="flex mt-[5px] flex-col items-center">
              <button onClick={togglePlayPause}>
                {isPlay ? <Pause /> : <Play />}
              </button>
            </div>
            
          </div>

          {/* Bottom user + text */}
          <div className="absolute bottom-4 left-5 text-white z-10 w-[90%] flex flex-col items-start gap-[10px]">
            <div className="flex items-center mb-2">
              <img
                src={`http://37.27.29.18:8003/images/${rels[rellIdx].userImage}`}
                alt={rels[rellIdx].userName}
                className="w-10 h-10 mr-3 border border-white rounded-full"
              />
              <span className="font-semibold">{rels[rellIdx].userName}</span>
              <button className="px-3 py-1 ml-4 text-sm text-black bg-white rounded-full">
                {rels[rellIdx].isSubscriber ? 'Вы Подписаны' : 'Подписатся'}
              </button>
            </div>
            {rels[rellIdx].content && (
              <div>
                <span>
                  {fullText[rels[rellIdx].postId]
                    ? rels[rellIdx].content
                    : truncateText(rels[rellIdx].content, 100)}
                </span>
                {rels[rellIdx].content.length > 100 && (
                  <button
                    className="ml-2 text-sm text-gray-300 underline"
                    onClick={() => toggleFullText(rels[rellIdx].postId)}
                  >
                    {fullText[rels[rellIdx].postId] ? 'Менще' : 'Ещё'}
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-[15px]">
            <span className="font-[500]">🎵 {rels[rellIdx].userName} Original audio</span> <div className="flex mt-[5px] flex-col items-center">
  <button onClick={toggleMute}>
    {isMuted ? <VolumeX /> : <Volume2 />}
  </button>
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;
