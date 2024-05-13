/**
 * @file ProfileView.jsx 
 * Thisis a reusable component that displays the profile of a user.
 * It takes in a userID as a parameter and fetches the profile of the user from the database.
 * It then displays the profile in a table format.
 * 
 * @uses ProfileViewTable - A table that displays the profile of a user.
 * @param {string} userID - The userID of the user whose profile is to be displayed.
 * @returns {JSX.Element} - A table displaying the profile of the user.
 * @author Ghulam Hassan Hassani <w20017074@northumbria.ac.uk>
 * 
 */
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
        return <h1>Profile Not Found</h1>;
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