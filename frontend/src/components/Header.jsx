import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { LuMenu } from "react-icons/lu";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import Search from "./Search";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-20 shadow-md sticky top-0 bg-white z-50 p-3">
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        {/* Logo */}
        <Link to={"/"} className="flex items-center h-full">
          <img
            src={logo}
            alt="Logo"
            className="w-32 sm:w-40 h-auto object-contain"
          />
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:block">
          <Search />
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
            Login
          </button>
          <button className=" text-black rounded px-4 py-2">
            <FaShoppingCart size={30} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-blue-600">
            {isOpen ? <RxCross2 size={30} /> : <LuMenu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 shadow-lg">
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none"
            />
            <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
              Search
            </button>
            <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
              Login
            </button>
            <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
              My Cart
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
