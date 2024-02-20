import React from "react";
import {
    Space,
    Table,
    Cascader,
    Select,
    Form,
    Button,
    Col,
    Divider,
    Row,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";

const JAPAN_OFFSET = "+0900";

const columns = [
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
        render: (_, { address, name }) => {
            const href = `https://www.google.com/maps?q=${address} ${name}`;
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
    // {
    //     title: "操作",
    //     key: "action",
    //     render: () => (
    //         <Tooltip placement="top" title="未実装">
    //             <Space size="middle">
    //                 <a>詳細</a>
    //             </Space>
    //         </Tooltip>
    //     ),
    // },
];

const genres = [
    "全部",
    "和食",
    "日本料理",
    "寿司",
    "海鮮・魚介",
    "そば（蕎麦）",
    "うなぎ",
    "焼き鳥",
    "お好み焼き",
    "もんじゃ焼き",
    "洋食",
    "フレンチ",
    "イタリアン",
    "スペイン料理",
    "ステーキ",
    "中華料理",
    "韓国料理",
    "タイ料理",
    "ラーメン",
    "カレー",
    "鍋",
    "もつ鍋",
    "居酒屋",
    "パン",
    "スイーツ",
    "バー・お酒",
    "天ぷら",
    "焼肉",
    "料理旅館",
    "ビストロ",
    "ハンバーグ",
    "とんかつ",
    "串揚げ",
    "うどん",
    "しゃぶしゃぶ",
    "沖縄料理",
    "ハンバーガー",
    "パスタ",
    "ピザ",
    "餃子",
    "ホルモン",
    "カフェ",
    "喫茶店",
    "ケーキ",
    "タピオカ",
    "食堂",
    "ビュッフェ・バイキング",
];

const App = () => {
    const [options, setOptions] = useState([]);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState("");
    const [area, setArea] = useState("");
    let host = "";
    if (import.meta.env.PROD) {
        host = "https://hunter.atang.tech";
    }
    async function list() {
        setLoading(true);
        const qsArr = ["limit=500"];
        if (genre) {
            qsArr.push(`genre=${genre}`);
        }
        if (area) {
            qsArr.push(`url=${area}`);
        }
        const apiUrl = host + "/api/stores?" + qsArr.join("&");
        const res = await axios.get(apiUrl);
        const data = res.data.stores;
        setData(data);
        setTotal(res.data.count);
        setLoading(false);
    }

    async function init() {
        list("");
        const prefecturesRes = await axios.get(`${host}/api/prefectures`);
        const prefecturesArr = prefecturesRes.data.map((i) => ({
            value: i.key,
            label: i.label,
            isLeaf: false,
        }));
        setOptions(prefecturesArr);
    }

    const onChange = (value) => {
        if (value) {
            if (value.length === 2) {
                setArea(`${value[0]}/${value[1].replace("-", "/")}`);
            }
        } else {
            setArea("");
        }
    };

    const handleSelectChange = (value) => {
        let result = "";
        if (value !== "全部") {
            result = value;
        }
        setGenre(result);
        // list({ genre: result });
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

    const handleExport = async () => {
        const json = data.map((i) => {
            return {
                name: i.name,
                tel: i.tel,
                genre: i.category,
                address: i.address,
            };
        });
        const res = await axios.post(host + "/api/stores/export", {
            data: json,
        });
        const csv = res.data.csv;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", `download_${Date.now()}.csv`);
        a.click();
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        list();
    }, [genre, area]);

    return (
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Form layout="inline">
                <div style={{ display: "flex", width: "100%" }}>
                    <Form.Item label="エリア">
                        <Cascader
                            options={options}
                            loadData={loadData}
                            onChange={onChange}
                            changeOnSelect
                            style={{ width: 150 }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginLeft: 20 }} label="ジャンル">
                        <Select
                            defaultValue="全部"
                            style={{
                                width: 120,
                            }}
                            onChange={handleSelectChange}
                            options={genres.map((i) => ({
                                value: i,
                                label: i,
                            }))}
                        />
                    </Form.Item>

                    <Button
                        style={{ marginLeft: "auto" }}
                        type="primary"
                        onClick={handleExport}
                        icon={<DownloadOutlined />}
                    />
                </div>
            </Form>

            <Table
                loading={loading}
                rowKey="_id"
                columns={columns}
                dataSource={data}
                pagination={{
                    defaultPageSize: 10,
                    total: total,
                    showTotal: (total) => `全${total}件`,
                }}
            />
        </Space>
    );
};

export default App;
