import PostTemplate from '../utils/PostTemplate';
import { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import { toast } from 'react-hot-toast';

const Post = ({ reloadPage, setReloadPage, posts, setPosts, user, showEditPost, setShowEditPost, postTobeEdited, setPostToBeEdited }) => {

    const [dropdownIndex, setDropdownIndex] = useState(null);
    const visibilityOptions = ['Public', 'Friends', 'Private'];

    const fetchPost = async () => {
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post');
            const data = await response.json();
            if (data && data.message === 'success' && Object.keys(data).length > 0) {
                delete data.message;
                setPosts(Object.values(data));
            } else {
                setPosts(['No posts found']);
            }
        } catch (error) {
            setPosts(['Error fetching posts']);
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
                setReloadPage(true);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (reloadPage) {
            fetchPost();
            console.log('Reloading page', posts);
            setReloadPage(false);
        }
    }, [reloadPage]);

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
        setPostToBeEdited((prev) => ({...prev, ...post}));
        setShowEditPost(true);
        console.log('Post to be edited', post);
        console.log('showEditPost', showEditPost);
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

    useEffect(() => {
        if (reloadPage) {
            fetchPost();
            setReloadPage(false);
        }
    }, [reloadPage]);

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
            {showEditPost && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center overflow-auto">
                <div className='bg-white p-6 rounded-lg max-h-full'>
                    {console.log('Post to be edited', postTobeEdited)}
                    <CreatePost
                        post={postTobeEdited}
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
