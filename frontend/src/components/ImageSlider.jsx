import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const ImageSlider = ({ images }) => {
    return (
        <Carousel autoPlay showThumbs={false} infiniteLoop>
            {images.map((url, idx) => (
                <div key={idx}>
                    <img
                        src={url}
                        alt={`product-${idx}`}
                        className="w-full max-h-[150px]"
                    />
                </div>
            ))}
        </Carousel>
    );
};

export default ImageSlider;
