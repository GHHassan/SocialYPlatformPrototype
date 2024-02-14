import Home from '../components/pages/Home'
import { Routes, Route } from 'react-router-dom'
import Chat from '../components/pages/Chat'
import Profile from '../components/pages/Profile'


const HomePages = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  )
}

export default HomePages;