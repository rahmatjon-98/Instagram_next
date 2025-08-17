'use client'
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import Stories from "react-insta-stories";


export default function SwiperStories() {
  const storiesData = [
    [
      { url: "https://picsum.photos/300/600?random=1", duration: 3000 },
      { url: "https://picsum.photos/300/600?random=2", duration: 3000 },
    ],
    [
      { url: "https://picsum.photos/300/600?random=3", duration: 3000 },
      { url: "https://picsum.photos/300/600?random=4", duration: 3000 },
    ],
    [
      { url: "https://picsum.photos/300/600?random=5", duration: 3000 },
      { url: "https://picsum.photos/300/600?random=6", duration: 3000 },
    ],
  ];
  return (
    <div className="w-full h-[600px] flex justify-center items-center">
      <Swiper
        effect={"cube"}
        grabCursor={true}
        cubeEffect={{
          shadow: false,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        pagination={true}
        modules={[EffectCube,]}
        className="w-[320px] h-[600px] rounded-2xl overflow-hidden shadow-lg"
      >
        {storiesData.map((stories, index) => (
          <SwiperSlide key={index}>
            <Stories
              stories={stories}
              width={320}
              height={600}
              defaultInterval={4000}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}