"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { FaCheck } from "react-icons/fa";
import { Switch } from "@/components/ui/switch"
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";


function Cardmenu() {

    const [isActive, setIsActive] = useState(true);

    // ฟังก์ชันสำหรับสลับสถานะ
    const handleToggle = () => {

        
      setIsActive(!isActive);
      Swal.fire({
        title: `สถานะถูก${!isActive ? "เปิด" : "ปิด"}ใช้งานแล้ว`,
        text: " ",
        icon: "success",
        confirmButtonColor: "#28a745",
        timer: 1500, // ปิด popup อัตโนมัติหลังจาก 1.5 วินาที
        showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
      });
    };


  return (
    <div>
        <Card className='size-full  min-w-[250px]'>
                <CardHeader>
                    <CardTitle className="text-center">Card Title</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <img src="../123.jpg" alt=""  className="max-w-full h-auto min-w-[200px] min-h-[150px]"/>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <div className="flex justify-center items-center space-x-2">


                            {isActive ? (
                            <>
                                <FaCheck className="text-[#28a745]" />
                                <p className="text-[#28a745]">เปิดใช้งาน</p>
                            </>
                            ) : (
                            <>
                                <FaTimes className="text-[#dc3545]" />
                                <p className="text-[#dc3545]">ปิดใช้งาน</p>
                            </>
                            )}
                        </div>
                        <div className="flex justify-center items-center">
                        
                    </div>
                    <div className="flex justify-center items-center">
                    <Switch checked={isActive} onCheckedChange={handleToggle} />
                    </div>
                </CardFooter>
            </Card>
    </div>
  )
}
export default Cardmenu