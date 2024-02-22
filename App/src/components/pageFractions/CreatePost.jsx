import React, { useEffect, useRef, useState } from 'react';
import ProfileAvatar from '../utils/ProfileAvatar';
const CreatePost = () => {
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [postVideo, setPostVideo] = useState(null);
    const [postImageURL, setPostImageURL] = useState('');
    const [postVideoURL, setPostVideoURL] = useState('');
    const [uploaded, setUploaded] = useState(false);

    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const uploadFile = async () => {
        const body = new FormData();
        body.append('image', postImage);
        body.append('video', postVideo);
        await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/upload', {
            method: 'POST',
            body: body,
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.imageUpload && result.imageUpload.message === 'success') {
                setPostImageURL(result.imageUpload.url);
            }
            if (result.videoUpload && result.videoUpload.message === 'success') {
                setPostVideoURL(result.videoUpload.url);
            }
        })
    }

    const uploadData = async () => {
        const body = {
            "userID": 5, // Replace with the logged in user's ID
            "firstName": "John", // Replace with the logged in user's name
            "lastName": "Doe", // Replace with the logged in user's name
            "textContent": postContent,
            "photoPath": postImageURL,
            "videoPath": postVideoURL,
        };
        
        console.log('Post Data:', body);
        await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post', {
            method: 'POST',
            body: JSON.stringify(body),
        })
        .then((response) => response.json())
        .then((json) => {
            console.log( json);
        });
    }

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

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!postContent.trim() && !postImage && !postVideo) {
            return;
        }
        if (postImage || postVideo) {
            await uploadFile();
            setUploaded(true);
        }

    };

    useEffect(() => {
        if (uploaded) {
            uploadData();
            setUploaded(false);
            resetPostForm();
        }
    }, [uploaded]);

    const resetPostForm = () => {
        setPostContent('');
        setPostImage(null);
        setPostVideo(null);
        setPostImageURL('');
        setPostVideoURL('');
        // Reset file input fields
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    }
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
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/gif" // Add more image MIME types if needed
                        onChange={handleImageChange}
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="videoInput" className="mr-2">
                        Video:
                    </label>
                    <input
                        id="videoInput"
                        ref={videoInputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/gif" // Add more image MIME types if needed
                        // accept="video/mp4, video/mpeg, video/quicktime" // Add more video MIME types if needed
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
