/**
 * @file App.jsx 
 * This is the main entyr of the application. 
 * It contains the routing of the application and uses all 
 * sub componenets of this application.
 * It uses the AppStateContext and Clerk's useUser to varify the user's
 * sign in state.
 * uses the MainLayout to arrange the main components of the application
 * for appropriatly displaying the contents in grids provided by TailWindCSS.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */

import React, { useEffect } from 'react';
import { useAppState } from './contexts/AppStateContext';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/pageFractions/Navbar';
import Home from './components/pages/Home';
import Settings from './components/pages/Settings';
import OtherUsersProfile from './components/pages/OtherUsersProfile';
import Login from './components/pageFractions/SignIn';
import Footer from "./components/pageFractions/Footer";
import { useUser } from "@clerk/clerk-react";
import { HomeStateProvider } from './contexts/HomeStateContext';
import { API_ROOT } from "./Config";
import { jwtDecode } from 'jwt-decode';
import SignUp from './components/pageFractions/SignUp';
import MainLayout from './components/utils/MainLayout';
import { toast } from 'react-hot-toast';

function App() {
  const ssoUser = useUser();
  const { state: AppState, dispatch: AppDispatch } = useAppState();
  const { signedIn, signedInUser, reloadProfile } = AppState;
  const navigate = useNavigate();

  /** set signedIn user */
  useEffect(() => {
    if (ssoUser?.isLoaded && ssoUser?.isSignedIn) {
      const signedInUser = {
        ...ssoUser.user,
        email: ssoUser.user?.emailAddresses[0]?.emailAddress,
        isSignedIn: ssoUser.isSignedIn,
      };
      AppDispatch({ type: 'SET_SIGNEDIN_USER', payload: signedInUser });
      AppDispatch({ type: 'TOGGLE_SIGNED_IN', payload: true });
    } else if (localStorage.getItem("token")) {
      const token = jwtDecode(localStorage.getItem("token"));
      if (token.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        AppDispatch({ type: 'TOGGLE_SIGNED_IN', payload: false });
        AppDispatch({ type: 'SET_SIGNEDIN_USER', payload: null });
      } else {
        const user = {
          id: token.sub,
          email: token.email,
          username: token.username,
          isSignedIn: true,
        };
        AppDispatch({ type: 'SET_SIGNEDIN_USER', payload: user });
        AppDispatch({ type: 'TOGGLE_SIGNED_IN', payload: true });
      }
    }
  }, [ssoUser.isSignedIn, signedIn]);

  /** check if user has a profile */
  useEffect(() => {
    if (signedIn && signedInUser) {
      getUserProfile(signedInUser.id);
      AppDispatch({ type: 'RELOAD_PROFILE', payload: false });
    }
  }, [signedInUser, signedIn, reloadProfile]);

  const getUserProfile = async (userID) => {
    try {
      const response = await fetch(`${API_ROOT}/profile?userID=${userID}`);
      const data = await response.json();
      if (data.message === "success") {
        const user = { ...data[0], hasProfile: true };
        AppDispatch({ type: "SET_USER_PROFILE", payload: user });
      } else {
        toast.error("Please Create a Profile to continue");
        navigate('/settings', { replace: true });
      }
    } catch (error) {
      toast.error("Error getting user data");
    }
  };

  return (
    <div>
      <header className="w-full">
        <Navbar />
      </header>

      <Routes>
        <Route path="/" element={
          <MainLayout>
            <HomeStateProvider>
              <Home />
            </HomeStateProvider>
          </MainLayout>
        } />
        <Route path="/settings" element={
          <MainLayout>
            <Settings />
          </MainLayout>
        } />
        <Route path="/profile/:userID" element={
          <MainLayout>
            <OtherUsersProfile />
          </MainLayout>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
