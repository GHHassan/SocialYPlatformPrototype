import React from 'react';
import ProfileAvatar from '../utils/ProfileAvatar';
import { useState, useEffect } from 'react';
const Post = () => {

    const [posts, setPosts] = useState([]);

    const fetchPost = async () => {
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/api/post');
            const data = await response.json();
            if (data && data.message === 'success' && Object.keys(data).length > 0) {
                delete data.message;
                setPosts(Object.values(data));
            } else {
                console.log('No posts found');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        fetchPost();
    }, [posts]);

    const postJSX = posts ? (
        posts.map((post, index) => (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4" key={index}>
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
                                <p className="text-sm text-gray-500">{post.visibility}</p>
                                <p className="text-sm text-gray-500">{post.location}</p>
                            </div>
                            {/* Add any additional post meta info here */}
                        </div>
                    </div>
                </div>
                <div className='m-2 bg-blue-200'>
                    <h1 className="text-lg font-semibold mb-2">{post.textContent}</h1>
                    {post.videoPath && <p className="mb-2">{post.videoPath}</p>}
                    {post.photoPath && <p className="mb-2">{post.photoPath}</p>}
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
            <h1 className="text-xl font-semibold">Loading...</h1>
        </div>
    );


    return (
        <div>
            {postJSX}
        </div>
    );
};

export default Post;
