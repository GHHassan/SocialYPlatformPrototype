/**
 * @file OtherUsersProfile.jsx 
 * is the file where the profile of other users is displayed.
 * It is used to display the profile of other users when the user
 * clicks on the profile of other users.
 * 
 * This component will render a read-only profile and will not allow
 * the user to edit the profile of other users.
 * 
 * @uses ProfileTemplate to display the profile of the user.
 * @uses useParams from react-router-dom to get the userID from the URL.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 * 
 */
import { useEffect } from 'react';
import ProfileTemplate from '../utils/ProfileView';
import { useParams } from 'react-router-dom';
import { API_ROOT } from '../../Config';

const OtherUsersProfile = () => {
    const { userID } = useParams();
    switch (userID) {
        case 'undefined':
            return <h1>User Not found</h1>
        case userID.length > 15:
            return <h1>User Not found</h1>
    }

    let user = null;
    const prospectiveUser = async () => {
        const response = await fetch(`${API_ROOT}/profile?userID=${userID}`, {
            method: 'GET'
        })
        const data = await response.json();
        if (data.message === 'success') {
            user = data[0];
        } else {
            return <h1>User Not found</h1>
        }
    }

    useEffect(() => {
        prospectiveUser();
    }
        , []);

    return (
        <div>
            < ProfileTemplate userID={userID} user={user} />
        </div>
    );
}

export default OtherUsersProfile;
