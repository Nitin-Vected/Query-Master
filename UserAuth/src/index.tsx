import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Get the Google OAuth client ID from environment variables
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

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
