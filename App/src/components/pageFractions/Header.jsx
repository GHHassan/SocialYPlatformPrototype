import React from 'react';
import { Link } from 'react-router-dom';

const Header = (props) => {

    const signOut = () => {
        localStorage.removeItem('token');
        props.setSignedIn(false);
    }
  return (
    <nav className="bg-gray-800">
        <ul className="flex justify-center space-x-4">
            <li>
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
            </li>
            <li>
                <Link to="/profile" className="text-white hover:text-gray-300">Profile</Link>
            </li>
            <li>
                <Link to="/settings" className="text-white hover:text-gray-300">Settings</Link>
            </li>
            <li>
                {props.signedIn ? (
                    <p className="text-white hover:text-gray-300" onClick={signOut}>Sign Out</p>
                ) : (
                    <Link to="/signIn" className="text-white hover:text-gray-300">Sign In</Link>
                )}
            </li>
        </ul>
    </nav>
  );
};

export default Header;
