import React from "react";
import { createRoot } from "react-dom/client";

import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from 'antd';
import { QueryClientProvider } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 300000 } }
});
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Auth0Provider
          domain="dev-ndcpsqh6dgrlwy4z.us.auth0.com"
          clientId="UgyE6aFSr8Teo3tuJR0u8XmXjtUJ8npr"
          authorizationParams={{ redirect_uri: window.location.origin }}>
          <App />
        </Auth0Provider>
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
