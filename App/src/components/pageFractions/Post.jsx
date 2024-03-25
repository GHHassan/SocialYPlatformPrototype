import PostTemplate from '../utils/PostTemplate';
import { useState } from 'react';
import CreatePost from './CreatePost';
import { toast } from 'react-hot-toast';
import { API_ROOT } from '../../Config';

const SUCCESS_MESSAGE = 'success';



const Post = ({
    reloadPosts,
    setReloadPosts,
    posts,
    user,
}) => {
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [showActions, setShowActions] = useState(false);
    const visibilityOptions = ['Public', 'Friends', 'Private'];
    const [allComments, setAllComments] = useState([]);
    const [showEditPost, setShowEditPost] = useState(false);
    const [postToBeEdited, setPostToBeEdited] = useState(null);

    let token = localStorage.getItem('token');
    const deleteImage = async (imageName) => {
        if (!imageName) {
            return;
        }
        try {
            const response = await fetch(`${API_ROOT}/upload?image=${imageName}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            handleApiResponse(response, 'Old image deleted successfully');
        } catch (error) {
            console.error('Error during deleteImage:', error);
        }
    };

    const deleteVideo = async (videoName) => {
        try {
            const response = await fetch(`${API_ROOT}/upload?video=${videoName}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            handleApiResponse(response, 'Old video deleted successfully');
        } catch (error) {
            console.error('Error during deleteVideo:', error);
        }
    };

    const deleteComments = async (postID) => {
        try {
            const response = await fetch(`${API_ROOT}/comment?postID=${postID}`, {
                method: 'DELETE',
            });
            handleApiResponse(response, 'Comments deleted successfully');
        } catch (error) {
            console.error('Error during deleteComments:', error);
        }
    };

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
            setReloadPosts(true);
        } else {
            console.error('Unexpected response:', response);
            console.error('Unexpected response:', data);
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
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            handleApiResponse(response, 'Post deleted successfully');
        } catch (error) {
            console.error('Error during deletePost:', error);
        }
    };

    const fetchAllComments = async () => {
        try {
            const response = await fetch(`${API_ROOT}/comment`);
            const data = await response.json();
            if (data.message === SUCCESS_MESSAGE) {
                delete data.message;
                setAllComments((prevComments) => ({
                    ...prevComments,
                    data,
                }));
                console.log('All comments:', allComments);
            }
        } catch (error) {
            console.error('Error during fetchComments:', error);
        }
    }

    console.log('All comments:', allComments);
    const handleEditPost = (post) => {
        setPostToBeEdited({ ...post });
        setShowEditPost(true);
        setShowActions(false);
    };

    const handleDeletePost = (post) => {
        deletePost(post);
        setShowActions(false);
    };

    const handleDropdownToggle = (index) => {
        setDropdownIndex(dropdownIndex === index ? null : index);
        setShowActions(true);
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
                    user={user}
                    handleDropdownToggle={handleDropdownToggle}
                    dropdownIndex={dropdownIndex}
                    handleEditPost={handleEditPost}
                    handleDeletePost={handleDeletePost}
                    handleVisibility={handleVisibility}
                    visibilityOptions={visibilityOptions}
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
                            <CreatePost
                                post={postToBeEdited}
                                reloadPosts={reloadPosts}
                                setReloadPosts={setReloadPosts}
                                user={user}
                                showEditPost={showEditPost}
                                setShowEditPost={setShowEditPost}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Post;