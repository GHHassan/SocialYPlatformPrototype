/**
 * @file Post.jsx 
 * is the file where the Post component is defined. 
 * It is used to display and managed the posts on the home page.
 * 
 * @uses the PostTemplate component to display and manage each post.
 * @uses the CreatePost component to handle the creation of new posts.
 * @uses useContext from react to access the global state and 
 * dispatch functions to update the global state and the application.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 * 
 */

import PostTemplate from '../utils/PostTemplate';
import CreatePost from './CreatePost';
import { toast } from 'react-hot-toast';
import { API_ROOT } from '../../Config';
import { useAppState } from '../../contexts/AppStateContext';
import { useHomeState } from '../../contexts/HomeStateContext';
const SUCCESS_MESSAGE = 'success';

export const deleteImage = async (imageName) => {
    if (!imageName) {
        return;
    }
    try {
        const response = await fetch(`${API_ROOT}/upload?image=${imageName}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (data.message === SUCCESS_MESSAGE) {
            toast.success('Old image deleted successfully');
        }
    } catch (error) {
        toast.error('Error during deleteImage operation');
    }
};

export const deleteVideo = async (videoName) => {
    try {
        const response = await fetch(`${API_ROOT}/upload?video=${videoName}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (data.message === SUCCESS_MESSAGE) {
            toast.success('Old video deleted successfully');
        }
    } catch (error) {
        toast.error('Error during deleteVideo operation');
    }
};

const Post = () => {
    const { state, dispatch } = useAppState();
    const { signedInUser: user } = state;
    const { state: HomeState, dispatch: HomeDispatch } = useHomeState();
    const { posts, allComments, showEditPost, postToBeEdited } = HomeState;
    const visibilityOptions = ['Public', 'Friends', 'Private'];
    let token = localStorage.getItem('token');

    const updatePostVisibility = async (post) => {
        try {
            const response = await fetch(`${API_ROOT}/post`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(post),
            });
            handleApiResponse(response, 'Post visibility updated successfully');
            HomeDispatch({ type: 'RELOAD_POSTS', payload: true })
        } catch (error) {
            toast.error('Error during update operation');
        }
    };

    const handleApiResponse = async (response, successMessage) => {
        const data = await response.json();
        if (data.message === SUCCESS_MESSAGE) {
            toast.success(successMessage);
            dispatch({ type: 'SET_RELOAD_POSTS', payload: true });
        } else {
            toast.error('Unexpected JSON response from server', data.message);
        }
    };

    const deletePost = async (post) => {
        try {
            if (post.photoPath) {
                await deleteImage(post.photoPath);
            }

            if (post.videoPath) {
                await deleteVideo(post.videoPath);
            }
            if (allComments.length > 0) await deleteComments(post.postID);
            const response = await fetch(`${API_ROOT}/post?postID=${post.postID}`, {
                method: 'DELETE',
            });
            handleApiResponse(response, 'Post deleted successfully');
            HomeDispatch({ type: 'RELOAD_POSTS', payload: true })
        } catch (error) {
            toast.error('Error during deletePost operation');
        }
    };

    const deleteComments = async (postID) => {
        try {
            const response = await fetch(`${API_ROOT}/comment?postID=${postID}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.message === SUCCESS_MESSAGE) {
                toast.success('Comments deleted successfully');
            }
        } catch (error) {
            toast.error('Error during deleting comment operation');
        }
    };

    const handleDeletePost = (post) => {
        deletePost(post);
        HomeDispatch({ type: 'TOGGLE_EDIT_POST', payload: false });
        HomeDispatch({ type: 'RELOAD_POSTS', payload: true })
        HomeDispatch({ type: 'TOGGLE_ACTIONS', payload: false })
    };

    const handleVisibility = (post, key) => {
        const myPost = { ...post, visibility: key };
        updatePostVisibility(myPost);
    };

    const postJSX = (
        posts.map((post, index) => (
            <div className='my-4 p-3 border border-gray-300 rounded-lg' key={index}>
                <PostTemplate
                    post={post}
                    index={index}
                    visibilityOptions={visibilityOptions}
                    handleVisibility={handleVisibility}
                    handleDeletePost={handleDeletePost}
                    postIndex={index}
                />
            </div>
        ))
    );
    return (
        <>
            {postJSX}
            {(user && showEditPost && postToBeEdited) && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center overflow-auto">
                    <div className='bg-white p-6 rounded-lg max-h-screen max-w-[60%] overflow-y-auto'>
                        <CreatePost post={postToBeEdited} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Post;