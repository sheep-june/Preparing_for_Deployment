import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CheckBox from "../LandingPage/Sections/CheckBox";
import RadioBox from "../LandingPage/Sections/RadioBox";
import CardItem from "../LandingPage/Sections/CardItem";
import { categories, prices } from "../../utils/filterData";
import axiosInstance from "../../utils/axios";
import usePageTitle from "../../hooks/usePageTitle";
import { toast } from "react-toastify";

const sortOptions = [
    { id: "views", label: "조회순" },
    { id: "rating", label: "별점순" },
    { id: "lowPrice", label: "가격 낮은순" },
    { id: "highPrice", label: "가격 높은순" },
    { id: "sold", label: "판매순" },
];

const ITEMS_PER_PAGE = 18;

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialSearch = searchParams.get("query") || "";
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [filters, setFilters] = useState({ continents: [], price: [] });
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState("views");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    usePageTitle(searchTerm ? `${searchTerm} 검색 결과` : "검색 결과");

    useEffect(() => {
        if (initialSearch) {
            fetchSearchResults(initialSearch, filters, sortBy, 1);
        }
    }, []);

    useEffect(() => {
        fetchSearchResults(searchTerm, filters, sortBy, currentPage);
    }, [currentPage, sortBy]);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        // navigate(`/search?query=${searchTerm}`);
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        fetchSearchResults(searchTerm, filters, sortBy, 1);
    };

    const handleFilters = (newData, type) => {
        const newFilters = { ...filters };
        const key = type === "categories" ? "continents" : type;

        if (key === "continents") {
            newFilters[key] = newData.map((v) => parseInt(v));
        } else if (key === "price") {
            newFilters[key] = getPriceRange(newData);
        }

        setFilters(newFilters);
        setCurrentPage(1);
        fetchSearchResults(searchTerm, newFilters, sortBy, 1);
    };

    const getPriceRange = (id) => {
        const priceObj = prices.find((item) => item._id === parseInt(id));
        return priceObj ? priceObj.array : [];
    };

    const fetchSearchResults = async (
        term = searchTerm,
        appliedFilters = filters,
        sort = sortBy,
        page = currentPage
    ) => {
        try {
            const skip = (page - 1) * ITEMS_PER_PAGE;
            const res = await axiosInstance.get("/products", {
                params: {
                    searchTerm: term,
                    // filters: appliedFilters,
                    ...appliedFilters,
                    sort,
                    skip,
                    limit: ITEMS_PER_PAGE,
                },
            });
            setProducts(res.data.products);
            setTotalPages(Math.ceil(res.data.totalCount / ITEMS_PER_PAGE));
        } catch (err) {
            toast.error("검색 실패:", err);
        }
    };

    const changePage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleSortChange = (sortId) => {
        setSortBy(sortId);
        setCurrentPage(1);
        fetchSearchResults(searchTerm, filters, sortId, 1);
    };

    return (
        <section className="w-full px-4">
            {/* 검색창 */}
            <form
                onSubmit={handleSearchSubmit}
                className="mb-4 flex justify-center gap-2"
            >
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    className="w-full max-w-xl border border-[#00C4C4] p-2 rounded-md 
             focus:outline-none focus:ring-0 focus:border-2 focus:border-[#00C4C4]"
                    placeholder="검색어를 입력하세요"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-white text-[#00C4C4] border border-[#00C4C4] rounded 
             hover:bg-[#00C4C4] hover:text-white"
                >
                    검색
                </button>
            </form>
            <div className="flex gap-6">
                <div className="w-[250px] space-y-4">
                    <div>
                        <h3 className="text-[#00C4C4] font-semibold mb-1 text-center">
                            카테고리
                        </h3>
                        <CheckBox
                            items={categories}
                            checkedItems={filters.continents}
                            onFilters={(filters) =>
                                handleFilters(filters, "categories")
                            }
                        />
                    </div>
                    <div>
                        <h3 className="text-[#00C4C4] font-semibold text-center mb-1">
                            가격
                        </h3>
                        <RadioBox
                            prices={prices}
                            checkedPrice={
                                prices.find(
                                    (p) =>
                                        JSON.stringify(p.array) ===
                                        JSON.stringify(filters.price)
                                )?._id || 0
                            }
                            onFilters={(filters) =>
                                handleFilters(filters, "price")
                            }
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex gap-4 mb-4 border-b pb-2">
                        {sortOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleSortChange(option.id)}
                                className={`text-sm px-2 py-1 rounded border-b-2 transition-all duration-150 ${
                                    sortBy === option.id
                                        ? "border-black font-semibold"
                                        : "border-transparent text-gray-500"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {products.map((product) => (
                            <CardItem
                                key={product._id}
                                product={product}
                                refreshWishlist={() => {}}
                            />
                        ))}
                    </div>
                    {/* 페이지네이션: 숫자 버튼 */}
                    <div className="flex justify-center mt-8 space-x-2">
                        <button
                            onClick={() => changePage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-[#00C4C4] text-[#00C4C4] rounded hover:bg-[#00C4C4] hover:text-white disabled:opacity-50"
                        >
                            처음
                        </button>
                        <button
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-[#00C4C4] text-[#00C4C4] rounded hover:bg-[#00C4C4] hover:text-white disabled:opacity-50"
                        >
                            이전
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1;
                            const isActive = currentPage === pageNum;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => changePage(pageNum)}
                                    className={`px-3 py-1 border border-[#00C4C4] rounded transition-all
                                        ${
                                            isActive
                                                ? "bg-[#00C4C4] text-white"
                                                : "text-[#00C4C4] hover:bg-[#00C4C4] hover:text-white"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-[#00C4C4] text-[#00C4C4] rounded hover:bg-[#00C4C4] hover:text-white disabled:opacity-50"
                        >
                            다음
                        </button>
                        <button
                            onClick={() => changePage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-[#00C4C4] text-[#00C4C4] rounded hover:bg-[#00C4C4] hover:text-white disabled:opacity-50"
                        >
                            마지막
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchPage;
