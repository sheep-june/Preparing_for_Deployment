import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../store/thunkFunctions";
import { setCsrfToken } from "../../utils/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import { toast } from "react-toastify";

const AuthPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const fromRef = useRef(sessionStorage.getItem("redirectAfterLogin") || "/");

    usePageTitle("Welcome買う売る");

    useEffect(() => {
        setCsrfToken();
        if (mode === "register") {
            setIsRightPanelActive(true);
        }
    }, [mode]);

    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        reset: resetLogin,
        formState: { errors: loginErrors },
    } = useForm({ mode: "onChange" });

    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        reset: resetRegister,
        formState: { errors: registerErrors },
    } = useForm({ mode: "onChange" });

    const onLogin = async ({ email, password }) => {
        try {
            const result = await dispatch(loginUser({ email, password }));
            if (loginUser.fulfilled.match(result)) {
                resetLogin();
                const target = fromRef.current || "/";
                sessionStorage.removeItem("redirectAfterLogin");
                navigate(target, { replace: true });
            } else {
                toast.error("로그인에 실패했습니다");
            }
        } catch (error) {
            toast.error("로그인 에러:", error);
        }
    };

    const onRegister = async ({ name, email, password }) => {
        try {
            const result = await dispatch(
                registerUser({
                    name,
                    email,
                    password,
                    image: "https://via.placeholder.com/600x400?text=no+user+image",
                })
            );
            if (registerUser.fulfilled.match(result)) {
                resetRegister();
                setIsRightPanelActive(false);
            } else {
                toast.error("회원가입 실패");
            }
        } catch (error) {
            toast.error("회원가입 에러:", error);
        }
    };

    return (
        <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-white font-[Montserrat] relative flex">
            {/* 회원가입 폼 */}
            <div
                className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
                    isRightPanelActive
                        ? "translate-x-full opacity-100 z-20"
                        : "opacity-0 z-10"
                }`}
            >
                <form
                    onSubmit={handleRegisterSubmit((data) => {
                        if (data.password !== data.confirmPassword) {
                            alert(
                                "비밀번호와 비밀번호 확인이 일치하지 않습니다."
                            );
                            return;
                        }
                        onRegister(data);
                    })}
                    className="bg-white flex flex-col items-center justify-center h-full px-10 text-center"
                >
                    <h1 className="text-2xl text-[#00C4C4] mb-2">회원가입</h1>

                    <input
                        type="text"
                        placeholder="Name"
                        {...registerRegister("name", {
                            required: "이름은 필수입니다.",
                        })}
                        className="bg-white border border-[#00C4C4] px-4 py-2 w-full max-w-[300px] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4C4]"
                    />
                    {registerErrors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {registerErrors.name.message}
                        </p>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        {...registerRegister("email", {
                            required: "이메일은 필수입니다.",
                        })}
                        className="bg-white border border-[#00C4C4] px-4 py-2 w-full max-w-[300px] mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4C4]"
                    />
                    {registerErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {registerErrors.email.message}
                        </p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        {...registerRegister("password", {
                            required: "비밀번호는 필수입니다.",
                            minLength: { value: 6, message: "최소 6자입니다." },
                        })}
                        className="bg-white border border-[#00C4C4] px-4 py-2 w-full max-w-[300px] mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4C4]"
                    />
                    {registerErrors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {registerErrors.password.message}
                        </p>
                    )}

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        {...registerRegister("confirmPassword", {
                            required: "비밀번호 확인은 필수입니다.",
                        })}
                        className="bg-white border border-[#00C4C4] px-4 py-2 w-full max-w-[300px] mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4C4]"
                    />
                    {registerErrors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {registerErrors.confirmPassword.message}
                        </p>
                    )}

                    <div className="flex flex-col items-center space-y-2 mt-4">
                        <button
                            type="submit"
                            className="w-[120px] py-2 border border-[#00C4C4] text-[#00C4C4] bg-white rounded-full hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                        >
                            회원가입
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRightPanelActive(false)}
                            className="w-[120px] py-2 border border-pink-500 text-pink-500 bg-white rounded-full hover:bg-pink-500 hover:text-white transition-colors duration-200"
                        >
                            로그인으로
                        </button>
                    </div>
                </form>
            </div>

            {/* 로그인 폼 */}
            <div
                className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
                    isRightPanelActive
                        ? "translate-x-full opacity-0 z-10"
                        : "opacity-100 z-20"
                }`}
            >
                <form
                    onSubmit={handleLoginSubmit(onLogin)}
                    className="bg-white flex flex-col items-center justify-center h-full px-10 text-center"
                >
                    <h1 className="text-2xl text-[#00C4C4] mb-2">로그인</h1>

                    <input
                        type="email"
                        placeholder="Email"
                        {...loginRegister("email", {
                            required: "이메일은 필수입니다.",
                        })}
                        className="bg-white border border-[#00C4C4] px-4 py-2 w-full max-w-[300px] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4C4]"
                    />
                    {loginErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {loginErrors.email.message}
                        </p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        {...loginRegister("password", {
                            required: "비밀번호는 필수입니다.",
                            minLength: { value: 6, message: "최소 6자입니다." },
                        })}
                        className="bg-white border border-[#00C4C4] px-4 py-2 w-full max-w-[300px] mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4C4]"
                    />
                    {loginErrors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {loginErrors.password.message}
                        </p>
                    )}

                    <div className="flex flex-col items-center space-y-2 mt-4">
                        <button
                            type="submit"
                            className="w-[120px] py-2 border border-[#00C4C4] text-[#00C4C4] bg-white rounded-full hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                        >
                            로그인
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRightPanelActive(true)}
                            className="w-[120px] py-2 border border-pink-500 text-pink-500 bg-white rounded-full hover:bg-pink-500 hover:text-white transition-colors duration-200"
                        >
                            회원가입으로
                        </button>
                    </div>
                </form>
            </div>

            {/* 오버레이 패널 */}
            <div
                className={`absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-700 z-30 ${
                    isRightPanelActive ? "-translate-x-full" : "translate-x-0"
                }`}
            >
                <div
                    className={`w-full h-full text-white flex flex-col items-center justify-center px-10 text-center transition-[background,border-radius] duration-500 delay-700 ${
                        isRightPanelActive
                            ? "bg-gradient-to-l from-[#66d1d1] to-[#3cbcbc] rounded-tr-[100px] rounded-br-[100px]"
                            : "bg-gradient-to-r from-[#66d1d1] to-[#3cbcbc] rounded-tl-[100px] rounded-bl-[100px]"
                    }`}
                >
                    <h1 className="text-2xl font-bold mb-2">
                        {isRightPanelActive
                            ? "Hello, Friend!"
                            : "Welcome Back!"}
                    </h1>
                    <p className="text-sm mb-4">
                        {isRightPanelActive
                            ? "회원가입을 하고 여정을 시작하세요"
                            : "로그인하고 여정을 시작하세요"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
