import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Post from './pageFractions/Post'
import OtherUsersProfile from './pages/OtherUsersProfile'
import CreateProfile from './pages/CreateProfile'
import Header from './pageFractions/Header'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

const HomePages = (props) => {

  console.log('homepages props = '+{...props})

  return (
    <>
      {(!props.showSignIn && !props.showSignUp && props.signedIn) && (
        <Routes>
          <Route path="/createProfile" element={<CreateProfile
            signedIn={props.signedIn}
            user={props.user}
          />} />

          <Route path="/" element={<Home
            signedIn={props.signedIn}
            user={props.user}
          />} />

          <Route path="Chat" element={<Chat
          />} />
          <Route path="/profile"
            element={<Profile
              signedIn={props.signedIn}
              user={props.user}
              setUser={props.setUser}
            />} />
          <Route path='/post' element={<Post
            user={props.user}
            signedIn={props.signedIn}
          />} />
          <Route path='/otherUsersProfile/:userID' element={<OtherUsersProfile />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      )}
    </>
  )
}

export default HomePages;