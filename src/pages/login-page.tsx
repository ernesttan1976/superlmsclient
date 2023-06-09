import { Layout, Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "./logomedium.png";

export const LoginPage: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Layout
            style={{
                background: `radial-gradient(50% 50% at 50% 50%, #63386A 0%, #310438 100%)`,
                backgroundSize: "105% 105%",
                margin: 0,
                padding: 0,

            }}
        >
            <div style={{ height: "100vh", display: "flex" }}>
                <div style={{ maxWidth: "300px", margin: "auto" }}>
                    <div style={{ marginBottom: "28px" }}>
                        <img src={logo} alt="Logo" style={{ maxWidth: "300px", borderRadius: "10px"}}/>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={() => loginWithRedirect()}
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default LoginPage;