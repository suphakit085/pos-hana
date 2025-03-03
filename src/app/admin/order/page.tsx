import Admintemplate from "@/components/Admintemplate"
import CardOrder from "@/components/CardOrder"
import { Button } from "@/components/ui/button"
function Orderpage() {
  return (
    <>
    <Admintemplate>
        <div className="pt-5 pl-5 pb-0 flex items-center">
        <button className="bg-[#FFB8B9] rounded-full py-4 px-8 mr-5 text-black hover:text-white hover:bg-[#FFB8DA]">
                รอการดำเนินการ
            </button>
            <button className="bg-[#B8FFBD] rounded-full py-4 px-8 text-black hover:text-white hover:bg-[#FFB8DA]">
                เสร็จสิ้น
            </button>
        </div>
        <div className="p-5 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4">
            <CardOrder />
            <CardOrder />
            <CardOrder />
            <CardOrder />
            <CardOrder />
        </div>
    </Admintemplate>
    </>
  )
}
export default Orderpage