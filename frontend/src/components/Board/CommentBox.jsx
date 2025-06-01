import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance, { setCsrfToken } from "../../utils/axios";

const CommentBox = ({ questionId, onFinish, onClose }) => {
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            return toast.warn("댓글 내용을 입력해주세요.");
        }

        try {
            await setCsrfToken();
            await new Promise((r) => setTimeout(r, 100));
            await axiosInstance.post(`/api/question/${questionId}/comment`, {
                content,
            });

            toast.success("댓글이 등록되었습니다.");
            setContent("");
            if (onFinish) onFinish();
            if (onClose) onClose();
        } catch (err) {
            toast.error("댓글 등록 실패");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="답변 내용을 입력하세요"
                className="w-full border px-3 py-2 rounded h-24 focus:outline-none focus:ring-2 focus:ring-[#00C4C4]"
            />
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-red-500 text-red-500 text-sm bg-white rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                >
                    취소
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-[#00C4C4] text-[#00C4C4] text-sm bg-white rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                >
                    등록
                </button>
            </div>
        </form>
    );
};

export default CommentBox;
