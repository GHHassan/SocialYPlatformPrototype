import ProfileAvatar from './ProfileAvatar';
import Table from './ProfileSettingTable';
import ErrorComponent from '../pageFractions/ErrorComponent';
import React, { useState, useEffect } from 'react';

const ProfileTemplate = (user) => {

    // const { userID } = props;
    const [profile, setProfile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    // const [Loading, setLoading] = useState(true);

    // const profileAvatar = (
    //     <ProfileAvatar
    //         imagePath={user.profilePicturePath}
    //         firstName={user.firstName}
    //         lastName={user.lastName}
    //         userID={user.userID}
    //     />
    // )
    console.log(user);
    const profileJSX = () => {

        return (
            <>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
                    <div className="flex flex-col items-center">
                        {/* {profileAvatar} */}
                        <h2 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
                    </div>
                    <Table
                        profile={user}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            {profileJSX()}
        </>
    );
};



export default ProfileTemplate;