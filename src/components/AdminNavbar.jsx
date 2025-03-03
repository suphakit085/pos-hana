"use client"; 
import { GoHomeFill } from "react-icons/go";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdTableBar, MdFastfood } from "react-icons/md";
import { FaClipboardList, FaInbox, FaBoxArchive } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { FaChevronUp } from "react-icons/fa";
import { CiInboxOut } from "react-icons/ci";


function AdminNavbar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (path) => {
    return pathname === path;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav>
      <div className='container mx-auto px-5 pt-3'>
        <ul>
          <Link href="../admin/dashboard/"><li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/dashboard') ? 'bg-[#FFECF5] text-black' : ''}`}><GoHomeFill className="mr-3 text-lg" />รายงานผล</li></Link>
          <Link href="../admin/que/"><li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/que') ? 'bg-[#FFECF5] text-black' : ''}`}><FaInbox className="mr-3" />การจอง</li></Link>
          <Link href="../admin/tables/"><li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/tables') ? 'bg-[#FFECF5] text-black' : ''}`}><MdTableBar className="mr-2.5 text-lg" />จัดการโต๊ะ</li></Link>
          <Link href="../admin/order/"><li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/order') ? 'bg-[#FFECF5] text-black' : ''}`}><FaClipboardList className="mr-3 text-lg" />ออเดอร์</li></Link>
          <Link href="../admin/menu/"><li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/menu') ? 'bg-[#FFECF5] text-black' : ''}`}><MdFastfood className="mr-3 text-lg" />จัดการเมนู</li></Link>
          <li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full cursor-pointer relative ${isActive('/admin/stock') ? 'bg-[#FFECF5] text-black' : ''}`} onClick={toggleDropdown}><FaBoxArchive className="mr-3" />คลังสินค้า <FaChevronUp className={`text-sm absolute top-[1.3rem] right-3 transition-transform ${isDropdownOpen ? 'rotate-0' : 'rotate-180'}`} /></li>
          {isDropdownOpen && (
            <ul className="ml-5">
              <Link href="../admin/stock/"><li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/stock') ? 'bg-[#FFECF5] text-black' : ''}`}>คลังสินค้า</li></Link>
              <Link href="../admin/addstockout/"><li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/addstockout') ? 'bg-[#FFECF5] text-black' : ''}`}>เบิกสินค้า</li></Link>
              <Link href="../admin/stockin/"><li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/stockin') ? 'bg-[#FFECF5] text-black' : ''}`}>ประวัติการนำเข้า</li></Link>
              <Link href="../admin/stockout/"><li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/stockout') ? 'bg-[#FFECF5] text-black' : ''}`}>ประวัติการเบิก</li></Link>
            </ul>
          )}
          <Link href="../admin/settings/">
            <li className={`flex items-center py-4 px-7 my-2 hoveradminmenu rounded-full ${isActive('/admin/settings') ? 'bg-[#FFECF5] text-black' : ''}`}>
              <IoSettingsOutline className="mr-3 text-lg" />การตั้งค่า
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavbar;