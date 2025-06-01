import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function AdImageSlider() {
    const [ads, setAds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await axiosInstance.get("/api/admin/ad-images");
                setAds(res.data);
            } catch (err) {
                console.error("광고 불러오기 실패:", err);
            }
        };
        fetchAds();
    }, []);

    if (ads.length === 0) return null;

    return (
        <div className="w-full aspect-[16/9] overflow-hidden">
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                navigation={true}
                pagination={{ type: "progressbar" }}
                autoplay={{
                    delay: 7000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                loop={true}
                className="w-full h-full"
                speed={2000}
            >
                {ads.map((ad) => (
                    <SwiperSlide key={ad._id}>
                        <img
                            // src={`http://localhost:4000/${ad.image}`}
                            
                            src={`${import.meta.env.VITE_SERVER_URL}/${ad.image}`}
                            alt={ad.product?.title}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() =>
                                navigate(
                                    `/product/${ad.product?._id || ad.product}`
                                )
                            }
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
