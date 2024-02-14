import Select from '../pageFractions/Select';
import { useEffect } from 'react';

const Table = (props) => {

    const optionalValues = ['Public', 'Friends', 'Private'];
    const settingParams = [
        "username",
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
        updateVisibility(key, value);
    }

    // send a put request to the server to update the visibility of the field
    const updateVisibility = async (key, value) => {
        const newKey = (key === 'profileVisibility') ? [key]: key + 'Visibility';
        if (props.profile.hasOwnProperty(newKey)) {
            props.setProfile((prevVisibility) => ({
                ...prevVisibility,
                [newKey]: value,
            }));
        } else {
            console.log(`${newKey} does not exist in props.profile`);
        }
    };

    useEffect(() => {
        if (props.profile.userID === undefined) return;

        try {
            const response = fetch(`https://w20017074.nuwebspace.co.uk/kf6003API/api/profile?userID=${props.profile.userID}`, {
                method: "PUT",
                body: JSON.stringify(props.profile),
            });
            console.log(response.message);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [props.profile]);

    const rows = [];
    for (const [key, value] of Object.entries(props.profile)) {
        if (settingParams.includes(key)) continue;

        // Check if the key is not included in the intersection of publicData and includes
        if (!publicParams.includes(key) && privateParams.includes(key)) {
            rows.push(
                <tr key={key} className='border-solid'>
                    <td className="py-2 px-4 w-40">{key}</td>
                    <td className="py-2 px-4 w-40">{value}</td>
                    <td className="py-2 px-4 w-40">
                        <Select
                            value={props.profile[key + 'Visibility']}
                            options={optionalValues}
                            onChange={handleSelectChange}
                            identifier={key}
                        />
                    </td>
                </tr>
            );
        } else {
            // If the key is in the intersection, render only the text without Select
            rows.push(
                <tr key={key}>
                    <td className="py-2 px-4 w-40">{key}</td>
                    <td className="py-2 px-4 w-40">{value}</td>
                </tr>
            );
        }
    }

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

export default Table;
