import { Layout, Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import refineLogo from "./refine.svg";

export const Login: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Layout
            style={{
                background: `radial-gradient(50% 50% at 50% 50%, #63386A 0%, #310438 100%)`,
                backgroundSize: "cover",
            }}
        >
            <div style={{ height: "100vh", display: "flex" }}>
                <div style={{ maxWidth: "200px", margin: "auto" }}>
                    <div style={{ marginBottom: "28px" }}>
                        <img src={refineLogo} alt="Refine" />
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