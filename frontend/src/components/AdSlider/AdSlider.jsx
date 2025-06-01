//막아둠

import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/axios";
import AdVideoSlider from "./AdVideoSlider";

const AdSlider = () => {
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef();

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

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
    };

    if (ads.length === 0) return null;

    return (
        <div className="relative w-full aspect-video bg-black mb-8 overflow-hidden">
            <button
                className="absolute left-2 top-1/2 z-20 transform -translate-y-1/2 text-white text-3xl"
                onClick={handlePrev}
            >
                ◀
            </button>
            <button
                className="absolute right-2 top-1/2 z-20 transform -translate-y-1/2 text-white text-3xl"
                onClick={handleNext}
            >
                ▶
            </button>

            <AdVideoSlider
                ads={ads}
                currentIndex={currentIndex}
                handleNext={handleNext}
            />
        </div>
    );
};

export default AdSlider;
