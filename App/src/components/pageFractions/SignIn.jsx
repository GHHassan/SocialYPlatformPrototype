/** 
 * SignIn component
 * 
 * This component processes the user's
 * credentials, send them to the server and 
 * if the credintials were valid receives
 * a token in return.
 * 
 * if the credentials were invalid, it displays
 * an error message in red. 
 * it stores the token in the local storage
 * and sets the signedIn state to true.
 * also it removes the token from the local storage
 * when the user signs out.
 * 
 * finally it renders the sign in and sign out buttons
 * styled based on the signedIn state.
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */

import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

function SignIn(props) {

  const navigate = useNavigate()
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)
  const [signinError, setSigninError] = useState(null)
  const notifySignIn = () => toast.success('You have successfully signed in!')
  const notifySignOut = () => toast.success('You have successfully signed out!')
  const notifySignInError = () => toast.error('Invalid credentials. Please check your username and password.')
  const notiySignInCancel = () => toast.success('Sign in cancelled.')
  const notifyEmptyFields = () => toast.error('Please enter your username and password.')

  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.setSignedIn(true)
    }
  }, [props.signedIn])

  const cancel = () => {
    navigate('/')
    notiySignInCancel()
  }
  const signIn = () => {
    if (usernameRef.current.value === '' || passwordRef.current.value === '') {
      setSigninError('Please enter your username and password.')
      notifyEmptyFields()
      return
    } else {
      const encodedString = btoa(usernameRef.current.value.toLowerCase() + ':' + passwordRef.current.value)
      fetchToken(encodedString)
    }
  }

  const fetchToken = (encodedString) => {
    fetch(`https://w20017074.nuwebspace.co.uk/kf6003API/token`,{
      method: 'GET',
      headers: new Headers({ Authorization: 'Basic ' + encodedString }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          setSigninError('Invalid credentials. Please check your username and password.')
          notifySignInError()
        } else {
          setSigninError('Invalid Credentials. Please check your username and password.')
          notifySignInError()
        }
      })
      .then((data) => {
        if (data.message === 'success') {
          localStorage.setItem('token', data.token)
          if (localStorage.getItem('token')) {
            props.setSignedIn(true)
          }
          notifySignIn()
          setSigninError(null)
          navigate('/')
        } else {
          setSigninError('Invalid response from the server.')
          notifySignInError()
        }
      })
      .catch(() => { })
  }

  const signOut = () => {
    localStorage.removeItem('token')
    props.setSignedIn(false)
    notifySignOut()
  }

  const signUp = () => {
    navigate('/signUp')
  }

  return (
    <>
      <div className="bg-stone-300 p-2 flex-grow text-md text-center m-10 rounded-xl ">
        {!props.signedIn && (
          <div>
            <input
              onClick={() => setSigninError(null)}
              type="text"
              placeholder="Username"
              className="p-2 my-2 w-full lg:w-64 md:w-48 bg-slate-100 rounded-md text-black mr-2"
              ref={usernameRef}
            />
            <input
              onClick={() => setSigninError(null)}
              type="password"
              placeholder="Password"
              className="p-2 my-2 w-full lg:w-64 md:w-48 bg-slate-100 rounded-md text-black mr-2"
              ref={passwordRef}
            />
            <button
              className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white"
              onClick={signIn}
            >
              Sign In
            </button>
            <button
              className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white ml-2"
              onClick={signUp}>
                Sign Up
              </button>
            <button
              className="py-1 px-4 bg-blue-500 hover:bg-sky-500 rounded-md text-white ml-2"
              onClick={cancel}
            > Cancel
            </button>
          </div>
        )}
        {signinError && <p className="text-red-300 text-sm my-2">{signinError}</p>}
      </div>
    </>
  )
}

export default SignIn
