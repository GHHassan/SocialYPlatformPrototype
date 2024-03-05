import PostTemplate from '../utils/PostTemplate';
import { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import { toast } from 'react-hot-toast';

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

    const deleteImage = async (imageName) => {
        console.log('imageName:', imageName);
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/upload?image=' + imageName, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.message === 'success') {
                toast.success('oldImage deleted successfully');
                setReloadPage(true);
            } else {
                console.error('Unexpected response:', data);
            }
        } catch (error) {
            console.error('Error during deleteImage:', error);
        }
    };

    const deleteVideo = async (videoName) => {
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/upload?video=' + videoName, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.message === 'success') {
                toast.success('oldVideo deleted successfully');
                setReloadPage(true);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    const deletePost = async (post) => {
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post?postID=' + post.postID, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.message === 'success') {
                toast.success('Post deleted successfully');

                if (post.photoPath) {
                    const photoDeleted = await deleteImage(post.photoPath)
                    if (photoDeleted.message === 'success') {
                        toast.success('Post photo deleted successfully');
                    }
                }
                if (post.videoPath) {
                    videoDeleted = await deleteVideo(post.videoPath)
                    if (videoDeleted.message === 'success') {
                        toast.success('Post video deleted successfully');
                    }
                }
                setReloadPage(true);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    const updatePostVisibility = async (post) => {
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post', {
                method: 'PUT',
                body: JSON.stringify(post),
            })
            const data = await response.json();
            if (data.message === 'success') {
                setReloadPage(true);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    const handleEditPost = (post) => {
        setPostToBeEdited({ ...post });
        setShowEditPost(true);
    }

    const handleDeletePost = (post) => {
        deletePost(post);
    }

    // Function to toggle the dropdown visibility
    const handleDropdownToggle = (index) => {
        setDropdownIndex(dropdownIndex === index ? null : index);
    };

    const handVisibility = (post, key) => {
        const myPost = { ...post, visibility: key };
        updatePostVisibility(myPost);
    };

    const handleLikeClick = () => {
        console.log('Like clicked');
    }

    const handleCommentClick = () => {
        console.log('Comment clicked');
    }

    const handleShareClick = () => {
        console.log('Share clicked');
    }

    const postJSX = posts[0] !== 'No posts found' ? (
        posts.map((post, index) => (
            // className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4"
            <div className='my-4 p-5 border border-gray-300 rounded-lg' key={index}>
                <PostTemplate
                    post={post}
                    index={index}
                    user={user}
                    handleDropdownToggle={handleDropdownToggle}
                    dropdownIndex={dropdownIndex}
                    handleEditPost={handleEditPost}
                    handleDeletePost={handleDeletePost}
                    handleVisibility={handVisibility}
                    handleLikeClick={handleLikeClick}
                    handleCommentClick={handleCommentClick}
                    handleShareClick={handleShareClick}
                    visibilityOptions={visibilityOptions}
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
