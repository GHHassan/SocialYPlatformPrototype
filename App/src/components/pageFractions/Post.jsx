import PostTemplate from '../utils/PostTemplate';
import { useState } from 'react';
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
        console.error('Error during deleteImage:', error);
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
        console.error('Error during deleteVideo:', error);
    }
};

const Post = () => {
    const { state, dispatch } = useAppState();
    const { user } = state;
    const { state: pstate, dispatch: pDispatch } = useHomeState();
    const { reloadPosts, posts, allComments, showEditPost, showActions } = pstate;
    const visibilityOptions = ['Public', 'Friends', 'Private'];

    console.log('Post.js: posts:', posts);
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
        } catch (error) {
            console.error('Error during updatePostVisibility:', error);
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
        } catch (error) {
            toast.error('Error during delete operation');
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
            console.error('Error during deleteComments:', error);
        }
    };

    const handleEditPost = (post) => {
        pDispatch({ type: 'SET_EDITING_POST', payload: post });
        pDispatch({ type: 'TOGGLE_EDIT_POST', payload: true });
        pDispatch({ type: 'TOGGLE_ACTIONS', payload: false });
    };

    const handleDeletePost = (post) => {
        deletePost(post);
        pDispatch({ type: 'TOGGLE_EDIT_POST', payload: false });
    };

    const handleVisibility = (post, key) => {
        const myPost = { ...post, visibility: key };
        updatePostVisibility(myPost);
    };

    const postJSX = posts[0] !== 'No posts found' ? (
        posts.map((post, index) => (
            <div className='my-4 p-5 border border-gray-300 rounded-lg' key={index}>
                <PostTemplate
                    post={post}
                    index={index}
                    visibilityOptions={visibilityOptions}
                    handleVisibility={handleVisibility}
                    handleEditPost={handleEditPost}
                    handleDeletePost={handleDeletePost}
                    showActions={showActions}
                />
            </div>
        ))
    ) : (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4">
            <h1 className="text-xl font-semibold">No post found</h1>
        </div>
    );

    return (
        <>
            <div>
                {postJSX}
                {(user && showEditPost && postToBeEdited) && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center overflow-auto">
                        <div className='bg-white p-6 rounded-lg max-h-screen max-w-[60%] overflow-y-auto'>
                            <CreatePost post={postToBeEdited}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Post;