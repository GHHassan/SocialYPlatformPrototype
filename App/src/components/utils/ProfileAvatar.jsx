import React from 'react';
import {useNavigate} from 'react-router-dom';

const ProfileAvatar = ({ imagePath, userID, firstName, lastName }) => {
  
  const navigate = useNavigate();
  const hasImage = imagePath !== 'Private' && imagePath.trim() !== '';
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  const image = hasImage ? (
    <img
      className="object-cover w-full h-full"
      src={imagePath}
      alt={fullName}
    />
  ) : (
    <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600 font-semibold text-2xl">
      {initials}
    </div>
  );

  const handleClick = () => {
    if(userID === null || userID === undefined || userID === '') {
      return;
    }
    navigate(`/singleProfile/${userID}`);
  }
  return (
    <div>
      <div className="relative w-10 h-10 overflow-hidden rounded-full m-2 cursor-pointer"
        onClick={handleClick}
      >
        {image} 
      </div>
        <h4>{fullName}</h4>
    </div>
  );
};

export default ProfileAvatar;
