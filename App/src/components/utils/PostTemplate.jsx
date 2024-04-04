/**
 * @file PostTemplate.jsx 
 * It is used to display and manage of the posts individually.
 * 
 * sub components of the PostTemplate are:
 * - PostHeader
 * - PostContent
 * - PostActions
 * - CommentSection
 * 
 * sub components have been intentionally separated to make 
 * the code more readable and maintainable.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 * 
 **/
import React from 'react';
import ProfileAvatar from '../utils/ProfileAvatar';
import Select from '../pageFractions/Select';
import CommentSection from '../pageFractions/CommentSection';
import { API_ROOT } from '../../Config';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppState } from '../../contexts/AppStateContext';
import { useHomeState } from '../../contexts/HomeStateContext';
import { Link } from 'react-router-dom';
import ShareButtons from './ShareButtons';

const SUCCESS_MESSAGE = 'success';
const handleApiResponse = async (response, successMessage) => {
  const data = await response.json();
  if (data.message === SUCCESS_MESSAGE) {
    toast.success(successMessage);
    setReloadPosts(true);
  } else {
    console.error('Unexpected response:', response);
    console.error('Unexpected response:', data);
  }
};

const PostHeader = ({ post, user, visibilityOptions, handleVisibility }) => {

  return (
    <div className="flex items-start">
      <div className={` w-10 h-10 rounded-full m-2 cursor-pointer`}>
        <Link to={`/profile/${post.userID}`}>
          <ProfileAvatar
            imagePath={post.profilePicturePath}
            firstName={post.firstName}
            lastName={post.lastName}
            userID={post.userID}
          />
        </Link>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">{post.postDateTime}</p>
            {user?.userID === post.userID ? (
              <p className="text-xs text-gray-500">Audience:
                <span className="text-xs text-gray-500 ml-4">
                  <Select
                    options={visibilityOptions}
                    value={post.visibility || ''}
                    identifier={post}
                    onChange={handleVisibility}
                  />
                </span>
              </p>) : (
              <p className="text-xs text-gray-500 mr-4">Audience:
                <span className="text-xs text-gray-500 ml-4">
                  {post.visibility}
                </span>
              </p>
            )}
            <p className="text-sm text-gray-500">Location:
              <span className="text-sm text-gray-500 ml-4">
                {post.location}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
const PostContent = ({ post }) => (
  <div className='m-2 bg-white'>
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
);


const PostActions = ({ post, handleCommentClick, handleLikeClick, handleShareClick }) => {

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <button className="text-blue-500"
          onClick={() => handleLikeClick(post)}
        >Like</button>
        <button className="text-blue-500 ml-2"
          onClick={() => handleCommentClick(post)}
        >Comment</button>
        <button className="text-blue-500 ml-2"
          onClick={() => handleShareClick(post)}
        >Share</button>
      </div>
    </div>
  );
}
const PostTemplate = ({
  post,
  index,
  visibilityOptions,
  handleDeletePost,
  handleVisibility,
  postIndex,
}) => {

  const { state: AppState, } = useAppState();
  const { dispatch: HomeDispatch } = useHomeState();
  const { userProfile: user } = AppState;
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState({});
  const [reloadComments, setReloadComments] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const sendLike = async (post) => {
    if (!user) {
      toast.error('Please login to like the post');
      return;
    }
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

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_ROOT}/comment?postID=${post.postID}`);
      const data = await response.json();
      if (data.message === 'success') {
        delete data.message;
        setComments(Object.values(data));
        setReloadComments(false);
      }
    } catch (error) {
      toast.error('Error fetching comments');
    }
  }

  useEffect(() => {
    if (showComment || reloadComments) {
      fetchComments();
    }
  }, [showComment, reloadComments]);


  const handleShareClick = (post) => {
    setShowShareOptions(!showShareOptions);
  };

  const handleDropdownToggle = (index, postIndex) => {
    setShowActions(!showActions);
    setTimeout(() => {
      setShowActions(false);
    }, 4000);
  }

  const handleEditPost = (post) => {
    HomeDispatch({ type: 'SET_EDITING_POST', payload: post });
    HomeDispatch({ type: 'TOGGLE_SHOW_EDIT_POST', payload: true });
    setShowActions(false);
  };

  return (
    <div>
      <div className="bg-white border-b-2 border-double border-gray300">
        {user?.userID === post?.userID && (
          <div className="relative">
            <button className="absolute top-0 right-0 mt-2 mr-2 bg-white border border-gray-300 rounded-lg pr-1 pl-1"
              onClick={() => handleDropdownToggle(index, postIndex)}>...</button>
            {(showActions && postIndex === index) && (
              <div className="absolute top-0 right-0 mt-2 mr-2 bg-white border border-gray-300 rounded-lg pr-1 pl-1">
                <button className="text-blue-500 text-xs" onClick={() => handleEditPost(post)}>Edit</button>
                <button className="text-red-500 ml-2 text-xs" onClick={() => handleDeletePost(post)}>Delete</button>
              </div>
            )}
          </div>
        )}
        <PostHeader post={post} user={user} visibilityOptions={visibilityOptions} handleVisibility={handleVisibility} />
        <p className="text-sm font-semibold text-gray-500">{post.firstName} {post.lastName}</p>
        <p className="text-xs text-gray-500">@{post.username}</p>
      </div>
      <PostContent post={post} />

      <PostActions
        post={post}
        handleCommentClick={() => setShowComment(!showComment)}
        handleLikeClick={sendLike}
        handleShareClick={handleShareClick}
      />
      {showShareOptions && <ShareButtons post={post} />}
      <CommentSection
        post={post}
        user={user}
        comments={comments}
        showComment={showComment}
        setShowComment={setShowComment}
        setReloadComments={setReloadComments}
      />
    </div>
  );
}

export default PostTemplate;
