// src/app/superadmin/staff/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast, Toaster } from "sonner";
import { 
  Search, 
  UserPlus, 
  RefreshCw, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  User,
  Users,
  DollarSign 
} from "lucide-react";

// Define interfaces for type safety
interface Employee {
  empID: number;
  empFname: string;
  empLname: string;
  empPhone: string;
  position: string;
  salary: number;
}

export default function StaffPage() {
  // State for employees data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  
  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  
  // State for form data
  const [formData, setFormData] = useState<Omit<Employee, 'empID'>>({
    empFname: '',
    empLname: '',
    empPhone: '',
    position: '',
    salary: 0
  });
  
  // State for employee being edited/deleted
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Fetch employees data
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employees');
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const data = await response.json();
      setEmployees(data);
      setFilteredEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('ไม่สามารถโหลดข้อมูลพนักงานได้');
      setLoading(false);
      setEmployees([]);
      setFilteredEmployees([]);
    }
  };
  
  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  // Filter employees based on search term and selected position
  useEffect(() => {
    // สร้างฟังก์ชันสำหรับกรองข้อมูล
    const filterEmployees = () => {
      // กรองตามตำแหน่งก่อน
      let filtered = employees;
      
      if (selectedPosition !== 'all') {
        filtered = filtered.filter(employee => employee.position === selectedPosition);
      }
      
      // จากนั้นกรองตามคำค้นหา
      if (searchTerm.trim() !== '') {
        filtered = filtered.filter(employee => 
          employee.empFname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.empLname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.empPhone.includes(searchTerm)
        );
      }
      
      setFilteredEmployees(filtered);
    };
    
    filterEmployees();
  }, [searchTerm, selectedPosition, employees]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Handle position selection change
  const handlePositionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      position: value
    }));
  };
  
  // Handle form submission for adding a new employee
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.empFname || !formData.empLname || !formData.empPhone || !formData.position) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add employee');
      }
      
      const newEmployee = await response.json();
      setEmployees([...employees, newEmployee]);
      setIsAddModalOpen(false);
      toast.success('เพิ่มพนักงานใหม่สำเร็จ');
      
      // Reset form data
      setFormData({
        empFname: '',
        empLname: '',
        empPhone: '',
        position: '',
        salary: 0
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('ไม่สามารถเพิ่มพนักงานได้');
    }
  };
  
  // Open edit modal and populate form data
  const handleOpenEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      empFname: employee.empFname,
      empLname: employee.empLname,
      empPhone: employee.empPhone,
      position: employee.position,
      salary: employee.salary
    });
    setIsEditModalOpen(true);
  };
  
  // Handle form submission for editing an employee
  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) return;
    
    // Simple validation
    if (!formData.empFname || !formData.empLname || !formData.empPhone || !formData.position) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    try {
      // ส่งคำขอ PUT ไปยัง API เพื่อแก้ไขข้อมูลพนักงาน
      const response = await fetch(`/api/employees/${selectedEmployee.empID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update employee');
      }
      
      const updatedEmployee = await response.json();
      
      // อัปเดตข้อมูลในสถานะ
      const updatedEmployees = employees.map(emp => 
        emp.empID === selectedEmployee.empID ? updatedEmployee : emp
      );
      
      setEmployees(updatedEmployees);
      setIsEditModalOpen(false);
      toast.success('แก้ไขข้อมูลพนักงานสำเร็จ');
      
      // รีเซ็ตข้อมูลฟอร์มและพนักงานที่เลือก
      setFormData({
        empFname: '',
        empLname: '',
        empPhone: '',
        position: '',
        salary: 0
      });
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('ไม่สามารถแก้ไขข้อมูลพนักงานได้');
    }
  };
  
  // Open delete modal
  const handleOpenDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };
  
  // Handle employee deletion
  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      // ส่งคำขอ DELETE ไปยัง API เพื่อลบข้อมูลพนักงาน
      const response = await fetch(`/api/employees/${selectedEmployee.empID}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete employee');
      }
      
      // อัปเดตข้อมูลในสถานะโดยลบพนักงานที่ถูกเลือกออก
      const updatedEmployees = employees.filter(emp => emp.empID !== selectedEmployee.empID);
      
      setEmployees(updatedEmployees);
      setIsDeleteModalOpen(false);
      toast.success('ลบข้อมูลพนักงานสำเร็จ');
      
      // รีเซ็ตพนักงานที่เลือก
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('ไม่สามารถลบข้อมูลพนักงานได้');
    }
  };
  
  // Format salary as Thai Baht
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  };

  return (
    <div className="space-y-6">
      <Toaster richColors />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">จัดการพนักงาน</h1>
          <p className="text-gray-500">ดูและจัดการข้อมูลพนักงานทั้งหมด</p>
        </div>
        
        <Button 
          onClick={() => setIsAddModalOpen(true)} 
          className="bg-pink-500 hover:bg-pink-600"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          เพิ่มพนักงานใหม่
        </Button>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">พนักงานทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              {employees.length} คน
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">เงินเดือนรวม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-500" />
              {formatSalary(employees.reduce((sum, emp) => sum + emp.salary, 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">เงินเดือนเฉลี่ย</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-yellow-500" />
              {employees.length > 0 
                ? formatSalary(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length) 
                : formatSalary(0)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="ค้นหาพนักงาน..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select 
                value={selectedPosition}
                onValueChange={(value) => {
                  setSelectedPosition(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="ตำแหน่งทั้งหมด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ตำแหน่งทั้งหมด</SelectItem>
                  <SelectItem value="ผู้จัดการ">ผู้จัดการ</SelectItem>
                  <SelectItem value="พนักงานเสิร์ฟ">พนักงานเสิร์ฟ</SelectItem>
                  <SelectItem value="พ่อครัว">พ่อครัว</SelectItem>
                  <SelectItem value="แคชเชียร์">แคชเชียร์</SelectItem>
                  <SelectItem value="พนักงานทำความสะอาด">พนักงานทำความสะอาด</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={fetchEmployees} title="รีเฟรชข้อมูล">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Employees table */}
      <Card>
        <CardHeader>
          <CardTitle>รายชื่อพนักงาน</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
              <span className="ml-3 text-gray-500">กำลังโหลดข้อมูล...</span>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-md">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">ไม่พบข้อมูลพนักงาน</h3>
              {searchTerm ? (
                <p className="mt-2 text-gray-500">ไม่พบผลลัพธ์สำหรับ "{searchTerm}"</p>
              ) : (
                <p className="mt-2 text-gray-500">ยังไม่มีข้อมูลพนักงาน กรุณาเพิ่มพนักงานใหม่</p>
              )}
              <Button 
                className="mt-6 bg-pink-500 hover:bg-pink-600"
                onClick={() => setIsAddModalOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                เพิ่มพนักงานใหม่
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">รหัส</TableHead>
                    <TableHead>ชื่อ</TableHead>
                    <TableHead>นามสกุล</TableHead>
                    <TableHead>เบอร์โทรศัพท์</TableHead>
                    <TableHead>ตำแหน่ง</TableHead>
                    <TableHead className="text-right">เงินเดือน</TableHead>
                    <TableHead className="w-[100px] text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.empID}>
                      <TableCell className="font-medium">{employee.empID}</TableCell>
                      <TableCell>{employee.empFname}</TableCell>
                      <TableCell>{employee.empLname}</TableCell>
                      <TableCell>{employee.empPhone}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell className="text-right">{formatSalary(employee.salary)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">เปิดเมนู</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditModal(employee)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              แก้ไข
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleOpenDeleteModal(employee)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              ลบ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Employee Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่มพนักงานใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลพนักงานใหม่ให้ครบถ้วน
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddEmployee}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empFname">ชื่อ</Label>
                  <Input
                    id="empFname"
                    name="empFname"
                    value={formData.empFname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empLname">นามสกุล</Label>
                  <Input
                    id="empLname"
                    name="empLname"
                    value={formData.empLname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="empPhone">เบอร์โทรศัพท์</Label>
                <Input
                  id="empPhone"
                  name="empPhone"
                  value={formData.empPhone}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">ตำแหน่ง</Label>
                <Select 
                  value={formData.position} 
                  onValueChange={handlePositionChange}
                  required
                >
                  <SelectTrigger id="position">
                    <SelectValue placeholder="เลือกตำแหน่ง" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ผู้จัดการ">ผู้จัดการ</SelectItem>
                    <SelectItem value="พนักงานเสิร์ฟ">พนักงานเสิร์ฟ</SelectItem>
                    <SelectItem value="พ่อครัว">พ่อครัว</SelectItem>
                    <SelectItem value="แคชเชียร์">แคชเชียร์</SelectItem>
                    <SelectItem value="พนักงานทำความสะอาด">พนักงานทำความสะอาด</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">เงินเดือน</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                  min={0}
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  ยกเลิก
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                เพิ่มพนักงาน
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Employee Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลพนักงาน</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลพนักงานตามต้องการ
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditEmployee}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-empFname">ชื่อ</Label>
                  <Input
                    id="edit-empFname"
                    name="empFname"
                    value={formData.empFname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-empLname">นามสกุล</Label>
                  <Input
                    id="edit-empLname"
                    name="empLname"
                    value={formData.empLname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-empPhone">เบอร์โทรศัพท์</Label>
                <Input
                  id="edit-empPhone"
                  name="empPhone"
                  value={formData.empPhone}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-position">ตำแหน่ง</Label>
                <Select 
                  value={formData.position} 
                  onValueChange={handlePositionChange}
                  required
                >
                  <SelectTrigger id="edit-position">
                    <SelectValue placeholder="เลือกตำแหน่ง" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ผู้จัดการ">ผู้จัดการ</SelectItem>
                    <SelectItem value="พนักงานเสิร์ฟ">พนักงานเสิร์ฟ</SelectItem>
                    <SelectItem value="พ่อครัว">พ่อครัว</SelectItem>
                    <SelectItem value="แคชเชียร์">แคชเชียร์</SelectItem>
                    <SelectItem value="พนักงานทำความสะอาด">พนักงานทำความสะอาด</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-salary">เงินเดือน</Label>
                <Input
                  id="edit-salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                  min={0}
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  ยกเลิก
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                บันทึกการแก้ไข
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ลบข้อมูลพนักงาน</DialogTitle>
            <DialogDescription>
              คุณต้องการลบข้อมูลพนักงานนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="py-4 border-y">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-semibold">{selectedEmployee.empFname} {selectedEmployee.empLname}</h4>
                  <p className="text-sm text-gray-500">{selectedEmployee.position}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                ยกเลิก
              </Button>
            </DialogClose>
            <Button 
              onClick={handleDeleteEmployee} 
              variant="destructive"
            >
              ลบข้อมูล
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}