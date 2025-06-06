import React, { useEffect, useState } from "react";
import axiosInstance, { setCsrfToken } from "../../utils/axios";

const PRODUCT_API_PATH = "/products";

export default function AdminAdImagePage() {
    const [products, setProducts] = useState([]);
    const [ads, setAds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    // ① 페이지 로드 시: CSRF → 상품 목록 → 광고 목록
    useEffect(() => {
        (async () => {
            await setCsrfToken();
            await fetchProducts();
            await fetchAds();
        })();
    }, []);

    // 상품 목록 가져오기
    const fetchProducts = async () => {
        try {
            const res = await axiosInstance.get(PRODUCT_API_PATH);
            setProducts(res.data.products || []);
        } catch (err) {
            console.error("상품 불러오기 실패:", err);
            setErrorMsg("상품 목록을 불러오는 중 오류가 발생했습니다.");
        }
    };

    // 광고 목록 가져오기 (공개 API: authAdmin 제거됨)
    const fetchAds = async () => {
        try {
            const res = await axiosInstance.get("/api/admin/ad-images");
            setAds(res.data);
        } catch (err) {
            console.error("광고 불러오기 실패:", err);
            setErrorMsg("광고 목록을 불러오는 중 오류가 발생했습니다.");
        }
    };

    // 광고 업로드
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !imageFile) {
            alert("상품을 선택하고, 이미지 파일을 업로드해주세요.");
            return;
        }
        if (ads.length >= 5) {
            alert("광고는 최대 5개까지 등록할 수 있습니다.");
            return;
        }

        const formData = new FormData();
        formData.append("productId", selectedProduct._id);
        formData.append("image", imageFile);

        try {
            await axiosInstance.post("/api/admin/ad-images", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("광고가 등록되었습니다.");
            setSelectedProduct(null);
            setImageFile(null);
            setSearchTerm("");
            fetchAds();
        } catch (err) {
            console.error("광고 등록 실패:", err);
            if (err.response?.status === 403) {
                alert(
                    "권한이 없거나 CSRF 토큰이 유효하지 않습니다. 다시 로그인해주세요."
                );
            } else {
                alert("광고 등록 중 오류가 발생했습니다.");
            }
        }
    };

    // 광고 삭제
    const handleDelete = async (id) => {
        if (!window.confirm("이 광고를 삭제하시겠습니까?")) return;
        try {
            await axiosInstance.delete(`/api/admin/ad-images/${id}`);
            fetchAds();
        } catch (err) {
            console.error("광고 삭제 실패:", err);
            alert("광고 삭제 중 오류가 발생했습니다.");
        }
    };

    // 광고 순서 변경 (up / down)
    const moveAd = async (id, direction) => {
        try {
            await axiosInstance.patch(`/api/admin/ad-images/order/${id}`, {
                direction,
            });
            fetchAds();
        } catch (err) {
            console.error("광고 순서 변경 실패:", err);
            alert("광고 순서 변경 중 오류가 발생했습니다.");
        }
    };

    // 상품 검색 필터
    const filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">광고 이미지 관리</h2>

            {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}

            {/* ─ 광고 등록 폼 ─ */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div>
                    <label className="block mb-1 font-medium">상품 검색</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="상품명을 입력하세요"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => setSelectedProduct(product)}
                            className={`px-2 py-1 cursor-pointer rounded ${
                                selectedProduct?._id === product._id
                                    ? "bg-blue-100 border border-blue-400"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            {product.title}
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <p className="text-gray-500">검색 결과가 없습니다.</p>
                    )}
                </div>

                {selectedProduct && (
                    <p className="text-green-700">
                        선택된 상품: <strong>{selectedProduct.title}</strong>
                    </p>
                )}

                <div>
                    <label className="block mb-1 font-medium">
                        광고 이미지 파일
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="block"
                    />
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                    광고 등록
                </button>
            </form>

            {/* ─ 등록된 광고 목록 ─ */}
            <h3 className="text-xl font-semibold mb-2">등록된 광고</h3>
            {ads.length === 0 ? (
                <p className="text-gray-500">등록된 광고가 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {ads.map((ad, idx) => (
                        <li
                            key={ad._id}
                            className="flex items-center justify-between border rounded p-3"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={`${import.meta.env.VITE_SERVER_URL}/${
                                        ad.image
                                    }`}
                                    alt={ad.product?.title}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div>
                                    <p className="font-medium">
                                        {ad.product?.title}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        순서: {ad.order}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => moveAd(ad._id, "up")}
                                    disabled={ad.order === 1}
                                    className={`px-2 py-1 text-sm rounded ${
                                        ad.order === 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => moveAd(ad._id, "down")}
                                    disabled={ad.order === ads.length}
                                    className={`px-2 py-1 text-sm rounded ${
                                        ad.order === ads.length
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                >
                                    ▼
                                </button>
                                <button
                                    onClick={() => handleDelete(ad._id)}
                                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
