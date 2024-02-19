import Select from '../pageFractions/Select';
import { useEffect, useState } from 'react';

const Table = (props) => {

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
        updateVisibility(key, value);
    }

    // send a put request to the server to update the visibility of the field
    const updateVisibility = async (key, value) => {
        try {
            console.log(JSON.stringify({ 'userID': props.profile.userID ,[key + 'Visibility']: value }))
            const response = await fetch(`https://w20017074.nuwebspace.co.uk/kf6003API/api/profile`, {
                method: "PUT",
                body: JSON.stringify({ 'userID': props.profile.userID ,[key + 'Visibility']: value }),
            });
            const data = await response.json();
            if(data.message === 'success') {
                setUpdated(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if(updated) {
            props.refresh();
            setUpdated(false);
        }
    }, [updated]);
    const rows = [];
    for (const [key, value] of Object.entries(props.profile)) {
        if (settingParams.includes(key)) continue;

        if (!publicParams.includes(key) && privateParams.includes(key)) {
            rows.push(
                <tr key={key} className='border-solid'>
                    <td className="py-2 px-4 w-40">{key}</td>
                    <td className="py-2 px-4 w-40">{value ?? ""}</td>
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
                    <td className="py-2 px-4 w-40">{value ?? ""}</td>
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