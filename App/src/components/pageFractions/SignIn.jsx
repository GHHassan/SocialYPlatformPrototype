// /** 
//  * SignIn component
//  * 
//  * This component processes the user's
//  * credentials, send them to the server and 
//  * if the credintials were valid receives
//  * a token in return.
//  * 
//  * if the credentials were invalid, it displays
//  * an error message in red. 
//  * it stores the token in the local storage
//  * and sets the signedIn state to true.
//  * also it removes the token from the local storage
//  * when the user signs out.
//  * 
//  * finally it renders the sign in and sign out buttons
//  * styled based on the signedIn state.
//  * 
//  * @author Ghulam Hassan Hassani <w20017074>
//  */

// import React, { useRef, useState} from 'react'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-hot-toast'
// import { jwtDecode } from 'jwt-decode'
// import { API_ROOT } from '../../Config'

// function SignIn(props) {

//   const navigate = useNavigate()
//   const usernameRef = useRef(null)
//   const passwordRef = useRef(null)
//   const [signinError, setSigninError] = useState(null)
//   const notifySignIn = () => toast.success('You have successfully signed in!')
//   const notifySignInError = () => toast.error('Invalid credentials. Please check your username and password.')
//   const notiySignInCancel = () => toast.success('Sign in cancelled.')
//   const notifyEmptyFields = () => toast.error('Please enter your username and password.')

//   const cancel = () => {
//     navigate('/')
//     notiySignInCancel()
//   }
//   const signIn = () => {
//     if (usernameRef.current.value === '' || passwordRef.current.value === '') {
//       setSigninError('Please enter your username and password.')
//       notifyEmptyFields()
//       return
//     } else {
//       const encodedString = btoa(usernameRef.current.value.toLowerCase() + ':' + passwordRef.current.value)
//       fetchToken(encodedString)
//     }
//   }

//   const fetchToken = (encodedString) => {
//     fetch(`${API_ROOT}/token`, {
//       method: 'GET',
//       headers: new Headers({ Authorization: 'Basic ' + encodedString }),
//     })
//       .then((response) => {
//         if (response.status === 200) {
//           return response.json()
//         } else if (response.status === 401) {
//           setSigninError('Invalid credentials. Please check your username and password.')
//           notifySignInError()
//         } else {
//           setSigninError('Invalid Credentials. Please check your username and password.')
//           notifySignInError()
//         }
//       })
//       .then((data) => {
//         if (data.message === 'success') {
//           localStorage.setItem('token', data.token)
//           if (localStorage.getItem('token')) {
//             const decodedToken = jwtDecode(data.token)
//             if (decodedToken && decodedToken.exp > Date.now() / 1000) {
//               props.setUser(decodedToken)
//               props.setSignedIn(true)
//               navigate('/')
//             }
//             props.setSignedIn(true)
//             navigate('/')
//           }
//           notifySignIn()
//           setSigninError(null)
          
//         } else {
//           setSigninError('Invalid response from the server.')
//           notifySignInError()
//         }
//       })
//       .catch(() => { })
//   }

//   const signUp = () => {
//     navigate('/signUp')
//     props.setShowSignIn(false)
//     props.setShowSignUp(true)
//   }

//   return (
//     <>
//       <div className="bg-stone-300 p-2 flex-grow text-md text-center m-10 rounded-xl ">
//         {!props.signedIn && (
//           <div>
//             <input
//               onClick={() => setSigninError(null)}
//               type="text"
//               placeholder="Username"
//               className="p-2 my-2 w-full lg:w-64 md:w-48 bg-slate-100 rounded-md text-black mr-2"
//               ref={usernameRef}
//             />
//             <input
//               onClick={() => setSigninError(null)}
//               type="password"
//               placeholder="Password"
//               className="p-2 my-2 w-full lg:w-64 md:w-48 bg-slate-100 rounded-md text-black mr-2"
//               ref={passwordRef}
//             />
//             <button
//               className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white"
//               onClick={signIn}
//             >
//               Sign In
//             </button>
//             <button
//               className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white ml-2"
//               onClick={signUp}>
//               Sign Up
//             </button>
//             <button
//               className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white ml-2"
//               onClick={cancel}
//             > Cancel
//             </button>
//           </div>
//         )}
//         {signinError && <p className="text-red-300 text-sm my-2">{signinError}</p>}
//       </div>
//     </>
//   )
// }

// export default SignIn


/**
 * login page
 *
 * This page contains the login form for existing users to sign in
 * to their account using their email and password.
 * This also allows users to sign in using their Google or LinkedIn account.
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
import { SignUpWithGoogleButton, CheckboxWithLabel, FormGroup } from "./Signup"; // Assuming this is already defined
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { API_ROOT } from "../../Config";

const Login = ({ setSignedIn }) => {
  const user = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        setFormErrors((prev) => ({
          ...prev,
          [key]: "This field is required",
        }));
      }
    });
    login(formData);
  };

  const login = async (formData) => {
    const encodedString = btoa(`${formData.email}:${formData.password}`);
    try {
      const response = await fetch(`${API_ROOT}/token`, {
        method: "GET",
        headers: new Headers({ Authorization: "Basic " + encodedString }),
      });
      const data = await response.json();
      if (data.message === "success") {
        setSignedIn(true);
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        setFormErrors((prev) => ({
          ...prev,
          email: "Invalid email or password",
          password: "Invalid email or password",
        }));
      }
    } catch (error) {
      toast.error("Error signing in");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      if (!user.isSignedIn) {
        await Clerk.load();
        const redirectUrl = window.location.origin + '/';
        Clerk.openSignIn({ redirectUrl: redirectUrl });
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Error signing in with Google");
    }
  };

  return (
    <div className="flex w-full items-center justify-center py-16 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border border-gray-300 rounded-xl shadow-sm bg-white space-y-4"
      >
        <SignUpWithGoogleButton
          buttonText={"Continue with Google or LinkedIn"}
          onClick={handleGoogleSignUp}
        />
        <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:mt-0.5 after:flex-1 after:border-t after:border-gray-200 after:mt-0.5 ">
          Or
        </div>
        <FormGroup
          id="email"
          name="email"
          type="email"
          label="Email address"
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
          value={formData.password}
          onChange={handleChange}
          errorMessage={formErrors.password}
          required
        />

        <div className="my-2 text-sm font-medium text-gray-700">
          don't have an account?{" "}
          <Link
            to={"/signup"}
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Sign up
          </Link>
        </div>
        <CheckboxWithLabel
          id="remember-me"
          name="rememberMe"
          label="Remember me"
          checked={formData.rememberMe}
          onChange={handleChange}
        />

        <a
          href="/"
          className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          forgot password?
        </a>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Sign in
        </button>

        <Link to={"/"}>
          <p className="w-full mt-3 py-3 px-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">
            Cancel
          </p>
        </Link>
      </form>
    </div>
  );
};

export default Login;
