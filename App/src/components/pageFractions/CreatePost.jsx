
/** 
 * Create post
 * 
 * This component is responsible for create a new post.
 * Users can create a new post with text, image, and video.
 * 
 * if the user is not signed in, the component will not be displayed.
 * 
 * Only acceps images in both video and image input fields due to the
 * server fileUpload size limit is  2MB in php.ini file.
 * 
 * @author G H Hassani <w20017074>
 */



import React, { useRef, useState } from 'react';

const CreatePost = ({ user, setReloadPage }) => {

    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [postVideo, setPostVideo] = useState(null);
    const [postImageURL, setPostImageURL] = useState('');
    const [postVideoURL, setPostVideoURL] = useState('');

    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    let imageURL = '';
    let videoURL = '';
    const uploadFile = async () => {
        const body = new FormData();
        body.append('image', postImage ? postImage : '');
        body.append('video', postVideo ? postVideo : '');

        const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/upload', {
            method: 'POST',
            body: body,
        });

        const result = await response.json();

        console.log('File upload result:', result);
        if (result.imageUpload && result.videoUpload) {
            imageURL = result.imageUpload.url;
            videoURL = result.videoUpload.url;
            setPostImageURL(result.imageUpload.url);
            setPostVideoURL(result.videoUpload.url);
        }

        if (result.message) {
            if (result.imageURL) {
                setPostImageURL(result.imageURL)
                imageURL = result.imageURL;
            }
            if (result.videoURL) {
                videoURL = result.videoURL;
                setPostVideoURL(result.videoURL);
            }
        }

        if (!result) {
            console.error('File upload failed:', result.message);
        }
    };

    const uploadData = async () => {
        console.log('imageURL variable: ', imageURL)
        console.log('videoURL variable: ', videoURL)
        console.log('postImageURL:', postImageURL);
        console.log('postVideoURL:', postVideoURL);
        const body = {
            "userID": user.userID,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "textContent": postContent,
            "photoPath": imageURL,
            "videoPath": videoURL,
        }
        try {
            console.log('Uploading post data:', body);
            setReloadPage(false);
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post', {
                method: 'POST',
                body: JSON.stringify(body),
            })
            const data = await response.json();
            if (data.message === 'success') {
                setReloadPage(true);
            }
        }
        catch (error) {
            console.log('Error:', error);
        }
    }

    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setPostImageURL(URL.createObjectURL(file));
        setPostImage(file);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        setPostVideoURL(URL.createObjectURL(file));
        setPostVideo(file);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!postContent && !postImage && !postVideo) {
            console.log('Post content is required');
            return;
        }
        console.log('Post submitted');
        if (postImage || postVideo) {
            await uploadFile();
        }
        await uploadData();
        setReloadPage(true);
        resetPostForm();
    };

    const resetPostForm = () => {
        console.log('Resetting post form');
        setPostContent('');
        setPostImage(null);
        setPostVideo(null);
        setPostImageURL('');
        setPostVideoURL('');
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
                <div>
                    <textarea
                        type="text"
                        className="border border-gray-300 rounded-lg p-2 w-full mr-2"
                        placeholder="What is in your mind..."
                        value={postContent}
                        onChange={handlePostChange}
                    />
                    {postImageURL && (
                        <img src={postImageURL} alt="Post Image" className="w-full h-full" />)}
                    {postVideoURL && (
                        <img src={postVideoURL} alt="Post Video" className="w-full h-full" />)}
                </div>
                <div className="flex items-center mb-1">
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

                <button type="submit" className="bg-blue-500 text-white rounded-lg p-2"
                    onClick={handlePostSubmit}>
                    Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
