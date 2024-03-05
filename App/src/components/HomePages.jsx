import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import Post from './pageFractions/Post'
import OtherUsersProfile from './pages/OtherUsersProfile'
import CreateProfile from './pages/CreateProfile'
import { useState, useEffect } from 'react'

const HomePages = (props) => {
  const [reloadPage, setReloadPage] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showEditPost, setShowEditPost] = useState(false);
  const [postToBeEdited, setPostToBeEdited] = useState(null)

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
      {(!props.showSignIn && !props.showSignUp && props.signedIn) && (
        <Routes>
          <Route path="/createProfile" element={<CreateProfile
            {...props}
          />} />

          <Route path="/" element={<Home
            {...props}
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
            element={<Settings {...props}
            />} />
          {/* <Route path='/post' element={<Post 
            {...props}
            posts={posts}
          />} />
          <Route path='/createProfile' element={<CreateProfile {...props}
          />} /> */}
          <Route path='/profileViewTemplate/:userID' element={<OtherUsersProfile {...props} />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      )}
    </>
  )
}

export default HomePages;