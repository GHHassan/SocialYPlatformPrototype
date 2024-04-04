/**
 * Home page component
 * 
 * This component is used to display the home page of the application.
 * It displays the posts and allows the user to create new posts.
 * @uses useContext to provide home state and dispatch functions to its 
 * children components.
 * This reduces the need to pass the state and dispatch functions as props 
 * and helps improve the readability and maintainance of the code.
 * ß
 * @uses Post and its children component to manage the posts.
 * @uses CreatePost component to handle the creation of new posts.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */
import Post from '../pageFractions/Post';
import CreatePost from '../pageFractions/CreatePost';
import { useEffect } from 'react';
import { API_ROOT } from '../../Config';
import { useAppState } from '../../contexts/AppStateContext';
import { useHomeState } from '../../contexts/HomeStateContext';

const Home = () => {

    const SUCCESS_MESSAGE = 'success';
    const { state: AppState, } = useAppState();
    const { userProfile, isChatOpen } = AppState;
    const { state: HomeState, dispatch: HomeDispatch } = useHomeState();
    const { reloadPosts, allComments } = HomeState;

    const fetchPost = async () => {
        try {
            const response = await fetch(`${API_ROOT}/post`);
            const data = await response.json();
            if (data.message === 'success' && Object.keys(data).length > 0) {
                delete data.message;
                HomeDispatch({ type: 'SET_POSTS', payload: Object.values(data) });
            } else {
                HomeDispatch({ type: 'SET_POSTS', payload: ['No Post Found'] });
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchAllComments = async () => {
        try {
            const response = await fetch(`${API_ROOT}/comment`);
            const data = await response.json();
            if (data.message === SUCCESS_MESSAGE) {
                delete data.message;
                HomeDispatch({ type: 'SET_COMMENTS', payload: data });
            }
        } catch (error) {
            console.error('Error during fetchComments:', error);
        }
    }

    useEffect(() => {
        if (reloadPosts) {
            fetchPost()
            fetchAllComments()
        }
    }, [reloadPosts])

    return (
        <div className='m-7'>
            {userProfile && <CreatePost />}
            <Post />
        </div>
    );

}

export default Home;
