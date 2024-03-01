import React, { useState } from 'react';
import Select from '../pageFractions/Select';
import { jwtDecode } from "jwt-decode"
import  {useNavigate } from 'react-router-dom';

const CreateProfile = ({ signedIn, user }) => {

 if (signedIn && !user){
    const token = localStorage.getItem('token');
    user = jwtDecode(token);
  }else{
    console.log('user from create profile = not found')
  }

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [profilePicturePath, setProfilePicturePath] = useState('');
  const [coverPicturePath, setCoverPicturePath] = useState('');
  // setting states for visibility
  const [dateOfBirthVisibility, setDateOfBirthVisibility] = useState('Private');
  const [genderVisibility, setGenderVisibility] = useState('Private');
  const [emailVisibility, setEmailVisibility] = useState('Private');
  const [phoneNumberVisibility, setPhoneNumberVisibility] = useState('Private');
  const [addressVisibility, setAddressVisibility] = useState('Private');
  const [relationshipStatusVisibility, setRelationshipStatusVisibility] = useState('Private');
  const [profileVisibility, setProfileVisibility] = useState('Private');
  const options = ['Private', 'Friends', 'Public']
  const navigate = useNavigate();

  let profilePicture = null;
  let coverPicture = null;
  let profilePicturePathTemp = null;
  let coverPicturePathTemp = null;

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
        profilePicturePathTemp = data.imageURL;
      } else if (type === 'coverPicture') {
        coverPicturePathTemp = data.imageURL;
      }
      console.log('Image uploaded successfully:', data.imageURL);
    }
  }

  const updateProfile = async () => {
    //upload profile and cover pictures
    let imageResponses = {};

    if (profilePicture && coverPicture) {
      imageResponses['profilePicture'] = await uploadFile(profilePicture, 'profilePicture');
      imageResponses['coverPicture'] = await uploadFile(coverPicture, 'coverPicture');
    } else if (profilePicture) {
      imageResponses['profilePicture'] = await uploadFile(profilePicture, 'profilePicture');
    } else if (coverPicture) {
      imageResponses['coverPicture'] = await uploadFile(coverPicture, 'coverPicture');
    }

    if (imageResponses['profilePicture'] || imageResponses['profilePicture']) {
      console.log('Profile picture uploaded successfully:');
      console.log('Cover picture: ' + imageResponses['coverPicture']?.message);
      console.log('Profile picture: ' + imageResponses['profilePicture']?.message);
    } else {
      console.error('Error uploading profile picture:', imageResponses['profilePicture']?.message);
    }

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
          "profilePicturePath": profilePicturePathTemp,
          "coverPicturePath": coverPicturePathTemp,
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
    }else if(data.message === "user already exists (Forbidden)"){
      navigate('/profile');
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

  const handleProfilePictureChange = (e) => {
    // Ensure that a file was selected
    if (e.target.files.length > 0) {
      profilePicture = e.target.files[0];
      setProfilePicturePath(URL.createObjectURL(e.target.files[0]));
      console.log(profilePicturePath);
    }
  };

  const handleCoverPictureChange = (e) => {
    // Ensure that a file was selected
    if (e.target.files.length > 0) {
      setCoverPicturePath(URL.createObjectURL(e.target.files[0]));
      coverPicture = e.target.files[0];
      console.log(coverPicturePath);
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

  const handleProfileVisibilityChange = (identifier, value) => {
    console.log(identifier, value);
    setProfileVisibility(value);
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
      {/* profile and cover Pictures */}
      <h2 className="text-3xl font-semibold text-center mb-4">Please, complete your Profile to Continue</h2>
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
        <h3 className='text-red-500 text-center'>Inputs with Astrisk * indicates Mandatory field</h3>
        <label htmlFor="firstNameInput" className="block text-sm font-medium text-gray-600">
          First Name: *
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
          Last Name: *
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
          Date of Birth: *
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
          Email: *
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
