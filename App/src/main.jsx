import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { AppStateProvider } from "./contexts/AppStateContext.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Entry point of the React application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppStateProvider> 
      <Router basename="/kf6003/"> 
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}> 
          <App />
        </ClerkProvider>
      </Router>
    </AppStateProvider>
  </React.StrictMode>
);
