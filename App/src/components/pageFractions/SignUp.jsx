/**
 * Sign up page
 *
 * This page contains the sign up form for new users to create an account.
 * This also allows users to sign up using their Google or LinkedIn account.
 * It contains reusable form components for input, select and checkbox elements.
 *
 * @uses Clerk SSO for authentication
 * @uses Tailwind CSS for styling
 *
 * @version 1.0
 * @date 13/03/2024
 * @author Hassan #w20017074
 * @generated
 */

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { API_ROOT } from "../../Config";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export const SignUpWithGoogleButton = ({ onClick, buttonText }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-2 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 shadow-sm text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
    >
      <div className="w-10 h-5">
        <img
          src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
          alt="Google Logo"
        />
        <img
          src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg"
          alt="LinkedIn Logo"
        />
      </div>
      {buttonText || "Sign up with Google or LinkedIn"}
    </button>
  );
};

export const CheckboxWithLabel = ({ id, name, label, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="shrink-0 mt-0.5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 "
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
    </div>
  );
};

// FormGroup.jsx
export const FormGroup = ({
  label,
  type,
  id,
  name,
  placeholder,
  errorMessage,
  required,
  value,
  onChange,
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-700 "
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={`w-full p-3 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errorMessage ? "border-red-500" : "border-gray-300"
          } `}
      />
      {errorMessage && (
        <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

// SelectGroup.jsx
export const SelectGroup = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  errorMessage,
  required,
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-700 "
        >
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        onChange={onChange}
        value={value}
        required={required}
        className={`w-full p-6 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errorMessage ? "border-red-500" : "border-gray-300"
          } `}
      >
        <option value="">Select your role</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

const SignUp = () => {

  const user = useUser();
  const handleGoogleSignUp = async () => {
    try {
      if (!user?.isSignedIn) {
        await Clerk.load();
        const redirectUrl = '/';
        Clerk.openSignIn({ redirectUrl: redirectUrl });
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      toast.error("Error signing in with Google");
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setFormErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  // Form submission handler
  const handleSubmit = (event) => {
    event.preventDefault();
    let isFormValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        isFormValid = false;
        setFormErrors((prevState) => ({
          ...prevState,
          [key]: `${key} is required`,
        }));
      }
    });

    if (formData.password !== formData.confirmPassword) {
      isFormValid = false;
      setFormErrors((prevState) => ({
        ...prevState,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    if (
      !isFormValid ||
      Object.values(formErrors).some((error) => error !== "")
    ) {
      toast.error("Please fill in all required fields");
    } else {
      registerUser(formData);
    }
  };

  const registerUser = async (formData) => {
    console.log("formData", formData);
    const body = JSON.stringify(formData);
    delete body.confirmPassword;
    const response = await fetch(`${API_ROOT}/register`, {
      method: "POST",
      body: body,
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    if (data.message === "success") {
      window.location.href = "/kf6003/login";
    } else if (data.message === "duplicate (Conflict)") {
      window.location.href = "/kf6003/login";
      alert("User already exists, please login.");
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="flex w-full items-center justify-center py-16 bg-gray-100">
      <form
        onSubmit={handleSubmit}
      >
        <div className="w-full max-w-md mx-auto p-6 border border-gray-300 shadow-lg rounded-lg bg-white">
          <div className="mb-4">
            <SignUpWithGoogleButton onClick={handleGoogleSignUp} />
          </div>

          <FormGroup
            id="username"
            name="username"
            type="text"
            label="Username"
            placeholder="your username"
            value={formData.username}
            onChange={handleChange}
            errorMessage={formErrors.username}
            required
          />
          <FormGroup
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            errorMessage={formErrors.email}
            required
          />
          <FormGroup
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            errorMessage={formErrors.password}
            required
          />
          <FormGroup
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            errorMessage={formErrors.confirmPassword}
            required
          />
          <button
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
            type="submit"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
          <div className="my-2 text-sm font-medium text-gray-700">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
