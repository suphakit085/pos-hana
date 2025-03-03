import { Button } from "@/components/ui/button"
import Link from "next/link"


const page = () => {
  return (
    <Link href='/admin/dashboard'><Button >Click me</Button></Link>
  )
}
export default page