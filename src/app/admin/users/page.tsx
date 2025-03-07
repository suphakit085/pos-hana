import Admintemplate from "@/components/Admintemplate"
import Adduser from "@/components/Adduser"
function userpage() {
  return (
    <>
    <Admintemplate>
        <div className="size-full xl:flex items-center justify-center p-10">
            <div className="bg-white size-full rounded-3xl">
                <Adduser></Adduser>
            </div>
        </div>
    </Admintemplate>
    </>
  )
}
export default userpage