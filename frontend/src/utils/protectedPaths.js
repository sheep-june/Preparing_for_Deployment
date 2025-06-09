// 보호된(인증이 필요한) 경로들을 미리 정의한 배열
// 예: 로그인하지 않으면 접근하면 안 되는 페이지들
export const protectedPrefixes = [
    "/product/upload",  // 상품 등록 페이지 (관리자용)
    "/product/edit",    // 상품 수정 페이지 (관리자용)
    "/user",            // 마이페이지, 유저 정보 페이지
    "/history",         // 주문 내역 페이지
];

// 현재 URL(pathname)이 보호된 경로에 해당하는지 검사하는 함수
// 예: "/user/profile" → "/user"로 시작하니까 보호된 경로로 판단됨
export const isProtectedPath = (pathname) =>
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
