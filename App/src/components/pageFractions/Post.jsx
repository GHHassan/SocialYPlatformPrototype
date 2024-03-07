import PostTemplate from '../utils/PostTemplate';
import { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import { toast } from 'react-hot-toast';
import { API_ROOT } from '../../Config';

const SUCCESS_MESSAGE = 'success';

const handleApiResponse = async (response, successMessage) => {
    const data = await response.json();
    if (data.message === SUCCESS_MESSAGE) {
        toast.success(successMessage);
        setReloadPage(true);
    } else {
        console.error('Unexpected response:', data);
    }
};

const deleteImage = async (imageName) => {
    if (!imageName) {
        return;
    }

    try {
        const response = await fetch(`${API_ROOT}/upload?image=${imageName}`, {
            method: 'DELETE',
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
            body: JSON.stringify(post),
        });
        handleApiResponse(response, 'Post visibility updated successfully');
    } catch (error) {
        console.error('Error during updatePostVisibility:', error);
    }
};

const Post = ({
    reloadPage,
    setReloadPage,
    posts,
    user,
    showEditPost,
    setShowEditPost,
    postToBeEdited,
    setPostToBeEdited,
}) => {
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const visibilityOptions = ['Public', 'Friends', 'Private'];
    const [commentContent, setCommentContent] = useState('');
    const [showComment, setShowComment] = useState({});
    const [comments, setComments] = useState([]);
    const [postID, setPostID] = useState('');

    const deletePost = async (post) => {
        try {
            const response = await fetch(`${API_ROOT}/post?postID=${post.postID}`, {
                method: 'DELETE',
            });
            handleApiResponse(response, 'Post deleted successfully');

            if (post.photoPath) {
                await deleteImage(post.photoPath);
            }

            if (post.videoPath) {
                await deleteVideo(post.videoPath);
            }

            await deleteComments(post.postID);
        } catch (error) {
            console.error('Error during deletePost:', error);
        }
    };

    const postComment = async (post) => {
        const body = {
            "postID": post.postID,
            "userID": user.userID,
            "username": user.username,
            "profilePath": user.profilePicturePath,
            "name": `${user.firstName} ${user.lastName}`,
            "commentContent": commentContent,
        };

        try {
            const response = await fetch(`${API_ROOT}/comment`, {
                method: 'POST',
                body: JSON.stringify(body),
            });
            handleApiResponse(response, 'Comment posted successfully');
            fetchComments(post.postID);
            setCommentContent('');
        } catch (error) {
            console.error('Error during postComment:', error);
        }
    };

    const postLike = async (post) => {
        const body = {
            "postID": post.postID,
            "userID": user.userID,
            "username": user.username,
            "name": `${user.firstName} ${user.lastName}`,
            "ReactionType": ":Like:",
        };

        try {
            const response = await fetch(`${API_ROOT}/reaction`, {
                method: 'POST',
                body: JSON.stringify(body),
            });
            handleApiResponse(response, 'Like posted successfully');
        } catch (error) {
            console.error('Error during postLike:', error);
        }
    };

    const fetchComments = async (postID) => {
        try {
            const response = await fetch(`${API_ROOT}/comment?postID=${postID}`);
            const data = await response.json();
            if (data.message === SUCCESS_MESSAGE) {
                delete data.message;
                setComments(Object.values(data));
            }
        } catch (error) {
            console.error('Error during fetchComments:', error);
        }
    };

    const handleEditPost = (post) => {
        setPostToBeEdited({ ...post });
        setShowEditPost(true);
    };

    const handleDeletePost = (post) => {
        deletePost(post);
    };

    const handleDropdownToggle = (index) => {
        setDropdownIndex(dropdownIndex === index ? null : index);
    };

    const handleVisibility = (post, key) => {
        const myPost = { ...post, visibility: key };
        updatePostVisibility(myPost);
    };

    const handleLikeClick = async (post) => {
        postLike(post);
    };

    const handleCommentChange = (e) => {
        setCommentContent(e.target.value);
    };

    const handleCommentClick = (post) => {
        setShowComment((prevShowComment) => ({
            ...prevShowComment,
            [post.postID]: !prevShowComment[post.postID],
        }));

        // Fetch comments only if the clicked post's comments are not already loaded
        if (!showComment[post.postID]) {
            setPostID(post.postID);
            fetchComments(post.postID);
        }
    };
    useEffect(() => {
        if (showComment[postID]) {
            fetchComments(postID);
        }
    }, [showComment, postID]);

    //   const handleCommentClick = (post) => {
    //     setShowComment((prevShowComment) => ({
    //       ...prevShowComment,
    //       [post.postID]: !prevShowComment[post.postID],
    //     }));

    //     // Set the postID for the current post
    //     setPostID(post.postID);
    //   };

    const handleShareClick = () => {
        console.log('Share clicked');
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
                    handleLikeClick={handleLikeClick}
                    handleCommentClick={() => handleCommentClick(post)} // Pass post to handleCommentClick
                    handleShareClick={handleShareClick}
                    visibilityOptions={visibilityOptions}
                    handleCommentChange={handleCommentChange}
                    handleSubmitComment={postComment}
                    showComment={showComment[post?.postID]} // Show comment based on the clicked post
                    comments={comments}
                    commentContent={commentContent}
                    postID={post.postID}
                />
            </div>
        ))
    ) : (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4">
            <h1 className="text-xl font-semibold">No post found</h1>
        </div>
    );

    return (
        <div>
            {postJSX}
            {(showEditPost && postToBeEdited) && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center overflow-auto">
                    <div className='bg-white p-6 rounded-lg max-h-screen max-w-[60%] overflow-y-auto'>
                        <CreatePost
                            post={postToBeEdited}
                            reloadPage={reloadPage}
                            setReloadPage={setReloadPage}
                            user={user}
                            showEditPost={showEditPost}
                            setShowEditPost={setShowEditPost}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;