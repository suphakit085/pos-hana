import React from 'react'
import Admintemplate from '@/components/Admintemplate';
import { FaRegClipboard } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { TbPigMoney } from "react-icons/tb";
import { FaRegMoneyBill1 } from "react-icons/fa6";
import { Charts1 } from '@/components/Charts1';
import Chart2 from '@/components/Charts2';

function dashboardadmin() {
  return (
    <div>
        <Admintemplate>
            <div className='border w-full h-full grid grid-cols-1 xl:grid-cols-2 gap-4 p-4 xl:gap-8 lg:p-8 '>

                <div className='w-full rounded-3xl min-h-[300px] max-h-[700px] grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-8'>
                    
                    <div className='w-full bg-white rounded-3xl min-h-[150px] flex'>
                        
                        <div className='h-full w-[45%] flex items-center justify-center'>
                            <div className=' bg-[#D5FFDB] p-7 rounded-full'>
                                <FaRegClipboard  className=" text-[#39D95B] text-3xl sm:text-6xl xl:text-4xl 2xl:text-6xl"/>
                            </div>
                        </div>
                        <div  className='h-full w-[55%] flex items-start justify-center flex-col pl-2'>
                            <p className='text-5xl mb-3'>76</p>
                            <p className='text-xl text-zinc-500'>จำนวนบิลวันนี้</p>
                        </div>

                    </div>

                    <div className='w-full bg-white rounded-3xl min-h-[150px] flex'>
                        
                        <div className='h-full w-[45%] flex items-center justify-center'>
                            <div className=' bg-[#B7E0FF] p-7 rounded-full'>
                                <LuClipboardList  className=" text-[#2586D0] text-3xl sm:text-6xl xl:text-4xl 2xl:text-6xl"/>
                            </div>
                        </div>
                        <div  className='h-full w-[55%] flex items-start justify-center flex-col pl-2'>
                            <p className='text-5xl mb-3'>280</p>
                            <p className='text-xl text-zinc-500'>ออเดอร์วันนี้</p>
                        </div>

                    </div>
                    
                    <div className='w-full bg-white rounded-3xl min-h-[150px] flex'>
                        
                        <div className='h-full w-[45%] flex items-center justify-center'>
                            <div className=' bg-[#F0CCFF] p-7 rounded-full'>
                                <TbPigMoney  className=" text-[#AD3ADF] text-3xl sm:text-6xl xl:text-4xl 2xl:text-6xl"/>
                            </div>
                        </div>
                        <div  className='h-full w-[55%] flex items-start justify-center flex-col pl-2'>
                            <p className='text-3xl mb-3 xl:text-2xl 2xl:text-3xl'>฿ 95,000</p>
                            <p className='text-xl text-zinc-500'>รายได้เดือนนี้</p>
                        </div>

                    </div>
                    
                    <div className='w-full bg-white rounded-3xl min-h-[150px] flex'>
                        
                        <div className='h-full w-[45%] flex items-center justify-center'>
                            <div className=' bg-[#D0FFFA] p-7 rounded-full'>
                                <FaRegMoneyBill1  className=" text-[#32C7B9] text-3xl sm:text-6xl xl:text-4xl 2xl:text-6xl"/>
                            </div>
                        </div>
                        <div  className='h-full w-[55%] flex items-start justify-center flex-col pl-2'>
                            <p className='text-3xl mb-3 xl:text-2xl 2xl:text-3xl'>฿ 6,500</p>
                            <p className='text-xl text-zinc-500'>รายได้ในวันนี้</p>
                        </div>

                    </div>
                
                </div>








                <div className='w-full bg-white rounded-3xl min-h-[300px] max-h-[700px] '><div className=''><Charts1 /></div></div>









                <div className='w-full bg-white rounded-3xl min-h-[300px] max-h-[700px]'><Chart2 /></div>









                <div className='w-full bg-white rounded-3xl min-h-[300px] max-h-[700px]'>
                
                    <div className='w-full h-[25%] flex items-center justify-center md:justify-start md:pl-14'>
                        <p className='text-3xl'>TOP 3 Menu Of This Week</p>
                    </div>
                    
                    <div  className='w-full h-[75%] flex flex-col pb-3'>
                        
                        
                        <div className='w-[100%] h-1/3 flex md:pl-0 xl:pl-1 items-center justify-center'>
                           
                            <div className='w-[20%] max-w-[120px] max-h-[120px] md:w-[15%] xl:w-[20%] 2xl:size-[90px] h-full mr-2  flex items-center justify-center'>
                                <img src="../../menu2.jpg" alt="" className='size-[90%] rounded-full p-2'/>
                            </div>

                            <div className='h-full flex items-start justify-center flex-col w-[35%]'>
                                <p className='mb-3  text-zinc-500 text-lg xl:text-xl 2xl:text-lg'>Menu</p>
                                <p className='text-black text-lg xl:text-xl 2xl:text-xl'>เนื้อออสเตรเลีย</p>
                            </div>
                                
                            <div className='h-full flex items-start justify-center flex-col w-[25%]'>
                                <p className='mb-3  text-zinc-500 text-lg xl:text-xl 2xl:text-lg'>Option</p>
                                <p className='text-black text-lg xl:text-xl 2xl:text-xl'>ถาดใหญ่</p>
                            </div>

                            <div className='h-full flex items-start justify-center flex-col w-[20%]'>
                                <p className='mb-3  text-zinc-500 text-sm xl:text-base 2xl:text-lg'>Total Orders</p>
                                <p className='text-black text-xl xl:text-xl 2xl:text-xl'>112</p>
                            </div>

                        </div>

                        <div className='w-[100%] h-1/3 flex md:pl-0 xl:pl-1 items-center justify-center'>
                           
                            <div className='w-[20%] max-w-[120px] max-h-[120px] md:w-[15%] xl:w-[20%] 2xl:size-[90px] h-full mr-2  flex items-center justify-center'>
                                <img src="../../menu2.jpg" alt="" className='size-[90%] rounded-full p-2'/>
                            </div>

                            <div className='h-full flex items-start justify-center flex-col w-[35%]'>
                                <p className='mb-3  text-zinc-500 text-lg xl:text-xl 2xl:text-lg'>Menu</p>
                                <p className='text-black text-lg xl:text-xl 2xl:text-xl'>เนื้อออสเตรเลีย</p>
                            </div>
                                
                            <div className='h-full flex items-start justify-center flex-col w-[25%]'>
                                <p className='mb-3  text-zinc-500 text-lg xl:text-xl 2xl:text-lg'>Option</p>
                                <p className='text-black text-lg xl:text-xl 2xl:text-xl'>ถาดใหญ่</p>
                            </div>

                            <div className='h-full flex items-start justify-center flex-col w-[20%]'>
                                <p className='mb-3  text-zinc-500 text-sm xl:text-base 2xl:text-lg'>Total Orders</p>
                                <p className='text-black text-xl xl:text-xl 2xl:text-xl'>112</p>
                            </div>

                        </div>

                        <div className='w-[100%] h-1/3 flex md:pl-0 xl:pl-1 items-center justify-center'>
                           
                            <div className='w-[20%] max-w-[120px] max-h-[120px] md:w-[15%] xl:w-[20%] 2xl:size-[90px] h-full mr-2  flex items-center justify-center'>
                                <img src="../../menu3.jpg" alt="" className='size-[90%] rounded-full p-2'/>
                            </div>

                            <div className='h-full flex items-start justify-center flex-col w-[35%]'>
                                <p className='mb-3  text-zinc-500 text-lg xl:text-xl 2xl:text-lg'>Menu</p>
                                <p className='text-black text-lg xl:text-xl 2xl:text-xl'>ลูกชิ้นลาวาชีส</p>
                            </div>
                                
                            <div className='h-full flex items-start justify-center flex-col w-[25%]'>
                                <p className='mb-3  text-zinc-500 text-lg xl:text-xl 2xl:text-lg'>Option</p>
                                <p className='text-black text-lg xl:text-xl 2xl:text-xl'>-</p>
                            </div>

                            <div className='h-full flex items-start justify-center flex-col w-[20%]'>
                                <p className='mb-3  text-zinc-500 text-sm xl:text-base 2xl:text-lg'>Total Orders</p>
                                <p className='text-black text-xl xl:text-xl 2xl:text-xl'>94</p>
                            </div>

                        </div>

                        
                       
                        
                    </div>
                
                </div>

            </div>
        </Admintemplate>
    </div>
    
  )
}

export default dashboardadmin