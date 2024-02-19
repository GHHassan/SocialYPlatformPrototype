import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Post from './pageFractions/Post'
import SingleProfile from './pages/SingleProfile'
import SignIn from './pageFractions/SignIn'

const HomePages = (props) => {

  return (
    <>
      <Routes>
        <Route path="/signIn" element={<SignIn 
          setSignedIn={props.setSignedIn}
          signedIn={props.signedIn}
          setShowSignIn={props.setShowSignIn}
          setShowSignUp={props.setShowSignUp}
          showSignIn={props.showSignIn}
        />} />
        <Route path="/" element={<Home />} />
        <Route path="Chat" element={<Chat 
        />} />
        <Route path="/profile" 
          element={<Profile 
            userID={props.userID}
          />} />
        <Route path='/post' element={<Post />} />
        <Route path='/singleProfile/:userID' element={<SingleProfile />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  )
}

export default HomePages;