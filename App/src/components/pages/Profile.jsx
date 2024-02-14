// Importing necessary libraries and components
import React, { useEffect, useState } from 'react';
import Table from '../utils/Table';

const Profile = () => {
  const [profile, setProfile] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch("https://w20017074.nuwebspace.co.uk/kf6003API/api/profile?userID=11", {
        method: "GET"
      });
      const data = await response.json();
      const firstProfile = data[0];
      setProfile(firstProfile);
  
      if (firstProfile && firstProfile.profilePicturePath !== 'Private') {
        setProfilePicture(
          <img
            alt="Profile"
            src={firstProfile.profilePicturePath}
            className="rounded-full h-20 w-20 object-cover"
          />
        );
      } else {
        let initials = firstProfile ? firstProfile.firstName.charAt(0) + firstProfile.lastName.charAt(0) : '';
        setProfilePicture(
          <div className="rounded-full h-20 w-20 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm">{initials}</span>
          </div>
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <div>
        <h1 className="flex justify-center">{profile.firstName} {profile.lastName}</h1>
      </div>
      <div className="flex justify-center">
        {profilePicture}
        <br />
      </div>
      <div>
        <Table
          profile={profile}
          setProfile={setProfile}
        />
      </div>
    </>
  );
};

export default Profile;
