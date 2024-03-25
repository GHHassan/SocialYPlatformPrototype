import { createContext } from "react";
import Footer from "./components/pageFractions/Footer";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { API_ROOT } from "./Config";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/pages/Home";
import Chat from "./components/pages/Chat";
import Settings from "./components/pages/Settings";
import OtherUsersProfile from "./components/pages/OtherUsersProfile";
import Navbar from "./components/pageFractions/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { SignIn, useUser } from "@clerk/clerk-react";
import Login from "./components/pageFractions/SignIn";
export const AuthContext = createContext(null);



function App() {

  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [posts, setPosts] = useState([]);
  const [signedInUser, setSignedInUser] = useState();
  const ssoUser = useUser();
  const [authState, setAuthState] = useState();

  useEffect(() => {
    if (signedIn === true && signedInUser && signedInUser.username) {
      setAuthState({
        isAuthenticated: true,
        user: signedInUser,
        token: localStorage.getItem("token"),
      });
    } else if (signedIn === false) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
      });
    }
  }, [signedIn, signedInUser]);

  useEffect(() => {
    if (ssoUser.isLoaded && ssoUser.isSignedIn) {
      console.log(ssoUser.user);
      let user = {
        id: ssoUser.user.id,
        email: ssoUser.user.primaryEmailAddress?.emailAddress,
        username:
          ssoUser.user.username ??
          (ssoUser.user.primaryEmailAddress?.emailAddress || ssoUser.user.firstName + ssoUser.user.id.slice(-4)),
        imageUrl: ssoUser.user.imageUrl,
      };
      setSignedIn(true);
      setSignedInUser(user);
    } else if (localStorage.getItem("token")) {
      let token = jwtDecode(localStorage.getItem("token"));
      if (token.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
      } else {
        let user = {
          id: token.sub,
          email: token.email,
          username: token.username
        };
        setSignedInUser(user);
        setSignedIn(true);
      }
    }
  }, [ssoUser.isSignedIn]);

	const getUser = async (userID) => {
		try {
			const response = await fetch(`${API_ROOT}/register?userID=${userID}`);
      const data = await response.json();
			if (data.message === "success") {
				setSignedInUser({
					...signedInUser,
					role: data[0].role,
					job_title: data[0].job_title,
					country: data[0].country,
					bio: data[0].bio,
				});
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
        setUser(data[0]);
        setSignedIn(true);
        setInitialized(true);
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
    <AuthContext.Provider value={{ authState, setSignedIn, setAuthState }}>
    <div className="bg-gray-100 font-sans">
      <header>
        <Navbar signedIn={signedIn} setSignedIn={setSignedIn} />
      </header>
      <div>
        <Toaster
          toastOptions={{
            className: '',
            style: {
              background: '#3a80c9',
              color: '#fff',
            },
          }}
        />
      </div>
      <main className="mt-8 lg:mt-8 sm:mx-5 md:mx-5 lg:m-auto max-w-7xl grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* hot toast notifications */}
        <div>
          <Toaster />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md md:col-start-1 md:col-end-3">
          {(!showSignIn && !showSignUp) && (
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    signedIn={signedIn}
                    user={user}
                    posts={posts}
                    setPosts={setPosts}
                  />
                }
              />

              <Route path="Chat" element={<Chat />} />
              <Route
                path="/settings"
                element={
                  <Settings
                    signedIn={signedIn}
                    setSignedIn={setSignedIn}
                    user={user}
                    setUser={setUser}
                    showSignIn={showSignIn}
                    setShowSignIn={setShowSignIn}
                  />
                }
              />
              <Route
                path="/profileViewTemplate/:userID"
                element={
                  <OtherUsersProfile
                    signedIn={signedIn}
                    setSignedIn={setSignedIn}
                    user={user}
                    setUser={setUser}
                    showSignIn={showSignIn}
                    setShowSignIn={setShowSignIn}
                  />
                }
              />
               <Route
              path="/login"
              element={
                <Login
                  signedIn={signedIn}
                  setSignedIn={setSignedIn}
                />
              }
            />
            <Route
              path="/signup"
              element={<SignIn />}
            />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hidden sm:hidden md:block md:col-start-2 lg:col-start-3">
          Chat
        </div>
      </main>
      {/* footer goes here */}
      <footer className="bg-white p-4 m-8 shadow-md">
        <Footer />
      </footer>
    </div>
    </AuthContext.Provider>
  );
}

export default App;
