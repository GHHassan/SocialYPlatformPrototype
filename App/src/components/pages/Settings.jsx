import ProfileSettingTable from '../utils/ProfileSetttingTable';

const Settings = ({ signedIn, user }) => {

  return (
    <>
      {signedIn ? (
        <div>
          <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1> 
          </div>
            <>
              <ProfileSettingTable user={user} />
            </>
        </div>
      ) : (
        <div>
          <h1>Not signed in</h1>
        </div>
      )}
    </>

  )
}
export default Settings;
