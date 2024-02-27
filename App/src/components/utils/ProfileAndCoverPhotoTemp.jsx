import {FontAwesomeIcon} from  "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons";

const ProfileAndCoverPhotoTemp = ({ handleProfilePictureChange, handleCoverPictureChange, profilePicturePath, coverPicturePath }) => {
    return (
        <div>
            {/* Cover Picture */}
            <label htmlFor="coverPictureInput" className="block text-sm font-medium text-gray-600">
                Cover Picture:
            </label>
            <input
                type="file"
                id="coverPictureInput"
                onChange={handleCoverPictureChange}
                accept="image/*"
                className="hidden"
            />
            <label
                htmlFor="coverPictureInput"
                className="cursor-pointer block mb-4 relative w-full h-32 bg-cover bg-center rounded-md"
                style={{
                    backgroundImage: `url(${coverPicturePath})`, // Use the cover picture path here
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <span className="absolute inset-0 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
                </span>
            </label>

            {/* Profile Picture */}
            <label htmlFor="profilePictureInput" className="block text-sm font-medium text-gray-600">
                Profile Picture:
            </label>
            <input
                type="file"
                id="profilePictureInput"
                onChange={handleProfilePictureChange}
                accept="image/*"
                className="hidden"
            />
            <label
                htmlFor="profilePictureInput"
                className="cursor-pointer block w-16 h-16 bg-cover bg-center rounded-full border-4 border-white -mt-8 mx-auto"
                style={{
                    backgroundImage: `url(${profilePicturePath})`, // Use the profile picture path here
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <span className="absolute inset-0 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
                </span>
            </label>
        </div>
    )
}

export default ProfileAndCoverPhotoTemp