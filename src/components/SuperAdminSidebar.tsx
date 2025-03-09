// src/components/SuperAdminSidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, BarChart3, DollarSign, ShoppingBag, Users, Calendar } from 'lucide-react';

const menuItems = [
  { title: "แดชบอร์ด", path: "/superadmin/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
  { title: "ยอดขาย", path: "/superadmin/sales", icon: <DollarSign className="w-5 h-5" /> },
  { title: "รายงานสินค้า", path: "/superadmin/products", icon: <ShoppingBag className="w-5 h-5" /> },
  { title: "ลูกค้า", path: "/superadmin/customers", icon: <Users className="w-5 h-5" /> },
  { title: "รายงานตามช่วงเวลา", path: "/superadmin/time-reports", icon: <Calendar className="w-5 h-5" /> },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  
  const handleLogout = () => {
    // ลบ cookies
    document.cookie = "userRole=; path=/; max-age=0";
    document.cookie = "userId=; path=/; max-age=0";
    
    // redirect ไปยังหน้า login
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Hana Shabu</h2>
        <p className="text-sm text-gray-500">Super Admin Panel</p>
      </div>
      
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center px-6 py-3 hover:bg-gray-100 transition-colors ${
                  pathname === item.path ? "bg-[#FFECF5] text-[#FFB8DA] font-medium" : ""
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <button 
          onClick={handleLogout}
          className="flex items-center px-6 py-3 w-full text-red-500 hover:bg-red-50 transition-colors rounded"
        >
          <LogOut className="mr-3 h-5 w-5" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}