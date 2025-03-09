"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Store,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define sidebar navigation items
const navItems = [
  {
    title: "แดชบอร์ด",
    href: "/superadmin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: "พนักงาน",
    href: "/superadmin/staff",
    icon: <Users className="h-5 w-5" />
  },
  {
    title: "ตั้งค่า",
    href: "/superadmin/settings",
    icon: <Settings className="h-5 w-5" />
  }
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        className="fixed lg:hidden z-50 top-4 left-4 bg-pink-500 text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 lg:z-0 h-screen w-64 bg-white shadow-md transition-transform lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/superadmin/dashboard" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r bg-[#FFB8DA] hover:bg-[#fcc6e0] text-transparent bg-clip-text">
                Hana Shabu
              </span>
            </Link>
            <p className="text-sm text-gray-500 mt-1">ระบบจัดการร้าน</p>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-pink-50 text-pink-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <Link 
              href="/login"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              ออกจากระบบ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}