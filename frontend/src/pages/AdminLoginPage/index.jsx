import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setCsrfToken } from "../../utils/axios";

const AdminLoginPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/api/admin/login", form);
            const { token } = res.data;
            localStorage.setItem("adminToken", token);
            await setCsrfToken();
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.response?.data || "로그인 실패");
        }
    };

    return (
        <section className="flex flex-col justify-center mt-20 max-w-[400px] m-auto">
            <div className="p-6 bg-white rounded-md shadow-md">
                <h1 className="text-3xl font-semibold text-center">
                    관리자 로그인
                </h1>
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="text-sm font-semibold text-gray-800">
                            이메일
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="text-sm font-semibold text-gray-800">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700"
                        >
                            로그인
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AdminLoginPage;
