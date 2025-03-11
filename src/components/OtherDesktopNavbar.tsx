import Link from "next/link";

function OtherDesktopNavbar() {
  return (
    <div className="hidden pt-3 pb-3 lg:flex w-full bg-[#fff]">
      <div className="flex justify-start items-center w-[45%] pl-16">
        {/* เอาเมนูหน้าหลักออก */}
      </div>

      <div className="flex justify-center items-center w-[10%]">
        <Link href="/user-login">
          <img src="/user-images/logo.png" alt="Home" className="rounded-full w-[40px]" />
        </Link>
      </div>

      <div className="flex justify-end items-center w-[45%] pr-16">
        <ul className="flex justify-between">
          <li className="mr-[35px] hover:border-b-2 hover:border-[#4D4D4D]">
            <Link href={'/user-login'} className="text-[#4D4D4D]">เข้าสู่ระบบ</Link>
          </li>
          <li className="mr-[35px] hover:border-b-2 hover:border-[#4D4D4D]">
            <Link href={'/register'} className="text-[#4D4D4D]">ลงทะเบียน</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default OtherDesktopNavbar;