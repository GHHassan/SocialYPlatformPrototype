import React, { useEffect, useState } from 'react';
import Select from '../pageFractions/Select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_ROOT } from '../../Config';
import { useUser } from "@clerk/clerk-react";
import { useAppState } from '../../contexts/AppStateContext';

const pictures = {
    newProfilePicture: null,
    newCoverPicture: null,
    profilePicturePath: '',
    coverPicturePath: '',
    newProfilePicturePath: '',
    newCoverPicturePath: '',
}

const inputErrors = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: '',
    bio: '',
    website: '',
    address: '',
};

const Settings = () => {
    const { state: AppState, dispatch: AppDispatch } = useAppState();
    const { signedInUser, userProfile } = AppState;
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState((userProfile || signedInUser) || {});
    const [errors, setErrors] = useState(inputErrors);
    const [loading, setLoading] = useState(true);
    let filesUploaded = false;
    const setUserId = () => {
        if (userInfo && userInfo.id) {
            const { id, hasProfile, isSignedIn, imageUrl, ...rest } = userInfo;
            const userID = id;
            setUserInfo({ ...rest, userID: userID, profilePicturePath: imageUrl });
        }
    };

    setUserId();

    useEffect(() => {
        if (Object.keys(userInfo).length > 0) {
            setLoading(false);
        }
    }, [userInfo, signedInUser, userProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleVisibilityChange = (fieldName, value) => {
        setUserInfo((prev) => ({ ...prev, [fieldName]: value }));
    };

    const uploadFile = async (imageFile, type) => {
        const body = new FormData();
        body.append('image', imageFile);
        const response = await fetch(`${API_ROOT}/upload`, {
            method: 'POST',
            body: body,
        });
        const data = await response.json();
        if (data.message === 'success') {
            if (type === 'profilePicture') {
                console.log('uploadFile: profilePicture:', data);
                setUserInfo((prev) => ({ ...prev, profilePicturePath: data.imageURL }));
                filesUploaded = true;
            } else if (type === 'coverPicture') {
                setUserInfo((prev) => ({ ...prev, coverPicturePath: data.imageURL }));
                console.log('uploadFile: coverPicture:', data);
                filesUploaded = true;
            }
            toast.success(`${type} Updated`);
        }
    };
    const updateProfile = async () => {
        const response = await fetch(`${API_ROOT}/profile`, {
            method: userProfile.hasProfile ? 'PUT' : 'POST',
            body: JSON.stringify(userInfo),
        });
        const data = await response.json();
        console.log('updateProfile: data:', data);
        console.log('body:', userInfo)
        if (data.message === 'success') {
            delete data.message;
            AppDispatch({ type: 'SET_USER_PROFILE', payload: userInfo });
            filesUploaded = false;
            toast.success('Profile Updated');
        } else {
            toast.error('Error uploading picture');
        }
    };

    const handleProfilePictureChange = (e) => {
        if (e.target.files.length > 0) {
            pictures.newProfilePicture = e.target.files[0];
            setUserInfo({
                ...userInfo,
                profilePicturePath: URL.createObjectURL(e.target.files[0]),
                oldProfilePicturePath: userInfo.profilePicturePath,
            });
        }
    };

    const handleCoverPictureChange = (e) => {
        if (e.target.files.length > 0) {
            pictures.newCoverPicture = e.target.files[0];
            setUserInfo({
                ...userInfo,
                coverPicturePath: URL.createObjectURL(e.target.files[0]),
                oldCoverPicturePath: userInfo.coverPicturePath,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pictures.newProfilePicture && pictures.newCoverPicture) {
            if (pictures.newProfilePicture) {
                await uploadFile(pictures.newProfilePicture, 'profilePicture');
                await uploadFile(pictures.newCoverPicture, 'coverPicture');
            }
        }else if (pictures.newProfilePicture) {
            await uploadFile(pictures.newProfilePicture, 'profilePicture');
        }else if (pictures.newCoverPicture) {
            await uploadFile(pictures.newCoverPicture, 'coverPicture');
        }else {
            updateProfile();
        }
    };

    useEffect(() => {
        if (filesUploaded) {
            updateProfile();
        }
    }, [filesUploaded]);

    const checkDuplicateUseName = async () => {
        const response = await fetch(`${API_ROOT}/profile?userID=${signedInUser.id}`);
        const data = await response.json();
        if (data.message === 'success') {
            const user = data[0];
            if (user.username !== userInfo.username) {
                setErrors((prev) => ({ ...prev, username: 'Username already exists try different username' }));
            }
        }
    }
    return (
        <div>
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
                                style={{ backgroundImage: `url(${userInfo.coverPicturePath})` }}
                            >
                                {!userInfo.coverPicturePath && (
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center font-semibold">
                                        <span>Upload Cover Picture</span>
                                    </div>
                                )}
                                {userInfo.coverPicturePath && (
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
                            First Name:
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
                    </div>

                    {/* Last Name */}
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
                            Last Name:
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={userInfo.lastName || ''}
                            onChange={handleInputChange}
                            onBlur={checkDuplicateUseName}
                            required
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <p className='text
                        ;red-500'>{errors.username}</p>
                    </div>

                    {/* Username */}
                    <div className="mb-4">
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-600">
                            Username:
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={userInfo.username || ''}
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <p className='text-red-500'>{errors.username}</p>
                    </div>

                    {/* Email -- Example already provided, included for completeness */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email:
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
                            Date of Birth:
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            value={userInfo.dateOfBirth || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <Select
                            options={['Private', 'Friends', 'Public']}
                            value={userInfo.dateOfBirthVisibility || 'Select'}
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
                            value={userInfo.genderVisibility || 'Select'}
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
                            value={userInfo.phoneNumberVisibility || 'Select'}
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
                            value={userInfo.address}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <Select
                            options={['Private', 'Friends', 'Public']}
                            value={userInfo.addressVisibility || 'Select'}
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
                            value={userInfo.relationshipStatus || 'Select'}
                            identifier='relationshipStatus'
                            onChange={handleVisibilityChange}
                        />
                        <Select
                            options={['Private', 'Friends', 'Public']}
                            value={userInfo.relationshipStatusVisibility || 'Select'}
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
                            value={userInfo.profileVisibility || 'Select'}
                            identifier='profileVisibility'
                            onChange={handleVisibilityChange}
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white rounded-md p-2" onClick={handleSubmit}>Submit</button>
                </form>
            )}
        </div>
    );
};

export default Settings;