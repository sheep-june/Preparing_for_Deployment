import axios from "axios";
import qs from "qs";

// axios 인스턴스를 새로 생성
// 공통 설정을 미리 정의해서 여러 곳에서 재사용할 수 있게 함
const axiosInstance = axios.create({
    // baseURL: API 서버의 기본 주소 설정
    // import.meta.env.VITE_SERVER_URL 은 환경변수로 설정된 API 서버 주소
    baseURL: import.meta.env.VITE_SERVER_URL,

    // withCredentials: true를 설정하면, 요청 시 브라우저가 자동으로 쿠키를 포함시켜 줌 (인증 유지용)
    withCredentials: true,

    // paramsSerializer: 쿼리 파라미터를 문자열로 바꿀 때 사용하는 함수
    paramsSerializer: (params) => {
        // filters라는 파라미터가 있을 경우, 그 안의 내용을 JSON 문자열로 변환
        // 서버가 JSON 형식으로 받기를 기대할 때 사용
        if (params.filters) {
            return qs.stringify({
                ...params, // 기존 다른 파라미터 유지
                filters: JSON.stringify(params.filters), // filters만 JSON 문자열화
            });
        }
        // filters가 없으면 그냥 일반적인 방식으로 변환
        return qs.stringify(params);
    },
});

// 요청을 보내기 전에 실행되는 인터셉터 설정
// 모든 요청에 공통 헤더(토큰 등)를 추가할 수 있음
axiosInstance.interceptors.request.use(
    function (config) {
        // config.headers가 없으면 빈 객체로 초기화
        if (!config.headers) {
            config.headers = {};
        }

        // localStorage에서 저장된 액세스 토큰 가져오기
        // 일반 사용자 또는 관리자 중 하나라도 있으면 사용
        const token =
            localStorage.getItem("accessToken") ||
            localStorage.getItem("adminToken");

        // 저장된 CSRF 토큰 가져오기
        const csrf = localStorage.getItem("csrfToken");

        // 액세스 토큰이 있으면 Authorization 헤더에 Bearer 토큰 추가
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // CSRF 토큰이 있으면 x-xsrf-token 헤더에 추가
        if (csrf) {
            config.headers["x-xsrf-token"] = csrf;
        }

        // 수정된 config를 반환하여 요청 진행
        return config;
    },
    function (error) {
        // 요청 보내기 전에 에러가 나면 거부 처리
        return Promise.reject(error);
    }
);

// CSRF 토큰을 서버에서 받아와 저장하는 함수
// CSRF 공격 방지를 위해 서버와 클라이언트 간에 공유된 토큰 사용
export const setCsrfToken = async () => {
    try {
        // 서버에서 CSRF 토큰 요청
        const res = await axiosInstance.get("/csrf-token");

        // 응답에서 csrfToken 값 추출
        const token = res.data.csrfToken;

        // localStorage에 저장
        localStorage.setItem("csrfToken", token);

        // axiosInstance에 기본 헤더로 등록 (모든 요청에 자동 포함됨)
        axiosInstance.defaults.headers.common["x-xsrf-token"] = token;

        // 브라우저 쿠키에도 저장 (서버에서 쿠키로 읽는 경우 대비)
        document.cookie = `XSRF-TOKEN=${token}; path=/;`;
    } catch (err) {
        // 오류 발생 시 콘솔에 출력
        console.error("CSRF 토큰 요청 실패:", err);
    }
};

export default axiosInstance;




// 쇼핑몰 프론트엔드에서 백엔드 API와 안전하고 일관되게 통신하기 위해 만든 axios 설정 파일
// 프론트엔드 전체에서 API 요청을 보낼 때 공통적으로 사용하는 axios 인스턴스를 구성
// 인증 토큰, CSRF 보안, 쿠키 포함 등 요청에 필요한 중요한 설정들을 자동으로 붙여주는 역할


// 1. axios 인스턴스 생성: 기본 서버 주소, 쿠키 포함, 쿼리 문자열 포맷 등을 미리 설정해둠
// 2. 요청 인터셉터 설정: 모든 요청에 인증 토큰과 CSRF 토큰을 자동으로 추가함
// 3. CSRF 토큰 초기화 함수 제공: 서버에서 CSRF 토큰을 받아 localStorage, axios, 쿠키에 저장
// 4. 모든 API 요청에서 재사용 가능: 상품조회, 장바구니, 주문, 로그인 등 모든 API 요청에서 이 인스턴스를 사용함


// 동작 흐름
//     앱이 처음 실행되면
//         setCsrfToken()을 호출해서 CSRF 토큰을 한 번 받아놓음

//     사용자가 로그인하면
//         서버가 JWT 또는 세션 쿠키를 내려주고, 프론트는 JWT를 localStorage에 저장

//     이후 모든 API 요청은
//         axiosInstance.get(...), axiosInstance.post(...) 등으로 보냄
//         자동으로 토큰이 헤더에 붙고, 쿠키도 포함되어 로그인 상태 유지

