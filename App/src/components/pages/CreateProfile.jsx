import React, { useState } from 'react';

const CreateProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicturePath, setProfilePicturePath] = useState('');
  const [coverPicturePath, setCoverPicturePath] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');

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

  const handleGenderChange = (e) => {
    setGender(e.target.value);
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

  const handleProfilePicturePathChange = (e) => {
    setProfilePicturePath(e.target.value);
  };

  const handleCoverPicturePathChange = (e) => {
    setCoverPicturePath(e.target.value);
  };

  const handleRelationshipStatusChange = (e) => {
    setRelationshipStatus(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your logic to submit the form data to the server or perform any other actions
    console.log('Form Data:', {
      firstName,
      lastName,
      bio,
      website,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      address,
      profilePicturePath,
      coverPicturePath,
      relationshipStatus,
    });

    // Reset the form fields
    setFirstName('');
    setLastName('');
    setBio('');
    setWebsite('');
    setDateOfBirth('');
    setGender('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setProfilePicturePath('');
    setCoverPicturePath('');
    setRelationshipStatus('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
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
          type="text"
          id="dateOfBirthInput"
          value={dateOfBirth}
          onChange={handleDateOfBirthChange}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="genderInput" className="block text-sm font-medium text-gray-600">
          Gender:
        </label>
        <input
          type="text"
          id="genderInput"
          value={gender}
          onChange={handleGenderChange}
          className="mt-1 p-2 border rounded-md w-full"
        />
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
      </div>
      <div className="mb-4">
        <label htmlFor="profilePicturePathInput" className="block text-sm font-medium text-gray-600">
          Profile Picture Path:
        </label>
        <input
          type="text"
          id="profilePicturePathInput"
          value={profilePicturePath}
          onChange={handleProfilePicturePathChange}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="coverPicturePathInput" className="block text-sm font-medium text-gray-600">
          Cover Picture Path:
        </label>
        <input
          type="text"
          id="coverPicturePathInput"
          value={coverPicturePath}
          onChange={handleCoverPicturePathChange}
          className="mt-1 p-2 border rounded-md w-full"
        />
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
      </div>
      <button type="submit" className="bg-blue-500 text-white rounded-md p-2">Submit</button>
    </form>
  );
};

export default CreateProfile;
