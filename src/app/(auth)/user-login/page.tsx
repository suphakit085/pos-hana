"use client";
import OtherMobileNavbar from "@/components/OtherMobileNavbar";
import OtherDesktopNavbar from "@/components/OtherDesktopNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faKey } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


function LoginPage() {
  //for input
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //to change button's color
  const isFormValid = email !== "" && password !== "";

  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for success message from registration
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    
    if (success === 'true') {
      toast.success("ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError("");

    const userData = {
      email,
      password, // Send plain password - hashing will be done on the API side
    };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage for authentication checks
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Store user data in cookies for server-side authentication
        document.cookie = `userData=${JSON.stringify(data.user)}; path=/; max-age=86400; SameSite=Lax`;
        
        // Handle successful login - redirect to dashboard
        toast.success("เข้าสู่ระบบสำเร็จ");
        
        // Check if there's a callback URL to redirect to
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get('callbackUrl');
        
        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push("/landing"); // Redirect to landing page after login
        }
      } else {
        // Handle login error
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
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
            <h2 className="text-3xl text-[#fff] text-center font-medium">ยินดีต้อนรับ</h2>
            <form onSubmit={handleSubmit} method="POST">
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
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      className={`w-4 h-4 ${isEmailFocused ? "text-white" : "text-gray-300"}`}
                    />
                  </span>
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
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <FontAwesomeIcon
                      icon={faKey}
                      className={`w-4 h-4 ${isPasswordFocused ? "text-white" : "text-gray-300"}`}
                    />
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <a href="#" className="text-[#fff] text-xs ml-auto">ลืมรหัสผ่าน?</a>
                </div>
                
                <button type="submit" className={`w-full mt-4 py-1.5 rounded-full transform transition-transform duration-300 active:scale-95 ${isFormValid ? "bg-[#FFB8DA] text-[#fff]" : "bg-[#CACACA] text-[#4D4D4D]"}`}>
                  เข้าสู่ระบบ
                </button>

                <div className="mt-4 flex justify-center items-center">
                  <p className="text-[#fff]">ยังไม่มีบัญชี?</p>
                  <a href="/register" className="text-[#fff] underline ml-2">ลงทะเบียน</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
