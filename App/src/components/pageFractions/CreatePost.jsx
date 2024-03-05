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



import { useEffect, useRef, useState } from 'react';
import Select from './Select';
import { toast } from 'react-hot-toast';

const CreatePost = ({ user, setReloadPage, post, setShowEditPost, showEditPost }) => {

    const [postContent, setPostContent] = useState(post ? post.textContent : '');
    const [postImage, setPostImage] = useState(null);
    const [postVideo, setPostVideo] = useState(null);
    const [postImageURL, setPostImageURL] = useState(post ? post.photoPath : '');
    const [postVideoURL, setPostVideoURL] = useState(post ? post.videoPath : '');
    const [oldphotoPath, setOldphotoPath] = useState(post ? post.postImageURL : '');
    const [oldvideoPath, setOldvideoPath] = useState(post ? post.postVideoURL : '');
    const [newImagePath, setNewImagePath] = useState(null);
    const [newVideoPath, setNewVideoPath] = useState(null);
    const [postVisibility, setPostVisibility] = useState(post ? post.visibility : 'Friends');
    const [toBeSubmitted, setToBeSubmitted] = useState(false);
    const [mediaUploaded, setMediaUploaded] = useState(false);
    const [message, setMessage] = useState(post ? post.visibility : 'Friends');
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

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

    const uploadFile = async () => {

        const body = new FormData();
        body.append('image', postImage ? postImage : '');
        body.append('video', postVideo ? postVideo : '');

        const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/upload', {
            method: 'POST',
            body: body,
        });

        const result = await response.json();
        if (result.imageUpload && result.videoUpload) {
            if (result.imageUpload.message === 'success') {
                toast.success('Image uploaded successfully');
                setNewImagePath(result.imageUpload.imageURL);
            }
            if (result.videoUpload.message === 'success') {
                toast.success('Video uploaded successfully');
                setNewVideoPath(result.videoUpload.videoURL);
            }
            setMediaUploaded(true);
        } else if (result.message) {
            if (result.imageURL) {
                setNewImagePath((prevUrl) => result.imageURL || prevUrl);
            }
            if (result.videoURL) {
                videoURL = result.videoURL;
                setNewVideoPath((prevUrl) => result.videoURL || prevUrl);
            }
            setMediaUploaded(true);
        }
        if (!result) {
            console.error('File upload failed:', result.message);
        }
    }

    const uploadData = async () => {
        try {
            const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/post', {
                method: showEditPost ? 'PUT' : 'POST',
                body: JSON.stringify(
                    {
                        "postID": showEditPost ? post.postID : '',
                        "userID": user.userID,
                        "firstName": user.firstName,
                        "lastName": user.lastName,
                        "textContent": postContent,
                        "photoPath":  newImagePath ? newImagePath : postImageURL,
                        "videoPath": newVideoPath ? newVideoPath : postVideoURL,
                        "visibility": postVisibility
                    }
                ),
            })
            const data = await response.json();
            if (data.message === 'success') {
                resetPostForm();
                toast.success('Post created successfully');
                setReloadPage(true);
            }
            if (showEditPost && oldphotoPath) {
                deleteImage(oldphotoPath);
            }
            if (showEditPost && oldvideoPath) {
                deleteVideo(oldvideoPath);
            }
        }
        catch (error) {
            console.log('Error:', error);
        }
    }

    const checkFileSize = (file) => {
        if (file.size > 2097152) {
            toast.error('File size is too large, please select a file less than 2MB');
            return false;
        }
        return true;
    }
    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        checkFileSize(file);
        if (showEditPost) {
            setOldphotoPath(post.photoPath);
        }
        setPostImage(file);
        setPostImageURL(URL.createObjectURL(file));
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        checkFileSize(file);
        if (showEditPost) {
            setOldvideoPath(post.videoPath);
        }
        setPostVideoURL(URL.createObjectURL(file));
        setPostVideo(file);
    };

    const postAnyWay = async () => {
        try {
            setToBeSubmitted(false);

            if (postImage || postVideo) {
                await uploadFile();
            }

            if (postContent) {
                setMediaUploaded(true);
            }


        } catch (error) {
            console.error('Error during postAnyWay:', error);
        }
    };

    useEffect(() => {
        if (mediaUploaded) {
            uploadData();
            setMediaUploaded(false);
        }
    }, [mediaUploaded]);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!postContent && !postImage && !postVideo) {
            toast.error('Empty Post, Please input some Text or medis file');
            return;
        }
        handleMessageChange(message)
        setToBeSubmitted(true);

    };

    const resetPostForm = () => {
        setPostContent('');
        setPostImage(null);
        setPostVideo(null);
        setPostImageURL('');
        setPostVideoURL('');
        setShowEditPost(false);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    }

    const handleMessageChange = (value) => {
        if (!value) return;
        if (value === 'Private') {
            setMessage('This post will only be visible to you, Are you sure, you want to continue?');
        } else if (value === 'Friends') {
            setMessage('This post will only be visible to your friends on SocialY, Are you sure, you want to continue?');
        } else {
            setMessage('This post will be visible to everyone, Are you sure, you want to continue?');
        }
    }

    const handlePostVisibilityChange = (userID, value) => {
        handleMessageChange(value);
        setPostVisibility(value);
    }

    return (
        <div>
            <h2>Create Post</h2>
            <div className="flex justify-between items-center mb-2 mr-2 float-end">
                <p className=' mr-2'>Select your Audience</p>
                <div className="flex mr-0">
                    <Select
                        options={['Public', 'Friends', 'Private']}
                        value={postVisibility}
                        identifier={user.userID}
                        onChange={handlePostVisibilityChange}
                    />
                </div>
            </div>

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
                        <div className="relative">
                            <img src={postImageURL} alt="Post Image" className="w-full h-full" />
                            <button
                                className="absolute top-0 right-0 p-1 bg-gray-300 rounded-full"
                                onClick={() => {
                                    setOldphotoPath(postImageURL);
                                    setPostImage(null);
                                    setPostImageURL('');
                                    imageInputRef.current.value = '';
                                }
                                }
                            >
                                X
                            </button>
                        </div>
                    )}
                    {postVideoURL && (
                        <div className="relative">
                            < img src={postVideoURL} alt="Post Video" className="w-full h-full" />
                            <button
                                className="absolute top-0 right-0 p-1 bg-gray-300 rounded-full"
                                onClick={() => {
                                    setOldvideoPath(postVideoURL);
                                    setPostVideo(null);
                                    setPostVideoURL('');
                                    videoInputRef.current.value = '';
                                }
                                }
                            >
                                X
                            </button>
                        </div>
                    )
                    }
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
                    {postImageURL && (
                        <button
                            className="bg-gray-400 text-white rounded-lg w-5 h-5 ml-2"
                            onClick={() => {
                                setPostImage(null);
                                setPostImageURL('');
                                imageInputRef.current.value = '';
                            }}
                        >
                            X
                        </button>
                    )}
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
                    {postVideoURL && (
                        <button
                            className="bg-gray-400 text-white rounded-lg w-5 h-5 ml-2"
                            onClick={() => {
                                setPostVideo(null);
                                setPostVideoURL('');
                                videoInputRef.current.value = '';
                            }}
                        >
                            X
                        </button>
                    )}
                </div>
                {((postContent || postImage || postVideo)) &&
                    <div className='flex justify-center'>
                        <button type="submit" className="bg-blue-500 text-white rounded-lg p-2 w-20 mt-2 mr-2"
                            onClick={handlePostSubmit}>
                            Post
                        </button>
                        <button className="bg-blue-500 text-white rounded-lg p-2 w-20 mt-2"
                            onClick={resetPostForm}>
                            Cancel
                        </button>
                    </div>
                }
            </form>
            { }
            {toBeSubmitted && <div className="fixed top-1/4 left-1/4 right-1/4 bg-red-500 text-white p-4 text-center">
                <p className="font-bold">Consider the audience of your post!</p>
                <p>{message}</p>
                <p>Remember to be mindful of your content and its impact on your privacy.</p>
                <button className="bg-white text-red-500 p-2 rounded-lg mt-2 mr-4"
                    onClick={() => setToBeSubmitted(false)}>
                    updateVisibility
                </button>
                <button className="bg-white text-red-500 p-2 rounded-lg mt-2"
                    onClick={postAnyWay}>
                    Post Anyway
                </button>

            </div>}
        </div>
    );
};

export default CreatePost;
