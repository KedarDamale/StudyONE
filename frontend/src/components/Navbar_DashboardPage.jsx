import React from 'react';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaBars } from 'react-icons/fa';
import Logo123 from '../assets/Logo123.png'; // Ensure this path is correct

function Navbar({ toggleSidebar }) {
  return (
    <IconContext.Provider value={{ color: '#fff' }}>
      <div className="fixed top-0 left-0 w-full bg-black h-16 px-4 flex items-center z-40">
        <Link
          to="#"
          className="text-2xl text-white mr-4 hover:text-emerald-300 transition-colors duration-200"
          onClick={toggleSidebar}
        >
          <FaBars />
        </Link>
        <div className="flex items-center space-x-2">
          <img src={Logo123} alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold text-white">
            StudyONE
          </h1>
        </div>
      </div>
    </IconContext.Provider>
  );
}

export default Navbar;
