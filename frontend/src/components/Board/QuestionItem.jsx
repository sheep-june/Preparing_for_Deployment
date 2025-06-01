import { useState } from "react";
import CommentBox from "./CommentBox";

const QuestionItem = ({ question, isAdmin, refresh }) => {
    const [showCommentForm, setShowCommentForm] = useState(false);

    const toggleForm = () => {
        setShowCommentForm((prev) => !prev);
    };

    return (
        <div className="border rounded mb-4 p-4">
            <div className="mb-2">
                <h3 className="text-lg font-semibold">{question.title}</h3>
                <p className="text-gray-700 whitespace-pre-line mt-1">
                    {question.content}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    작성자: {question.user?.name || "유저"} /{" "}
                    {new Date(question.createdAt).toLocaleString()}
                </p>
            </div>

            {question.comment ? (
                <div className="mt-4 border-t pt-3 text-sm bg-gray-50 p-3 rounded">
                    <p className="text-gray-800 font-medium">💬 관리자 답변</p>
                    <p className="text-gray-700 mt-1 whitespace-pre-line">
                        {question.comment.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 text-right">
                        작성자: {question.comment.admin?.name || "관리자"} /{" "}
                        {new Date(question.comment.createdAt).toLocaleString()}
                    </p>
                </div>
            ) : isAdmin ? (
                <>
                    <button
                        className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        onClick={toggleForm}
                    >
                        {showCommentForm ? "취소" : "답변 작성"}
                    </button>
                    {showCommentForm && (
                        <CommentBox
                            questionId={question._id}
                            onFinish={refresh}
                            onClose={toggleForm}
                        />
                    )}
                </>
            ) : (
                <p className="mt-3 text-sm text-gray-400"> ※ 답변 대기 중</p>
            )}
        </div>
    );
};

export default QuestionItem;
