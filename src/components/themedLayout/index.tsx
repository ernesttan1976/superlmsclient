import React from "react";
import { ThemedSider as DefaultSider } from "./sider";
import { ThemedHeader as DefaultHeader } from "./header";
import { ThemedTitle as DefaultTitle } from "./title";
import { Grid, Layout as AntdLayout } from "antd";
import type { RefineThemedLayoutProps } from "@refinedev/antd";

export const ThemedLayout: React.FC<RefineThemedLayoutProps> = ({
  children,
  Header,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;
  const TitleToRender = Title ?? DefaultTitle;
  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;

  return (
    <AntdLayout style={{ minHeight: "100vh"}}>
      <SiderToRender Title={TitleToRender} />
      <AntdLayout>
        <HeaderToRender />
        <AntdLayout.Content>
          <div
            style={{
              minHeight: 360,
              padding: 0 
            }}
          >
            {children}
          </div>
          {OffLayoutArea && <OffLayoutArea />}
        </AntdLayout.Content>
        {Footer && <Footer />}
      </AntdLayout>
    </AntdLayout>
  );
};

export default ThemedLayout