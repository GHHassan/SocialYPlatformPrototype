import React, { useEffect } from 'react';
import ProfileAvatar from '../utils/ProfileAvatar';
import { useState } from 'react';
import { API_ROOT } from '../../Config';
import toast from 'react-hot-toast';
let token = localStorage.getItem('token');
import { useAppState } from '../../contexts/AppStateContext';
import { useHomeState } from '../../contexts/HomeStateContext';
const SUCCESS_MESSAGE = 'success';

function CommentItems({ comments }) {
  const commentsJSX = comments.length > 0 ? (
    comments.map((comment, index) => (
      <div key={index} className="mb-4 p-4 bg-white border border-gray-300 rounded-md">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-4">
            <ProfileAvatar
              imagePath={comment.profilePath}
              firstName={comment.username}
              lastName={""}
              userID={comment.userID}
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{comment.username}</h2>
            </div>

            <h3 className="text-sm text-gray-500">{comment.commentDateTime}</h3>
            <p className="text-base">{comment.commentContent}</p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4">
      <h1 className="text-xl font-semibold">No comments found</h1>
    </div>
  );

  return (
    <div>
      {commentsJSX}
    </div>
  );
}

function CommentSection({ post, showComment, comments, setReloadComments, setShowComment }) {
  const [commentContent, setCommentContent] = useState('');
  const { state: AppState, dispatch: AppDispatch } = useAppState();
  const { userProfile: user, isChatOpen } = AppState;
  const handleCommentChange = (e) => {
    setCommentContent(e.target.value); 
  }
  const postComment = async (post) => {
    if (!commentContent) return;
    const body = {
      "postID": post.postID,
      "userID": user.userID,
      "username": user.username,
      "profilePath": user.profilePicturePath,
      "name": `${user.firstName} ${user.lastName}`,
      "commentContent": commentContent,
    };
    try {
      const response = await fetch(`${API_ROOT}/comment`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.message === 'success') {
        toast.success('Comment posted successfully');
        setReloadComments(true);
        setCommentContent('');
      } else {
        setCommentContent('No comments found');
      }
    } catch (error) {
      toast.error('Error posting comment');
    }
  }

  const inputJSX = (
    <div className="flex items-center mb-4">
      <input type="text"
        className="border border-gray-300 rounded-lg p-2 w-full mr-2"
        placeholder="Write a comment..."
        value={commentContent}
        onChange={handleCommentChange}
        onClick={() => setShowComment(!showComment)}
      />
      <button
        type='submit'
        className="bg-blue-500 text-white rounded-lg p-2"
        onClick={() => postComment(post)}
      >
        Submit
      </button>
    </div>
  )
  return (
    <div>
      {user && inputJSX}
      {showComment && (
        <CommentItems
          comments={comments}
        />
      )}
    </div>
  )
}

export default CommentSection;