import React from 'react';
import {useNavigate} from 'react-router-dom';
import OtherUsersProfile from '../pages/OtherUsersProfile';

const ProfileAvatar = ({ imagePath, userID, firstName, lastName, w, h }) => {
  
  const navigate = useNavigate();
  const hasImage = (imagePath !== 'Private' || imagePath === null || imagePath === '' || typeof(imagePath) === 'undefined' ) && imagePath !== '';
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  const image = hasImage ? (
    <img
      src={imagePath}
      alt={fullName}
    />
  ) : (
    <div className={`flex items-center justify-center w-${w} h-${h} bg-gray-300 text-gray-600 font-semibold text-2xl`}>
      <h4>{initials}</h4>
    </div>
  );

  const handleClick = () => {
    if(userID === null || userID === undefined || userID === '') {
      return;
    }
    navigate(`/profileViewTemplate/${userID}`);
  }
  
  return (
      <div 
        onClick={handleClick}
      >
        {image} 
      </div>
  );
};

export default ProfileAvatar;
