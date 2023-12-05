import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const VimeoVideoCarousel = () => {
  const [videos, setVideos] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = "efe262906a956927cbe769d2ab9d6a3b";
  const apiUrl = "https://api.vimeo.com/categories/music/videos";

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.vimeo.*+json;version=3.4",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setVideos(data.data); // Assuming the video data is in the 'data' property
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchVideos();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        spaceBetween={50}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index}>
            <div>
              <img
                src={video.pictures.sizes[3].link}
                alt={video.name}
                style={{ width: "100%", height: "auto" }}
              />
              <h3>{video.name}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        modules={[Thumbs]}
        spaceBetween={50}
        slidesPerView={1}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%" /* 16:9 */,
                height: "0",
                overflow: "hidden",
              }}
            >
              <iframe allowfullscreen="allowfullscreen"
                src={video.player_embed_url}
                style={{
                  left: "50%",
                  minHeight: "100%",
                  minWidth: "100%",
                  transform: " translate(-50%, -50%)",
                  position: "absolute",
                  top: "50%",
                }}
              />
              <h3>{video.name}</h3>
              {/* Add more video details as needed */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
};

export default VimeoVideoCarousel;
