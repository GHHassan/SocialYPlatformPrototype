import HomePages from "./components/HomePages";
import Headers from "./components/pageFractions/Header";
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react";
import toast, {Toaster} from "react-hot-toast";

function App() {

  const [postOwnerUserID, setPostOwnerUserID] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [userID, setUserID] = useState(null);

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        localStorage.removeItem('token');
        setSignedIn(false);
      } else {
        setUserID(decodedToken.sub);
        setSignedIn(true);
      }
    }
  }, [token]);

  return (
    <>
      <div className="bg-gray-100 font-sans">
        {/* Header */}
        <header className="bg-white p-4 shadow-md">
          <Headers 
            showSignIn={showSignIn}
            setShowSignIn={setShowSignIn}
            showSignUp={showSignUp}
            setShowSignUp={setShowSignUp}
            signedOut={signedOut}
            setSignedOut={setSignedOut} 
          />
        </header>

        {/* Main Content */}
        <main className="mt-8 lg:mt-8 sm:mx-5 md:mx-5 lg:m-auto max-w-7xl grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* hot toast notifications */}
            <div>
              <Toaster />
            </div>
         
          <div className="bg-white p-4 rounded-lg shadow-md md:col-start-1 md:col-end-3">
            <HomePages 
              signedIn={signedIn}
              setSignedIn={setSignedIn}
              showSignIn={showSignIn}
              setShowSignIn={setShowSignIn}
              showSignUp={showSignUp}
              setShowSignUp={setShowSignUp}
              signedOut={signedOut}
              setSignedOut={setSignedOut} 
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hidden sm:hidden md:block md:col-start-2 lg:col-start-3">
            Chat
          </div>
        </main>

        {/* footer goes here */}
        <footer className="bg-white p-4 mt-8 shadow-md">
          Footer
        </footer>
      </div>
    </>
  )
}

export default App
