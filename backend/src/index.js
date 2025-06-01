// const express = require("express");
// const path = require("path");
// const cors = require("cors");
// const helmet = require("helmet");
// const csrf = require("csurf");
// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();

// const app = express();
// const port = 4000;

// // app.use(
// //     // 개발중에
// //     // cors({
// //     //   origin: "http://localhost:5173",
// //     //   credentials: true,
// //     // })

// //     //로컬배포용
// //     cors({
// //         origin: "https://592a-182-229-137-57.ngrok-free.app",
// //         credentials: true,
// //     })
// // );
// const allowedOrigins = [
//     // "http://localhost:5173",
//     "https://kauuru-d541p8qsq-yangjuns-projects-672649fb.vercel.app",
//     "https://af70-182-229-137-57.ngrok-free.app",
// ];

// // app.use(
// //   cors({
// //     origin: function (origin, callback) {
// //       // origin이 없을 때는 Postman 등 직접 요청할 때도 허용하기 위해 체크
// //       if (!origin || allowedOrigins.includes(origin)) {
// //         callback(null, true);
// //       } else {
// //         callback(new Error("Not allowed by CORS"));
// //       }
// //     },
// //     credentials: true,
// //   })
// // );
// app.use(
//     cors({
//         origin: function (origin, callback) {
//             if (!origin || allowedOrigins.includes(origin)) {
//                 callback(null, true);
//             } else {
//                 callback(new Error("Not allowed by CORS"));
//             }
//         },
//         credentials: true,
//     })
// );

// app.use(helmet({ crossOriginResourcePolicy: false }));

// app.use(cookieParser());
// app.use(express.json());

// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// app.use("/ads", express.static(path.join(__dirname, "../uploads/ads")));
// app.use("/IMGads", express.static(path.join(__dirname, "../uploads/IMGads")));

// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => console.log("✅ MongoDB 연결 성공"))
//     .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

// app.use("/users", require("./routes/users"));
// app.use("/products", require("./routes/products"));
// app.use("/reviews", require("./routes/reviews"));

// app.use("/api/admin", require("./routes/admin"));
// // app.use("/api/admin/ads", require("./routes/adminAds"));
// app.use("/api/admin/ad-images", require("./routes/adminImageAds"));

// app.use("/api/faq", require("./routes/faq"));
// app.use("/api/question", require("./routes/question"));

// const csrfProtection = csrf({
//     cookie: {
//         httpOnly: false, // 개발 중엔 false
//         sameSite: "lax",
//         secure: false,
//     },
//     value: (req) => req.headers["x-csrf-token"],
// });

// app.get("/csrf-token", csrfProtection, (req, res) => {
//     res.status(200).json({ csrfToken: req.csrfToken() });
// });

// app.use((req, res, next) => {
//     const csrfNeeded = ["POST", "PUT", "DELETE"].includes(req.method);
//     if (csrfNeeded) {
//         return csrfProtection(req, res, next);
//     }
//     next();
// });

// app.get("/", (req, res) => {
//     res.send("서버 실행 중");
// });

// app.use((err, req, res, next) => {
//     console.error("에러 발생:", err);
//     res.status(err.status || 500).send(err.message || "서버 오류");
// });

// app.listen(port, () => {
//     console.log(`✅ 서버 실행 중: http://localhost:${port}`);
// });








const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 4000;

const allowedOrigins = [
  "https://kauuru.vercel.app", // ✅ 실제 프로덕션 주소
  "https://kauuru-d541p8qsq-yangjuns-projects-672649fb.vercel.app", // ✅ 프리뷰 주소
  "https://af70-182-229-137-57.ngrok-free.app" // ✅ 최신 ngrok 주소
];


app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔗 요청 Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS 차단:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/ads", express.static(path.join(__dirname, "../uploads/ads")));
app.use("/IMGads", express.static(path.join(__dirname, "../uploads/IMGads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 성공"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/reviews", require("./routes/reviews"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/admin/ad-images", require("./routes/adminImageAds"));
app.use("/api/faq", require("./routes/faq"));
app.use("/api/question", require("./routes/question"));

const csrfProtection = csrf({
  cookie: {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
  },
  value: (req) => req.headers["x-csrf-token"],
});

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  const csrfNeeded = ["POST", "PUT", "DELETE"].includes(req.method);
  if (csrfNeeded) {
    return csrfProtection(req, res, next);
  }
  next();
});

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

app.get("/", (req, res) => {
  res.send("서버 실행 중");
});

app.use((err, req, res, next) => {
  console.error("에러 발생:", err);
  res.status(err.status || 500).send(err.message || "서버 오류");
});

app.listen(port, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${port}`);
});
