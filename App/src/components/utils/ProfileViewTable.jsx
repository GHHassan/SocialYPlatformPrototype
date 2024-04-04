import React from 'react';

const ProfileViewTable = (profile) => {
    const newProfile = profile.profile;
    const privateParams = [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "address",
        "dateOfBirth",
        "gender",
        "relationshipStatus",
        "website",
        "joinedDate",
        "profileVisibility",
    ];
    const publicParams = [
        "firstName",
        "lastName",
        "bio",
        "website",
        "joinedDate",
    ];

    const rows = [];
    if (newProfile['profileVisibility'] !== 'Private') {
        for (const [key, value] of Object.entries(newProfile)) {
            if (!publicParams.includes(key) && privateParams.includes(key)) {
                rows.push(
                    <tr key={key} className="border-b border-gray-200">
                        <td className="py-3 px-6 w-1/3">{key}</td>
                        <td className="py-3 px-6 w-2/3">
                            {newProfile[key + "Visibility"] !== 'Private' ? value : 'Locked'}
                        </td>
                    </tr>
                );
            } else if (publicParams.includes(key)) {
                rows.push(
                    <tr key={key} className="border-b border-gray-200">
                        <td className="py-3 px-6 w-1/3">{key}</td>
                        <td className="py-3 px-6 w-2/3">{value}</td>
                    </tr>
                );
            }
        }
    } else {
        rows.push(
            <tr key={'locked'} className="border-b border-gray-200">
                <td className="py-3 px-6 w-full">
                    {newProfile.firstName + ' ' + newProfile.lastName}'s has locked {newProfile['gender'] === 'Male' ? <span>his</span> : newProfile['gender'] === 'Female' ? <span>her</span> : <span>their</span>} profile
                </td>

            </tr>
        );
    }
    // Check if profilePicturePath is null
    const profilePictureStyle = {
        backgroundImage: `url(${newProfile.profilePicturePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
    };

    return (
        <div>
            {/* Cover Picture */}
            <div className="mb-20">
                <label htmlFor="coverPictureInput" className="block text-sm font-medium text-gray-600">
                    Cover Picture:
                </label>
                <img
                    src={newProfile.coverPicturePath}
                    alt="CoverPicture"
                    className="w-full h-36 object-cover border border-gray-300 rounded-t-lg"
                />

                {/* Overlay Profile Picture */}
                <div className='relative'>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div style={profilePictureStyle}>
                            {newProfile.profilePicturePath ? null : (
                                <span className="text-2xl font-bold text-gray-500">
                                    {newProfile.firstName?.charAt(0) || ''}{newProfile.lastName?.charAt(0) || ''}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Contents */}
            <table className="min-w-full bg-white border border-gray-300">
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};

export default ProfileViewTable;
