import React, { useState } from 'react';
import { imageIcon } from '../utils/Icons';
const CreatePost = () => {
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [postVideo, setPostVideo] = useState(null);

    const image = imageIcon();
    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setPostImage(file);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        setPostVideo(file);
    };

    const handlePostSubmit = (e) => {
        e.preventDefault();
        // Add logic to submit the post content, image, and video to the server or perform any other actions
        console.log('Post submitted:', postContent);
        console.log('Image submitted:', postImage);
        console.log('Video submitted:', postVideo);
        setPostContent('');
        setPostImage(null);
        setPostVideo(null);
    };

    return (
        <div>
            <h2>Create Post</h2>
            <form onSubmit={handlePostSubmit}>
                <div className="flex items-center">
                    <textarea
                        type="text"
                        className="border border-gray-300 rounded-lg p-2 w-full mr-2"
                        placeholder="What is in your mind..."
                        value={postContent}
                        onChange={handlePostChange}
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="imageInput" className="mr-2">
                        Image
                    </label>
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="videoInput" className="mr-2">
                        Video:
                    </label>
                    <input
                        id="videoInput"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white rounded-lg p-2">
                    Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
