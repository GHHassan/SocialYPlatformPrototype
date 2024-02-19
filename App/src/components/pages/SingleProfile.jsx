
import ProfileTemplate from '../utils/ProfileViewTemplate';
import { useParams } from 'react-router-dom';

const SingleProfile = () => {
    const { userID } = useParams();
    return (
        <div>
            < ProfileTemplate userID={userID} />
        </div>
    );
}

export default SingleProfile;
