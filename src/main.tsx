import React from "react";
import ReactDOM from "react-dom/client";
import jaJP from "antd/locale/ja_JP";
import { ConfigProvider } from "antd";

import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ConfigProvider locale={jaJP}>
            <App />
        </ConfigProvider>
    </React.StrictMode>
);
