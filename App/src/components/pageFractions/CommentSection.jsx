/**
 * @file CommentSection.jsx 
 * is a component that displays the comments for a post 
 * and allows users to post comments.
 * It also allows users to edit and delete their comments.
 * It is used in the PostTemplate component that is 
 * responsible for rendering a single post.
 * 
 * @uses the CommentItem component to display and manage 
 * individual comments.
 * @uses the ProfileAvatar component to display the
 * profile picture of the user who posted the comment.
 * @uses the AppStateContext to access the user's profile information.
 * 
 * @author Hassan <w20017074>
 * 
 */
import ProfileAvatar from '../utils/ProfileAvatar';
import { useState } from 'react';
import { API_ROOT } from '../../Config';
import toast from 'react-hot-toast';
import { useAppState } from '../../contexts/AppStateContext';

function CommentItem({ comment, setReloadComments }) {
  const { state: AppState } = useAppState();
  const { userProfile: user } = AppState;
  const [showActions, setShowActions] = useState(false);
  const [showEditComment, setShowEditComment] = useState(false);
  const [commentContent, setCommentContent] = useState(comment?.commentContent);

  const handleDropdownToggle = () => {
    setShowActions(true);
    setTimeout(() => {
      setShowActions(false);
    }, 3000);
  }


  const editComment = async (comment) => {
    const response = await fetch(`${API_ROOT}/comment`, {
      method: 'PUT',
      body: JSON.stringify(comment),
    });
    const data = await response.json();
    if (data.message === 'success') {
      toast.success('Comment updated successfully');
      setReloadComments(true);
    } else {
      toast.error('Error updating comment');
    }
    setShowEditComment(!showEditComment);
  }


  const handleEditComment = async () => {
    const updatedComment = {...comment, commentContent: commentContent};
    editComment(updatedComment);
  }

  const handleEditCommentClick = () => {
    setShowEditComment(!showEditComment);
  }

  const handleDeleteComment = async (comment) => {
    const response = await fetch(`${API_ROOT}/comment?commentID=${comment.commentID}`,
      {
        method: 'DELETE',
      });
    const data = await response.json();
    if (data.message === 'success') {
      toast.success('Comment deleted successfully');
      setReloadComments(true);
    } else {
      toast.error('Error deleting comment');
    }
    setShowActions(!showActions);
  }

  const commentJSX =
    <div className="mb-4 p-4 bg-white border border-gray-300 rounded-md">
      {user?.userID === comment?.userID && (
        <div className="relative">
          <button className="absolute top-0 right-0 mt-2 mr-2 bg-white border border-gray-300 rounded-lg pr-1 pl-1"
            onClick={() => handleDropdownToggle()}>...</button>
          {(showActions) && (
            <div className="absolute top-0 right-0 mt-2 mr-2 bg-white border border-gray-300 rounded-lg pr-1 pl-1">
              <button className="text-blue-500 text-xs" onClick={handleEditCommentClick}>Edit</button>
              <button className="text-red-500 ml-2 text-xs" onClick={() => handleDeleteComment(comment)}>Delete</button>
            </div>
          )}
        </div>
      )}
      <div className="flex items-start">
        <div className="w-7 h-7 rounded-full overflow-hidden mr-4">
          <ProfileAvatar
            imagePath={comment.profilePath}
            firstName={comment.username}
            lastName={""}
            userID={comment.userID}
          />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold flex justify-between text-gray-500">{comment.firstName} {comment.lastName} @{comment.username}</p>
          <p className="text-xs font-semibold flex justify-between text-gray-500"></p>
          <p className="text-xs text-gray-500">{comment.commentDateTime}</p>
        </div>
      </div>
      {showEditComment ? (
        <>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-2 w-full mt-2"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white rounded-lg p-2 mt-2"
            onClick={handleEditComment}
          >
            Save
          </button>
        </>
      ) : (
        <p className="text-base">{comment.commentContent}</p>
      )}

    </div>

  return (
    <div>
      {commentJSX}
    </div>
  );
}

function CommentSection({ post, showComment, comments, setReloadComments, setShowComment }) {
  const { state: AppState } = useAppState();
  const { userProfile: user } = AppState;
  const [commentContent, setCommentContent] = useState('');

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  }
  const postComment = async (post) => {
    if (!commentContent) return;
    const body = {
      "postID": post.postID,
      "userID": user.userID,
      "username": user.username,
      "firstName": user.firstName,
      "lastName": user.lastName,
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

  const commentsJSX = Object.values(comments).length > 0 ?
    Object.values(comments).map((comment, index) => (
      <div key={index}>
        <CommentItem
          comment={comment}
          index={index}
          setReloadComments={setReloadComments}
        />
      </div>
    )) :
    [
      <div key="no-comments" className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4">
        <h1 className="text-xl font-semibold">No comments found</h1>
      </div>
    ];

  return (
    <div>
      {user && inputJSX}
      {showComment && (
        <div>
          {commentsJSX}
        </div>
      )}
    </div>
  )
}

export default CommentSection;