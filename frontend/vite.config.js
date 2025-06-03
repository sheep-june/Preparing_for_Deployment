// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import eslint from "vite-plugin-eslint";

// export default defineConfig({
//     plugins: [react(), eslint()],
//     server: {
//         proxy: {
//             "/api": "http://localhost:4000",
//         },
//         allowedHosts: ['592a-182-229-137-57.ngrok-free.app'],
//         // 만약 ngrok 주소가 자주 바뀐다면 아래처럼 'all'로 허용 가능하지만 보안 주의 필요
//         // allowedHosts: 'all',
//     },

//     appType: "spa",
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import dotenv from "dotenv";

// .env 파일 로딩
dotenv.config();

export default defineConfig({
    plugins: [react(), eslint()],
    server: {
        proxy: {
            "/api": {
                target: process.env.VITE_SERVER_URL,
                changeOrigin: true,
                secure: false,
            },
        },
        allowedHosts: ["92b4-182-229-137-57.ngrok-free.app"],
    },
    appType: "spa",
});
