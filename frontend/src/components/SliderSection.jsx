import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axiosInstance from "../utils/axios";
import CardItem from "../pages/LandingPage/Sections/CardItem";

const SliderSection = ({ title, sort }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchSortedProducts = async () => {
            try {
                const res = await axiosInstance.get("/products", {
                    params: {
                        sort,
                        limit: 10,
                    }
                });
                const sorted = res.data.products;
                setProducts(sorted);
            } catch (err) {
                console.error(`${title} 슬라이드 로딩 실패:`, err);
            }
        };
        fetchSortedProducts();
    }, [sort, title]);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2500,
        autoplaySpeed: 1500,
        cssEase: "linear",
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="my-10 bg-[#fff5f8] px-4 py-6 rounded-md">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <Slider {...settings}>
                {products.map((product) => (
                    <div key={product._id} className="px-2">
                        <div className="w-full">
                            <CardItem product={product} />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderSection;
