import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../store/thunkFunctions";
import axiosInstance from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductInfo = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const handleCartClick = () => {
        if (!user.isAuth) {
            toast.warn("로그인이 필요합니다.");
            setTimeout(() => {
                navigate("/auth");
            }, 2000); // 1초 정도 후 이동
            return;
        }
        dispatch(addToCart({ productId: product._id }));
    };

    const handleWishlistClick = async () => {
        if (!user.isAuth) {
            toast.warn("로그인이 필요합니다.");
            setTimeout(() => {
                navigate("/auth");
            }, 2000);
            return;
        }

        try {
            const res = await axiosInstance.post("/users/wishlist", {
                productId: product._id,
            });
            toast.success("찜 목록에 추가되었습니다.");
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("찜하기에 실패했습니다.");
            }
        }
    };

    return (
        <div>
            <p className="text-xl text-bold">상품 정보</p>
            <ul>
                <li>
                    <span className="font-semibold text-gray-900">가격:</span>{" "}
                    {product.price} 원
                </li>
                <li>
                    <span className="font-semibold text-gray-900">
                        팔린 개수:
                    </span>{" "}
                    {product.sold} 개
                </li>
            </ul>
            <div className="mt-3 flex space-x-2">
                <button
                    onClick={handleCartClick}
                    className="w-1/2 px-4 py-2 border border-[#00C4C4] text-[#00C4C4] bg-white rounded-md hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                >
                    장바구니로
                </button>
                <button
                    onClick={handleWishlistClick}
                    className="w-1/2 px-4 py-2 border border-pink-500 text-pink-500 bg-white rounded-md hover:bg-pink-500 hover:text-white transition-colors duration-200"
                >
                    찜하기
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;
