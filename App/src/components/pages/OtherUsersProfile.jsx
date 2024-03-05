
import { useEffect } from 'react';
import ProfileTemplate from '../utils/ProfileViewTemplate';
import { useParams } from 'react-router-dom';
import { API_ROOT } from '../../Config';

const OtherUsersProfile = () => {
    const { userID } = useParams();
    let user = null;
    const prospectiveUser = async () => {
        const response = await fetch (`${API_ROOT}/profile?userID=${userID}`, {
            method: 'GET'
        })
        const data = await response.json();
        console.log(data);
        if (data.message === 'success') {
            user = data[0];
        }else {
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
