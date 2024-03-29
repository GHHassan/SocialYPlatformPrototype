// /**
//  * SignUp component
//  * 
//  * This component is used to sign up a user.
//  * the user will be asked to enter their name, email, and password.
//  * the app validates the email and password and if they are valid, the user will be signed up.
//  * this allows to sign in if the user has already signed up and allows them
//  * to cancel the sign up process.
//  * 
//  * @Authror Ghulam Hassan Hassani <w20017074>
//  */

// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-hot-toast'
// import { API_ROOT } from '../../Config'

// function SignUp(props) {

//   const navigate = useNavigate()
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password2, setpassword2] = useState('')
//   const [password, setPassword] = useState('')
//   const [invalidEmail, setInvalidEmail] = useState(false)
//   const [signUpSuccess, setSignUpSuccess] = useState(false)
//   const [emptyFields, setEmptyFields] = useState(false)
//   const [matched, setMatched] = useState(false)
//   const [modified, setModified] = useState(true)
//   const [showCreateProfile, setShowCreateProfile] = useState(false)
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//   const notifySignUp = () => toast.success('You have successfully signed up!')
//   const notifymatchedUser = () => toast.error('Email already exists. Please choose another email.')
//   const notifyEmptyFields = () => toast.error('Please enter your name, email, and password.')
//   const notifyError = () => toast.error('Please check the form and try again.')
//   const notifyInvalidEmail = () => toast.error('Please enter a valid email address.')

//   const signingUp = async () => {
//     try {
//       if (name === '' || email === '' || password === '') {
//         setEmptyFields(true)
//         notifyEmptyFields()
//         return
//       }
//       const data = await fetch(`${API_ROOT}/register`, {
//         method: 'POST',
//         body: JSON.stringify({ "username": name, "email": email, "password": password })
//     })
//       .then(response => response.json())
//       if (data.message === 'success') {
//         notifySignUp()
//         setShowCreateProfile(true)
//         setSignUpSuccess(true)
//       } else if (data.message === 'matched (Conflict)') {
//         setSignUpSuccess(false)
//         setMatched(true)
//         notifymatchedUser()
//       } else if (data.message === 'Invalid email (Bad Request)') {
//         console.log('Invalid email');
//         setSignUpSuccess(false)
//         setInvalidEmail(true)
//         notifyInvalidEmail()
//       }
//     } catch (error) {
//       setSignUpSuccess(false)
//       notifyError()
//     }
//   }

//   const handleSignUp = () => {
//     try {
//       if (name === '' || email === '' || password === '' || password2 === '') {
//         setEmptyFields(true)
//         notifyEmptyFields()
//         return
//       }

//       if (!emailRegex.test(email)) {
//         setInvalidEmail(true)
//         notifyInvalidEmail()
//       }
//       if (password === password2) {
//         signingUp()
//       }
//     } catch (error) {}
//   }

//   const modify = () => {
//     setInvalidEmail(false)
//     setMatched(false)
//     setModified(true)
//     setEmptyFields(false)
//   }
//   const handleNameChange = (e) => {
//     setName(e.target.value)
//     modify()
//   }
//   const handleEmailChange = (e) => {
//     setEmail(e.target.value)
//     modify()
//   }

//   const handlepasswordChange = (e) => {
//     setPassword(e.target.value)
//     modify()
//   }

//   const handlepassword2Change = (e) => {
//     setpassword2(e.target.value)
//     modify()
//   }


//   return (
//     <div className="bg-stone-300 p-2 flex-grow mt-10 mb-10 w-10/12 lg:w-8/12 md:w-9/12 text-md text-center m-10 rounded-xl">
//       {!signUpSuccess && (
//         <div>
//           <h2 className="text-black font-bold">Sign Up</h2>
//           <input
//             type="text"
//             placeholder="Name"
//             className="p-2 my-2 w-9/12 lg:w-80 block md:w-80 bg-slate-100 rounded-md text-black m-auto"
//             value={name}
//             onChange={handleNameChange}

//           />
//           <input
//             type="email"
//             placeholder="Email"
//             className="p-2 my-2 w-9/12 lg:w-80 block md:w-80 bg-slate-100 rounded-md text-black m-auto"
//             value={email}
//             onChange={handleEmailChange}
//           />
//           <p className="text-red-500 text-sm">
//             {invalidEmail && "Please enter a valid email address."}
//           </p>
//           <p className="text-red-500 text-sm">
//             {matched && "Email already exists. Please sign in or use another email."}
//           </p>
//           <input
//             type="password"
//             placeholder="enter password"
//             className="p-2 w-9/12 lg:w-80 block md:w-80 bg-slate-100 rounded-md text-black m-auto"
//             value={password}
//             onChange={handlepasswordChange}
//           />
//           <input
//             type="password"
//             placeholder="Re-enter password"
//             className="p-2 my-2 w-9/12 lg:w-80 md:w-80 bg-slate-100 rounded-md text-black m-auto"
//             value={password2}
//             onChange={handlepassword2Change}
//           />
//           <p className="text-red-500 text-sm">
//             {(password !== password2) && "Passwords do not match. Please re-enter your password."}
//           </p>

//           <p className="text-red-500 text-sm">
//             {emptyFields && "Please enter your name, email, and password."}
//           </p>

//           <button
//             className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white"
//             onClick={handleSignUp}
//           >
//             Submit
//           </button>

//           <button
//             className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white ml-2"
//             onClick={()=> navigate('/')}
//           >
//             Cancel
//           </button>

//           {!modified && <p className="text-red-500 text-sm">
//              "Please correct the errors and try again."
//           </p>
//           }
//           <p className="text-blue-500 text-lg">
//             Already have an account?{' '}
//             <span className="text-red-500 cursor-pointer " onClick={()=> navigate('/signIn')}>
//               Sign In
//             </span>
//           </p>
//         </div>
//       )}
//       {signUpSuccess && (
//         <>
//           <button
//             className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white"
//             onClick={()=> navigate('/')}
//           >
//             Sign In
//           </button>
//           <button
//             className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white"
//             onClick={()=> navigate('/')}
//           >
//             Home
//           </button>
//         </>
//       )}
//     </div>
//   )
// }

// export default SignUp

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
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleGoogleSignUp = async () => {
    try {
      if (!user.isSignedIn) {
        await Clerk.load();
        const redirectUrl = window.location.origin + '/kf6002/';

        Clerk.openSignIn({ redirectUrl: redirectUrl });
      } else {
        window.location.href = "/kf6002/";
      }
    } catch (error) {
      toast.error("Error signing in with Google");
    }
  };

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
    const body = JSON.stringify(formData);
    delete body.confirmPassword;
    const response = await fetch(`${API_ROOT}/register`, {
      method: "POST",
      body: body,
    });
    const data = await response.json();
    if (data.message === "success") {
      window.location.href = "/kf6002/login";
    } else if (data.message === "duplicate (Conflict)") {
      window.location.href = "/kf6002/login";
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
          {/* Role Selection */}
          <SelectGroup
            id="role"
            name="role"
            label="Role"
            value={formData.role} // Ensure formData.role exists in your state
            onChange={handleChange}
            options={[
              { value: "Researcher", label: "Researcher" },
              { value: "Participant", label: "Participant" },
              {
                value: "ResearcherAndParticipant",
                label: "Researcher And Participant",
              },
            ]}
            errorMessage={formErrors.role}
            required
          />
          {/* Additional form groups for other inputs as needed */}
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
