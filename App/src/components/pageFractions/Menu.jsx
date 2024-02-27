/**
 * Menu component
 * 
 * This component styles and renders the menu
 * and link them to the relevant pages.
 * 
 * @uses Link from react-router-dom
 * @author Ghulam Hassan Hassani <w20017074>
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'

function Menu(props) {

  const [isMenuOpen, setMenuOpen] = useState(false)

  const hideSignInAndUp = () => {
    setMenuOpen(!isMenuOpen)
    props.setShowSignIn(false)
    props.setShowSignUp(false)
  }

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  return (
    <div className="bg-black p-2 text-md font-bold justify-center ">
      <div className="lg:flex md:flex hidden justify-center">
        <ul className="flex justify-center gap-10">
          <Link to="/">
            <li onClick={hideSignInAndUp} 
              className="mb-3 bg-stone-200 rounded-md px-4 text-center hover:bg-sky-500">
                Home
            </li>
          </Link>
          <Link to="/profile">
            <li onClick={hideSignInAndUp} 
              className="mb-3 bg-stone-200 rounded-md px-4 text-center hover:bg-sky-500">
                Setting
            </li>
          </Link>
          <Link to="/post">
            <li onClick={hideSignInAndUp} 
              className="mb-3 bg-stone-200 rounded-md px-4 text-center hover:bg-sky-500">
                post
            </li>
          </Link>
        </ul>
      </div>

      {/* Hamburger menu for smaller screens */}
      <div className="lg:hidden md:hidden">
        <button className="text-white text-lg" onClick={toggleMenu}>
          ☰ Menu
        </button>
        <div className="lg:hidden md:hidden">
          {isMenuOpen && (
            <div className="flex flex-col items-start">
              <ul className="flex flex-col items-left">
                <Link to="/">
                  <li onClick={hideSignInAndUp}
                    className="mb-3 bg-stone-200 rounded-md px-4 text-center hover:bg-sky-500">
                      Home
                  </li>
                </Link>
                <Link to="/profile">
                  <li onClick={hideSignInAndUp}
                    className="mb-3 bg-stone-200 rounded-md px-4 text-center hover:bg-sky-500">
                      Settings
                  </li>
                </Link>
                <Link to="/">
                  <li onClick={hideSignInAndUp}
                    className="mb-3 bg-stone-200 rounded-md px-4 text-center hover:bg-sky-500">
                      Contents
                  </li>
                </Link>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Menu