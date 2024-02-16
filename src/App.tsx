import React, { useState } from "react";
import { BankOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Store from "./Store";

const { Sider, Content } = Layout;

const App: React.FC = () => {
    const [collapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            icon: <BankOutlined />,
                            label: "店舗",
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Store />
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
