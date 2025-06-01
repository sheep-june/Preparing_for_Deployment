import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { Link } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useConfirmAlert } from "../../hooks/useConfirmAlert";

const MyProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const user = useSelector((state) => state.user);
    const { confirm } = useConfirmAlert();

    usePageTitle(user?.userData?.name && `${user.userData.name}님의 상품`);

    const fetchMyProducts = async () => {
        try {
            const res = await axiosInstance.get("/users/myproducts");
            setProducts(res.data.products);
        } catch (error) {
            console.error("내가 올린 상품 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "정말 삭제하시겠습니까?",
            text: "삭제된 항목은 되돌릴 수 없습니다.",
            confirmText: "삭제",
            cancelText: "취소",
        });

        if (!ok) return;

        try {
            await axiosInstance.delete(`/products/${id}`);
            toast.success("삭제되었습니다.");
            fetchMyProducts();
        } catch (err) {
            toast.error("삭제 중 오류 발생");
        }
    };

    const filtered = products.filter(
        (product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <section className="w-full px-4">
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#00C4C4]">
                내가 올린 상품
            </h2>

            {/* 검색창 */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    placeholder="상품명을 입력하세요"
                    className="w-full max-w-3xl border border-[#00C4C4] p-2 rounded-md focus:outline-none focus:ring-0 focus:border-2 focus:border-[#00C4C4]"
                />
            </div>

            {paginated.length === 0 ? (
                <p className="text-center text-gray-500">상품이 없습니다.</p>
            ) : (
                <>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {paginated.map((product) => (
                            <li
                                key={product._id}
                                className="border border-gray-300 hover:border-[#00C4C4] rounded-md p-4 shadow hover:shadow-md transition-colors duration-200"
                            >
                                <img
                                    // src={`http://localhost:4000/uploads/${product.images[0]}`}
                                    src={`${import.meta.env.VITE_SERVER_URL}/uploads/${product.images[0]}`}
                                    alt={product.title}
                                    className="w-full h-40 object-cover mb-2 rounded"
                                />
                                <h3 className="text-lg font-bold mb-1">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-700 mb-1">
                                    ₩{product.price.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    등록일:{" "}
                                    {new Date(
                                        product.createdAt
                                    ).toLocaleDateString()}
                                </p>
                                <div className="flex justify-between mt-2">
                                    <Link
                                        to={`/product/${product._id}`}
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        상세보기
                                    </Link>
                                    <Link
                                        to={`/product/edit/${product._id}`}
                                        className="text-yellow-600 text-sm hover:underline"
                                    >
                                        수정
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(product._id)
                                        }
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* 페이지네이션 */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 border rounded transition-colors duration-200 ${
                                    currentPage === i + 1
                                        ? "bg-[#00C4C4] text-white border-[#00C4C4]"
                                        : "text-[#00C4C4] border-[#00C4C4] hover:bg-[#00C4C4] hover:text-white"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default MyProductsPage;
