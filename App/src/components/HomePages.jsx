import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import Post from './pageFractions/Post'
import OtherUsersProfile from './pages/OtherUsersProfile'
import CreateProfile from './pages/CreateProfile'

const HomePages = (props) => {

  return (
    <>
      {(!props.showSignIn && !props.showSignUp && props.signedIn) && (
        <Routes>
          <Route path="/createProfile" element={<CreateProfile
            {...props}
          />} />

          <Route path="/" element={<Home 
             {...props}
          />} />

          <Route path="Chat" element={<Chat
          />} />
          <Route path="/settings"
            element={<Settings {...props}
            />} />
          <Route path='/post' element={<Post {...props}
          />} />
          <Route path='/createProfile' element={<CreateProfile {...props}
          />} />
          <Route path='/profileViewTemplate/:userID' element={<OtherUsersProfile {...props}/>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      )}
    </>
  )
}

export default HomePages;