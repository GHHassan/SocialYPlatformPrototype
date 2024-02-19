import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-gray-800">
        <ul className="flex justify-center space-x-4">
            <li>
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
            </li>
            <li>
                <Link to="/profile" className="text-white hover:text-gray-300">Profile</Link>
            </li>
        </ul>
    </nav>
  );
};

export default Header;
