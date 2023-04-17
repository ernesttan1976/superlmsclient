import React from "react";
import { createRoot } from "react-dom/client";

import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

let redirect_uri2 = "";

redirect_uri2=window.location.origin;

// if (window.location.origin==="http://localhost:3000"){
//   redirect_uri2 = 'https://103.252.202.42:3000';
// } else {
//   redirect_uri2 = window.location.origin;
// }
console.log(window.location.origin, redirect_uri2 );

root.render(
  <React.StrictMode>
    <Auth0Provider 
    domain="dev-ndcpsqh6dgrlwy4z.us.auth0.com" 
    clientId="UgyE6aFSr8Teo3tuJR0u8XmXjtUJ8npr" 
    authorizationParams={{redirect_uri: redirect_uri2}}>
    <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
