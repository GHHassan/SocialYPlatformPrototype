import Post from '../pageFractions/Post';
import CreatePost from '../pageFractions/CreatePost';
import CreateProfile from './CreateProfile';
import { useState, useEffect } from 'react';

const Home = (props) => {
    const [isDropdownVisible, setDropdownVisibility] = useState(false);

    const fetchPost = async () => {
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post');
            const data = await response.json();
            if (data && data.message === 'success' && Object.keys(data).length > 0) {
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
            console.log('Reloading page', props.posts);
            props.setReloadPage(false);
        }
    }, [props.reloadPage]);

    const deletePost = async (post) => {
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post?postID=' + post.postID, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.message === 'success') {
                toast.success('Post deleted successfully');
                setReloadPage(true);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    if(!props.user || props.user.userID === null){

        return (
            <CreateProfile 
                {...props}
                isDropdownVisible={isDropdownVisible}
                setDropdownVisibility={setDropdownVisibility}    
                deletePost={deletePost}
            />
        )
    }

    return (
       <>
       <CreatePost 
            {...props}
            setDropdownVisibility={setDropdownVisibility}
            deletePost={deletePost}
        />

        <Post 
            {...props}
            deletePost={deletePost}
        />
       </>
    );
}

export default Home;
