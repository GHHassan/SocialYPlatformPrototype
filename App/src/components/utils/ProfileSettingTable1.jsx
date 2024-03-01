import Select from '../pageFractions/Select';

// fix the dropdown functionality
const ProfileSettingTable = (user) => {

    console.log(user);
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

    const updatedParams = {};
    const saveChanges = () => {
        console.log("Changes saved");
        setUpdated(true);
    }
    const handleSelectChange = (key, value) => {
        updatedParams[key] = value;
        console.log(key, value);
        console.log(updatedParams);

    }

    const handleInputChange = (key, value) => {
        updatedParams[key] = value;
        console.log(key, value);
        console.log(updatedParams);
    }
    if (user === undefined) {
        return (
            <div>
                <h1>Profile not found</h1>
            </div>
        );
    }
    const rows = Object.entries(user.user).map(([key, value]) => {
        let char = key.charAt(0).toUpperCase();
        let setterKey = "set"+char + key.slice(1);
        console.log(setterKey);
        if (!publicParams.includes(key) && privateParams.includes(key)) {
            return (
                <tr key={key} className='border-solid'>
                    <td className="py-2 px-4 w-40">{key}</td>
                    <td className="py-2 px-4 w-40">
                        <input
                            type="text"
                            value={value ?? ""}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="w-40 bg-gray-200 border border-gray-500 rounded-md"
                        />
                    </td>
                    <td className="py-2 px-4 w-40">
                        <Select
                            options={optionalValues}
                            value={""}
                            identifier={key}
                            onChange={handleSelectChange}
                        />
                    </td>
                </tr>
            )
        } else if (publicParams.includes(key)) {
            // If the key is in the intersection, render only the text without Select
            return (
                <tr key={key}>
                    <td className="py-2 px-4 w-40">{key}</td>
                    <td className="py-2 px-4 w-40">
                        <input
                            type="text"
                            value={value ?? ""}
                            onChange={(e) => handleSelectChange(key, e.target.value)}
                            className="w-40 bg-gray-200 border border-gray-500 rounded-md"
                        />
                    </td>
                </tr>
            );
        }
    })
    return (
        <>
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
            <button className="bg-blue-500 rounded-md px-4 text-center text-sm hover:bg-sky-500 mt-4 mb-4"
                onClick={saveChanges}>Save Changes</button>
        </>
    );
}

export default ProfileSettingTable;