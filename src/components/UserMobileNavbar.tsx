"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from "next/navigation";

function UserMobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบว่ามีข้อมูลผู้ใช้ใน localStorage หรือไม่
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!userData);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    // ลบข้อมูลผู้ใช้ออกจาก localStorage และ cookies
    localStorage.removeItem('userData');
    document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    
    // เปลี่ยนเส้นทางไปยังหน้าหลัก
    router.push('/');
    
    // รีเฟรชหน้าเพื่อให้การเปลี่ยนแปลงมีผล
    window.location.reload();
  };

  return (
    <nav className="lg:hidden w-full z-10 absolute bg-white">
      <div className="flex justify-between items-center py-4 px-6 text-white w-full">
        <img src="/user-images/logo.png" alt="Logo" className="rounded-full w-[40px]" />
        <button 
            className="text-2xl cursor-pointer" 
            onClick={toggleMenu}>
          {isOpen ? <FaTimes className="text-[#4D4D4D]" /> : <FaBars className="text-[#4D4D4D]" />}
        </button>
      </div>
      <div className={`w-full flex justify-center transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        <ul className="w-[95%] bg-white shadow-lg rounded-lg">
          <li className="border-b"><Link href="/" className="block px-4 py-4">หน้าหลัก</Link></li>
          
          {isLoggedIn ? (
            <>
              <li className="border-b"><Link href="/reservations" className="block px-4 py-4">จองโต๊ะ</Link></li>
              <li className="border-b"><Link href="/reshistory" className="block px-4 py-4">ประวัติการจอง</Link></li>
              <li className="block px-4 py-4"><button onClick={handleLogout} className="w-full text-left">ออกจากระบบ</button></li>
            </>
          ) : (
            <>
              <li className="border-b"><Link href="/user-login" className="block px-4 py-4">เข้าสู่ระบบ</Link></li>
              <li className="block px-4 py-4"><Link href="/register" className="block px-4 py-4">ลงทะเบียน</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default UserMobileNavbar;