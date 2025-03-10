// src/app/login/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// รายชื่อผู้ใช้สำหรับตัวอย่าง (ในระบบจริงควรเก็บในฐานข้อมูลและเข้ารหัส)
const USERS = {
  superadmin: { id: '1', username: 'superadmin', password: 'super123', role: 'superadmin' },
  admin: { id: '2', username: 'admin', password: 'admin123', role: 'admin' }
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('admin');  // เริ่มต้นที่ admin login
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let isAuthenticated = false;
      let userData = null;

      // ตรวจสอบการเข้าสู่ระบบตาม role ที่เลือก
      if (loginType === 'superadmin' && 
          username === USERS.superadmin.username && 
          password === USERS.superadmin.password) {
        isAuthenticated = true;
        userData = USERS.superadmin;
      } else if (loginType === 'admin' && 
                username === USERS.admin.username && 
                password === USERS.admin.password) {
        isAuthenticated = true;
        userData = USERS.admin;
      }

      if (isAuthenticated && userData) {
        // เก็บค่า cookies สำหรับการเข้าสู่ระบบ
        document.cookie = `userRole=${userData.role}; path=/; max-age=${60*60*24*7}`; // 7 วัน
        document.cookie = `userId=${userData.id}; path=/; max-age=${60*60*24*7}`;
        
        toast.success('เข้าสู่ระบบสำเร็จ');
        
        // นำทางไปยังหน้า dashboard ตาม role
        if (userData.role === 'superadmin') {
          router.push('/superadmin/dashboard');
        } else {
          router.push('/admin/tables');
        }
      } else {
        toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">ระบบเข้าสู่ระบบ</CardTitle>
          <CardDescription className="text-center">
            กรุณาเลือกประเภทผู้ใช้และป้อนข้อมูลเพื่อเข้าสู่ระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" onValueChange={setLoginType}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="admin">แอดมิน</TabsTrigger>
              <TabsTrigger value="superadmin">ซูเปอร์แอดมิน</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">ชื่อผู้ใช้</Label>
                  <Input
                    id="admin-username"
                    placeholder="ป้อนชื่อผู้ใช้แอดมิน"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">รหัสผ่าน</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="ป้อนรหัสผ่าน"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={loading}
                >
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="superadmin">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="superadmin-username">ชื่อผู้ใช้</Label>
                  <Input
                    id="superadmin-username"
                    placeholder="ป้อนชื่อผู้ใช้ซูเปอร์แอดมิน"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="superadmin-password">รหัสผ่าน</Label>
                  <Input
                    id="superadmin-password"
                    type="password"
                    placeholder="ป้อนรหัสผ่าน"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}