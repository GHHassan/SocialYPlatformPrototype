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
import { SignUpWithGoogleButton, CheckboxWithLabel, FormGroup } from "./SignUp";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { API_ROOT } from "../../Config";
import { useAppState } from "../../contexts/AppStateContext";

const Login = () => {

  const { dispatch: appDispatch } = useAppState();
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
        appDispatch({ type: "TOGGLE_SIGNED_IN", payload: true });
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
