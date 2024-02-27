import React from 'react';
import ProfileAvatar from '../utils/ProfileAvatar';
import Select from './Select';
import { useState, useEffect } from 'react';

const Post = ({ reloadPage, setReloadPage, posts, setPosts, user}) => {

    // const [posts, setPosts] = useState([]);
    const [isDropdownVisible, setDropdownVisibility] = useState(false);
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
        console.log('Deleting post:', post);
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post?postID=' + post.postID, {
                method: 'DELETE',
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

    const handleUpdatePost = (post) => {
        console.log('Update post:', post);
    }

    const handleDeletePost = (post) => {
        deletePost(post);
    }

    // Function to toggle the dropdown visibility
    const handleDropdownToggle = (index) => {
        setDropdownIndex(dropdownIndex === index ? null : index);
    };

    const handVisibility = (key, value) => {
        console.log(key, value);
    }

    useEffect(() => {
        console.log('Reload page:', reloadPage);
        if (reloadPage) {
            fetchPost();
            setReloadPage(false);
        }
    }, [reloadPage]);

    useEffect(() => {
        fetchPost();
    }, []);

    const postJSX = posts[0] !== 'No posts found' ? (
        posts.map((post, index) => (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4" key={index}>
                { (
                    <div className="relative">
                        <button className="absolute top-0 right-0 mt-2 mr-2 bg-white border border-gray-300 rounded-lg p-2"
                            onClick={() => handleDropdownToggle(index)}>...</button>
                        {dropdownIndex === index && (
                            <div className="absolute top-0 right-0 mt-2 mr-2 bg-white border border-gray-300 rounded-lg p-2">
                                <button className="text-blue-500" onClick={() => handleUpdatePost(post)}>Update</button>
                                <button className="text-red-500 ml-2" onClick={() => handleDeletePost(post)}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
                {/* Post body */}
                <div className="flex items-start">
                    <div className="mr-4">
                        <ProfileAvatar
                            imagePath={post.profilePicturePath}
                            firstName={post.firstName}
                            lastName={post.lastName}
                            userID={post.userID}
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <p className="text-sm text-gray-500">{post.postDateTime}</p>
                                {user.userID === post.userID && (
                                <p className="text-sm text-gray-500" >Audience: 
                                    <span className="text-sm text-gray-500 ml-4" >
                                        <Select 
                                            options={visibilityOptions}
                                            value={post.visibility}
                                            identifier={post.postID}
                                            onChange={handVisibility}
                                        />
                                    </span>
                                </p>)}
                                <p className="text-sm text-gray-500">{post.location}</p>
                            </div>
                            {/* Add any additional post meta info here */}
                        </div>
                    </div>
                </div>
                <div className='m-2 bg-blue-200'>
                    <h1 className="text-lg font-semibold mb-2">{post.textContent}</h1>

                    {post.videoPath &&
                        <div className="video-container mb-2">
                            <video controls width="100%" height="auto">
                                <source src={post.videoPath} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    }

                    {post.photoPath &&
                        <div className="image-container mb-2">
                            <img src={post.photoPath} alt="Post Image" style={{ width: '100%', height: 'auto' }} />
                        </div>
                    }
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <button className="text-blue-500">Like</button>
                        <button className="text-blue-500 ml-2">Comment</button>
                        <button className="text-blue-500 ml-2">Share</button>
                    </div>
                </div>
                <div className="flex items-center">
                    <input type="text" className="border border-gray-300 rounded-lg p-2 w-full mr-2" placeholder="Write a comment..." />
                    <button className="bg-blue-500 text-white rounded-lg p-2">Post</button>
                </div>
                {/* Post comments */}

            </div>
        ))
    ) : (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4">
            <h1 className="text-xl font-semibold">No post found</h1>
        </div>
    );


    console.log('Posts:', postJSX.length);
    return (
        <div>
            {postJSX.length > 0 && postJSX[0] === 'No posts found' ? (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4">
                    <h1 className="text-xl font-semibold">No posts found</h1>
                </div>
            ) : postJSX}
        </div>
    );
};

export default Post;
