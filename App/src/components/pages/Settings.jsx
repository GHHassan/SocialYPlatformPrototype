/**
 * @file Settings.jsx 
 * Is the profile setting page for the 
 * signed in user. It allows the user to
 * update their profile information.
 * 
 * @uses Select component to display the select options.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */
import React, { useEffect, useState } from 'react';
import Select from '../pageFractions/Select';
import { toast } from 'react-hot-toast';
import { API_ROOT } from '../../Config';
import { useAppState } from '../../contexts/AppStateContext';
import { deleteImage } from '../pageFractions/Post';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';

const pictures = {
    newProfilePicture: null,
    newCoverPicture: null,
    oldProfilePicturePath: '',
    oldCoverPicturePath: '',
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
    const { signedInUser, userProfile, signedIn } = AppState;
    const [userInfo, setUserInfo] = useState((userProfile || signedInUser));
    const [errors, setErrors] = useState(inputErrors);
    const [loading, setLoading] = useState(true);
    const ssoUser = useUser();
    const { signOut } = useAuth();
    const requiredFields = {
        firstName: userInfo?.firstName || '',
        lastName: userInfo?.lastName || '',
        username: userInfo?.username || '',
        email: userInfo?.email || '',
        dateOfBirth: userInfo?.dateOfBirth || '',
    };

    useEffect(() => {
        setProfilePicturePath();
        setLoading(false);
    }, [signedIn, pictures, signedInUser]);

    let method;
    if (userInfo && !userInfo?.hasProfile) {
        method = 'POST';
    } else {
        method = 'PUT';
    }

    const setProfilePicturePath = () => {

        if (method === 'POST' && !(pictures?.newProfilePicturePath)) {
            let profilePicturePath = ssoUser?.user?.imageUrl || pictures.newProfilePicturePath;
            setUserInfo((userInfo) => ({ ...userInfo, profilePicturePath }));
        } else if (method === 'PUT' && !userInfo?.profilePicturePath) {
            setUserInfo((userInfo) => ({ ...userInfo, profilePicturePath: ssoUser?.user?.imageUrl }));
        }
    };

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

    const uploadFile = async (imageFile, type) => {
        const body = new FormData();
        body.append('image', imageFile);
        const response = await fetch(`${API_ROOT}/upload`, {
            method: 'POST',
            body: body,
        })
        const data = await response.json();
        if (data.message === 'success') {
            if (type === 'profilePicture') {
                pictures.newProfilePicturePath = data.imageURL;
                setUserInfo({ ...userInfo, profilePicturePath: data.imageURL });
            } else if (type === 'coverPicture') {
                pictures.newCoverPicturePath = data.imageURL;
                setUserInfo({ ...userInfo, coverPicturePath: data.imageURL });
            }
        }
    }
    /** updating profile data */
    const updateProfile = async () => {
        try {
            if (pictures.newProfilePicture !== null) {
                await uploadFile(pictures.newProfilePicture, 'profilePicture');
                toast.success('Profile Picture Updated');
            }
        } catch (e) {
            toast.error('Error uploading profile', e.message);
        }
        try {
            if (pictures.newCoverPicture !== null) {
                await uploadFile(pictures.newCoverPicture, 'coverPicture');
                toast.success('Cover Picture Updated');
            }
        } catch (e) {
            toast.error('Error uploading cover picture', e.message);
        }

        try {
            const body = {
                "profileID": userInfo?.profileID,
                "userID": signedInUser.id,
                "firstName": userInfo?.firstName,
                "lastName": userInfo?.lastName,
                "username": userInfo?.username,
                "bio": userInfo?.bio,
                "website": userInfo?.website,
                "dateOfBirth": userInfo?.dateOfBirth,
                "gender": userInfo?.gender,
                "email": userInfo?.email,
                "phoneNumber": userInfo?.phoneNumber,
                "address": userInfo?.address,
                "profilePicturePath": pictures?.newProfilePicturePath || userInfo?.profilePicturePath,
                "coverPicturePath": pictures?.newCoverPicturePath || userInfo?.coverPicturePath,
                "relationshipStatus": userInfo?.relationshipStatus,

                "profileVisibility": userInfo?.profileVisibility,
                "emailVisibility": userInfo?.emailVisibility,
                "phoneNumberVisibility": userInfo?.phoneNumberVisibility,
                "addressVisibility": userInfo?.addressVisibility,
                "dateOfBirthVisibility": userInfo?.dateOfBirthVisibility,
                "genderVisibility": userInfo?.genderVisibility,
                "relationshipStatusVisibility": userInfo?.relationshipStatusVisibility,
            }
            const response = await fetch(`${API_ROOT}/profile`,
                {
                    method: method,
                    body: JSON.stringify(body),
                })
            const data = await response.json();
            if (data.message === 'success') {
                toast.success('Profile Updated');
                /** delete old images and clean up after update if applicable */
                if (userInfo.profilePicturePath !== null && userInfo.oldProfilePicturePath !== null) {
                    deleteImage(userInfo.oldProfilePicturePath);
                }
                if (userInfo?.coverPicturePath !== null && userInfo.oldCoverPicturePath !== null) {
                    deleteImage(userInfo.oldCoverPicturePath);
                }
                AppDispatch({ type: 'RELOAD_PROFILE', payload: true });
            } else {
                toast.error('Error updating profile Data', data.message);
            }
        } catch (e) {
            toast.error('Error updating profile Final catch', e.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateForm() ?? updateProfile();
    }

    const hasErrors = (error) => {
        return Object.values(error).some((value) => value !== '');
    }
    const validateForm = () => {
        Object.keys(requiredFields).forEach((key) => {
            if (requiredFields[key] === '') {
                setErrors((prev) => ({ ...prev, [key]: 'This field is required *' }));
            }
        });
        if (hasErrors(errors)) {
            toast.error('Please fill in all required fields');
            return false;
        }
    }

    function validateEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }


    const checkDuplicateUseName = async () => {
        const response = await fetch(`${API_ROOT}/register?userID=${signedInUser.id}`);
        const data = await response.json();
        if (data.message === 'success') {
            const user = data[0];
            if (user.username === userInfo.username) {
                setErrors((prev) => ({ ...prev, username: 'Username already exists try different username' }));
            }
        }
    }
    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your profile? it cannot be undone!')) {
            const deleteProfile = async () => {
                try {
                    const response = await fetch(`${API_ROOT}/profile?userID=${signedInUser.id}`, {
                        method: 'DELETE',
                    });
                    const data = await response.json();
                    if (data.message === 'success') {
                        toast.success('Profile Deleted');
                        await deleteImage(userInfo?.profilePicturePath);
                        await deleteImage(userInfo?.coverPicturePath);
                        await deleteAccount();
                    } else {
                        toast.error('Error deleting profile', data.message);
                    }
                } catch (e) {
                    toast.error('Error deleting profile', e.message);
                }
            }
            deleteProfile();
        }
    }

    const deleteAccount = async () => {
        try {
            const response = await fetch(`${API_ROOT}/register?userID=${signedInUser.id}`, {
                method: 'DELETE',
            });
            await response.json();
            if (response.status === 200) {
                toast.success('Account Deleted');
                if (ssoUser.isSignedIn) {
                    toast.success("Signed out successfully");
                    await signOut();
                    AppDispatch({ type: 'SET_UNAUTHENTICATED' });
                    AppDispatch({ type: 'REMOVE_TOKEN' });
                    toast.success("Signed out successfully");
                }
                if (localStorage.getItem("token")) {
                    AppDispatch({ type: 'REMOVE_TOKEN' });
                    AppDispatch({ type: 'SET_UNAUTHENTICATED' });
                    toast.success("Signed out successfully");
                    console.log('token removed')
                }
                window.location.href = "/kf6003/";
            }
        } catch (e) {
            toast.error('Error deleting account', e.message);
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
                            onBlur={checkDuplicateUseName}
                            required
                            className="mt-1 p-2 border rounded-md w-full"
                        />
                        <p className='text-red-500'>{errors.lastName}</p>
                    </div>

                    {/* Username */}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                            Username: *
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={userInfo.username || ''}
                            onChange={handleInputChange}
                            onBlur={checkDuplicateUseName}
                            required
                            // disabled={userInfo?.hasProfile}
                            className="mt-1 p-2 border rounded-md w-full"
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
                            value={userInfo.address || ''}
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