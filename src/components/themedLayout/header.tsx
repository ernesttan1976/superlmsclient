import React from "react";
import { useActiveAuthProvider, useGetIdentity } from "@refinedev/core";
import { Layout as AntdLayout, Typography, Avatar, Space, theme } from "antd";
import type { RefineThemedLayoutHeaderProps } from "@refinedev/antd";
import Profile from "../profile"

const { Text } = Typography;
const { useToken } = theme;

export const ThemedHeader: React.FC<RefineThemedLayoutHeaderProps> = () => {
  const { token } = useToken();

  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const shouldRenderHeader = user && (user.name || user.avatar);

  if (!shouldRenderHeader) {
    return null;
  }

  return (
    <AntdLayout.Header
      style={{
        backgroundColor: token.colorBgElevated,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0px 24px",
        height: "64px",
      }}
    >
      <Space>
        <Space size="middle">
          <Profile />
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};

export default ThemedHeader;
