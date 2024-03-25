import Post from '../pageFractions/Post';
import CreatePost from '../pageFractions/CreatePost';
import { useState, useEffect } from 'react';
import { API_ROOT } from '../../Config';

const Home = (props) => {


    const [showEditPost, setShowEditPost] = useState(false);

    const fetchPost = async () => {
        try {
            const response = await fetch(`${API_ROOT}/post`);
            const data = await response.json();
            if (data.message === 'success' && Object.keys(data).length > 0) {
                delete data.message;
                props.setPosts(Object.values(data));

            } else {
                props.setPosts(['No posts found']);
            }
        } catch (error) {
            props.setPosts(['Error fetching posts']);
        }
    }

    useEffect(() => {
        if (props.reloadPage) {
            fetchPost();
            props.setReloadPage(false);
        }
    }, [props.reloadPage])


    return (
        <>
            {props.signedIn &&
                <CreatePost
                    {...props}
                    showEditPost={showEditPost}
                    setShowEditPost={setShowEditPost}
            />}

            <Post
                {...props}
                showEditPost={showEditPost}
                setShowEditPost={setShowEditPost}
            />
        </>
    );
}

export default Home;
