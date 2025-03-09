// src/app/superadmin/layout.tsx
import React from 'react';
import { Toaster } from "sonner";
import SuperAdminSidebar from '@/components/SuperAdminSidebar';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SuperAdminSidebar />
      <div className="flex-1 p-8">
        {children}
        <Toaster richColors position="top-right" />
      </div>
    </div>
  );
}