/**
 * Main entry point of the React application
 * 
 * This includes the BrowserRouter, ClerkProvider and AppStateProvider
 * to the entire application.
 * 
 * uses .env.local file to get the Clerk Publishable Key. 
 * The .env.local file is not included in the repository 
 * to hide the Clerk Publishable key for security reasons.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */

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
