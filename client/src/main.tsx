import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  throw new Error(
    "Google OAuth client ID is not defined in environment variables."
  );
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
 