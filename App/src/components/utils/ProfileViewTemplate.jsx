
import Table from './ProfileViewTable';
import ProfileAvatar from './ProfileAvatar';
import React, { useState, useEffect } from 'react';

const ProfileTemplate = (props) => {
    const { userID } = props;
    const [profile, setProfile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);


    // Fetch Profile is repeated in ProfileViewTemplate.jsx
    // This is a good candidate for a custom hook
    const fetchProfile = async () => {
        try {
            const response = await fetch(`https://w20017074.nuwebspace.co.uk/kf6003API/profile?userID=${userID}`, {
                method: "GET"
            });
            const data = await response.json();
            console.log(typeof(data))
            console.log(data);
            const firstProfile = data[0];
            setProfile(firstProfile);
            setProfilePicture(
                <ProfileAvatar
                    imagePath={firstProfile.profilePicturePath}
                    firstName={firstProfile.firstName}
                    lastName={firstProfile.lastName}
                    userID={firstProfile.userID}
                />
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (!profile ) {
        return <h1>Loading...</h1>;
    } else {
        return (
            <>
                <div>
                    <h1 className="flex justify-center">{profile.firstName} {profile.lastName}</h1>
                </div>
                <div className="flex justify-center">
                    {profilePicture}
                </div>
                <div>
                    <Table
                        profile={profile}
                    />
                </div>
            </>
        );
    };

}

export default ProfileTemplate;