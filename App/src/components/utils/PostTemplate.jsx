import ProfileAvatar from '../utils/ProfileAvatar';
import Select from '../pageFractions/Select';

const PostTemplate = ({
    post,
    index,
    visibilityOptions,
    user,
    handleDropdownToggle,
    dropdownIndex,
    handleEditPost,
    handleDeletePost,
    handleVisibility,
    handleLikeClick,
    handleShareClick,
    handleCommentClick
}) => {
    console.log('Post:', post);
    return (
        <div >
            <div className="bg-gray-100 border-b-2 border-double border-gray300 pt-4">
                {user.userID === post.userID && (
                    <div className="relative">
                        <button className="absolute top-0 right-0 mt-2 mr-2 bg-white border border-gray-300 rounded-lg p-2"
                            onClick={() => handleDropdownToggle(index)}>...</button>
                        {dropdownIndex === index && (
                            <div className="absolute top-0 right-0 mt-2 mr-2 bg-white border border-gray-300 rounded-lg p-2">
                                <button className="text-blue-500" onClick={() => handleEditPost(post)}>Edit</button>
                                <button className="text-red-500 ml-2" onClick={() => handleDeletePost(post)}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
                {/* Post body */}
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
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <p className="text-sm text-gray-500">{post.postDateTime}</p>
                                {user.userID === post.userID ? (
                                    <p className="text-sm text-gray-500" >Audience:
                                        <span className="text-sm text-gray-500 ml-4" >
                                            <Select
                                                options={visibilityOptions}
                                                value={post.visibility}
                                                identifier={post}
                                                onChange={handleVisibility}
                                            />
                                        </span>
                                    </p>) : (<p className="text-sm text-gray-500 mr-4" >Audience:
                                        <span className="text-sm text-gray-500 ml-4" >
                                            {post.visibility}
                                        </span>
                                    </p>)}
                                <p className="text-sm text-gray-500">Location:
                                    <span className="text-sm text-gray-500 ml-4" >
                                        {post.location}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-lg font-semibold text-gray-500">{post.firstName} {post.lastName}</p>
                <p className="text-sm text-gray-500">@{post.username}</p>
            </div>
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

            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <button className="text-blue-500"
                        onClick={handleLikeClick}
                    >Like</button>
                    <button className="text-blue-500 ml-2"
                        onClick={handleCommentClick}
                    >Comment</button>
                    <button className="text-blue-500 ml-2"
                        onClick={handleShareClick}
                    >Share</button>
                </div>
            </div>
            <div className="flex items-center">
                <input type="text" className="border border-gray-300 rounded-lg p-2 w-full mr-2" placeholder="Write a comment..." />
                <button className="bg-blue-500 text-white rounded-lg p-2">Post</button>
            </div>
            {/* Post comments */}

        </div>
    )
}
export default PostTemplate;