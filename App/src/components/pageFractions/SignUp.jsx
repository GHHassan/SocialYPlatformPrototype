/**
 * SignUp component
 * 
 * This component is used to sign up a user.
 * the user will be asked to enter their name, email, and password.
 * the app validates the email and password and if they are valid, the user will be signed up.
 * this allows to sign in if the user has already signed up and allows them
 * to cancel the sign up process.
 * 
 * @Authror Ghulam Hassan Hassani <w20017074>
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

function SignUp(props) {

  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password2, setpassword2] = useState('')
  const [password, setPassword] = useState('')
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [emptyFields, setEmptyFields] = useState(false)
  const [matched, setMatched] = useState(false)
  const [modified, setModified] = useState(true)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const notifySignUp = () => toast.success('You have successfully signed up!')
  const notifymatchedUser = () => toast.error('Email already exists. Please choose another email.')
  const notifyEmptyFields = () => toast.error('Please enter your name, email, and password.')
  const notifyError = () => toast.error('Please check the form and try again.')
  const notifyInvalidEmail = () => toast.error('Please enter a valid email address.')

  const signingUp = async () => {
    try {
      if (name === '' || email === '' || password === '') {
        setEmptyFields(true)
        notifyEmptyFields()
        return
      }
      const data = await fetch('https://w20017074.nuwebspace.co.uk/kf6003API/register', {
        method: 'POST',
        body: JSON.stringify({ "username": name, "email": email, "password": password })
    })
      .then(response => response.json())
      if (data.message === 'success') {
        notifySignUp()
        navigate('/createProfile')
        setSignUpSuccess(true)
      } else if (data.message === 'matched (Conflict)') {
        setSignUpSuccess(false)
        setMatched(true)
        notifymatchedUser()
      } else if (data.message === 'Invalid email (Bad Request)') {
        console.log('Invalid email');
        setSignUpSuccess(false)
        setInvalidEmail(true)
        notifyInvalidEmail()
      }
    } catch (error) {
      setSignUpSuccess(false)
      notifyError()
    }
  }

  const handleSignUp = () => {
    try {
      if (name === '' || email === '' || password === '' || password2 === '') {
        setEmptyFields(true)
        notifyEmptyFields()
        return
      }

      if (!emailRegex.test(email)) {
        setInvalidEmail(true)
        notifyInvalidEmail()
      }
      if (password === password2) {
        signingUp()
      }
    } catch (error) {}
  }

  const modify = () => {
    setInvalidEmail(false)
    setMatched(false)
    setModified(true)
    setEmptyFields(false)
  }
  const handleNameChange = (e) => {
    setName(e.target.value)
    modify()
  }
  const handleEmail1Change = (e) => {
    setEmail(e.target.value)
    modify()
  }

  const handlepassword2Change = (e) => {
    setpassword2(e.target.value)
    modify()
  }

  const handlepasswordChange = (e) => {
    setPassword(e.target.value)
    modify()
  }

  return (
    <div className="bg-stone-300 p-2 flex-grow mt-10 mb-10 w-10/12 lg:w-8/12 md:w-9/12 text-md text-center m-10 rounded-xl">
      {!signUpSuccess && (
        <div>
          <h2 className="text-black font-bold">Sign Up</h2>
          <input
            type="text"
            placeholder="Name"
            className="p-2 my-2 w-9/12 lg:w-80 block md:w-80 bg-slate-100 rounded-md text-black m-auto"
            value={name}
            onChange={handleNameChange}
            
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 my-2 w-9/12 lg:w-80 block md:w-80 bg-slate-100 rounded-md text-black m-auto"
            value={email}
            onChange={handleEmail1Change}
          />
          <p className="text-red-500 text-sm">
            {invalidEmail && "Please enter a valid email address."}
          </p>
          <p className="text-red-500 text-sm">
            {matched && "Email already exists. Please sign in or use another email."}
          </p>
          <input
            type="password"
            placeholder="Re-enter password"
            className="p-2 w-9/12 lg:w-80 block md:w-80 bg-slate-100 rounded-md text-black m-auto"
            value={password}
            onChange={handlepasswordChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 my-2 w-9/12 lg:w-80 md:w-80 bg-slate-100 rounded-md text-black m-auto"
            value={password2}
            onChange={handlepassword2Change}
          />
          <p className="text-red-500 text-sm">
            {(password !== password2) && "Passwords do not match. Please re-enter your password."}
          </p>

          <p className="text-red-500 text-sm">
            {emptyFields && "Please enter your name, email, and password."}
          </p>

          <button
            className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white"
            onClick={handleSignUp}
          >
            Submit
          </button>

          <button
            className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white ml-2"
            onClick={()=> navigate('/')}
          >
            Cancel
          </button>

          {!modified && <p className="text-red-500 text-sm">
             "Please correct the errors and try again."
          </p>
          }
          <p className="text-blue-500 text-lg">
            Already have an account?{' '}
            <span className="text-red-500 cursor-pointer " onClick={()=> navigate('/signIn')}>
              Sign In
            </span>
          </p>
        </div>
      )}
      {signUpSuccess && (
        <>
          <button
            className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white"
            onClick={()=> navigate('/')}
          >
            Sign In
          </button>
          <button
            className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white"
            onClick={()=> navigate('/')}
          >
            Home
          </button>
        </>
      )}
    </div>
  )
}

export default SignUp
