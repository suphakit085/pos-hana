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
  // State variables
  //??
  const [currentTable, setCurrentTable] = useState<Tables | null>(tableData[0]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuItem['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orderHistory, setOrderHistory] = useState<OrderDetails[]>([]);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

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

  const confirmOrder = () => {
    if (currentTable && selectedItems.length > 0) {
      const newOrder: OrderDetails = {
        orderID: orderHistory.length + 1, // Start from 1 and increment
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
    }
  };

  // Filtering menu items
  const filteredItems = useMemo(() => {
    return menuData.items.filter(item =>
      (activeCategory === 'all' || item.category === activeCategory) &&
      (
        item.NameENG.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.NameTHA.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex min-h-screen bg-white text-[#4D4D4D]">
      {/* Main Area */}
      <div className="flex-1 p-6 py-10 bg-gray-50">
        {/* Mobile Table Information */}
        {currentTable && (
          <div className="mb-6 p-4 bg-[#FFF5F9] rounded-lg md:hidden">
            <h3 className="font-bold text-lg mb-2">ข้อมูลโต๊ะ</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">หมายเลขโต๊ะ:</div>
              <div className="font-medium">{currentTable.tabId}</div>
              {/* can pull? */}
              <div className="text-gray-600">จำนวนลูกค้า:</div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 flex items-center justify-center" 
              onClick={() => setIsHistoryDialogOpen(true)}
            >
              <History className="mr-2 h-4 w-4" />
              ประวัติการสั่งอาหาร
            </Button>
          </div>
        )}

        {/* Menu Items */}
        <h2 className="text-2xl font-bold mb-6">
          {activeCategory === 'all' ? 'รายการอาหารทั้งหมด' : categoryTranslations[activeCategory as MenuItem['category']]} ({filteredItems.length} เมนู)
        </h2>

        {/* Category Navigation */}
        <div className="bg-white z-10 mb-6">
          {/* Mobile Dropdown */}
          <div className="md:hidden p-4">
            <Select
              value={activeCategory}
              onValueChange={(value) => setActiveCategory(value as MenuItem['category'] | 'all')}
            >
              <SelectTrigger className="w-full bg-white border border-gray-200">
                <SelectValue placeholder="เลือกหมวดหมู่อาหาร">
                  {activeCategory === 'all' ? 'ทั้งหมด' : categoryTranslations[activeCategory as MenuItem['category']]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {Object.keys(categoryTranslations).map((category) => (
                  <SelectItem key={category} value={category}>
                    {categoryTranslations[category as MenuItem['category']]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex overflow-x-auto">
            <div className="flex space-x-4 px-4 pb-2 pt-2">
              <Button
                key="all"
                variant={activeCategory === 'all' ? "default" : "outline"}
                onClick={() => setActiveCategory('all')}
                className={`whitespace-nowrap ${activeCategory === 'all'
                  ? 'bg-[#FFB8DA] text-white hover:bg-[#FFB8DA]/80'
                  : 'bg-white text-[#4D4D4D] hover:bg-gray-100'
                  }`}
              >
                ทั้งหมด
              </Button>
              {Object.keys(categoryTranslations).map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category as MenuItem['category'])}
                  className={`whitespace-nowrap ${activeCategory === category
                    ? 'bg-[#FFB8DA] text-white hover:bg-[#FFB8DA]/80'
                    : 'bg-white text-[#4D4D4D] hover:bg-gray-100'
                    }`}
                >
                  {categoryTranslations[category as MenuItem['category']]}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white z-10 px-6 pb-4 pt-2 mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="ค้นหาเมนู"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.menuItemID} className="overflow-hidden">
              <img
                src={item.itemImage}
                alt={item.NameENG}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-lg font-bold">{item.NameTHA}</h2>
                    <p className="text-sm text-gray-600">{item.NameENG}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">฿{item.menuItemsPrice}</p>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const existingItem = selectedItems.find(i => i.menuItemID === item.menuItemID);
                        if (existingItem && existingItem.quantity > 0) {
                          updateQuantity(item.menuItemID, existingItem.quantity - 1);
                        }
                      }}
                      className="w-8 h-8 p-0"
                    >
                      -
                    </Button>
                    <span>
                      {selectedItems.find(i => i.menuItemID === item.menuItemID)?.quantity || 0}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToOrder(item)}
                      className="w-8 h-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-96 bg-white border-l p-6 pt-16 hidden md:block">
        {/* Table Information */}
        {currentTable && (
          <div className="mb-6 p-4 bg-[#FFF5F9] rounded-lg">
            <h3 className="font-bold text-lg mb-2">ข้อมูลโต๊ะ</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">หมายเลขโต๊ะ:</div>
              <div className="font-medium">{currentTable.tabId}</div>
              {/* can pull? */}
              <div className="text-gray-600">จำนวนลูกค้า:</div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 flex items-center justify-center" 
              onClick={() => setIsHistoryDialogOpen(true)}
            >
              <History className="mr-2 h-4 w-4" />
              ประวัติการสั่งอาหาร
            </Button>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-bold">รายการออเดอร์</h2>
        </div>

        {selectedItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            ยังไม่มีรายการที่เลือก
          </div>
        ) : (
          selectedItems.map((item) => (
            <div key={item.menuItemID} className="flex justify-between mb-4 pb-4 border-b">
              <div>
                <h3 className="font-bold">{item.menuItem.menuItemNameTHA}</h3>
                <p className="text-sm text-gray-600">{item.quantity} x {item.menuItem.menuItemsPrice} บาท</p>
                <div className="flex items-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => updateQuantity(item.menuItemID, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => updateQuantity(item.menuItemID, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(item.menuItemID, 0)}
                className="text-red-500"
              >
                ลบ
              </Button>
            </div>
          ))
        )}

        <Button
          className="w-full mt-6 bg-[#FFB8DA] hover:bg-[#FFB8DA]/80 text-white"
          disabled={selectedItems.length === 0}
          onClick={confirmOrder}
        >
          ยืนยันออเดอร์
        </Button>
      </div>

      {/* Mobile Order */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex space-x-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" />
              รายการออเดอร์ ({selectedItems.reduce((sum, item) => sum + item.quantity, 0)})
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>รายการออเดอร์</SheetTitle>
              <SheetDescription>
                รายการอาหารที่คุณเลือก
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
              {selectedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  ยังไม่มีรายการที่เลือก
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item.menuItemID} className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <h3 className="font-bold">{item.menuItem.menuItemNameTHA}</h3>
                        <p className="text-sm text-gray-500">{item.menuItem.menuItemNameENG}</p>
                        <p className="text-sm text-gray-600">{item.quantity} x {item.menuItem.menuItemsPrice} บาท</p>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => updateQuantity(item.menuItemID, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => updateQuantity(item.menuItemID, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.menuItemID, 0)}
                          className="ml-2 text-red-500"
                        >
                          ลบ
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6">
              <Button
                className="w-full bg-[#FFB8DA] hover:bg-[#FFB8DA]/80 text-white"
                disabled={selectedItems.length === 0}
                onClick={() => {
                  confirmOrder();
                }}
              >
                ยืนยันออเดอร์
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Button
          className="flex-1 bg-[#FFB8DA] hover:bg-[#FFB8DA]/80 text-white"
          disabled={selectedItems.length === 0}
          onClick={confirmOrder}
        >
          ยืนยันการออเดอร์
        </Button>
      </div>

      {/* Order History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ประวัติการสั่งอาหาร</DialogTitle>
            <DialogDescription>
              ประวัติการสั่งอาหารของโต๊ะ {currentTable?.tabId}
            </DialogDescription>
          </DialogHeader>

          {orderHistory.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              ยังไม่มีประวัติการสั่งอาหาร
            </div>
          ) : (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {orderHistory.map((order) => (
                <div key={order.orderID} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-bold">ออเดอร์ #{order.orderID}</h3>
                      <p className="text-sm text-gray-500">
                        {order.orderCreatedAt.toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge
                      className={order.orderStatus === "Paid" ? "bg-green-500" : "bg-yellow-500"}
                    >
                      {order.orderStatus === "Paid" ? "ชำระแล้ว" : "ยังไม่ชำระ"}
                    </Badge>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รายการ</TableHead>
                        <TableHead className="text-right">จำนวน</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => {
                        const menuItem = menuData.items.find(m => m.menuItemID === item.menuItemID);
                        return (
                          <TableRow key={`${order.orderID}-${item.menuItemID}`}>
                            <TableCell>
                              {menuItem ? (
                                <div>
                                  <div className="font-medium">{menuItem.NameTHA}</div>
                                  <div className="text-sm text-gray-500">{menuItem.NameENG}</div>
                                </div>
                              ) : (
                                `รายการ #${item.menuItemID}`
                              )}
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
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