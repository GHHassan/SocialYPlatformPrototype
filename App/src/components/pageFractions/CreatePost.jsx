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
import { API_ROOT } from '../../Config';
import { useHomeState } from '../../contexts/HomeStateContext';
import { useAppState } from '../../contexts/AppStateContext';

const CreatePost = ({ post }) => {
    const { state: HomeState, dispatch: HomeDispatch } = useHomeState();
    const { showEditPost, reloadPosts: reload } = HomeState;
    const { state: AppState } = useAppState();
    const { userProfile: user } = AppState;

    const [postContent, setPostContent] = useState(post?.textContent || '');
    const [postImage, setPostImage] = useState('');
    const [postVideo, setPostVideo] = useState('');
    const [postImageURL, setPostImageURL] = useState(post?.photoPath || '');
    const [postVideoURL, setPostVideoURL] = useState(post?.videoPath || '');
    const [oldphotoPath, setOldphotoPath] = useState(post?.photoPath || '');
    const [oldvideoPath, setOldvideoPath] = useState(post?.videoPath || '');
    const [newImagePath, setNewImagePath] = useState('');
    const [newVideoPath, setNewVideoPath] = useState('');
    const [postVisibility, setPostVisibility] = useState(post?.visibility || 'Friends');
    const [toBeSubmitted, setToBeSubmitted] = useState(false);
    const [mediaUploaded, setMediaUploaded] = useState(false);
    const [message, setMessage] = useState(post?.visibility);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const deleteImage = async (imageName) => {
        try {
            const response = await fetch(`${API_ROOT}/upload?image=${imageName}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.message === 'success') {
                toast.success('oldImage deleted successfully');
            } else {
                console.error('Unexpected response:', data);
            }
        } catch (error) {
            console.error('Error during deleteImage:', error);
        }
    };

    const deleteVideo = async (videoName) => {
        try {
            const response = await fetch(`${API_ROOT}/upload?video=${videoName}`, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.message === 'success') {
                toast.success('oldVideo deleted successfully');
            }
        }
        catch (error) {
            toast.error('Error deleting video');
        }
    }

    const uploadFile = async () => {

        const body = new FormData();
        body.append('image', postImage ? postImage : '');
        body.append('video', postVideo ? postVideo : '');
        const response = await fetch(`${API_ROOT}/upload`, {
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
        } else if (result.message === 'success') {
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
            toast.error('Error uploading file');
        }
    }

    const uploadData = async () => {
        const body = {
            "postID": showEditPost ? post?.postID : '',
            "userID": user.userID,
            "username": user.username,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "textContent": postContent,
            "photoPath": newImagePath ? newImagePath : postImageURL,
            "videoPath": newVideoPath ? newVideoPath : postVideoURL,
            "visibility": postVisibility
        };
        const method = showEditPost ? 'PUT' : 'POST';
        try {
            const response = await fetch(`${API_ROOT}/post`, {
                method: method,
                body: JSON.stringify(body),
            })
            const data = await response.json();
            if (data.message === 'success') {
                resetPostForm();
                toast.success('Post created successfully');
            }
            if (showEditPost && newImagePath) {
                deleteImage(oldphotoPath);
            }
            if (showEditPost && newVideoPath) {
                deleteVideo(oldvideoPath);
            }
            HomeDispatch({ type: 'RELOAD_POSTS', payload: true })
        }
        catch (error) {
            console.error('Error during uploadData:', error);
            toast.error('Error creating post');
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
            } else {
                setMediaUploaded(true);
            }
        } catch (error) {
            toast.error('Error uploading media');
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
        handleMessageChange(postVisibility);
        setToBeSubmitted(true);

    };

    const resetPostForm = () => {
        setPostContent('');
        setPostImage(null);
        setPostVideo(null);
        setPostImageURL('');
        setPostVideoURL('');
        HomeDispatch({ type: 'TOGGLE_SHOW_EDIT_POST', payload: false });
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
            setMessage(<span>This post will Not be visible to <span className='text-xl font-bold'>ANYONE EXCEPT YOU </span>, Are you sure, you want to continue?</span>);
        } else if (value === 'Friends') {
            setMessage(<span>This post will only be visible to <span className='text-xl font-bold'> YOUR FRIENDS </span>, on SocialY, Are you sure, you want to continue?</span>);
        } else {
            setMessage(<span>This post will only be visible to <span className='text-xl font-bold'> EVERYONE </span>, on OR off SocialY, Are you sure, you want to continue?</span>);
        }
    }

    const handlePostVisibilityChange = (userID, value) => {
        handleMessageChange(value);
        setPostVisibility(value);
    }

    return (
        <div>
            {user && (
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
                    {toBeSubmitted && <div className="fixed top-1/4 left-1/4 right-1/4 bg-red-800 text-white p-4 text-center rounded-lg">
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
            )}
        </div>
    );
};

export default CreatePost;
