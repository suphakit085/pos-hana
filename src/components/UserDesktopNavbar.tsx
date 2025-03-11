"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function UserDesktopNavbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // ตรวจสอบว่ามีข้อมูลผู้ใช้ใน localStorage หรือไม่
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!userData);
  }, []);
  
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
    <div className="hidden pt-3 pb-3 lg:flex w-full bg-[#fff]">
      <div className="flex justify-start items-center w-[45%] pl-16">
        <ul className="flex">
          <li className="mr-[35px] hover:border-b-2 hover:border-[#4D4D4D]">
            <Link href={'/landing'} className="text-[#4D4D4D]">หน้าหลัก</Link>
          </li>
          {isLoggedIn && (
            <li className="mr-[35px] hover:border-b-2 hover:border-[#4D4D4D]">
              <Link href={'/reservations'} className="text-[#4D4D4D]">จองโต๊ะ</Link>
            </li>
          )}
        </ul>
      </div>

      <div className="flex justify-center items-center w-[10%]">
        <img src="/user-images/logo.png" alt="" className="rounded-full w-[40px]" />
      </div>

      <div className="flex justify-end items-center w-[45%] pr-16">
        <ul className="flex justify-between">
          {isLoggedIn ? (
            <>
              <li className="mr-[35px] hover:border-b-2 hover:border-[#4D4D4D]">
                <Link href={'/reshistory'} className="text-[#4D4D4D]">ประวัติการจอง</Link>
              </li>
              <li className="hover:border-b-2 hover:border-[#4D4D4D]">
                <button onClick={handleLogout} className="text-[#4D4D4D]">ออกจากระบบ</button>
              </li>
            </>
          ) : (
            <>
              <li className="mr-[35px] hover:border-b-2 hover:border-[#4D4D4D]">
                <Link href={'/user-login'} className="text-[#4D4D4D]">เข้าสู่ระบบ</Link>
              </li>
              <li className="hover:border-b-2 hover:border-[#4D4D4D]">
                <Link href={'/register'} className="text-[#4D4D4D]">ลงทะเบียน</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default UserDesktopNavbar;