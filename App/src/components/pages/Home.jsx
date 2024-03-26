import Post from '../pageFractions/Post';
import CreatePost from '../pageFractions/CreatePost';
import { useEffect } from 'react';
import { API_ROOT } from '../../Config';
import { useAppState } from '../../contexts/AppStateContext';
import { usePostState } from '../../contexts/PostStateContext';
import Chat from './Chat';

const Home = () => {

    const SUCCESS_MESSAGE = 'success';
    const { state: AppState } = useAppState();
    const { user, isChatOpen } = AppState;
    const { state, dispatch } = usePostState();
    const { reloadPosts, posts, allComments} = state;
    const fetchPost = async () => {
        try {
            const response = await fetch(`${API_ROOT}/post`);
            const data = await response.json();
            if (data.message === 'success' && Object.keys(data).length > 0) {
                delete data.message;
                console.log('Data:', data);
                dispatch({ type: 'SET_POSTS', payload: Object.values(data) });
            } else {
                dispatch({ type: 'SET_POSTS', payload: ['No Post Found'] });
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            dispatch({ type: 'SET_POSTS', payload: [] });
        }
    };

    const fetchAllComments = async () => {
        try {
            const response = await fetch(`${API_ROOT}/comment`);
            const data = await response.json();
            if (data.message === SUCCESS_MESSAGE) {
                delete data.message;
                dispatch({ type: 'SET_COMMENTS', payload: data });
                console.log('All comments:', allComments);
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
        <div className="relative "> {/* Use flex and h-screen for demonstration */}
            <div className="md:w-2/3 w-full">
                {user?.isSignedIn && <CreatePost />}
                <Post />
            </div>
            {/* This div should wrap the Chat component to apply the styles */}
            <div className={`lg:absolute lg:right-0 lg:w-1/3 w-full h-full ${isChatOpen ? 'block' : 'hidden'} z-50 bg-white shadow-lg`}>
                <Chat />
            </div>
        </div>
    );
    
}

export default Home;
