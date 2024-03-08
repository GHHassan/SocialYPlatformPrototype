import Footer from "./components/pageFractions/Footer";
import Header from "./components/pageFractions/Header";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { API_ROOT } from "./Config";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Chat from "./components/pages/Chat";
import Settings from "./components/pages/Settings";
import OtherUsersProfile from "./components/pages/OtherUsersProfile";

function App() {

  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [initialized, setInitialized] = useState(false);
  const [reloadPage, setReloadPage] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showEditPost, setShowEditPost] = useState(false);
  const [postToBeEdited, setPostToBeEdited] = useState(null)

  const userDetails = async () => {
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
  }
  
  useEffect(() => {
    const token = localStorage.getItem('token');
  
    const fetchUserDetails = async () => {
      console.log('Fetching user details...');
      await userDetails();
      console.log('User details fetched.');
      setInitialized(true);
    };
  
    if (token && !initialized) {
      console.log('Token found, initializing...');
      fetchUserDetails();
    } else if (token && signedIn) {
      console.log('Token found, user signed in, initializing...');
      fetchUserDetails();
    }
  }, [signedIn, initialized]);
  

  const fetchPost = async () => {
    try {
      const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post');
      const data = await response.json();
      if (data && data.message === 'success' && Object.keys(data).length > 0) {
        delete data.message;
        setPosts(Object.values(data));
      } else {
        setPosts(['No posts found']);
      }
    } catch (error) {
      setPosts(['Error fetching posts']);
    }
  }

  useEffect(() => {
    fetchPost();
  }, []);


  return (
    <>
      <div className="bg-gray-100 font-sans">
        <Header
          signedIn={signedIn}
          setSignedIn={setSignedIn}
          showSignIn={showSignIn}
          setShowSignIn={setShowSignIn}
          showSignUp={showSignUp}
          setShowSignUp={setShowSignUp}
          user={user}
          setUser={setUser}
          initialized={initialized}
          setInitialized={setInitialized}
        />
        <div>
          <Toaster
            toastOptions={
              {
                className: '',
                style: {
                  background: '#3a80c9',
                  color: '#fff',
                }
              }
            }
          />
        </div>
        <main className="mt-8 lg:mt-8 sm:mx-5 md:mx-5 lg:m-auto max-w-7xl grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* hot toast notifications */}
          <div>
            <Toaster />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md md:col-start-1 md:col-end-3">
            {(!showSignIn && !showSignUp && signedIn) && (
              <Routes>
                <Route path="/" element={<Home
                  signedIn={signedIn}
                  setSignedIn={setSignedIn}
                  user={user}
                  setUser={setUser}
                  showSignIn={showSignIn}
                  setShowSignIn={setShowSignIn}
                  posts={posts}
                  setPosts={setPosts}
                  reloadPage={reloadPage}
                  setReloadPage={setReloadPage}
                  showEditPost={showEditPost}
                  setShowEditPost={setShowEditPost}
                  postToBeEdited={postToBeEdited}
                  setPostToBeEdited={setPostToBeEdited}
                />} />

                <Route path="Chat" element={<Chat
                />} />
                <Route path="/settings"
                  element={<Settings
                    signedIn={signedIn}
                    setSignedIn={setSignedIn}
                    user={user}
                    setUser={setUser}
                    showSignIn={showSignIn}
                    setShowSignIn={setShowSignIn}
                  />} />
                <Route path='/profileViewTemplate/:userID' element={<OtherUsersProfile
                  signedIn={signedIn}
                  setSignedIn={setSignedIn}
                  user={user}
                  setUser={setUser}
                  showSignIn={showSignIn}
                  setShowSignIn={setShowSignIn}
                />} />
                <Route path="*" element={<div>Not Found</div>} />
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
    </>
  )
}

export default App
