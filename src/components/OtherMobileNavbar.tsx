"use client";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from 'react-icons/fa';

function OtherMobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="lg:hidden w-full z-10 absolute bg-white">
      <div className="flex justify-between items-center py-4 px-6 text-white w-full">
        <Link href="/user-login">
          <img src="/user-images/logo.png" alt="Home" className="rounded-full w-[40px]" />
        </Link>
        <button 
            className="text-2xl cursor-pointer" 
            onClick={toggleMenu}>
          {isOpen ? <FaTimes className="text-[#4D4D4D]" /> : <FaBars className="text-[#4D4D4D]" />}
        </button>
      </div>
      <div className={`w-full flex justify-center transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        <ul className="w-[95%] bg-white shadow-lg rounded-lg">
          <li className="border-b"><Link href="/login" className="block px-4 py-4">เข้าสู่ระบบ</Link></li>
          <li className="block px-4 py-4"><Link href="/register" className="block px-4 py-4">ลงทะเบียน</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default OtherMobileNavbar;