import React from "react";
import { createRoot } from "react-dom/client";

import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

// const PRODUCTION_OAUTH_CALLBACK = "https://superlms.vercel.app:3000";
// const DEV_OAUTH_CALLBACK = "http://127.0.0.1:3000";
const OAUTH_CALLBACK = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_PRODUCTION_OAUTH_CALLBACK : process.env.REACT_APP_DEV_OAUTH_CALLBACK;

// if (window.location.origin==="http://localhost:3000"){
//   redirect_uri2 = 'https://103.252.202.42:3000';
// } else {
//   redirect_uri2 = window.location.origin;
// }

root.render(
  <React.StrictMode>
    <Auth0Provider 
    domain="dev-ndcpsqh6dgrlwy4z.us.auth0.com" 
    clientId="UgyE6aFSr8Teo3tuJR0u8XmXjtUJ8npr" 
    authorizationParams={{redirect_uri: OAUTH_CALLBACK}}>
    <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
