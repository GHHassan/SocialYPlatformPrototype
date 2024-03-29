import React, { useEffect } from 'react';
import { useAppState } from './contexts/AppStateContext';
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/pageFractions/Navbar';
import Home from './components/pages/Home';
import Chat from './components/pages/Chat';
import Settings from './components/pages/Settings';
import OtherUsersProfile from './components/pages/OtherUsersProfile';
import Login from './components/pageFractions/SignIn';
import Footer from "./components/pageFractions/Footer";
import { useUser } from "@clerk/clerk-react";
import { HomeStateProvider } from './contexts/HomeStateContext';
import { API_ROOT } from "./Config";
import {jwtDecode} from 'jwt-decode';
import SignUp from './components/pageFractions/SignUp';

function App() {
  const ssoUser = useUser();
  const {state, dispatch } = useAppState();
  const { signedIn, signedInUser, userProfile, posts } = state; 
  const navigate = useNavigate();

  useEffect(() => {
    if (ssoUser.isLoaded && ssoUser.isSignedIn) {
       const signedInUser = {
        ...ssoUser.user,
        isSignedIn: ssoUser.isSignedIn,
      };
      dispatch({ type: 'SET_SIGNEDIN_USER', payload: signedInUser });
      dispatch({ type: 'TOGGLE_SIGNED_IN', payload: true });
    } else if (localStorage.getItem("token")) {
      const token = jwtDecode(localStorage.getItem("token"));
      if (token.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        dispatch({ type: 'TOGGLE_SIGNED_IN', payload: false });
        dispatch({ type: 'SET_SIGNEDIN_USER', payload: null });
      } else {
        const user = {
          id: token.sub,
          email: token.email,
          username: token.username,
          isSignedIn: true,
        };
        dispatch({ type: 'SET_SIGNEDIN_USER', payload: user });
        dispatch({ type: 'TOGGLE_SIGNED_IN', payload: true });
      }
    }
  }, [ssoUser.isSignedIn, signedIn]);  

	const getUserProfile = async (userID) => {
		try {
			const response = await fetch(`${API_ROOT}/profile?userID=${userID}`);
      const data = await response.json();
			if (data.message === "success") {
				const user = {...data[0], hasProfile: true};
        dispatch({ type: "SET_USER_PROFILE", payload: user });
			}else {
        toast.error("Please Create a Profile to continue");
        const user = {...signedInUser, hasProfile: false};
        dispatch({ type: "SET_USER_PROFILE", payload: user });
      }
		} catch (error) {
			toast.error("Error getting user data");
		}
	};

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_ROOT}/post`);
      const data = await response.json();
      if (data.message === "success") {
        console.log('fetchPosts: data:', data);
        delete data.message;
        dispatch({ type: "SET_POSTS", payload: data.posts });
      }
    } catch (error) {
      toast.error("Error getting posts");
    }
  }

  
	useEffect(() => {
		if (userProfile && !userProfile.hasProfile) {
      navigate('/settings', { replace: true });	
		}
	}, [userProfile]);

  useEffect(() => {
    if (signedIn && signedInUser.id) {
      getUserProfile(signedInUser.id);
    }
  }, [signedIn]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [state.reloadPosts]);
  return (
    <div className="bg-gray-100 font-sans">
      <header>
        <Navbar />
      </header>
      <main className="mt-8">
        <Toaster />
        <Routes>
          <Route path="/" element={
          <HomeStateProvider>
          <Home />
          </HomeStateProvider>
          } />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/:userID" element={<OtherUsersProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
