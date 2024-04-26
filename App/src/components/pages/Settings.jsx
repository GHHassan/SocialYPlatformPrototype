/**
 * @file Settings.jsx 
 * Is the profile setting page for the 
 * signed in user. It allows the user to
 * set/update their profile information.
 * 
 * @uses the ProfileForm component to display the profile form.
 * @author Ghulam Hassan Hassani <w20017074>
 * 
 */

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_ROOT } from '../../Config';
import { useAppState } from '../../contexts/AppStateContext';
import { deleteImage } from '../pageFractions/Post';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import ProfileForm from '../utils/ProfileForm';

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
}

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
                "relationshipStatus": userInfo?.relationshipStatus,
                "profilePicturePath": pictures?.newProfilePicturePath || userInfo?.profilePicturePath,
                 "coverPicturePath": pictures?.newCoverPicturePath || userInfo?.coverPicturePath,
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
                }
                window.location.href = "/kf6003/";
            }
        } catch (e) {
            toast.error('Error deleting account', e.message);
        }
    }

    return (
        <ProfileForm
            userInfo={userInfo}
            errors={errors}
            loading={loading}
            userProfile={userProfile}
            setUserInfo={setUserInfo}
            pictures={pictures}
            setErrors={setErrors}
            handleSubmit={handleSubmit}
            handleDeleteAccount={handleDeleteAccount}
        />
    );
};

export default Settings;