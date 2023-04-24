import React from "react";
import { useActiveAuthProvider, useGetIdentity } from "@refinedev/core";
import { Layout as AntdLayout, Typography, Switch, Space, theme, Button, Row, Col } from "antd";
import type { RefineThemedLayoutHeaderProps } from "@refinedev/antd";
import Profile from "../profile"
import { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import { Link } from "react-router-dom";
import { HomeFilled, FolderOpenFilled, ShoppingFilled } from "@ant-design/icons";

const { Text } = Typography;
const { useToken } = theme;

export const ThemedHeader: React.FC<RefineThemedLayoutHeaderProps> = () => {
  const { token } = useToken();

  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const { mode, setMode } = useContext(ColorModeContext);


  //const shouldRenderHeader = user && (user.name || user.avatar);
  const shouldRenderHeader = true;

  if (!shouldRenderHeader) {
    return null;
  }

  return (
    <AntdLayout.Header
      style={{
        backgroundColor: token.colorBgElevated,
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        padding: "0px 24px",
        height: "64px",
      }}
    >
        {/* <Space>
          <Link to="/"><Button type="primary" icon={<HomeFilled />}>Home</Button></Link>
          <Link to="/courses/content"><Button type="primary" icon={<FolderOpenFilled />}>My Courses</Button></Link>
          <Link to="/cart"><Button type="primary" icon={<ShoppingFilled />}>Cart</Button></Link>
        </Space> */}
        <Space>
        <Switch
            checkedChildren="🌛"
            unCheckedChildren="🔆"
            onChange={() => setMode(mode === "light" ? "dark" : "light")}
            defaultChecked={mode === "dark"}
          />
          <Profile />
          </Space>
    </AntdLayout.Header>
  );
};

export default ThemedHeader;
