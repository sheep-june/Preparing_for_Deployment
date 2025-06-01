import React, { useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import usePageTitle from "../../hooks/usePageTitle";

const ITEMS_PER_PAGE = 20;

const HistoryPage = () => {
    const userData = useSelector((state) => state.user?.userData);
    const sortedHistory = [...(userData?.history || [])].sort(
        (a, b) => new Date(b.dateOfPurchase) - new Date(a.dateOfPurchase)
    );
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(sortedHistory.length / ITEMS_PER_PAGE);
    const paginated = sortedHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    usePageTitle("주문 내역");

    return (
        <section>
            <div className="text-center m-7">
                <h2 className="text-2xl">주문 내역</h2>
            </div>

            <table className="w-full text-sm text-left text-gray-500">
                <thead className="border-[1px]">
                    <tr>
                        <th className="w-1/4">상품명</th>
                        <th className="w-1/4">수량</th>
                        <th className="w-1/4">가격</th>
                        <th className="w-1/4">구매일</th>
                    </tr>
                </thead>

                <tbody>
                    {paginated.map((item, index) => (
                        <tr className="border-b" key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toLocaleString()}원</td>
                            <td>
                                {dayjs(item.dateOfPurchase).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-4 space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border rounded 
        ${
            currentPage === i + 1
                ? "bg-[#00C4C4] text-white border-[#00C4C4]"
                : "bg-white text-[#00C4C4] border-[#00C4C4] hover:bg-[#00C4C4] hover:text-white"
        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default HistoryPage;
