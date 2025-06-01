import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};

const FaqItem = ({ faq, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: faq.title,
        content: faq.content,
    });

    const isAdmin = !!localStorage.getItem("adminToken");
    const token = localStorage.getItem("adminToken");
    const csrfToken = getCookie("XSRF-TOKEN");

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/api/faq/${faq._id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-xsrf-token": csrfToken,
                },
            });
            toast.success("삭제 완료");
            onUpdate();
        } catch (err) {
            toast.error("삭제 실패");
        }
    };

    const handleUpdate = async () => {
        if (!editData.title || !editData.content) {
            return toast.warn("제목과 내용을 모두 입력하세요.");
        }
        try {
            await axios.put(`/api/faq/${faq._id}`, editData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-xsrf-token": csrfToken,
                },
            });
            toast.success("수정 완료");
            setIsEditing(false);
            onUpdate();
        } catch (err) {
            toast.error("수정 실패");
        }
    };

    return (
        <div className="border rounded mb-3 overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 font-medium"
            >
                {faq.title}
            </button>

            {open && (
                <div className="px-4 py-3 bg-white text-sm text-gray-700 border-t">
                    {isEditing ? (
                        <>
                            <input
                                className="w-full border px-2 py-1 mb-2 rounded"
                                value={editData.title}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <textarea
                                className="w-full border px-2 py-1 rounded mb-2"
                                value={editData.content}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        content: e.target.value,
                                    })
                                }
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleUpdate}
                                    className="px-3 py-1 bg-white text-[#00C4C4] border border-[#00C4C4] rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                                >
                                    저장
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1 bg-white text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                                >
                                    취소
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="whitespace-pre-line">{faq.content}</p>
                            <p className="mt-2 text-xs text-right text-gray-400">
                                작성자: {faq.admin?.name || "관리자"} /{" "}
                                {new Date(faq.createdAt).toLocaleString()}
                            </p>

                            {isAdmin && (
                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-3 py-1 bg-white text-[#00C4C4] border border-[#00C4C4] rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-3 py-1 bg-white text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FaqItem;
