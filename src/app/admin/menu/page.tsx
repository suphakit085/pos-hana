import Admintemplate from '@/components/Admintemplate';
import Cardmenu from '@/components/Cardmenu';
  


function Menupage() {
  return (
    <>
    <Admintemplate>
        <div className="p-8 ">
            <div className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4'> 
                <Cardmenu />
                <Cardmenu />
                <Cardmenu />
                <Cardmenu />
                <Cardmenu />
                <Cardmenu />
            </div>
        </div>
    </Admintemplate>
    </>
  )
}
export default Menupage