import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        {/* 모든 라우팅 기능을 App 내부에서 사용할 수 있도록 최상단에 BrowserRouter로 감쌉니다 */}

        <Provider store={store}>
            {/* Redux 상태관리 기능을 모든 컴포넌트에서 사용할 수 있도록 감쌉니다 */}

            <PersistGate loading={null} persistor={persistor}>
                {/* 로컬스토리지에 저장된 Redux 상태가 복원될 때까지 기다립니다 (null이면 로딩 화면 없음) */}

                <App />
                {/* 실제 전체 앱 컴포넌트를 렌더링합니다. 이 안에 라우터, 페이지, 레이아웃이 구성됩니다 */}
            </PersistGate>
        </Provider>
    </BrowserRouter>
);
