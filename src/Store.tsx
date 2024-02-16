import React from "react";
import { Space, Table, Tooltip, Cascader } from "antd";
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
    const [options, setOptions] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    let host = "";
    if (import.meta.env.PROD) {
        host = "https://hunter.atang.tech";
    }
    async function list(qs) {
        setLoading(true);
        const qsArr = ["limit=1000"];
        if (qs) {
            qsArr.push(qs);
        }
        const url = host + "/api/stores?" + qsArr.join("&");
        const res = await axios.get(url);
        const data = res.data.stores;
        setData(data);
        setLoading(false);
    }

    async function init() {
        list();
        const prefecturesRes = await axios.get(`${host}/api/prefectures`);
        const prefecturesArr = prefecturesRes.data.map((i) => ({
            value: i.key,
            label: i.label,
            isLeaf: false,
        }));
        setOptions(prefecturesArr);
    }

    const onChange = (value, selectedOptions) => {
        if (value.length === 2) {
            list(`url=${value[0]}/${value[1].replace("-", "/")}`);
        }
    };

    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        const areas = await axios.get(
            `${host}/api/areas?prefecture=${targetOption.value}`
        );
        const arr = areas.data.map((i) => ({
            value: i.key,
            label: i.label,
        }));
        arr.unshift({
            value: "",
            label: "全部",
        });
        targetOption.children = arr;
        setOptions([...options]);
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            <Space style={{ marginBottom: 20 }}>
                <div>エリア: </div>
                <Cascader
                    options={options}
                    loadData={loadData}
                    onChange={onChange}
                    changeOnSelect
                />
            </Space>
            <Table
                loading={loading}
                rowKey="_id"
                columns={columns}
                dataSource={data}
            />
        </div>
    );
};

export default App;
