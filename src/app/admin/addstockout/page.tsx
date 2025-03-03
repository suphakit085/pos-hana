"use client"

import Admintemplate from "@/components/Admintemplate";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from 'react';

function AddStockPage() {

  const [emp, setEmp] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [foodType, setFoodType] = useState('');


  return (
    <Admintemplate>
      <div className='size-full p-5 md:p-10  flex items-center justify-center '>
        <div className='bg-white size-full  rounded-3xl '>

          <div className="h-[100px] flex items-center justify-center">
            <p className="text-3xl">บันทึกการเบิกของ</p>
          </div>
          <div className="flex items-center justify-center">
          <div className=" w-[50%] h-[4px] bg-[#FFB8DA] rounded-full"></div>
          </div>

          <div className=" w-full flex mt-10 justify-center h-[80%]">
            <div className="px-3 w-full md:w-3/5 ">

              <form action="">

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-5'>
                  <div className="">
                    <label htmlFor="food-type" className="block text-sm font-medium text-gray-700">
                      รหัสพนักงาน
                    </label>
                    <Select value={emp} onValueChange={setEmp}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="เลือกพนักงาน" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A001">A001</SelectItem>
                        <SelectItem value="A002">A002</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="">
                    <label htmlFor="food-type" className="block text-sm font-medium text-gray-700">
                      เลือกอาหาร...
                    </label>
                    <Select value={foodType} onValueChange={setFoodType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="เลือกอาหาร..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="หมู">หมู</SelectItem>
                        <SelectItem value="ไก่">ไก่</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-end">

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      จำนวน
                    </label>
                    <input
                      type="number"
                      id="price"
                      placeholder="ระบุจำนวน"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FFB8DA] focus:border-[#FFB8DA] sm:text-sm"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                      หน่วย
                    </label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger className="w-full h-[40px]">
                        <SelectValue placeholder="เลือกหน่วย..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ชิ้น">ชิ้น</SelectItem>
                        <SelectItem value="กิโลกรัม">กิโลกรัม</SelectItem>
                        <SelectItem value="กรัม">กรัม</SelectItem>
                        <SelectItem value="ลิตร">ลิตร</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>


                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  หน่วย
                </label>
                <Textarea placeholder="เพิ่มหมายเหตุ (ถ้ามี)" />


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 mb-10">
                  <Button className="w-full h-[40px] bg-[#FFB8DA] hover:bg-[#fcc6e0]" type="submit">
                    บันทึก
                  </Button>
                  <Button variant="outline" className="w-full h-[40px]">
                    ยกเลิก
                  </Button>
                </div>
              </form>
            </div>
          </div>


        </div>
      </div>

    </Admintemplate>
  )
}
export default AddStockPage