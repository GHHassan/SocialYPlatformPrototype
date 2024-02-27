import Post from '../pageFractions/Post';
import CreatePost from '../pageFractions/CreatePost';
import { useState } from 'react';
import { useEffect } from 'react';

const Home = (props) => {

    const [reloadPage, setReloadPage] = useState(true);
    const [posts, setPosts] = useState([]);

    return (
       <>
       <CreatePost
            signedIn={props.signedIn}
            user={props.user}
            setReloadPage={setReloadPage}
        />

        <Post 
            signedIn={props.signedIn}
            user={props.user}
            setReloadPage={setReloadPage}
            reloadPage={reloadPage}
            posts={posts}
            setPosts={setPosts}
        />
       </>
    );
}

export default Home;
