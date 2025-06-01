import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axiosInstance from "../utils/axios";
import { useSelector } from "react-redux";

const ProductCard = ({ product, refreshWishlist }) => {
    const user = useSelector((state) => state.user);

    const isWished = user.userData?.wishlist?.includes(product._id);

    const handleToggleWish = async () => {
        try {
            if (isWished) {
                await axiosInstance.delete("/users/wishlist", {
                    params: { productId: product._id },
                });
            } else {
                await axiosInstance.post("/users/wishlist", {
                    productId: product._id,
                });
            }

            refreshWishlist();
        } catch (err) {
            console.error("찜 처리 오류:", err);
        }
    };

    return (
        <li className="relative border rounded-md shadow">
            <img
                // src={`http://localhost:4000/uploads/${product.images[0]}`}
                src={`${import.meta.env.VITE_SERVER_URL}/uploads/${product.images[0]}`}
                alt={product.title}
                className="w-full h-48 object-cover rounded-t"
            />

            <button
                onClick={handleToggleWish}
                className="absolute top-2 right-2 text-red-500 text-xl"
            >
                {isWished ? <FaHeart /> : <FaRegHeart />}
            </button>

            <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
                <p className="text-sm text-gray-700 mb-1">
                    ₩{product.price.toLocaleString()}
                </p>
                <Link
                    to={`/product/${product._id}`}
                    className="text-blue-600 text-sm hover:underline"
                >
                    상세보기
                </Link>
            </div>
        </li>
    );
};

export default ProductCard;
