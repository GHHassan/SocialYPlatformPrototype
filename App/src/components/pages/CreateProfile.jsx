import React, { useState } from 'react';
import Select from '../pageFractions/Select';
import { jwtDecode } from "jwt-decode"
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
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [coverPictureFile, setCoverPictureFile] = useState(null);

  const [dateOfBirthVisibility, setDateOfBirthVisibility] = useState('Private');
  const [genderVisibility, setGenderVisibility] = useState('Private');
  const [emailVisibility, setEmailVisibility] = useState('Private');
  const [phoneNumberVisibility, setPhoneNumberVisibility] = useState('Private');
  const [addressVisibility, setAddressVisibility] = useState('Private');
  const [relationshipStatusVisibility, setRelationshipStatusVisibility] = useState('Private');
  const [profileVisibility, setProfileVisibility] = useState('Private');
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [coverPictureURL, setCoverPictureURL] = useState('');
  const options = ['Private', 'Friends', 'Public']
  let user = null;
  if (localStorage.getItem('token')) {
    user = jwtDecode(localStorage.getItem('token'))
  }

  const uploadFile = async (imageFile, setURL) => {
    const body = new FormData();
    body.append('image', imageFile);
    const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/upload', {
        method: 'POST',
        body: body,
    })
    const data = await response.json();
    if (data.message === 'success') {
      setURL(data.url);
    }
}

console.log('User:', user);
  const updateProfile = async () => {
    // Send a POST request to the server with the updated profile data
    const response = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/profile',
      {
        method: 'POST',
        body: JSON.stringify({
          "userID": user['sub'],
          "firstName": firstName,
          "lastName": lastName,
          "bio": bio,
          "website": website,
          "dateOfBirth": dateOfBirth,
          "gender": gender,
          "email": email,
          "phoneNumber": phoneNumber,
          "address": address,
          "profilePicturePath": profilePicturePath,
          "coverPicturePath": coverPicturePath,
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
    console.log(data);
    if (data.message === 'success') {
      console.log('Profile updated successfully');
      resetFormFields();
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

  const handleProfilePictureChange = (e) => {
    // Ensure that a file was selected
    if (e.target.files.length > 0) {
      uploadFile(e.target.files[0], setProfilePictureURL);
    }
  };

  const handleCoverPictureChange = (e) => {
    // Ensure that a file was selected
    if (e.target.files.length > 0) {
      uploadFile(e.target.files[0], setCoverPictureURL);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile();
  };

  const resetFormFields = () => {
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
            backgroundImage: `url(${coverPictureURL})`, // Use the cover picture path here
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
            backgroundImage: `url(${profilePictureURL})`, // Use the profile picture path here
          }}
        >
        </label>
      </div>

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

      {visibilityDropdown(options, dateOfBirthVisibility, 'Date of Birth Visibility', handleDateOfBirthVisibilityChange)}

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

      {visibilityDropdown(options, genderVisibility, 'Gender Visibility', handleGenderVisibilityChange)}
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
      {visibilityDropdown(options, emailVisibility, 'Email Visibility', handleEmailVisibilityChange)}
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
      {visibilityDropdown(options, phoneNumberVisibility, 'Phone Number Visibility', handlePhoneNumberVisibilityChange)}
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
      {visibilityDropdown(options, addressVisibility, 'Address Visibility', handleAddressVisibilityChange)}
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
      {visibilityDropdown(options, relationshipStatusVisibility, 'Relationship Status Visibility', handleRelationshipStatusVisibilityChange)}
      <button type="submit" className="bg-blue-500 text-white rounded-md p-2">Submit</button>
    </form>
  );
};

export default CreateProfile;
