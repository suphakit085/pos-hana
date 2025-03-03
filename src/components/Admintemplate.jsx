"use client";
import React, { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi';
import { BsFillBellFill } from "react-icons/bs";
import { FaCircleUser } from "react-icons/fa6";
import AdminNavbar from '@/components/AdminNavbar'
import Logo from '@/components/Logo';

function Admintemplate({ children }) {
  
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
    <div className='box-border'>
        <section className='flex'>


            <div className={`w-[250px] h-screen ${isMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col `}>
                <div className='w-full h-[70px] primarybg flex items-center justify-center bottom-shadow px-3'>
                    <Logo />
                </div>
                <div className=' flex-1'>
                    <AdminNavbar />
                </div>
                
            </div>

            
            <div className='flex-1 flex flex-col'>
                    <div className=' h-[70px] primarybg flex justify-between items-center px-5 bottom-shadow2'>
                        
                        <div className='felx lg:invisible curser-pointer'  onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <HiX className="text-2xl" /> // แสดงกากบาทเมื่อเมนูเปิด
                            ) : (
                            <HiMenu className="text-2xl" /> // แสดงสามขีดเมื่อเมนูปิด
                            )}
                        </div>

                        <div className='flex  items-center justify-center'>
                            <BsFillBellFill className="relative text-white text-[1.7rem] mr-4 cursor-pointer" />
                            
                            <div
                            className='border-2 rounded-full flex justify-between items-center pl-1 pr-3 py-1 border-white cursor-pointer'>
                                <FaCircleUser  className="text-white text-3xl"/>
                                <p className="text-white ml-2">Thitikorn</p>
                            </div>
                        </div>

                    </div>

                    <main className='primarybgmain flex-1 min-h-screen-minus-70'>
                     { children }
                    </main>
            </div>



        </section>
    </div>
  )
}

export default Admintemplate