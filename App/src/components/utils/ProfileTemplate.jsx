import ProfileAvatar from './ProfileAvatar';
import Table from './ProfileSettingTable';
import ErrorComponent from '../pageFractions/ErrorComponent';
import React, { useState, useEffect } from 'react';

const ProfileTemplate = (props) => {

    const { userID } = props;
    const [profile, setProfile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [Loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`https://w20017074.nuwebspace.co.uk/kf6003API/api/profile?userID=${userID}`, {
                method: "GET"
            });
            const data = await response.json();
            if (data.message !== "success") {
                setLoading(false);
                setError("profile " + data.message);
                return;
            }
            setLoading(false);
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

    const profileJSX = () => {
        if (error) {
            return (
                <ErrorComponent
                    message={error}
                />
            );
        }

        return (
            <>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
                    <div className="flex flex-col items-center">
                        {profilePicture}
                        <h2 className="text-2xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</h2>
                    </div>
                    <Table
                        profile={profile}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            {Loading ? <div>Loading...</div> : profileJSX()}
        </>
    );
};



export default ProfileTemplate;