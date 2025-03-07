import Admintemplate from "@/components/Admintemplate"
import AllTable from "@/components/AllTable"
import IncomingReserve from "@/components/IncomingReserve"

function page() {
  return (
    <>
    <Admintemplate>
        <div className="size-full xl:flex items-center justify-center p-10">
            <div className="bg-white xl:w-4/5 h-fit rounded-3xl">
                <h1 className="text-3xl p-5">ALL ZONE</h1>
                <AllTable />
            </div>
            <div className="bg-white w-full xl:w-1/5 h-full rounded-3xl mt-3 xl:mt-0 xl:ml-3 p-4">
            <h1 className="text-3xl p-5 ">รายการจองวันนี้</h1>
              <div className="max-h-[720px] h-fit overflow-y-auto">
                <IncomingReserve />
              </div>
            </div>
            
        </div>
    </Admintemplate>
    </>
  )
}
export default page