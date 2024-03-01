import React, { useState } from 'react';
import Select from '../pageFractions/Select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
const CreateProfile = ({ user }) => {

    if (!user) {
        return <div>user Not found</div>;
    }
    // console.log('user from create profile = '+ user.userID + ' ' + user.profileID)
    const [firstName, setFirstName] = useState(user.firstName ?? '');
    const [lastName, setLastName] = useState(user.lastName ?? '');
    const [bio, setBio] = useState(user.bio ?? '');
    const [website, setWebsite] = useState(user.website ?? '');
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth ?? '');
    const [gender, setGender] = useState(user.gender ?? '');
    const [email, setEmail] = useState(user.email ?? '');
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '');
    const [address, setAddress] = useState(user.address ?? '');
    const [relationshipStatus, setRelationshipStatus] = useState(user.relationshipStatus ?? '');
    const [profilePicturePath, setProfilePicturePath] = useState(user.profilePicturePath ?? '');
    const [coverPicturePath, setCoverPicturePath] = useState(user.coverPicturePath ?? '');
    // setting states for visibility
    const [dateOfBirthVisibility, setDateOfBirthVisibility] = useState(user.dateOfBirthVisibility ?? '');
    const [genderVisibility, setGenderVisibility] = useState(user.genderVisibility ?? '');
    const [emailVisibility, setEmailVisibility] = useState(user.emailVisibility ?? '');
    const [phoneNumberVisibility, setPhoneNumberVisibility] = useState(user.phoneNumberVisibility ?? '');
    const [addressVisibility, setAddressVisibility] = useState(user.addressVisibility ?? '');
    const [relationshipStatusVisibility, setRelationshipStatusVisibility] = useState(user.relationshipStatusVisibility ?? '');
    const [profileVisibility, setProfileVisibility] = useState(user.profileVisibility ?? '');
    const [profilePicture, setProfilePicture] = useState(user.profilePicture ?? '');
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [newCoverPicture, setNewCoverPicture] = useState(null);
    const [coverPicture, setCoverPicture] = useState(user.coverPicturePath ?? '');
    const options = ['Private', 'Friends', 'Public']
    const navigate = useNavigate();

    let profilePictureURL = null;
    let coverPicturePathURL = null;

    const uploadFile = async (imageFile, type) => {
        const body = new FormData();
        body.append('image', imageFile);
        const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/upload', {
            method: 'POST',
            body: body,
        })
        const data = await response.json();
        if (data.message === 'success') {
            if (type === 'profilePicture') {
                profilePictureURL = data.imageURL;
            } else if (type === 'coverPicture') {
                coverPicturePathURL = data.imageURL;
            }
            console.log('Image uploaded successfully:', data.imageURL);
        }
    }

    //upload profile and cover pictures
    const updateProfile = async () => {

        if (newProfilePicture) {
            await uploadFile(newProfilePicture, 'profilePicture');
            toast.success('Profile Picture Updated');
        }

        if (newCoverPicture) {
            await uploadFile(newCoverPicture, 'coverPicture');
            toast.success('Cover Picture Updated');
        }
        // Send a POST request to the server with the updated profile data
        const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/profile',
            {
                method: 'PUT',
                body: JSON.stringify({
                    "userID": user.userID,
                    "firstName": firstName,
                    "lastName": lastName,
                    "bio": bio,
                    "website": website,
                    "dateOfBirth": dateOfBirth,
                    "gender": gender,
                    "email": email,
                    "phoneNumber": phoneNumber,
                    "address": address,
                    "profilePicturePath": profilePictureURL,
                    "coverPicturePath": coverPicturePathURL,
                    "relationshipStatus": relationshipStatus,

                    "profileVisibility": profileVisibility,
                    "emailVisibility": emailVisibility,
                    "phoneNumberVisibility": phoneNumberVisibility,
                    "addressVisibility": addressVisibility,
                    "dateOfBirthVisibility": dateOfBirthVisibility,
                    "genderVisibility": genderVisibility,
                    "relationshipStatusVisibility": relationshipStatusVisibility,
                }),
            })
        const data = await response.json();
        if (data.message === 'success') {
            toast.success('Profile Updated');
        } else if (data.message === "user already exists (Forbidden)") {
            navigate('/settings:userID');
        }
    }

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };


    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleWebsiteChange = (e) => {
        setWebsite(e.target.value);
    };

    const handleDateOfBirthChange = (e) => {
        setDateOfBirth(e.target.value);
    };

    const handleGenderChange = (identifier, value) => {
        console.log(identifier, value);
        setGender(value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleRelationshipStatusChange = (e) => {
        setRelationshipStatus(e.target.value);
    };

    const handleDateOfBirthVisibilityChange = (identifier, value) => {
        console.log(identifier, value);
        setDateOfBirthVisibility(value);
    }

    const handleGenderVisibilityChange = (identifier, value) => {
        console.log(identifier, value);
        setGenderVisibility(value);
    }

    const handleEmailVisibilityChange = (identifier, value) => {
        console.log(identifier, value);
        setEmailVisibility(value);
    }

    const handlePhoneNumberVisibilityChange = (identifier, value) => {
        console.log(identifier, value);
        setPhoneNumberVisibility(value);
    }

    const handleAddressVisibilityChange = (identifier, value) => {
        console.log(identifier, value);
        setAddressVisibility(value);
    }

    const handleRelationshipStatusVisibilityChange = (identifier, value) => {
        console.log(identifier, value);
        setRelationshipStatusVisibility(value);
    }

    const handleProfileVisibilityChange = (identifier, value) => {
        console.log(identifier, value);
        setProfileVisibility(value);
    }

    const handleProfilePictureChange = (e) => {
        // Ensure that a file was selected
        if (e.target.files.length > 0) {
            setProfilePicture((prevProfilePicture) => {
                setNewProfilePicture(e.target.files[0])
                console.log('Previous Profile Picture:', prevProfilePicture);
                const newProfilePicture = e.target.files[0];
                console.log('New Profile Picture:', newProfilePicture);
                setProfilePicturePath(URL.createObjectURL(newProfilePicture));
                return newProfilePicture;
            });
        }
    };

    const handleCoverPictureChange = (e) => {
        // Ensure that a file was selected
        if (e.target.files.length > 0) {
            setCoverPicture((prevCoverPicture) => {
                setNewCoverPicture(e.target.files[0])
                console.log('Previous Cover Picture:', prevCoverPicture);
                const newCoverPicture = e.target.files[0];
                console.log('New Cover Picture:', newCoverPicture);
                setCoverPicturePath(URL.createObjectURL(newCoverPicture));
                return newCoverPicture;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(profilePicture, coverPicture);
    };


    const visibilityDropdown = (options, value, identifier, onChange) => {
        return (
            <div >
                <label htmlFor={identifier} className="block text-sm font-medium text-gray-600">
                    {identifier}
                </label>

                <Select
                    options={options}
                    value={value}
                    identifier={identifier}
                    onChange={onChange}
                />

            </div>
        )
    }


    return (
        <form onSubmit={handleSubmit} className=" mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
            {/* profile and cover Pictures */}
            <div>
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
                    className="cursor-pointer block mb-4 relative w-full h-44 bg-cover bg-center rounded-md"
                    style={{
                        backgroundImage: `url(${coverPicturePath})`, // Use the cover picture path here
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-semibold">Change Cover Picture</span>
                    </span>
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
                    className="cursor-pointer block w-16 h-16 bg-cover bg-center rounded-full border-4 border-black -mt-8 mx-auto"
                    style={{
                        backgroundImage: `url(${profilePicturePath})`, // Use the profile picture path here
                    }}
                >
                </label>
            </div>

            {/* Profile form fields */}
            <div className="mb-4">
                <label htmlFor="firstNameInput" className="block text-sm font-medium text-gray-600">
                    First Name:
                </label>
                <input
                    type="text"
                    id="firstNameInput"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    required
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="lastNameInput" className="block text-sm font-medium text-gray-600">
                    Last Name:
                </label>
                <input
                    type="text"
                    id="lastNameInput"
                    value={lastName}
                    onChange={handleLastNameChange}
                    required
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="bioInput" className="block text-sm font-medium text-gray-600">
                    Bio:
                </label>
                <input
                    type="text"
                    id="bioInput"
                    value={bio}
                    onChange={handleBioChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="websiteInput" className="block text-sm font-medium text-gray-600">
                    Website:
                </label>
                <input
                    type="text"
                    id="websiteInput"
                    value={website}
                    onChange={handleWebsiteChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="dateOfBirthInput" className="block text-sm font-medium text-gray-600">
                    Date of Birth:
                </label>
                <input
                    type="date"
                    id="dateOfBirthInput"
                    value={dateOfBirth}
                    onChange={handleDateOfBirthChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
                {visibilityDropdown(options, dateOfBirthVisibility, 'Date of Birth Visibility', handleDateOfBirthVisibilityChange)}
            </div>

            <div className="mb-4">
                <label htmlFor="genderInput" className="block text-sm font-medium text-gray-600">
                    Gender:
                </label>
                <div className="mt-1 p-2 border rounded-md w-full">
                    {visibilityDropdown(['Male', 'Female', 'LGBTQ', 'Prefer Not to say'], gender, '', handleGenderChange)}
                </div>
                {visibilityDropdown(options, genderVisibility, 'Gender Visibility', handleGenderVisibilityChange)}
            </div>

            <div className="mb-4">
                <label htmlFor="emailInput" className="block text-sm font-medium text-gray-600">
                    Email:
                </label>
                <input
                    type="email"
                    id="emailInput"
                    value={email}
                    onChange={handleEmailChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
                {visibilityDropdown(options, emailVisibility, 'Email Visibility', handleEmailVisibilityChange)}
            </div>

            <div className="mb-4">
                <label htmlFor="phoneNumberInput" className="block text-sm font-medium text-gray-600">
                    Phone Number:
                </label>
                <input
                    type="tel"
                    id="phoneNumberInput"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
                {visibilityDropdown(options, phoneNumberVisibility, 'Phone Number Visibility', handlePhoneNumberVisibilityChange)}
            </div>

            <div className="mb-4">
                <label htmlFor="addressInput" className="block text-sm font-medium text-gray-600">
                    Address:
                </label>
                <input
                    type="text"
                    id="addressInput"
                    value={address}
                    onChange={handleAddressChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
                {visibilityDropdown(options, addressVisibility, 'Address Visibility', handleAddressVisibilityChange)}
            </div>

            <div className="mb-4">
                <label htmlFor="relationshipStatusInput" className="block text-sm font-medium text-gray-600">
                    Relationship Status:
                </label>
                <input
                    type="text"
                    id="relationshipStatusInput"
                    value={relationshipStatus}
                    onChange={handleRelationshipStatusChange}
                    className="mt-1 p-2 border rounded-md w-full"
                />
                {visibilityDropdown(options, relationshipStatusVisibility, 'Relationship Status Visibility', handleRelationshipStatusVisibilityChange)}
            </div>

            <div className="mb-4">
                <label htmlFor="genderInput" className="block text-sm font-medium text-gray-600">
                    Profile Visibility:
                </label>
                <div className="mt-1 p-2 border rounded-md w-full">
                    {visibilityDropdown(options, profileVisibility, '', handleProfileVisibilityChange)}
                </div>
            </div>


            <button type="submit" className="bg-blue-500 text-white rounded-md p-2">Submit</button>

        </form>
    );
};

export default CreateProfile;
