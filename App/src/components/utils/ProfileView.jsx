
import ProfileViewTable from './ProfileViewTable';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { API_ROOT } from '../../Config';

const ProfileTemplate = () => {
    const { userID } = useParams();
    const [profile, setProfile] = useState(null);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_ROOT}/profile?userID=${userID}`, {
                method: "GET"
            });
            const data = await response.json();
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
                    <ProfileViewTable
                        profile={profile}
                    />
                </div>
            </>
        );
    };

}

export default ProfileTemplate;