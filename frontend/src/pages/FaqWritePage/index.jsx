import { useState } from "react";
// import axios from "axios";
import axios from "../../utils/axios";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FaqWritePage = () => {
    const [form, setForm] = useState({ title: "", content: "" });
    const navigate = useNavigate();
    const isAdmin = !!localStorage.getItem("adminToken");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.content) {
            return toast.warn("제목과 내용을 모두 입력해주세요.");
        }

        try {
            const token = localStorage.getItem("adminToken");
            await axios.post("/api/faq", form, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("FAQ 작성 완료!");
            navigate("/board/faq");
        } catch (err) {
            toast.error("FAQ 작성 실패");
        }
    };

    if (!isAdmin) {
        return (
            <p className="text-center text-red-500">
                관리자만 접근 가능합니다.
            </p>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">FAQ 작성</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="제목"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#00C4C4] focus:border-[#00C4C4] transition-colors duration-200"
                />
                <textarea
                    placeholder="내용"
                    value={form.content}
                    onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded h-60 focus:outline-none focus:ring-2 focus:ring-[#00C4C4] focus:border-[#00C4C4] transition-colors duration-200"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-white text-[#00C4C4] border border-[#00C4C4] rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                >
                    작성하기
                </button>
            </form>
        </div>
    );
};

export default FaqWritePage;
