"use client";
import OtherMobileNavbar from "@/components/OtherMobileNavbar";
import OtherDesktopNavbar from "@/components/OtherDesktopNavbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function RegPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //to change button's color
  const isFormValid = firstName !== "" && lastName !== "" && email !== "" && password !== "" && password === confirmPassword;

  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
  
    setIsLoading(true);
    setError("");
  
    const userData = {
      firstName,
      lastName,
      email,
      password,
    };
  
    try {
      console.log('Sending data:', userData);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        toast.error(errorData.error || "ลงทะเบียนไม่สำเร็จ");
        return;
      }
  
      const data = await response.json();
      toast.success("ลงทะเบียนสำเร็จ");
  
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');
  
      if (callbackUrl) {
        router.push(`/user-login?success=true&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      } else {
        router.push("/user-login?success=true");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="hidden lg:flex fixed top-0 left-0 right-0">
        <OtherDesktopNavbar />
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-10">
        <OtherMobileNavbar />
      </div>

      <div className="my-16 mx-[3%] bg-white rounded-3xl relative" style={{ height: 'calc(100vh - 8rem)' }}>
        <div className="w-full h-full">
          <img src="/user-images/loginback4.png" alt="" className="w-full h-full object-cover rounded-3xl" />
        </div>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="w-[90%] lg:w-[30%] bg-white/50 backdrop-blur p-4 rounded-lg">
            <h2 className="text-3xl text-[#fff] text-center font-medium">ลงทะเบียนผู้ใช้ใหม่</h2>
            <form onSubmit={handleSubmit} method="POST">
              <div className="flex space-x-4 mt-6">
                <div className="sm:col-span-4 relative w-1/2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#fff]">
                    ชื่อจริง
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full border-b-2 border-gray-300 bg-transparent px-3 py-1.5 text-base text-[#fff] placeholder:text-gray-400 focus:border-[#fff] focus:outline-none sm:text-sm"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4 relative w-1/2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#fff]">
                    นามสกุล
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full border-b-2 border-gray-300 bg-transparent px-3 py-1.5 text-base text-[#fff] placeholder:text-gray-400 focus:border-[#fff] focus:outline-none sm:text-sm"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4 mt-6 relative">
                <label htmlFor="email" className="block text-sm font-medium text-[#fff]">
                  อีเมล
                </label>
                <div className="mt-2 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full border-b-2 border-gray-300 bg-transparent px-3 py-1.5 text-base text-[#fff] placeholder:text-gray-400 focus:border-[#fff] focus:outline-none sm:text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-4 mt-4 relative">
                <label htmlFor="password" className="block text-sm font-medium text-[#fff]">
                  รหัสผ่าน
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full border-b-2 border-gray-300 bg-transparent px-3 py-1.5 text-base text-[#fff] placeholder:text-gray-400 focus:border-[#fff] focus:outline-none sm:text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-4 mt-4 relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#fff]">
                  ยืนยันรหัสผ่าน
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full border-b-2 border-gray-300 bg-transparent px-3 py-1.5 text-base text-[#fff] placeholder:text-gray-400 focus:border-[#fff] focus:outline-none sm:text-sm"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className={`w-full mt-4 py-1.5 rounded-full transform transition-transform duration-300 active:scale-95 ${isFormValid ? "bg-[#FFB8DA] text-[#fff]" : "bg-[#CACACA] text-[#4D4D4D]"}`}>
                ลงทะเบียน
              </button>
            </form>

            <div className="mt-4 flex justify-center items-center">
              <p className="text-[#fff]">มีบัญชีแล้ว?</p>
              <a href="/login" className="text-[#fff] underline ml-2">เข้าสู่ระบบ</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegPage;
