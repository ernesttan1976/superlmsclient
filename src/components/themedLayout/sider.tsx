import React, { useState, CSSProperties } from "react";
import {
  useTranslate,
  useLogout,
  useTitle,
  CanAccess,
  ITreeMenu,
  useIsExistAuthentication,
  useRouterContext,
  useMenu,
  useRefineContext,
  useLink,
  useRouterType,
  useActiveAuthProvider,
  pickNotDeprecated,
  useWarnAboutChange,
} from "@refinedev/core";
import { ThemedTitle } from "@refinedev/antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  BarsOutlined,
  LeftOutlined,
  RightOutlined,
  FolderOpenFilled,
  HomeFilled,
  ShoppingFilled,
  ToolOutlined,
  ReadOutlined,
  ReadFilled,
  TeamOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Grid, Drawer, Button, theme, Space, Divider } from "antd";
import type { RefineThemedLayoutSiderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import { ICourse, IUser } from "models";
import { Link } from "react-router-dom";
import OpenAILogo from "../../pages/openai.gif";

const drawerButtonStyles: CSSProperties = {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  position: "fixed",
  top: 16,
  zIndex: 999,
};

const { SubMenu } = Menu;
const { useToken } = theme;

export const ThemedSider: React.FC<RefineThemedLayoutSiderProps> = ({
  Title: TitleFromProps,
  render,
  meta,
}) => {
  const { token } = useToken();

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const isExistAuthentication = useIsExistAuthentication();
  const routerType = useRouterType();
  const NewLink = useLink();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const { Link: LegacyLink } = useRouterContext();
  const Link = routerType === "legacy" ? LegacyLink : NewLink;
  const TitleFromContext = useTitle();
  const translate = useTranslate();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
  const breakpoint = Grid.useBreakpoint();
  const { hasDashboard } = useRefineContext();
  const authProvider = useActiveAuthProvider();
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  function courseLinks(user: IUser): JSX.Element {
    const menuElements = user.courses_id.map(course => (
      <Menu.Item
        key={course._id}
        icon={<ReadOutlined />}>
        <Link to={`/courses/content/${course._id}`} title={course.title}>{course.title.slice(0, 20)}</Link>
      </Menu.Item>
    ));

    return (
      <SubMenu
        key={"special"}
        icon={<ReadOutlined />}
        title={"My Courses"}>
        {menuElements}
      </SubMenu>)
  }


  const isMobile =
    typeof breakpoint.xl === "undefined" ? false : !breakpoint.xl;

  const RenderToTitle = TitleFromProps ?? TitleFromContext ?? ThemedTitle;

  const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
    return tree.map((item: ITreeMenu) => {
      const {
        icon,
        label,
        route,
        key,
        name,
        children,
        parentName,
        meta,
        options,
      } = item;

      if (children.length > 0) {
        return (
          <CanAccess
            key={item.key}
            resource={name.toLowerCase()}
            action="list"
            params={{
              resource: item,
            }}
          >
            <SubMenu
              key={item.key}
              icon={icon ?? <ToolOutlined />}
              title={label}
            >
              {renderTreeView(children, selectedKey)}
            </SubMenu>
          </CanAccess>
        );
      }
      const isSelected = key === selectedKey;
      const isRoute = !(
        pickNotDeprecated(meta?.parent, options?.parent, parentName) !==
        undefined && children.length === 0
      );

      return (
        <>
          <CanAccess
            key={item.key}
            resource={name.toLowerCase()}
            action="list"
            params={{
              resource: item,
            }}
          >
            <Menu.Item
              key={item.key}
              icon={icon ?? (isRoute && <ToolOutlined />)}>
              <Link to={route ?? ""}>{label}</Link>
              {!collapsed && isSelected && (
                <div className="ant-menu-tree-arrow" />
              )}
            </Menu.Item>
          </CanAccess>

        </>
      );
    });
  };

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(
        translate(
          "warnWhenUnsavedChanges",
          "Are you sure you want to leave? You have unsaved changes."
        )
      );

      if (confirm) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  };

  const logout = isExistAuthentication && (
    <Menu.Item
      key="logout"
      onClick={() => handleLogout()}
      icon={<LogoutOutlined />}
    >
      {translate("buttons.logout", "Logout")}
    </Menu.Item>
  );

  const dashboard = hasDashboard ?
    (<Menu.Item key="dashboard" icon={<DashboardOutlined />}>
      <Link to="/">{translate("dashboard.title", "Dashboard")}</Link>
      {!collapsed && selectedKey === "/" && (
        <div className="ant-menu-tree-arrow" />
      )}
    </Menu.Item>
    ) : null

  //Add your own menu items on top of the autogenerated menu tree
  // const courseLinks = (): JSX.Element => {
  //   return (
  //     <>
  //       {user?.courses_id && user.courses_id.map((course: ICourse) => (
  //         <Menu.Item
  //           key={course._id}
  //           icon={<ReadOutlined />}
  //         >
  //           <Link to={`/courses/content/${course._id}`}>{course.title}</Link>
  //         </Menu.Item>
  //       ))}
  //     </>
  //   )
  // }

  const items: JSX.Element[] = [
    <Menu.Item
      key="home"
      icon={<ShopOutlined />}>
      <Link to="/">Course Catalog</Link>
    </Menu.Item>,
    // <Menu.Item
    //   key="mycourses2"
    //   icon={<ReadOutlined />}>
    //   <Link to="/courses/content">Learn</Link>
    // </Menu.Item>,

    user && courseLinks(user),
    <Menu.Item
      key="cart"
      icon={<ShoppingFilled />}>
      <Link to="/cart">Cart</Link>
    </Menu.Item>,
    <Menu.Item
      key="OpenAI"
      icon={<img src={OpenAILogo} style={{width: 16, height:16}}/>}>
      <Link to="/chat">AI Powered Chat</Link>
    </Menu.Item>,
    <Divider key="divider" />,
    <Menu.Item
      key="admincourses"
      icon={<ReadFilled />}>
      <Link to="/dashboard/courses">Admin: Courses</Link>
    </Menu.Item>,
    <Menu.Item
      key="adminusers"
      icon={<TeamOutlined />}>
      <Link to="/dashboard/users">Admin: Users</Link>
    </Menu.Item>]

  //const items = renderTreeView(menuItems, selectedKey))})

  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        items,
        logout,
        collapsed,
      });
    }
    return (
      <>
        {dashboard}
        {items}
        {logout}
      </>
    );
  };

  const renderMenu = () => {
    return (
      <>
        <Menu
          selectedKeys={selectedKey ? [selectedKey] : []}
          defaultOpenKeys={defaultOpenKeys}
          mode="inline"
          style={{
            marginTop: "8px",
            border: "none",
          }}
          onClick={() => {
            setDrawerOpen(false);
            if (!breakpoint.sm) {
              setCollapsed(true);
            }
          }}
        >
          {renderSider()}
        </Menu>
      </>
    );
  };

  const renderDrawerSider = () => {
    return (
      <>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="left"
          closable={false}
          width={200}
          bodyStyle={{
            padding: 0,
          }}
          maskClosable={true}
        >
          <Layout>
            <Layout.Sider
              style={{
                height: "100%",
                overflow: "hidden",
                backgroundColor: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBgElevated}`,
              }}
            >
              <div
                style={{
                  width: "200px",
                  padding: "0 16px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "64px",
                  backgroundColor: token.colorBgElevated,
                }}
              >
                <RenderToTitle collapsed={false} />
              </div>
              {renderMenu()}
            </Layout.Sider>
          </Layout>
        </Drawer>
        <Button
          style={drawerButtonStyles}
          size="large"
          onClick={() => setDrawerOpen(true)}
          icon={<BarsOutlined />}
        ></Button>
      </>
    );
  };

  if (isMobile) {
    return renderDrawerSider();
  }



  return (
    <Layout.Sider
      style={{
        backgroundColor: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBgElevated}`,
      }}
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed) => setCollapsed(collapsed)}
      collapsedWidth={80}
      breakpoint="lg"
      trigger={
        <Button
          type="text"
          style={{
            borderRadius: 0,
            height: "100%",
            width: "100%",
            backgroundColor: token.colorBgElevated,
          }}
        >
          {collapsed ? (
            <RightOutlined
              style={{
                color: token.colorPrimary,
              }}
            />
          ) : (
            <LeftOutlined
              style={{
                color: token.colorPrimary,
              }}
            />
          )}
        </Button>
      }
    >
      <div
        style={{
          width: collapsed ? "80px" : "200px",
          padding: collapsed ? "0" : "0 16px",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
          alignItems: "center",
          height: "64px",
          backgroundColor: token.colorBgElevated,
          fontSize: "14px",
        }}
      >
        <RenderToTitle collapsed={collapsed} />
      </div>
      {renderMenu()}
    </Layout.Sider>
  );
};

export default ThemedSider;


