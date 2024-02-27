import Select from '../pageFractions/Select';
import {useState } from 'react';

// fix the dropdown functionality
const ProfileSettingTable = (user) => {

    const [updated, setUpdated] = useState(false);
    const optionalValues = ['Public', 'Friends', 'Private'];
    const settingParams = [
        "profileID",
        "userID",
        "emailVisibility",
        "phoneNumberVisibility",
        "addressVisibility",
        "dateOfBirthVisibility",
        "genderVisibility",
        "relationshipStatusVisibility",
        "profilePicturePath",
        "coverPicturePath"
    ];
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
    ]
    const publicParams = [
        "firstName",
        "lastName",
        "bio",
        "website",
        "joinedDate",
    ]

    const handleSelectChange = (key, value) => {
        console.log(key, value);
        
    }

    if (user === undefined) {
        return (
            <div>
                <h1>Profile not found</h1>
            </div>
        );
    }
    const rows = Object.entries(user.user).map(([key, value]) => {
        if (!publicParams.includes(key) && privateParams.includes(key)) {
            return (
                <tr key={key} className='border-solid'>
                    <td className="py-2 px-4 w-40">{key}</td>
                    <td className="py-2 px-4 w-40">{value ?? ""}</td>
                    <td className="py-2 px-4 w-40">
                        <Select
                            value={key + 'Visibility'}
                            options={optionalValues}
                            onChange={handleSelectChange}
                            identifier={key}
                        />
                    </td>
                </tr>
            )
        } else if(publicParams.includes(key)) {
            // If the key is in the intersection, render only the text without Select
            return (
                <tr key={key}>
                    <td className="py-2 px-4 w-40">{key}</td>
                    <td className="py-2 px-4 w-40">{value ?? ""}</td>
                </tr>
            );
        }
    })
    return (
        <table className="border-separate border border-spacing-x-5">
            <thead>
                <tr>
                    <th className="py-2 px-4 w-40">Field</th>
                    <th className="py-2 px-4 w-40">Value</th>
                    <th className="py-2 px-4 w-40">Visibility</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default ProfileSettingTable;