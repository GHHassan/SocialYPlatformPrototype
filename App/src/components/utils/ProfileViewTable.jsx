
import { useEffect, useState } from 'react';

const Table = (props) => {

    const [updated, setUpdated] = useState(false);
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

    useEffect(() => {
        if(updated) {
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
                    <td className="py-2 px-4 w-40">{value}</td>
                </tr>
            );
        } else if (publicParams.includes(key)) {
            rows.push(
                <tr key={key}>
                    <td className="py-2 px-4 w-40">{key}</td>
                    <td className="py-2 px-4 w-40">{value}</td>
                </tr>
            );
        }
    }

    return (
        <table>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default Table;
