const express = require("express"); //  Express 프레임워크 불러오기 (서버 기능 구현)
const path = require("path"); //  Node 내장 모듈 – 경로(path) 관련 작업을 쉽게 처리
const cors = require("cors"); //  CORS 설정용 – 도메인 간 통신 허용
const helmet = require("helmet"); //  보안 HTTP 헤더 설정을 도와주는 미들웨어
const csrf = require("csurf"); //  CSRF 토큰 미들웨어 – 요청 위조 방지
const cookieParser = require("cookie-parser"); //  쿠키를 읽고 파싱하는 미들웨어
const mongoose = require("mongoose"); //  MongoDB와 연결하고 데이터 다루는 ODM
const dotenv = require("dotenv"); //  환경변수 파일(.env) 읽기
dotenv.config(); // .env 파일 내용들을 process.env 로 등록

const app = express(); // Express 앱 생성
const port = 4000; // 서버가 열릴 포트 번호

// const allowedOrigins = [
//   "https://kauuru.vercel.app", // ✅ 실제 프로덕션 주소
//   "https://kauuru-d541p8qsq-yangjuns-projects-672649fb.vercel.app", // ✅ 프리뷰 주소
//   "https://0b79-182-229-137-57.ngrok-free.app" // ✅ 최신 ngrok 주소
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("🔗 요청 Origin:", origin);
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.log("❌ CORS 차단:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

const allowedOrigins = [
    "https://kauuru.vercel.app",
    "https://kauuru-d541p8qsq-yangjuns-projects-672649fb.vercel.app",
    "https://f2eb-182-229-137-57.ngrok-free.app",
];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // allow Postman etc
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, origin); // 👈 반드시 origin 그대로 넘겨야 함
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
// app.use(
//     cors({
//         origin: function (origin, callback) {
//             // 1) Postman, 서버 자체 호출 등 Origin이 없는 경우 허용
//             if (!origin) return callback(null, true);

//             // 2) 실제 허용할 도메인 목록에 있으면, 그 값을 다시 넘겨준다.
//             if (allowedOrigins.includes(origin)) {
//                 // → 두 방식 다 가능하나, 아래처럼 true를 리턴하면
//                 //   cors 패키지가 자동으로 Access-Control-Allow-Origin: <요청Origin> 으로 설정해 준다.
//                 return callback(null, true);
//                 // ↳ 만약 callback(null, origin) 을 쓰면 실제 응답 헤더에 정확히 origin이 들어가야 하지만,
//                 //   가독성/일관성 때문에 callback(null, true) 권장
//             }

//             // 3) 그 외 Origin에서 온 요청은 차단
//             return callback(new Error("Not allowed by CORS"));
//         },
//         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowedHeaders: [
//             "Content-Type",
//             "Authorization",
//             "x-csrf-token",
//             "x-xsrf-token",
//         ],
//         credentials: true, // → 반드시 true여야 브라우저가 쿠키(자격증명)를 허용
//     })
// );

app.use(
    cors({
        origin: function (origin, callback) {
            // 1) Postman이나 로컬(Origin이 없는 경우) 허용
            if (!origin) return callback(null, true);

            // 2) allowedOrigins 목록에 있으면 해당 Origin으로 허용
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // 3) 그 외의 Origin은 차단
            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "x-csrf-token",
            "x-xsrf-token", // ← 반드시 추가해야 x-xsrf-token 헤더가 허용
        ],
        credentials: true, // ← 꼭 true로 유지
    })
);

app.use(helmet({ crossOriginResourcePolicy: false }));
// helmet은 Express 앱에 보안 관련 HTTP 헤더를 자동으로 설정해주는 미들웨어
// crossOriginResourcePolicy 설정을 false로 지정하면 외부에서 정적 파일 접근이 가능
// 기본값은 'same-origin'이기 때문에 cross-origin 자원 접근이 필요할 경우 false로 설정
app.use(cookieParser());
// 클라이언트가 보낸 쿠키를 읽어서 req.cookies에 담아주는 미들웨어
// 쿠키 기반 인증이나 CSRF 토큰 검증 시 사용
app.use(express.json());
// JSON 형식의 요청 본문을 파싱해서 req.body로 사용할 수 있게 해주는 미들웨어
// 클라이언트가 JSON 데이터를 전송할 때 반드시 필요

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// /uploads 경로로 들어온 요청에 대해 서버의 ../uploads 디렉토리 안의 정적 파일을 응답
app.use("/ads", express.static(path.join(__dirname, "../uploads/ads")));
// /ads 경로로 들어온 요청에 대해 ../uploads/ads 폴더의 파일을 정적으로 제공
app.use("/IMGads", express.static(path.join(__dirname, "../uploads/IMGads")));
// /IMGads 경로로 들어온 요청에 대해 ../uploads/IMGads 폴더의 파일을 정적으로 제공

mongoose
    .connect(process.env.MONGO_URI)
    // .env 파일에 정의된 MONGO_URI 값을 사용해 MongoDB 데이터베이스에 연결
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.error("MongoDB 연결 실패:", err));

app.use("/users", require("./routes/users"));
// /users 경로로 들어오는 요청을 ./routes/users 모듈로 위임해서 처리
// 회원가입, 로그인 등 사용자 관련 API
app.use("/products", require("./routes/products"));
// /products 경로 요청을 ./routes/products에서 처리
// 상품 목록 조회, 등록, 수정 등의 기능을 여기에 구현
app.use("/reviews", require("./routes/reviews"));
// /reviews 경로 요청을 ./routes/reviews에서 처리
// 상품에 대한 리뷰 작성, 조회 등을 위한 API 경로
app.use("/api/admin", require("./routes/admin"));
// /api/admin 경로 요청은 ./routes/admin 모듈에서 처리
// 관리자 권한이 필요한 요청들을 처리
app.use("/api/admin/ad-images", require("./routes/adminImageAds"));
// /api/admin/ad-images 요청을 ./routes/adminImageAds 모듈로 위임
// 광고 이미지 등록/삭제 기능
app.use("/api/faq", require("./routes/faq"));
// /api/faq 요청은 ./routes/faq에서 처리
// 자주 묻는 질문(FAQ) 목록을 제공하거나 수정
app.use("/api/question", require("./routes/question"));
// /api/question 요청은 ./routes/question에서 처리
// 사용자 문의사항 등록, 목록 조회 등

// const csrfProtection = csrf({
//     cookie: {
//         httpOnly: false,
//         sameSite: "lax",
//         secure: false,
//     },
//     value: (req) => req.headers["x-csrf-token"],
// });

const csrfProtection = csrf({
    cookie: {
        httpOnly: false,
        // 쿠키를 JavaScript에서도 읽을 수 있도록 설정
        // httpOnly가 true면 document.cookie에서 접근이 불가능
        sameSite: "lax",
        // 쿠키를 보내는 조건을 설정
        // lax는 사용자가 직접 사이트를 방문한 경우에만 쿠키를 전송
        secure: false,
        // HTTPS 환경에서만 쿠키를 전송할지 여부를 결정
        // 개발 중에는 false로 두고, 배포 시에는 true로 설정
    },
    value: (req) => req.headers["x-xsrf-token"],
    // 클라이언트가 요청 헤더에 포함한 x-xsrf-token 값을 꺼내서 검증에 사용
    // 이 값을 서버가 발급한 토큰과 비교해서 일치해야 요청을 처리
});

// app.use((req, res, next) => {
//     if (req.method === "OPTIONS") {
//         return res.sendStatus(200);
//     }
//     const csrfNeeded = ["POST", "PUT", "DELETE"].includes(req.method);
//     if (csrfNeeded) {
//         return csrfProtection(req, res, next);
//     }
//     next();
// });

app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
        // 브라우저에서 CORS 사전 요청(preflight)을 보낼 때,
        // OPTIONS 메서드로 먼저 접근하는데 이 요청에는 OK 응답을 보내줘야 한다.
    }
    next();
    // OPTIONS가 아닌 경우에는 다음 미들웨어로 넘김
});

app.get("/csrf-token", csrfProtection, (req, res) => {
    res.status(200).json({ csrfToken: req.csrfToken() });
    // 클라이언트가 CSRF 보호를 위해 사용할 토큰을 발급해주는 엔드포인트
    // 클라이언트는 이 값을 요청 헤더에 포함해서 보냄
});

app.get("/", (req, res) => {
    res.send("서버 실행 중");
    // 기본 루트 경로에 요청이 오면 서버가 정상 실행 중임을 문자열로 응답
});

app.use((err, req, res, next) => {
    console.error("에러 발생:", err);
    // 요청 처리 중 오류가 발생했을 경우 서버 콘솔에 에러를 출력
    res.status(err.status || 500).send(err.message || "서버 오류");
    // 클라이언트에는 상태 코드와 에러 메시지를 전달
    // status가 없으면 500, 메시지가 없으면 "서버 오류"라는 기본값을 사용
});

app.listen(port, () => {
    console.log(`✅ 서버 실행 중: http://localhost:${port}`);
});
