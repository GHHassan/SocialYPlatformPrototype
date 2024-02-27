
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import ProfileAvatar from '../utils/ProfileAvatar';
import ProfileSettingTable from '../utils/ProfileSettingTable';

const Profile = ({ signedIn, user, setUser }) => {

  const [loading, setLoading] = useState(true);

  return (
    <>
      {signedIn ? (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <div className="flex flex-col items-center">

            <>
              <ProfileAvatar
                imagePath={user?.imagePath ?? ""}
                userID={user?.userID}
                firstName={user?.firstName}
                lastName={user?.lastName}
                w={40}
                h={40}
              />
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.firstName} {user?.lastName}
              </h2>
              {console.log(user)}
              <ProfileSettingTable user={user} />
            </>
          </div>
        </div>
      ) : (
        <div>
          <h1>Not signed in</h1>
        </div>
      )}
    </>

  )
}
export default Profile;
