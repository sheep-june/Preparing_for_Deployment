import React, { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import axiosInstance, { setCsrfToken } from "./utils/axios"; // axiosInstance와 setCsrfToken 가져오기
import "./App.css";

import { useDispatch, useSelector } from "react-redux";
import { authUser } from "./store/thunkFunctions";

import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotAuthRoutes from "./components/NotAuthRoutes";
import UploadProductPage from "./pages/UploadProductPage";
import CartPage from "./pages/CartPage";
import HistoryPage from "./pages/HistoryPage";
import DetailProductPage from "./pages/DetailProductPage";
import WishlistPage from "./pages/WishlistPage";
import MyProductsPage from "./pages/MyProductPage";
import EditProductPage from "./pages/EditProductPage";
import SearchPage from "./pages/SearchPage";
import ProtectedPage from "./pages/ProtectedPage";

import AuthPage from "./pages/AuthPage/Index";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminProtectedRoutes from "./components/AdminProtectedRoutes";
import AdminDashboardPage from "./pages/AdminDashboardPage";
// import AdminAdSection from "./pages/AdminAdSection";
import BoardSection from "./pages/AdminDashboardPage/Sections/BoardSection";
import FaqWritePage from "./pages/FaqWritePage";

import BoardPage from "./pages/BoardPage";
import FAQPage from "./pages/FAQPage";
import QuestionPage from "./pages/QuestionPage";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import AdminAdImagePage from "./pages/AdminAdImagePage/index";

function Layout() {
    const location = useLocation();

    // '/auth' 경로일 경우 레이아웃 없이 Outlet만 렌더
    if (location.pathname === "/auth") {
        return <Outlet />;
    }

    // 전역 레이아웃 (Navbar + main + Footer)
    const isFullWidthPage =
        location.pathname.startsWith("/search") ||
        location.pathname === "/user/myproducts";

    return (
        <div className="flex flex-col h-screen justify-between">
            <ToastContainer
                position="bottom-right"
                theme="light"
                pauseOnHover
                autoClose={1500}
            />
            <Navbar />
            <main
                className={
                    isFullWidthPage
                        ? "mb-auto w-full px-4"
                        : "mb-auto w-full max-w-[1600px] mx-auto px-4"
                }
            >
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

function App() {
    const isAuth = useSelector((state) => state.user?.isAuth);
    const dispatch = useDispatch();

    useEffect(() => {
        // 1) CSRF 토큰을 받아서 axiosInstance에 설정
        setCsrfToken();

        // 2) 로그인된 사용자(accessToken)가 있으면 redux 상태 갱신
        const token = localStorage.getItem("accessToken");
        if (token) {
            dispatch(authUser());
        }
        // axiosInstance.interceptors.request 에 이미 accessToken 또는 adminToken을 헤더에 자동으로 붙이도록 되어 있음
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* 메인 페이지: 광고 슬라이더, 베스트셀러 슬라이더 등 */}
                <Route index element={<LandingPage />} />

                {/* AuthPage는 레이아웃 없이 렌더 */}
                <Route path="/auth" element={<AuthPage />} />

                {/* 검색 결과 페이지 */}
                <Route path="/search" element={<SearchPage />} />

                {/* 상품 상세 페이지 */}
                <Route
                    path="/product/:productId"
                    element={<DetailProductPage />}
                />

                {/* FAQ 조회(사용자) */}
                <Route path="/board/faq" element={<FAQPage />} />

                {/* 로그인되지 않은 사용자 전용 라우트 */}
                <Route element={<NotAuthRoutes isAuth={isAuth} />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* 로그인된 사용자만 접근 가능한 라우트 */}
                <Route element={<ProtectedRoutes isAuth={isAuth} />}>
                    <Route path="/protected" element={<ProtectedPage />} />
                    <Route
                        path="/product/upload"
                        element={<UploadProductPage />}
                    />
                    <Route path="/user/cart" element={<CartPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route
                        path="/user/myproducts"
                        element={<MyProductsPage />}
                    />
                    <Route path="/user/wishlist" element={<WishlistPage />} />
                    <Route
                        path="/product/edit/:productId"
                        element={<EditProductPage />}
                    />
                    <Route path="/board" element={<BoardPage />} />
                    <Route path="/board/question" element={<QuestionPage />} />
                </Route>

                {/* 관리자 로그인 페이지 */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* 관리자 전용 라우트 */}
                <Route element={<AdminProtectedRoutes />}>
                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboardPage />}
                    />
                    {/* <Route path="/admin/ads" element={<AdminAdSection />} /> */}
                    <Route path="/admin/board" element={<BoardSection />} />
                    <Route path="/admin/faq-write" element={<FaqWritePage />} />
                    {/* <Route path="/admin/ad-image" element={<AdminAdSection />} /> */}
                    <Route path="/admin/ads" element={<AdminAdImagePage />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
