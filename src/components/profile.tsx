import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import "./profile.module.css"
import { Avatar, Button, Space, Typography } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
const { Title } = Typography;

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated ? (
      <Space>
        <Avatar size="large" icon={<UserOutlined />} src={user?.picture}/>
        <Title level={5} className="profile-name">{user?.name}</Title>
        <Button type="primary" icon={<LogoutOutlined />} className="logout-button" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Logout
        </Button>
      </Space>
    ) : <div className="header-profile">Not logged in</div>
  );
};

export default Profile;