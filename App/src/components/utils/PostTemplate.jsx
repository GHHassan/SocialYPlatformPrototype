import React from 'react';
import ProfileAvatar from '../utils/ProfileAvatar';
import Select from '../pageFractions/Select';
import CommentSection from '../pageFractions/CommentSection';
import { API_ROOT } from '../../Config';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
let token = localStorage.getItem('token');

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
        <ProfileAvatar
          imagePath={post.profilePicturePath}
          firstName={post.firstName}
          lastName={post.lastName}
          userID={post.userID}
        />
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
  user,
  handleEditPost,
  handleDeletePost,
  handleVisibility,
  showActions,
}) => {

  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState({});
  const [reloadComments, setReloadComments] = useState(false);

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
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(body),
      });
      handleApiResponse(response, 'Like posted successfully');
    } catch (error) {
      console.error('Error during postLike:', error);
    }
  };

  // handle share click
  // open a popup wiht option to share on homepage or facebook, twitter, linkedin or copy link
  // handle share click
  const handleShareClick = (post) => {
    console.log('Share clicked:', post);
  
    const postUrl = `${window.location.origin}/post/${post.postID}`;
    const url = encodeURIComponent(postUrl);
    const title = encodeURIComponent(post.title);
  
    // Construct sharing URLs
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
    const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`;
    const textMessageUrl = `sms:?body=${encodeURIComponent(title + " " + url)}`;
  
    // Prompt for the user's choice
    const choice = prompt('Choose an option to share:\n1. Homepage\n2. Facebook\n3. Twitter\n4. LinkedIn\n5. Copy Link\n6. WhatsApp\n7. Text Message');
  
    switch (choice) {
      case '1':
        console.log('Sharing on Homepage is not implemented.');
        break;
      case '2':
        window.open(facebookUrl, '_blank');
        break;
      case '3':
        window.open(twitterUrl, '_blank');
        break;
      case '4':
        window.open(linkedInUrl, '_blank');
        break;
      case '5':
        navigator.clipboard.writeText(postUrl)
          .then(() => alert('Link copied to clipboard!'))
          .catch(err => console.error('Error copying link:', err));
        break;
      case '6':
        window.open(whatsAppUrl, '_blank');
        break;
      case '7':
        window.open(textMessageUrl, '_blank');
        break;
      default:
        alert('Invalid choice.');
    }
  };
  

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_ROOT}/comment?postID=${post.postID}`);
      const data = await response.json();
      if (data.message === 'success') {
        delete data.message;
        setComments(Object.values(data));
        setShowComment(true);
      } else {
        setComments({ 'message': 'No comments found' });
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
  return (
    <div>
      <div className="bg-white border-b-2 border-double border-gray300">
        {user?.userID === post?.userID && (
          <div className="relative">
            <button className="absolute top-0 right-0 mt-2 mr-2 bg-white border border-gray-300 rounded-lg pr-1 pl-1"
              onClick={() => handleDropdownToggle(index)}>...</button>
            {(dropdownIndex === index && showActions) && (
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
        handleCommentClick={()=> setShowComment(!showComment)}
        handleLikeClick={sendLike}
        handleShareClick={handleShareClick}
      />
      <CommentSection
        post={post}
        user={user}
        comments={comments}
        setComments={setComments}
        showComment={showComment}
        setShowComment={setShowComment}
        setReloadComments={setReloadComments}
      />
    </div>
  );
}

export default PostTemplate;
