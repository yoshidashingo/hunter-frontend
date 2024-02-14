import React from "react";
import { Space, Table, Tooltip, Spin } from "antd";
import type { TableProps } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
const JAPAN_OFFSET = "+0900";

const columns: TableProps["columns"] = [
    {
        title: "店名",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "電話番号",
        dataIndex: "tel",
        key: "tel",
    },
    {
        title: "ジャンル",
        dataIndex: "category",
        key: "category",
    },
    {
        title: "住所",
        key: "address",
        dataIndex: "address",
        render: (_, { address }) => {
            const href = "https://www.google.com/maps?q=" + address;
            return (
                <a href={href} target="_blank">
                    {address}
                </a>
            );
        },
    },
    {
        title: "日付",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (_, { createdAt }) => {
            return moment(createdAt)
                .subtract(1, "day")
                .utcOffset(JAPAN_OFFSET)
                .format("YYYY-MM-DD");
        },
    },
    {
        title: "操作",
        key: "action",
        render: () => (
            <Tooltip placement="top" title="未実装">
                <Space size="middle">
                    <a>詳細</a>
                </Space>
            </Tooltip>
        ),
    },
];

const App: React.FC = () => {
    const [data, setData] = useState([]);

    async function init() {
        let host = "";
        if (import.meta.env.PROD) {
            host = "https://hunter.atang.tech";
        }
        const url = host + "/api/stores?limit=1000";
        const res = await axios.get(url, {
            headers: {
                "ngrok-skip-browser-warning": "hi",
            },
        });
        const data = res.data.stores;
        setData(data);
    }
    useEffect(() => {
        init();
    }, []);
    if (data.length) {
        return <Table columns={columns} dataSource={data} />;
    } else {
        return <Spin style={{ display: "flex", justifyContent: "center" }} />;
    }
};

export default App;
