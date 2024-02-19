import React from "react";
import { Space, Table, Cascader, Select } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
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
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState("");
    const [area, setArea] = useState("");
    let host = "";
    if (import.meta.env.PROD) {
        host = "https://hunter.atang.tech";
    }
    async function list() {
        setLoading(true);
        const qsArr = ["limit=10000"];
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

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        list();
    }, [genre, area]);

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
                <div style={{ marginLeft: 40 }}>ジャンル: </div>
                <Select
                    style={{
                        width: 120,
                    }}
                    onChange={handleSelectChange}
                    options={genres.map((i) => ({ value: i, label: i }))}
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
