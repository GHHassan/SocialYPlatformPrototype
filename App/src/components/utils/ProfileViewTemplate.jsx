
import Table from './ProfileViewTable';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const ProfileTemplate = () => {
    const { userID } = useParams();
    const [profile, setProfile] = useState(null);


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
                    <Table
                        profile={profile}
                    />
                </div>
            </>
        );
    };

}

export default ProfileTemplate;