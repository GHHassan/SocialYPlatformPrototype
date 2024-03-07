import React from 'react';
import ProfileAvatar from '../utils/ProfileAvatar';

function CommentSection({ comments }) {
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

export default CommentSection;
