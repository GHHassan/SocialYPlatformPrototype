import React, { useEffect } from 'react';
import { useAppState } from './contexts/AppStateContext'; // Adjust the path as necessary
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/pageFractions/Navbar';
import Home from './components/pages/Home';
import Chat from './components/pages/Chat';
import Settings from './components/pages/Settings';
import OtherUsersProfile from './components/pages/OtherUsersProfile';
import Login from './components/pageFractions/SignIn';
import Footer from "./components/pageFractions/Footer";
import { useUser } from "@clerk/clerk-react";
import { PostStateProvide } from './contexts/PostStateContext';
import { API_ROOT } from "./Config";

function App() {
  const ssoUser = useUser();
  const {state, dispatch } = useAppState();
  const { signedIn, signedInUser, initialized } = state; 

  useEffect(() => {  
    if (signedIn === true && signedInUser && signedInUser.username) {
      dispatch({
        type: 'SET_AUTHENTICATED',
        payload: {
          isSignedIn: signedIn,
          user: signedInUser,
          token: localStorage.getItem("token"),
        },
      });
    } else if (signedIn === false) {
      dispatch({ type: 'SET_UNAUTHENTICATED' });
    }
  }, [signedIn, signedInUser]);
  
  useEffect(() => {
    if (ssoUser.isLoaded && ssoUser.isSignedIn) {
      const user = {
        isSignedIn: ssoUser.isSignedIn,
        id: ssoUser.user.id,
        email: ssoUser.user.primaryEmailAddress?.emailAddress,
        username: ssoUser.user.username ?? (ssoUser.user.primaryEmailAddress?.emailAddress || ssoUser.user.firstName + ssoUser.user.id.slice(-4)),
        imageUrl: ssoUser.user.imageUrl,
      };
      dispatch({ type: 'SET_USER_FROM_SSO', payload: user });
      dispatch({ type: 'TOGGLE_SIGNED_IN', payload: true });
    } else if (localStorage.getItem("token")) {
      const token = jwtDecode(localStorage.getItem("token"));
      if (token.exp < Date.now() / 1000) {
        dispatch({ type: 'REMOVE_TOKEN' });
      } else {
        const user = {
          id: token.sub,
          email: token.email,
          username: token.username,
        };
        dispatch({ type: 'SET_USER_FROM_TOKEN', payload: user });
        dispatch({ type: 'TOGGLE_SIGNED_IN', payload: true });
      }
    }
  }, [ssoUser.isSignedIn, dispatch]);  

	const getUser = async (userID) => {
		try {
			const response = await fetch(`${API_ROOT}/register?userID=${userID}`);
      const data = await response.json();
			if (data.message === "success") {
				const user = data[0];
        dispatch({ type: "SET_USER", payload: user });
			} 
		} catch (error) {
			toast.error("Error getting user data");
		}
	};

	useEffect(() => {
		if (signedInUser && signedInUser.id) {
			getUser(signedInUser.id);
		}
	}, [signedIn]);

  useEffect(() => {
    if (signedInUser && signedInUser.role === "0") {
      setShowSetRole(true);
    }
  }, [signedInUser]);

  const fetchUserDetails = async () => {
    try {
      let userID = '';
      let username = '';
      if (localStorage.getItem('token') !== null) {
        const token = localStorage.getItem('token');
        userID = jwtDecode(token).sub;
        username = jwtDecode(token).username;
      }
      const response = await fetch(`${API_ROOT}/profile?userID=${userID}`);
      const data = await response.json();
      if (data.message === 'success') {
        const user = data[0];
        user.username = username;
        return data[0];
      }
    } catch (error) {
      console.log('Error in userDetails:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      fetchUserDetails();
    }
  }, [signedIn, initialized]);

  return (
    <div className="bg-gray-100 font-sans">
      <header>
        <Navbar />
      </header>
      <main className="mt-8">
        <Toaster />
        <Routes>
          <Route path="/" element={
          <PostStateProvide>
          <Home />
          </PostStateProvide>
          } />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/:userID" element={<OtherUsersProfile />} />
          <Route path="/login" element={<Login />} />
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
