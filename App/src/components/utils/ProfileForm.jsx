/**
 * @file ProfileForm.jsx 
 * This is a reusable component that renders a form for the user 
 * to fill in their profile information.
 * It takes in the following props:
 * 1. userInfo: An object containing the user's profile information.
 * 2. setUserInfo: A function to update the user's profile information.
 * 3. handleSubmit: A function to handle the form submission.
 * 4. loading: A boolean to indicate if the form is loading.
 * 5. userProfile: existing user profile information if applicable.
 * 6. errors: An object containing the form validation errors.
 * 7. setErrors: A function to update the form validation errors.
 * 8. pictures: An object containing the profile and cover pictures.
 * 9. handleDeleteAccount: A function to handle the deletion of the user's account.
 * 
 * This component uses the Select component to render dropdowns 
 * for the user to select the visibility of their profile information.
 * The component also uses the Global Constants API_ROOT to make requests to the backend.
 * 
 * @author Ghulam Hassan Hassan <w20017074@northumbria.ac.uk>
 * @genetated
 */

import React from 'react';
import Select from '../pageFractions/Select';
import { API_ROOT } from '../../Config';
const ProfileForm = ({ userInfo, setUserInfo, handleSubmit, loading, userProfile, errors, setErrors, pictures, handleDeleteAccount }) => {

    function validateEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
        if (value !== '') {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        if (name === 'email' && !validateEmail(value)) {
            setErrors((prev) => ({ ...prev, email: 'Invalid Email' }));
        }
    };

    const handleVisibilityChange = (fieldName, value) => {
        setUserInfo((prev) => ({ ...prev, [fieldName]: value }));
    };

    const handleProfilePictureChange = (e) => {
        if (e.target.files.length > 0) {
            pictures.newProfilePicture = e.target.files[0];
            pictures.newProfilePicturePath = e.target.files[0].name;
            setUserInfo({
                ...userInfo,
                oldProfilePicturePath: userInfo.profilePicturePath,
                profilePicturePath: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleCoverPictureChange = (e) => {
        if (e.target.files.length > 0) {
            pictures.newCoverPicture = e.target.files[0];
            pictures.newCoverPicturePath = e.target.files[0].name;
            setUserInfo({
                ...userInfo,
                coverPicturePath: URL.createObjectURL(e.target.files[0]),
                oldCoverPicturePath: userInfo?.coverPicturePath,
            });
        }
    };

    const checkDuplicateUseName = async () => {
        const response = await fetch(`${API_ROOT}/profile`);
        const data = await response.json();
        if (data.length > 0) {
            const user = data.find((user) => user.username === userInfo.username);
            if (user?.username === userInfo.username) {
                setErrors((prev) => ({ ...prev, username: 'Username already exists try different username' }));
            }
        }
    }

    return (
        <div >
            {!loading && (
                <form onSubmit={handleSubmit} className=" mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
                    <div>
                        {/* Cover Picture */}
                        <label htmlFor="coverPictureInput" className="block text-sm font-medium text-gray-600">
                            Cover Picture:
                        </label>
                        <div className="relative w-full h-36 overflow-hidden border border-gray-300 rounded-t-lg">
                            <input
                                type="file"
                                id="coverPictureInput"
                                onChange={handleCoverPictureChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <label
                                htmlFor="coverPictureInput"
                                className="cursor-pointer block w-full h-full bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${userInfo?.coverPicturePath})` }}
                            >
                                {!userInfo?.coverPicturePath && (
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center font-semibold">
                                        <span>Upload Cover Picture</span>
                                    </div>
                                )}
                                {userInfo?.coverPicturePath && (
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-white"
                                        onClick={() => {
                                            pictures.newCoverPicture = null
                                            setUserInfo({ ...userInfo, coverPicturePath: '' });
                                        }}
                                    >
                                        x
                                    </button>
                                )}
                            </label>
                        </div>

                        {/* Profile Picture */}
                        <input
                            type="file"
                            id="profilePictureInput"
                            onChange={handleProfilePictureChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <label
                            htmlFor="profilePictureInput"
                            className="cursor-pointer block w-16 h-16 bg-cover bg-center rounded-full border-2 -mt-8 mx-auto relative z-10"
                            style={{ backgroundImage: `url(${userInfo.profilePicturePath}` }}
                        >
                            {!userInfo.profilePicturePath && (
                                <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                                    {userInfo.firstName?.charAt(0) || ''}{userInfo.lastName?.charAt(0) || ''}
                                </span>
                            )}
                            {userInfo.profilePicturePath && (
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-white"
                                    onClick={() => {
                                        pictures.newProfilePicture = null
                                        setUserInfo({ ...userInfo, profilePicturePath: '' });
                                    }}
                                >
                                    x
                                </button>
                            )}
                        </label>
                    </div>

                    {/* Dynamic Form Fields Example: First Name and Email */}
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
                            First Name: *
                            {userProfile &&
                                <span className='px-2 py-2 pt-1 pb-1 rounded-md float-end bg-red-700 text-white text-pretty'
                                    onClick={handleDeleteAccount}>delete Account and profile</span>
                            }
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={userInfo.firstName || ''}
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <p className='text-red-500'>{errors.firstName}</p>
                    </div>

                    {/* Last Name */}
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
                            Last Name: *
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={userInfo.lastName || ''}
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <p className='text-red-500'>{errors.lastName}</p>
                    </div>

                    {/* Username */}
                    <div className="mb-4">
                        <label htmlFor="username" className={`block text-sm font-medium text-gray-600`}>
                            Username: *
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={userInfo?.username || ''}
                            onChange={handleInputChange}
                            onBlur={checkDuplicateUseName}
                            required
                            disabled={userInfo?.hasProfile}
                            className={`mt-1 p-2 border rounded-md w-full ${userInfo?.hasProfile ? 'bg-gray-100' : 'bg-inherit'}`}
                        />
                        <p className='text-red-500'>{errors.username}</p>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email: *
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={userInfo.email || ''}
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <p className='text-red-500'>{errors.email}</p>
                        <Select
                            options={['Private', 'Friends', 'Public', 'Select']}
                            value={userInfo.emailVisibility || 'Select'}
                            identifier="emailVisibility"
                            onChange={handleVisibilityChange}
                        />
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-600">
                            Bio:
                        </label>
                        <input
                            type="text"
                            name="bio"
                            id="bio"
                            value={userInfo.bio || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                    </div>

                    {/* Website */}
                    <div className="mb-4">
                        <label htmlFor="website" className="block text-sm font-medium text-gray-600">
                            Website:
                        </label>
                        <input
                            type="text"
                            name="website"
                            id="website"
                            value={userInfo.website || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="mb-4">
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-600">
                            Date of Birth: *
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            value={userInfo.dateOfBirth || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <p className='text-red-500'>{errors.dateOfBirth}</p>
                        <Select
                            options={['Private', 'Friends', 'Public']}
                            value={userInfo.dateOfBirthVisibility || 'Private'}
                            identifier='dateOfBirthVisibility'
                            onChange={handleVisibilityChange}
                        />
                    </div>

                    {/* Gender */}
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
                            Gender:
                        </label>
                        <Select
                            name="gender"
                            options={['Male', 'Female', 'LGBTQ', 'Prefer Not to Say']}
                            value={userInfo.gender || 'Select'}
                            identifier='gender'
                            onChange={handleVisibilityChange}
                        />
                        <Select
                            options={['Private', 'Friends', 'Public']}
                            value={userInfo.genderVisibility || 'Private'}
                            identifier='genderVisibility'
                            onChange={handleVisibilityChange}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-4">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">
                            Phone Number:
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={userInfo.phoneNumber || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <Select
                            options={['Private', 'Friends', 'Public']}
                            value={userInfo.phoneNumberVisibility || 'Friends'}
                            identifier='phoneNumberVisibility'
                            onChange={handleVisibilityChange}
                        />
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-600">
                            Address:
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={userInfo.address || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <Select
                            options={['Private', 'Friends', 'Public']}
                            value={userInfo.addressVisibility || 'Friends'}
                            identifier='addressVisibility'
                            onChange={handleVisibilityChange}
                        />
                    </div>

                    {/* Relationship Status */}
                    <div className="mb-4">
                        <label htmlFor="relationshipStatus" className="block text-sm font-medium text-gray-600">
                            Relationship Status:
                        </label>
                        <Select
                            name="relationshipStatus"
                            options={['Select', 'Single', 'In a Relationship', 'Engaged', 'Married', 'It\'s Complicated', 'Prefer Not to Say']}
                            value={userInfo.relationshipStatus || 'Friends'}
                            identifier='relationshipStatus'
                            onChange={handleVisibilityChange}
                        />
                        <Select
                            options={['Private', 'Friends', 'Public']}
                            value={userInfo.relationshipStatusVisibility || 'Friends'}
                            identifier='relationshipStatusVisibility'
                            onChange={handleVisibilityChange}
                        />
                    </div>

                    {/* Profile Visibility */}
                    <div className="mb-4">
                        <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-600">
                            Profile Visibility:
                        </label>
                        <Select
                            name="profileVisibility"
                            options={['Private', 'Friends', 'Public']}
                            value={userInfo.profileVisibility || 'Friends'}
                            identifier='profileVisibility'
                            onChange={handleVisibilityChange}
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white rounded-md p-2" onClick={handleSubmit}>Submit</button>
                </form>
            )}
        </div>
    )
}

export default ProfileForm;