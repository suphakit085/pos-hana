"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronLeft, Search, X, History, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useParams } from 'next/navigation';

// interfaces
interface Tables {
  tabId: number;
  tabTypes: string;
}

interface MenuItem {
  menuItemID: number;
  NameTHA: string;
  NameENG: string;
  menuItemsPrice: number;
  itemImage: string;
  description: string;
  MenuItemCreatedAt: Date;
  category: 'snack' | 'soup' | 'noodle' | 'vegetables' | 'meat' | 'beverage';
  buffetTypeID: number;
}

interface OrderItem {
  orderID: number;
  menuItemID: number;
  quantity: number;
}

interface OrderDetails {
  orderID: number;
  orderStatus: string;
  orderCreatedAt: Date;
  tabID: number;
  empID: number;
  items: OrderItem[];
}

// Fake data
const tableData: Tables[] = [
  { tabId: 10, tabTypes: 'normal' },
];

const menuData: { items: MenuItem[]; } = {
  items: [
    // Snack category
    {
      menuItemID: 101,
      NameTHA: "ปีกไก่ทอด",
      NameENG: "Chicken Wings",
      menuItemsPrice: 100,
      itemImage: "/api/placeholder/300/200",
      description: "Crispy fried chicken wings",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "snack",
      buffetTypeID: 1
    },
    {
      menuItemID: 102,
      NameTHA: "ปอเปี๊ยะทอด",
      NameENG: "Spring Rolls",
      menuItemsPrice: 0,
      itemImage: "/api/placeholder/300/200",
      description: "Crispy vegetable spring rolls",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "snack",
      buffetTypeID: 1
    },
    {
      menuItemID: 103,
      NameTHA: "เต้าหู้ทอด",
      NameENG: "Fried Tofu",
      menuItemsPrice: 80,
      itemImage: "/api/placeholder/300/200",
      description: "Golden fried tofu with dipping sauce",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "snack",
      buffetTypeID: 1
    },
    {
      menuItemID: 104,
      NameTHA: "เกี๊ยวซ่า",
      NameENG: "Gyoza",
      menuItemsPrice: 90,
      itemImage: "/api/placeholder/300/200",
      description: "Pan-fried Japanese dumplings",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "snack",
      buffetTypeID: 1
    },
    {
      menuItemID: 105,
      NameTHA: "ปลาหมึกทอด",
      NameENG: "Calamari",
      menuItemsPrice: 120,
      itemImage: "/api/placeholder/300/200",
      description: "Crispy fried squid rings",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "snack",
      buffetTypeID: 1
    },

    // Soup category
    {
      menuItemID: 201,
      NameTHA: "ต้มยำ",
      NameENG: "Tomyum Soup",
      menuItemsPrice: 150,
      itemImage: "/api/placeholder/300/200",
      description: "Spicy and sour traditional Thai soup",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "soup",
      buffetTypeID: 1
    },
    {
      menuItemID: 202,
      NameTHA: "แกงจืด",
      NameENG: "Clear Soup",
      menuItemsPrice: 120,
      itemImage: "/api/placeholder/300/200",
      description: "Light and clear vegetable soup",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "soup",
      buffetTypeID: 1
    },
    {
      menuItemID: 203,
      NameTHA: "ซุปมิโซะ",
      NameENG: "Miso Soup",
      menuItemsPrice: 130,
      itemImage: "/api/placeholder/300/200",
      description: "Traditional Japanese soybean soup",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "soup",
      buffetTypeID: 1
    },
    {
      menuItemID: 204,
      NameTHA: "ซุปข้าวโพด",
      NameENG: "Corn Soup",
      menuItemsPrice: 110,
      itemImage: "/api/placeholder/300/200",
      description: "Creamy sweet corn soup",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "soup",
      buffetTypeID: 1
    },
    {
      menuItemID: 205,
      NameTHA: "ซุปเห็ด",
      NameENG: "Mushroom Soup",
      menuItemsPrice: 140,
      itemImage: "/api/placeholder/300/200",
      description: "Rich and earthy mushroom soup",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "soup",
      buffetTypeID: 1
    },

    // Noodle category
    {
      menuItemID: 301,
      NameTHA: "อุด้ง",
      NameENG: "Udon",
      menuItemsPrice: 100,
      itemImage: "/api/placeholder/300/200",
      description: "Thick Japanese wheat noodles",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "noodle",
      buffetTypeID: 1
    },
    {
      menuItemID: 302,
      NameTHA: "ราเมน",
      NameENG: "Ramen",
      menuItemsPrice: 120,
      itemImage: "/api/placeholder/300/200",
      description: "Japanese noodle soup",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "noodle",
      buffetTypeID: 1
    },
    {
      menuItemID: 303,
      NameTHA: "วุ้นเส้น",
      NameENG: "Glass Noodles",
      menuItemsPrice: 90,
      itemImage: "/api/placeholder/300/200",
      description: "Transparent noodles made from starch",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "noodle",
      buffetTypeID: 1
    },
    {
      menuItemID: 304,
      NameTHA: "บะหมี่",
      NameENG: "Egg Noodles",
      menuItemsPrice: 95,
      itemImage: "/api/placeholder/300/200",
      description: "Yellow wheat noodles with egg",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "noodle",
      buffetTypeID: 1
    },
    {
      menuItemID: 305,
      NameTHA: "เส้นหมี่",
      NameENG: "Rice Noodles",
      menuItemsPrice: 85,
      itemImage: "/api/placeholder/300/200",
      description: "Thin rice flour noodles",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "noodle",
      buffetTypeID: 1
    },

    // Vegetables category
    {
      menuItemID: 401,
      NameTHA: "ผักกาดขาว",
      NameENG: "Chinese Cabbage",
      menuItemsPrice: 70,
      itemImage: "/api/placeholder/300/200",
      description: "Fresh and crisp Chinese cabbage",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "vegetables",
      buffetTypeID: 1
    },
    {
      menuItemID: 402,
      NameTHA: "ผักบุ้ง",
      NameENG: "Morning Glory",
      menuItemsPrice: 75,
      itemImage: "/api/placeholder/300/200",
      description: "Stir-fried water spinach",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "vegetables",
      buffetTypeID: 1
    },
    {
      menuItemID: 403,
      NameTHA: "เห็ดรวม",
      NameENG: "Mushroom Platter",
      menuItemsPrice: 90,
      itemImage: "/api/placeholder/300/200",
      description: "Assorted fresh mushrooms",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "vegetables",
      buffetTypeID: 1
    },
    {
      menuItemID: 404,
      NameTHA: "ข้าวโพด",
      NameENG: "Corn",
      menuItemsPrice: 65,
      itemImage: "/api/placeholder/300/200",
      description: "Sweet corn on the cob",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "vegetables",
      buffetTypeID: 1
    },
    {
      menuItemID: 405,
      NameTHA: "ผักรวมมิตร",
      NameENG: "Mixed Vegetables",
      menuItemsPrice: 85,
      itemImage: "/api/placeholder/300/200",
      description: "Assortment of seasonal vegetables",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "vegetables",
      buffetTypeID: 1
    },

    // Meat category
    {
      menuItemID: 501,
      NameTHA: "เนื้อวัวสไลด์",
      NameENG: "Sliced Beef",
      menuItemsPrice: 180,
      itemImage: "/api/placeholder/300/200",
      description: "Thinly sliced premium beef",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "meat",
      buffetTypeID: 1
    },
    {
      menuItemID: 502,
      NameTHA: "หมูสามชั้น",
      NameENG: "Pork Belly",
      menuItemsPrice: 150,
      itemImage: "/api/placeholder/300/200",
      description: "Thinly sliced pork belly",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "meat",
      buffetTypeID: 1
    },
    {
      menuItemID: 503,
      NameTHA: "ไก่สไลด์",
      NameENG: "Chicken Slices",
      menuItemsPrice: 130,
      itemImage: "/api/placeholder/300/200",
      description: "Thinly sliced chicken breast",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "meat",
      buffetTypeID: 1
    },
    {
      menuItemID: 504,
      NameTHA: "เนื้อแกะสไลด์",
      NameENG: "Lamb Slices",
      menuItemsPrice: 200,
      itemImage: "/api/placeholder/300/200",
      description: "Thinly sliced premium lamb",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "meat",
      buffetTypeID: 1
    },
    {
      menuItemID: 505,
      NameTHA: "ทะเลรวม",
      NameENG: "Seafood Mix",
      menuItemsPrice: 170,
      itemImage: "/api/placeholder/300/200",
      description: "Mix of shrimp, squid, and fish",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "meat",
      buffetTypeID: 1
    },

    // Beverage category
    {
      menuItemID: 601,
      NameTHA: "ชาเย็น",
      NameENG: "Thai Iced Tea",
      menuItemsPrice: 60,
      itemImage: "/api/placeholder/300/200",
      description: "Sweet Thai tea with milk",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "beverage",
      buffetTypeID: 1
    },
    {
      menuItemID: 602,
      NameTHA: "โซดามะนาว",
      NameENG: "Lemon Soda",
      menuItemsPrice: 55,
      itemImage: "/api/placeholder/300/200",
      description: "Refreshing lemon soda",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "beverage",
      buffetTypeID: 1
    },
    {
      menuItemID: 603,
      NameTHA: "กาแฟเย็น",
      NameENG: "Iced Coffee",
      menuItemsPrice: 65,
      itemImage: "/api/placeholder/300/200",
      description: "Thai style iced coffee with milk",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "beverage",
      buffetTypeID: 1
    },
    {
      menuItemID: 604,
      NameTHA: "น้ำมะพร้าว",
      NameENG: "Coconut Juice",
      menuItemsPrice: 70,
      itemImage: "/api/placeholder/300/200",
      description: "Fresh coconut juice",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "beverage",
      buffetTypeID: 1
    },
    {
      menuItemID: 605,
      NameTHA: "สมูทตี้ผลไม้",
      NameENG: "Fruit Smoothie",
      menuItemsPrice: 80,
      itemImage: "/api/placeholder/300/200",
      description: "Blended fresh seasonal fruits",
      MenuItemCreatedAt: new Date("2025-01-01"),
      category: "beverage",
      buffetTypeID: 1
    }
  ]
};

// categories transranslation
const categoryTranslations: Record<MenuItem['category'], string> = {
  snack: "ของทานเล่น",
  soup: "น้ำซุป",
  noodle: "เส้น",
  vegetables: "ผัก",
  meat: "เนื้อ",
  beverage: "เครื่องดื่ม"
};

const OrderPage = () => {
  // ดึงค่า ID จาก URL
  const params = useParams();
  const tableId = params.id as string;
  
  // State variables
  const [currentTable, setCurrentTable] = useState<Tables | null>(tableData[0]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuItem['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orderHistory, setOrderHistory] = useState<OrderDetails[]>([]);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buffetTypeID, setBuffetTypeID] = useState<number | null>(null);
  const [buffetTypeName, setBuffetTypeName] = useState<string>("");

  // ใช้ tableId ในการดึงข้อมูลโต๊ะหรือออเดอร์เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    if (tableId) {
      console.log("ID from URL:", tableId);
      
      // ตรวจสอบว่า tableId เป็นตัวเลขหรือไม่
      const isNumeric = /^\d+$/.test(tableId);
      
      if (isNumeric) {
        // ถ้าเป็นตัวเลข ให้ดึงข้อมูลโต๊ะจาก API ตาม ID
        fetch(`/api/tables/${tableId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('ไม่พบข้อมูลโต๊ะ');
            }
            return response.json();
          })
          .then(data => {
            console.log("Table data:", data);
            setCurrentTable({
              tabId: data.tabID,
              tabTypes: data.tabTypes || 'ทั่วไป'
            });
            // ในกรณีนี้ เราไม่มีข้อมูลประเภทบุฟเฟต์ จึงใช้ค่าเริ่มต้นเป็น 1
            setBuffetTypeID(1);
            setBuffetTypeName("บุฟเฟต์หมู");
          })
          .catch(error => {
            console.error("Error fetching table data:", error);
            setError("ไม่สามารถดึงข้อมูลโต๊ะได้");
          });
      } else {
        // ถ้าไม่ใช่ตัวเลข (เป็น UUID) ให้ดึงข้อมูลออเดอร์จาก API
        fetch(`/api/orders/get?id=${tableId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('ไม่พบข้อมูลออเดอร์');
            }
            return response.json();
          })
          .then(data => {
            console.log("Order data:", data);
            
            // เก็บข้อมูลประเภทบุฟเฟต์
            if (data.buffetType) {
              setBuffetTypeID(data.buffetType.id);
              setBuffetTypeName(data.buffetType.name);
            } else {
              // ถ้าไม่มีข้อมูลประเภทบุฟเฟต์ ใช้ค่าเริ่มต้น
              setBuffetTypeID(1);
              setBuffetTypeName("บุฟเฟต์หมู");
            }
            
            if (data.Tables_tabID) {
              // ดึงข้อมูลโต๊ะจาก API ตาม tabID ที่ได้จากออเดอร์
              return fetch(`/api/tables/${data.Tables_tabID}`)
                .then(response => {
                  if (!response.ok) {
                    throw new Error('ไม่พบข้อมูลโต๊ะ');
                  }
                  return response.json();
                })
                .then(tableData => {
                  console.log("Table data from order:", tableData);
                  setCurrentTable({
                    tabId: tableData.tabID,
                    tabTypes: tableData.tabTypes || 'ทั่วไป'
                  });
                });
            } else {
              // ถ้าไม่มีข้อมูลโต๊ะในออเดอร์ ให้ใช้ข้อมูลจากออเดอร์แทน
              setCurrentTable({
                tabId: data.Tables_tabID || 0,
                tabTypes: data.tabName || 'ไม่ระบุ'
              });
            }
          })
          .catch(error => {
            console.error("Error fetching order/table data:", error);
            setError("ไม่สามารถดึงข้อมูลโต๊ะหรือออเดอร์ได้");
          });
      }
    }
  }, [tableId]);

  // ดึงข้อมูลเมนูจาก API
  useEffect(() => {
    setLoading(true);
    fetch('/api/menuItems')
      .then(response => {
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลเมนูได้');
        }
        return response.json();
      })
      .then(data => {
        // แปลงข้อมูลจาก API ให้ตรงกับ interface MenuItem
        const formattedData: MenuItem[] = data.map((item: any) => ({
          menuItemID: item.menuItemsID,
          NameTHA: item.menuItemNameTHA,
          NameENG: item.menuItemNameENG,
          menuItemsPrice: item.menuItemsPrice,
          itemImage: item.itemImage,
          description: item.description || '',
          MenuItemCreatedAt: new Date(item.menuItemCreateAt),
          category: item.category as MenuItem['category'],
          buffetTypeID: item.BuffetTypes_buffetTypeID
        }));
        console.log("Menu items loaded:", formattedData);
        setMenuItems(formattedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching menu items:", error);
        setError("ไม่สามารถดึงข้อมูลเมนูได้");
        setLoading(false);
      });
  }, []);

  // Order management functions 
  const addToOrder = (item: MenuItem) => {
    const existingItem = selectedItems.find(i => i.menuItemID === item.menuItemID);
    if (existingItem) {
      setSelectedItems(selectedItems.map(i =>
        i.menuItemID === item.menuItemID ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, {
        menuItemID: item.menuItemID,
        menuItem: item,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (menuItemID: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setSelectedItems(selectedItems.map(item =>
        item.menuItemID === menuItemID ? { ...item, quantity: newQuantity } : item
      ));
    } else {
      setSelectedItems(selectedItems.filter(item => item.menuItemID !== menuItemID));
    }
  };

  const confirmOrder = async () => {
    if (currentTable && selectedItems.length > 0) {
      try {
        // สร้างข้อมูลออเดอร์
        const orderData = {
          Tables_tabID: currentTable.tabId,
          Employee_empID: 1, // Default employee ID
          BuffetTypes_buffetTypeID: buffetTypeID || 1,
          totalCustomerCount: 1, // ค่าเริ่มต้น
          items: selectedItems.map(item => ({
            MenuItems_menuItemsID: item.menuItemID,
            Quantity: item.quantity
          }))
        };

        // ส่งข้อมูลไปยัง API ใหม่
        const response = await fetch('/api/orders/submit-menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error('ไม่สามารถสร้างออเดอร์ได้');
        }

        const result = await response.json();
        console.log('Order created:', result);

        // เพิ่มในประวัติการสั่งอาหาร
        const newOrder: OrderDetails = {
          orderID: result.orderID || orderHistory.length + 1,
          orderStatus: "Unpaid",
          orderCreatedAt: new Date(),
          tabID: currentTable.tabId,
          empID: 1, // Default employee ID
          items: selectedItems.map(item => ({
            orderID: 0,
            menuItemID: item.menuItemID,
            quantity: item.quantity
          }))
        };

        // Add to order history
        setOrderHistory([...orderHistory, newOrder]);

        // Clear current order
        setSelectedItems([]);

        // แสดงข้อความแจ้งเตือน
        alert('สั่งอาหารสำเร็จ!');
      } catch (error) {
        console.error('Error creating order:', error);
        alert('เกิดข้อผิดพลาดในการสั่งอาหาร กรุณาลองใหม่อีกครั้ง');
      }
    } else {
      alert('กรุณาเลือกรายการอาหารก่อนสั่ง');
    }
  };

  // Filtering menu items
  const filteredItems = useMemo(() => {
    if (!menuItems || menuItems.length === 0) {
      console.log("No menu items available");
      return [];
    }
    
    console.log("Filtering menu items with buffetTypeID:", buffetTypeID);
    console.log("Active category:", activeCategory);
    
    const filtered = menuItems.filter(item => {
      // กรองตามหมวดหมู่ที่เลือก
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      
      // กรองตามคำค้นหา
      const searchMatch = 
        searchQuery === "" ||
        item.NameTHA.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.NameENG.toLowerCase().includes(searchQuery.toLowerCase());
      
      // กรองตามประเภทบุฟเฟต์
      let buffetTypeMatch = true;
      
      // ถ้าไม่มีการระบุประเภทบุฟเฟต์ ให้แสดงทุกเมนู
      if (!buffetTypeID) {
        buffetTypeMatch = true;
      }
      // บุฟเฟต์หมู (ID 1) แสดงเฉพาะเมนูหมู
      else if (buffetTypeID === 1) {
        // แสดงทุกเมนูที่ไม่ใช่เนื้อวัว
        buffetTypeMatch = !(
          item.NameTHA.includes('เนื้อวัว') || 
          item.NameTHA.includes('เนื้อโคขุน') || 
          item.NameENG.toLowerCase().includes('beef')
        );
      }
      // บุฟเฟต์หมู+เนื้อ (ID 2) แสดงทุกเมนู
      else if (buffetTypeID === 2) {
        buffetTypeMatch = true;
      }
      
      return categoryMatch && searchMatch && buffetTypeMatch;
    });
    
    console.log("Filtered items:", filtered.length);
    return filtered;
  }, [menuItems, activeCategory, searchQuery, buffetTypeID]);

  // แสดงข้อความเมื่อกำลังโหลดข้อมูล
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">กำลังโหลดข้อมูล</h2>
          <p className="text-gray-700">กรุณารอสักครู่...</p>
        </div>
      </div>
    );
  }

  // แสดงข้อความเมื่อเกิดข้อผิดพลาด
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">เกิดข้อผิดพลาด</h2>
          <p className="mb-6 text-gray-700">{error}</p>
          <div className="flex flex-col space-y-3">
            <Button className="w-full" onClick={() => window.location.reload()}>
              ลองใหม่อีกครั้ง
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
              กลับไปหน้าหลัก
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">เมนูอาหาร</h1>
          <p className="text-gray-600">โต๊ะ {currentTable?.tabId || tableId}</p>
          <div className="mt-2 p-2 bg-pink-50 rounded-md border border-pink-200">
            <p className="text-gray-700">
              <span className="font-semibold">ประเภทบุฟเฟต์:</span> {buffetTypeName || "ไม่ระบุ"}
              {buffetTypeID === 1 && (
                <span className="block text-sm text-pink-600 mt-1">
                  * สามารถสั่งได้ทุกเมนูยกเว้นเมนูเนื้อวัว
                </span>
              )}
              {buffetTypeID === 2 && (
                <span className="block text-sm text-pink-600 mt-1">
                  * สามารถสั่งได้ทุกเมนูรวมถึงเมนูเนื้อวัว
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <History className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>ประวัติการสั่งอาหาร</SheetTitle>
                <SheetDescription>
                  รายการอาหารที่สั่งไปแล้ว
                </SheetDescription>
              </SheetHeader>
              {/* Order History Content */}
              <div className="mt-6">
                {orderHistory.length === 0 ? (
                  <p className="text-center text-gray-500">ยังไม่มีประวัติการสั่งอาหาร</p>
                ) : (
                  orderHistory.map((order) => (
                    <div key={order.orderID} className="mb-6 p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">คำสั่งซื้อ #{order.orderID}</h3>
                        <Badge variant={order.orderStatus === 'completed' ? 'default' : 'outline'}>
                          {order.orderStatus === 'pending' ? 'รอดำเนินการ' : 'เสร็จสิ้น'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {new Date(order.orderCreatedAt).toLocaleString('th-TH')}
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item) => {
                          const menuItem = menuItems.find(m => m.menuItemID === item.menuItemID);
                          return menuItem ? (
                            <div key={`${order.orderID}-${item.menuItemID}`} className="flex justify-between">
                              <span>{menuItem.NameTHA} x {item.quantity}</span>
                              <span>{menuItem.menuItemsPrice * item.quantity} บาท</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {selectedItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {selectedItems.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>รายการอาหารที่เลือก</SheetTitle>
                <SheetDescription>
                  รายการอาหารที่คุณเลือกไว้
                </SheetDescription>
              </SheetHeader>
              {/* Cart Content */}
              <div className="mt-6">
                {selectedItems.length === 0 ? (
                  <p className="text-center text-gray-500">ยังไม่มีรายการอาหารที่เลือก</p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {selectedItems.map((item) => (
                        <div key={item.menuItemID} className="flex justify-between mb-4 pb-4 border-b">
                          <div>
                            <h3 className="font-bold">{item.menuItem.NameTHA}</h3>
                            <p className="text-sm text-gray-600">{item.quantity} x {item.menuItem.menuItemsPrice} บาท</p>
                            <div className="flex items-center mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.menuItemID, Math.max(1, item.quantity - 1))}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <span className="mx-2">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.menuItemID, item.quantity + 1)}
                              >
                                <ChevronDown className="h-4 w-4 rotate-90" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end">
                            <span className="font-bold">{item.menuItem.menuItemsPrice * item.quantity} บาท</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500"
                              onClick={() => updateQuantity(item.menuItemID, 0)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 border-t pt-4">
                      <div className="flex justify-between font-bold text-lg mb-4">
                        <span>รวมทั้งหมด</span>
                        <span>
                          {selectedItems.reduce((total, item) => total + (item.menuItem.menuItemsPrice * item.quantity), 0)} บาท
                        </span>
                      </div>
                      <Button className="w-full" onClick={confirmOrder}>
                        ยืนยันการสั่งอาหาร
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="ค้นหาเมนูอาหาร..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex overflow-x-auto space-x-2 pb-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            className="whitespace-nowrap"
            onClick={() => setActiveCategory('all')}
          >
            ทั้งหมด
          </Button>
          {Object.entries(categoryTranslations).map(([key, label]) => (
            <Button
              key={key}
              variant={activeCategory === key ? 'default' : 'outline'}
              className="whitespace-nowrap"
              onClick={() => setActiveCategory(key as MenuItem['category'])}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg p-8">
          <p className="text-gray-500 mb-4">ไม่พบเมนูอาหารที่ค้นหา</p>
          <Button variant="outline" onClick={() => {
            setActiveCategory('all');
            setSearchQuery('');
          }}>
            แสดงเมนูทั้งหมด
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-gray-600">พบ {filteredItems.length} เมนู</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.menuItemID} className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={item.itemImage || "/placeholder-food.jpg"}
                    alt={item.NameTHA}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-food.jpg";
                    }}
                  />
                  {item.NameTHA.includes('เนื้อวัว') || item.NameTHA.includes('เนื้อโคขุน') || item.NameENG.toLowerCase().includes('beef') ? (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      เนื้อวัว
                    </div>
                  ) : null}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{item.NameTHA}</h3>
                      <p className="text-sm text-gray-500">{item.NameENG}</p>
                    </div>
                    <span className="font-bold">{item.menuItemsPrice} บาท</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <Button 
                    className="w-full" 
                    onClick={() => addToOrder(item)}
                    disabled={buffetTypeID === 1 && (item.NameTHA.includes('เนื้อวัว') || item.NameTHA.includes('เนื้อโคขุน') || item.NameENG.toLowerCase().includes('beef'))}
                  >
                    {buffetTypeID === 1 && (item.NameTHA.includes('เนื้อวัว') || item.NameTHA.includes('เนื้อโคขุน') || item.NameENG.toLowerCase().includes('beef')) 
                      ? 'ไม่สามารถสั่งได้' 
                      : 'เพิ่มในรายการ'
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Order Confirmation Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>รายละเอียดคำสั่งซื้อ</DialogTitle>
            <DialogDescription>
              รายการอาหารที่คุณสั่ง
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            {selectedItems.map((item) => (
              <div key={item.menuItemID} className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="font-bold">{item.menuItem.NameTHA}</h3>
                  <p className="text-sm text-gray-500">{item.menuItem.NameENG}</p>
                  <p className="text-sm text-gray-600">{item.quantity} x {item.menuItem.menuItemsPrice} บาท</p>
                </div>
                <span className="font-bold">{item.menuItem.menuItemsPrice * item.quantity} บาท</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>รวมทั้งหมด</span>
              <span>
                {selectedItems.reduce((total, item) => total + (item.menuItem.menuItemsPrice * item.quantity), 0)} บาท
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmOrder}>ยืนยันการสั่งอาหาร</Button>
            <DialogClose asChild>
              <Button variant="outline">ปิด</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPage;