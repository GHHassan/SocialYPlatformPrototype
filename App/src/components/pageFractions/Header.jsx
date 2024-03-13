/**
 * Header component
 * 
 * This component styles and renders the header
 * of the application. this includes the title,
 * sign in and sign out buttons and the nav menu.
 * 
 * @uses Menu and SignIn components
 * @author Ghulam Hassan Hassani <w20017074>
 */

import React from 'react'
import Menu from './Menu'
import SignIn from './SignIn'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import SignUp from './SignUp'

function Header(props) {

  const location = useLocation()

  const signUp = () => {
    props.setShowSignIn(false)
    props.setShowSignUp(true)
  }

  const notifySignOut = () => toast.success('You have successfully signed out!')
  const signIn = () => {
    if (location.pathname !== '/signin')
      props.setShowSignIn(true)
      props.setShowSignUp(false)
  }

  const signOut = () => {
    localStorage.removeItem('token')
    props.setUser(null)
    notifySignOut()
    props.setShowSignIn(false)
    props.setSignedIn(false)
  }

  return (
    <>
      {(!props.signedIn && location.pathname !== '/signin') && (
        <div className="button-container flex mt-5">
          <button className="bg-blue-500 rounded-md px-4 text-center text-sm hover:bg-sky-500 ml-auto justify-end"
            onClick={signIn}>
            SignIn
          </button>
          {!props.showSignIn && <button className="bg-blue-500 rounded-md px-4 text-center text-sm hover:bg-sky-500 ml-2"
            onClick={signUp}
          >
            SignUp
          </button>}
        </div>
      )}
      {props.signedIn && (
        <button className="m-5 bg-red-500 rounded-md px-4 text-center hover:bg-sky-500 ml-auto justify-end"
          onClick={signOut}>
          Sign Out
        </button>
      )}
      <h1 className='text-4xl text-center text-bold mb-4 '>KF6003 Course Work</h1>
      <Menu {...props}/>
      {props.showSignIn &&
        <SignIn
          {...props}
        />
      }
      {props.showSignUp && !props.signedIn &&
        <SignUp
          {...props}
        />
      }
    </>
  )

}

export default Header