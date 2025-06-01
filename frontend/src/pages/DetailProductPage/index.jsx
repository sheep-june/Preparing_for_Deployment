import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import ProductImage from "./Sections/ProductImage";
import ProductInfo from "./Sections/ProductInfo";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import usePageTitle from "../../hooks/usePageTitle";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const DetailProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const user = useSelector((state) => state.user);

    usePageTitle(product?.title);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axiosInstance.get(
                    `/products/${productId}`
                );
                setProduct(response.data.product);
                setReviews(response.data.reviews);
                setAverageRating(response.data.averageRating);
                const reviewRes = await axiosInstance.get(
                    `/reviews/${productId}`
                );
                setReviews(reviewRes.data.reviews);
                setAverageRating(reviewRes.data.averageRating);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProduct();
    }, [productId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!comment || rating === 0) {
            await Swal.fire({
                icon: "warning",
                title: "입력값이 부족합니다",
                text: "별점과 내용을 모두 입력해주세요.",
                confirmButtonText: "확인",
                customClass: {
                    confirmButton: "tw-swal-cancel",
                },
                buttonsStyling: false,
            });
            return;
        }

        try {
            await axiosInstance.post("/reviews", {
                productId: product._id,
                comment,
                rating,
            });

            toast.success("리뷰가 등록되었습니다.");
            setComment("");
            setRating(0);

            const reviewRes = await axiosInstance.get(
                `/reviews/${product._id}`
            );
            setReviews(reviewRes.data.reviews);
            setAverageRating(reviewRes.data.averageRating);
        } catch (error) {
            console.error("리뷰 등록 오류:", error);
            toast.error("리뷰 등록에 실패했습니다.");
        }
    };

    if (!product) return null;

    return (
        <section className="max-w-6xl mx-auto p-4">
            <div className="text-center">
                <h1 className="p-4 text-2xl font-bold">{product.title}</h1>
            </div>

            {/* 좌우로 나뉜 기본 정보 영역 */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2">
                    <ProductImage product={product} />
                </div>
                <div className="w-full lg:w-1/2">
                    <ProductInfo product={product} />
                </div>
            </div>

            {/* 아래로 분리된 긴 설명 영역 */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">상품 설명</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {product.description}
                </p>
            </div>

            {/* 리뷰 평균 + 목록 */}
            <div className="mt-10">
                <h2 className="text-xl font-bold mb-2">
                    리뷰 {averageRating.toFixed(1)} / 5
                </h2>

                {reviews.length === 0 ? (
                    <p className="text-gray-500">등록된 리뷰가 없습니다.</p>
                ) : (
                    <ul className="space-y-3">
                        {reviews.map((review) => (
                            <li key={review._id} className="border p-3 rounded">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-yellow-500">
                                        {"★".repeat(review.rating)}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        by {review.user.name}
                                    </span>
                                </div>
                                <p>{review.comment}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 리뷰 작성 폼 */}
            {user.isAuth && (
                <form
                    onSubmit={handleSubmitReview}
                    className="mt-6 p-4 border rounded"
                >
                    <h3 className="text-lg font-semibold mb-2">리뷰 작성</h3>

                    <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <button
                                type="button"
                                key={i}
                                onClick={() => setRating(i)}
                                className="text-xl text-yellow-400"
                            >
                                <FaStar
                                    color={i <= rating ? "#facc15" : "#e5e7eb"}
                                />
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="w-full border p-2 rounded mb-2"
                        rows="4"
                        placeholder="리뷰 내용을 입력해주세요."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-[#00C4C4] text-[#00C4C4] bg-white rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                    >
                        등록하기
                    </button>
                </form>
            )}
        </section>
    );
};

export default DetailProductPage;
