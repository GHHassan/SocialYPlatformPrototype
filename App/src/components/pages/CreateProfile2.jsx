import React, { useState } from 'react';

const CreateProfile = () => {
  // Define an initial state object with default values
  const initialInputValues = {
    firstName: '',
    lastName: '',
    bio: '',
    website: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phoneNumber: '',
    address: '',
    relationshipStatus: '',
  };

  // Create state variables for input values
  const [inputValues, setInputValues] = useState(initialInputValues);

  // Create a generic change handler for all input fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  // Render input fields dynamically
  const renderInputFields = () => {
    return Object.keys(initialInputValues).map((fieldName) => (
      <div key={fieldName} className="mb-4">
        <label htmlFor={`${fieldName}Input`} className="block text-sm font-medium text-gray-600">
          {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}:
        </label>
        <input
          type="text"
          id={`${fieldName}Input`}
          value={inputValues[fieldName]}
          onChange={handleInputChange}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
    ));
  };

  return (
    <div>
      {renderInputFields()}
    </div>
  );
};

export default CreateProfile;
