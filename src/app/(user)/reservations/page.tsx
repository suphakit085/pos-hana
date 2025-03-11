"use client";
import UserDesktopNavbar from "@/components/UserDesktopNavbar";
import UserMobileNavbar from "@/components/UserMobileNavbar";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TableMapProps {
  selectedTable: number | string | null;
  onTableSelect: (table: number | string) => void;
  reservationDate: string;
}

const TableMap: React.FC<TableMapProps> = ({ selectedTable, onTableSelect, reservationDate }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 w-full">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-50 rounded-lg mb-4 p-2 md:p-4 overflow-hidden">
        {/* ห้อง VIP - เปลี่ยนเป็นปุ่มโต๊ะ */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 w-[60px] sm:w-[80px] md:w-[80px] h-[110px] sm:h-[140px] md:h-[180px] rounded-3xl border-2 border-gray-300 flex flex-col items-center justify-center">
          <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium text-center mb-2">ห้อง VIP</span>
          <button
            type="button"
            onClick={() => onTableSelect(17)}
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all text-xs sm:text-sm md:text-base
              ${selectedTable === 17 ? "bg-[#FFB8DA] text-white shadow-md transform scale-105" : "bg-purple-300 text-gray-700 hover:bg-purple-200"}`}
          >
            17
          </button>
        </div>

        {/* ห้องครัว */}
        <div className="absolute top-[130px] sm:top-[160px] md:top-[200px] left-2 md:left-4 w-[60px] sm:w-[80px] md:w-[80px] h-[120px] sm:h-[140px] md:h-[180px] rounded-3xl border-2 border-gray-300 flex items-center justify-center">
          <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium text-center">ห้องครัว</span>
        </div>

        {/* ทางเข้า */}
        <div className="absolute bottom-2 md:bottom-4 left-[90px] sm:left-[120px] md:left-[150px] w-[80px] rounded-3xl border-2 border-gray-300 text-center">
          <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">ทางเข้า</span>
        </div>

        {/* cashier */}
        <div className="absolute top-[180px] sm:top-[230px] md:top-[280px] left-[70px] sm:left-[100px] md:left-[100px] w-[30px] sm:w-[40px] md:w-[50px] h-[60px] sm:h-[80px] md:h-[100px] rounded-full border-2 border-gray-300 flex items-center justify-center">
          <span className="text-gray-700 text-[10px] sm:text-xs font-medium transform -rotate-90">แคชเชียร์</span>
        </div>

        {/* โต๊ะแถวบน */}
        <div className="absolute top-[12px] left-[100px] sm:left-[150px] md:left-[120px] flex space-x-4 sm:space-x-7 md:space-x-6">
          {[13, 14, 15, 16].map((table) => (
            <button
              key={table}
               type="button"
              onClick={() => onTableSelect(table)}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all text-xs sm:text-sm md:text-base
                ${selectedTable === table ? "bg-[#FFB8DA] text-white shadow-md transform scale-105" : "bg-gray-300 text-gray-700 hover:bg-gray-200"}`}
            >
              {table}
            </button>
          ))}
        </div>

        {/* โต๊ะแถวล่าง */}
        <div className="absolute top-[140px] sm:top-[170px] md:top-[200px] left-[130px] sm:left-[180px] md:left-[160px] grid grid-cols-4 sm:grid-cols-4 gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-3 md:gap-x-3 md:gap-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((table) => (
            <button
              key={table}
              type="button"
              onClick={() => onTableSelect(table)}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all text-xs sm:text-sm md:text-base
                ${selectedTable === table ? "bg-[#FFB8DA] text-white shadow-md transform scale-105" : "bg-gray-300 text-gray-700 hover:bg-gray-200"}`}
            >
              {table}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const initialFormState = {
  name: '',
  phone: '',
  peopleCount: 1,
  selectedTable: null,
  reservationDate: format(new Date(), "yyyy-MM-dd"),
  reservationTime: '18:00', // Default time
};

interface FormState {
  name: string;
  phone: string;
  peopleCount: number;
  selectedTable: number | string | null;
  reservationDate: string;
  reservationTime: string;
}

interface FormAction {
  type: 'SET_FIELD' | 'RESET_FORM';
  field?: keyof FormState;
  value?: any;
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field!]: action.value };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
}

export default function ReservationDesktop() {
  const router = useRouter();
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const [loading, setLoading] = useState(false);
  const [availableTables, setAvailableTables] = useState<number[]>([]);
  const [bookedTables, setBookedTables] = useState<number[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    dispatch({ 
      type: 'SET_FIELD', 
      field: 'reservationDate', 
      value: format(new Date(), "yyyy-MM-dd")
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldMap: { [key: string]: keyof FormState } = {
      Name: 'name',
      Phone: 'phone',
      resDate: 'reservationDate',
      resTime: 'reservationTime',
    };
    const field = fieldMap[name] || (name.toLowerCase() as keyof FormState);
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const decrementPeopleCount = () => {
    if (state.peopleCount > 1) {
      dispatch({ type: 'SET_FIELD', field: 'peopleCount', value: state.peopleCount - 1 });
    }
  };

  const incrementPeopleCount = () => {
    if (state.peopleCount < 12) {
      dispatch({ type: 'SET_FIELD', field: 'peopleCount', value: state.peopleCount + 1 });
    }
  };

  const handleTableSelect = (tableNumber: number | string) => {
    // เพิ่มการแปลง tableNumber เป็นตัวเลขเพื่อให้การเปรียบเทียบถูกต้อง
    const tableNum = Number(tableNumber);
    
    if (bookedTables.includes(tableNum)) {
      toast.error("โต๊ะนี้ถูกจองแล้วสำหรับวันที่เลือก");
      return;
    }
    
    dispatch({ type: 'SET_FIELD', field: 'selectedTable', value: tableNum });
    
    // แสดงข้อความที่แตกต่างกันสำหรับโต๊ะ VIP
    if (tableNum === 17) {
      toast.info(`เลือกห้อง VIP แล้ว (กรุณากดปุ่ม "ยืนยันการจอง" เพื่อทำการจองให้เสร็จสิ้น)`);
    } else {
      toast.info(`เลือกโต๊ะที่ ${tableNum} แล้ว (กรุณากดปุ่ม "ยืนยันการจอง" เพื่อทำการจองให้เสร็จสิ้น)`);
    }
  };

  // Get user data from localStorage when component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        
        // Pre-fill the form with user data if available
        if (parsedUserData.firstName) {
          dispatch({ type: 'SET_FIELD', field: 'name', value: parsedUserData.firstName });
        }
        if (parsedUserData.resPhone) {
          dispatch({ type: 'SET_FIELD', field: 'phone', value: parsedUserData.resPhone });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Check available tables when date changes
  useEffect(() => {
    const checkAvailableTables = async () => {
      try {
        const response = await fetch(`/api/user-reservations/check-tables?date=${state.reservationDate}`);
        if (response.ok) {
          const data = await response.json();
          setBookedTables(data.bookedTables || []);
        } else {
          console.error('Failed to fetch available tables');
        }
      } catch (error) {
        console.error('Error checking available tables:', error);
      }
    };

    checkAvailableTables();
  }, [state.reservationDate]);

  const validateForm = () => {
    if (!state.name.trim()) {
      toast.error('กรุณากรอกชื่อสำหรับการจอง');
      return false;
    }
    
    if (!state.phone.trim()) {
      toast.error('กรุณากรอกเบอร์โทรศัพท์');
      return false;
    }
    
    // Basic phone number validation for Thailand
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(state.phone.replace(/[-\s]/g, ''))) {
      toast.error('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เช่น 08X-XXX-XXXX)');
      return false;
    }
    
    if (!state.selectedTable) {
      toast.error('กรุณาเลือกโต๊ะที่ต้องการจอง');
      return false;
    }
    
    if (!state.reservationDate) {
      toast.error('กรุณาเลือกวันที่ต้องการจอง');
      return false;
    }
    
    // Check if the selected date is in the past
    const selectedDate = new Date(state.reservationDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < currentDate) {
      toast.error('ไม่สามารถจองวันที่ผ่านมาแล้วได้');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    toast.info("กำลังดำเนินการจองโต๊ะ...");
    setLoading(true);
    
    try {
      // ตรวจสอบอีกครั้งว่าโต๊ะที่เลือกยังว่างอยู่
      const checkResponse = await fetch(`/api/user-reservations/check-tables?date=${state.reservationDate}`);
      const checkData = await checkResponse.json();
      
      if (checkData.bookedTables.includes(state.selectedTable)) {
        toast.error("โต๊ะนี้ถูกจองไปแล้ว กรุณาเลือกโต๊ะใหม่");
        setLoading(false);
        return;
      }

      const reservationData = {
        resName: state.name,
        phoneNumber: state.phone,
        numberOfPeople: state.peopleCount,
        tableNumber: state.selectedTable,
        reservationDate: state.reservationDate,
        reservationTime: state.reservationTime || '18:00',
        status: 'pending',
        customerID: userData?.customerID // Include the logged-in user's ID if available
      };
      
      const response = await fetch('/api/user-reservations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('จองโต๊ะเรียบร้อยแล้ว!');
        dispatch({ type: 'RESET_FORM' });
        
        // Redirect to confirmation page
        setTimeout(() => {
          router.push(`/reservations/confirmation?id=${data.reservationId}`);
        }, 1500);
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาดในการจอง กรุณาลองอีกครั้ง');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hidden lg:flex fixed top-0 left-0 right-0 z-10">
        <UserDesktopNavbar />
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-10">
        <UserMobileNavbar />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 py-16 mt-10 pb-24 lg:pb-16 relative">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              จองโต๊ะล่วงหน้า
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ฟอร์มข้อมูลการจอง */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#FFB8DA] flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">ข้อมูลการจอง</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อสำหรับการจอง
                      </label>
                      <input
                        id="Name"
                        name="Name"
                        type="text"
                        value={state.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFB8DA] focus:border-transparent transition"
                        placeholder="กรอกชื่อของคุณ"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 mb-1">
                        เบอร์โทรศัพท์
                      </label>
                      <input
                        id="Phone"
                        name="Phone"
                        type="tel"
                        value={state.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFB8DA] focus:border-transparent transition"
                        placeholder="08X-XXX-XXXX"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="PeopleCount" className="block text-sm font-medium text-gray-700 mb-3">
                      จำนวนคน
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="w-12 h-12 bg-[#FFB8DA] rounded-full flex items-center justify-center text-white transition hover:bg-pink-400"
                        onClick={decrementPeopleCount}
                      >
                        <span className="text-xl font-bold">-</span>
                      </button>
                      <div className="w-20 text-center">
                        <span className="text-2xl font-semibold text-gray-800">{state.peopleCount}</span>
                        <span className="ml-2 text-gray-500">คน</span>
                      </div>
                      <button
                        type="button"
                        className="w-12 h-12 bg-[#FFB8DA] rounded-full flex items-center justify-center text-white transition hover:bg-pink-400"
                        onClick={incrementPeopleCount}
                      >
                        <span className="text-xl font-bold">+</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="resDate" className="block text-sm font-medium text-gray-700 mb-1">
                        วันที่จอง
                      </label>
                      <input
                        id="resDate"
                        type="date"
                        name="resDate"
                        value={state.reservationDate}
                        onChange={handleInputChange}
                        min={format(new Date(), "yyyy-MM-dd")}
                        className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFB8DA] focus:border-transparent transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="resTime" className="block text-sm font-medium text-gray-700 mb-1">
                        เวลาที่จอง
                      </label>
                      <select
                        id="resTime"
                        name="resTime"
                        value={state.reservationTime}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'reservationTime', value: e.target.value })}
                        className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFB8DA] focus:border-transparent transition"
                        required
                      >
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-gray-200" />

                <div className="bg-[#FFF5F9] p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">รายละเอียดการจอง</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">ชื่อผู้จอง:</div>
                    <div className="font-medium">{state.name || '-'}</div>
                    <div className="text-gray-500">เบอร์โทร:</div>
                    <div className="font-medium">{state.phone || '-'}</div>
                    <div className="text-gray-500">จำนวนคน:</div>
                    <div className="font-medium">{state.peopleCount} คน</div>
                    <div className="text-gray-500">โต๊ะ:</div>
                    <div className="font-medium">
                      {state.selectedTable ? `โต๊ะที่ ${state.selectedTable}` : '-'}
                    </div>
                    <div className="text-gray-500">วันที่:</div>
                    <div className="font-medium">
                      {state.reservationDate ? format(new Date(state.reservationDate), 'dd/MM/yyyy') : '-'}
                    </div>
                    <div className="text-gray-500">เวลา:</div>
                    <div className="font-medium">
                      {state.reservationTime || '-'}
                    </div>
                  </div>
                </div>

                <div className="mt-6 lg:block hidden">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#FFB8DA] hover:bg-pink-400 text-white rounded-lg font-medium text-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⭘</span>
                        <span>กำลังดำเนินการ...</span>
                      </>
                    ) : (
                      <span>ยืนยันการจอง</span>
                    )}
                  </button>
                </div>
              </div>

              {/* table */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#FFB8DA] flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">เลือกโต๊ะ</h2>
                  </div>

                  {bookedTables.length > 0 && (
                    <div className="mb-4 p-3 bg-amber-100 rounded-md text-amber-700 text-sm">
                      <p>โต๊ะที่มีการจองแล้วในวันที่เลือก จะแสดงเป็นสีเทาและไม่สามารถเลือกได้</p>
                    </div>
                  )}

                  <TableMap 
                    selectedTable={state.selectedTable} 
                    onTableSelect={handleTableSelect} 
                    reservationDate={state.reservationDate} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile fixed bottom button */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t border-gray-200 z-20">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FFB8DA] hover:bg-pink-400 text-white rounded-lg font-medium text-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⭘</span>
                  <span>กำลังดำเนินการ...</span>
                </>
              ) : (
                <span>ยืนยันการจอง</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}