//막아둠

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const AdVideoSlider = () => {
    const [ads, setAds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await axiosInstance.get("/api/admin/ads");
                setAds(res.data);
            } catch (err) {
                console.error("광고 불러오기 실패:", err);
            }
        };
        fetchAds();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 15000,
    };

    return (
        <div className="w-full aspect-video overflow-hidden bg-black mb-8">
            <Slider {...settings}>
                {ads.map((ad) => (
                    <div
                        key={ad._id}
                        className="w-full h-full flex items-center justify-center bg-black cursor-pointer"
                        onClick={() => navigate(`/product/${ad.product?._id}`)}
                    >
                        <video
                            src={`${import.meta.env.VITE_SERVER_URL}/ads/${ad.video}`}
                            muted
                            autoPlay
                            loop
                            playsInline
                            preload="auto"
                            className="w-full h-full object-contain"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default AdVideoSlider;

