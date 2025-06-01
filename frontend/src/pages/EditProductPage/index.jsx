import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance, { setCsrfToken } from "../../utils/axios";
import FileUpload from "../../components/FileUpload";
import { toast } from "react-toastify";
import { categories } from "../../utils/filterData";
import usePageTitle from "../../hooks/usePageTitle";

const EditProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user?.userData);
    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: 0,
        category: 1,
        images: [],
    });

    usePageTitle("상품수정");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(
                    `/products/${productId}?type=single`
                );
                setProduct(res.data[0]);
            } catch (err) {
                console.error("상품 정보 불러오기 실패:", err);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImages = (newImages) => {
        setProduct((prev) => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await setCsrfToken();
            await axiosInstance.put(`/products/${productId}`, {
                ...product,
                writer: userData.id,
            });
            toast.success("상품이 수정되었습니다.");
            setTimeout(() => {
                navigate("/user/myproducts");
            }, 2000);
        } catch (err) {
            console.error("수정 실패:", err);
            toast.error("수정 중 오류 발생");
        }
    };

    if (!product || !product.images) {
        return (
            <p className="text-center mt-10">
                상품 정보를 불러오는 중입니다...
            </p>
        );
    }

    return (
        <section>
            <div className="text-center m-7">
                <h1>상품 수정</h1>
            </div>
            <form onSubmit={handleSubmit} className="mt-6">
                <FileUpload
                    images={product.images}
                    onImageChange={handleImages}
                />
                <div className="mt-4">
                    <label htmlFor="title">상품명</label>
                    <input
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C4C4] focus:border-[#00C4C4]"
                        name="title"
                        id="title"
                        onChange={handleChange}
                        value={product.title}
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="price">가격</label>
                    <input
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C4C4] focus:border-[#00C4C4]"
                        type="number"
                        name="price"
                        id="price"
                        onChange={handleChange}
                        value={product.price}
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="category">카테고리</label>
                    <select
                        className="w-full px-4 py-2 mt-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C4C4] focus:border-[#00C4C4]"
                        name="category"
                        id="category"
                        onChange={handleChange}
                        value={product.category}
                    >
                        {categories.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-4">
                    <label htmlFor="description">상품 설명</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={6}
                        onChange={handleChange}
                        value={product.description}
                        className="w-full px-4 py-2 mt-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C4C4] focus:border-[#00C4C4]"
                    />
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-[#00C4C4] border border-[#00C4C4] bg-white rounded-md hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                    >
                        수정하기
                    </button>
                </div>
            </form>
        </section>
    );
};

export default EditProductPage;
