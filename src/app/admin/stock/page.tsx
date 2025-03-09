"use client";

import Admintemplate from "@/components/Admintemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ModalEditIngre from "@/components/ModalEditIngre";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  RefreshCw,
  Search,
  Upload,
  Package,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  Image,
  X,
} from "lucide-react";
import ModalAddIngre from "@/components/ModalAddIngre";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { deleteStock } from "@/actions/actions";

// คอมโพเนนต์หลอดความคืบหน้าที่ปรับแต่งได้
function CustomProgressBar({ percentage, isLowStock }) {
  return (
    <div
      className={`w-full h-2 rounded-full ${isLowStock ? "bg-red-100" : "bg-green-100"
        }`}
    >
      <div
        className={`h-full rounded-full ${isLowStock ? "bg-red-500" : "bg-green-500"
          }`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

function Stockpage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all', 'low-stock', 'normal'
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้า
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/stock?search=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("ไม่สามารถโหลดข้อมูลได้", {
        description: error.message || "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  // ฟังก์ชันสำหรับเปิด Modal เพิ่มวัตถุดิบ
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // ฟังก์ชันสำหรับปิด Modal เพิ่มวัตถุดิบ
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchProducts(); // รีเฟรชข้อมูลหลังจากเพิ่มวัตถุดิบ
  };

  // ฟังก์ชันสำหรับรีเฟรชข้อมูล
  const handleRefresh = () => {
    fetchProducts();
    toast.success("รีเฟรชข้อมูลสำเร็จ");
  };

  // ฟังก์ชันสำหรับแก้ไขสินค้า
  const handleEdit = (stockID) => {
    // ค้นหาข้อมูลของวัตถุดิบจาก stockID
    const product = products.find(p => p.stockID === stockID);

    if (product) {
      setSelectedProduct(product);
      setIsEditModalOpen(true);
    } else {
      toast.error('ไม่พบข้อมูลวัตถุดิบ');
    }
  };

  // ฟังก์ชันสำหรับลบสินค้า
  const handleDelete = async (stockID) => {
    try {
      if (!confirm(`ต้องการลบสินค้ารหัส ${stockID} ใช่หรือไม่?`)) {
        return;
      }

      const result = await deleteStock(stockID);

      if (result.success) {
        toast.success(`ลบสินค้ารหัส ${stockID} สำเร็จ`);
        fetchProducts();
      }
    } catch (error) {
      toast.error("ไม่สามารถลบสินค้านี้ได้");
      console.error(error);
    }
  };

  // ฟังก์ชันสำหรับเปิด Dialog อัพโหลดรูปภาพ
  const handleUploadImage = (stockID) => {
    setSelectedProductId(stockID);
    setIsImageUploadOpen(true);
  };

  // ฟังก์ชันสำหรับอัพโหลดรูปภาพ
  const handleSubmitImage = async (e) => {
    e.preventDefault();

    const file = fileInputRef.current?.files[0];
    if (!file) {
      toast.error("กรุณาเลือกรูปภาพ");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("stockId", selectedProductId);

    try {
      setUploadingImage(true);
      const response = await fetch("/api/uploadphoto", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("อัพโหลดรูปภาพไม่สำเร็จ");
      }

      const data = await response.json();

      if (data.success) {
        toast.success("อัพโหลดรูปภาพสำเร็จ");
        setIsImageUploadOpen(false);
        // รีเซ็ตไฟล์ input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchProducts(); // รีเฟรชข้อมูลหลังจากอัพโหลดรูปภาพ
      } else {
        throw new Error(data.message || "อัพโหลดรูปภาพไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error.message || "อัพโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // กรองข้อมูลตามตัวกรอง
  const filteredProducts = products.filter((product) => {
    const status =
      product.Quantity <= product.minQuantity ? "เหลือน้อย" : "ปกติ";

    if (selectedFilter === "low-stock" && status !== "เหลือน้อย") return false;
    if (selectedFilter === "normal" && status !== "ปกติ") return false;

    return true;
  });

  // สถิติสรุป
  const stockStats = {
    total: products.length,
    lowStock: products.filter((p) => p.Quantity <= p.minQuantity).length,
    normal: products.filter((p) => p.Quantity > p.minQuantity).length,
  };

  return (
    <Admintemplate>
      <Toaster richColors position="top-right" />
      <div className="w-full h-full p-6">
        <div className="bg-white w-full h-full rounded-3xl shadow-sm border overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">คลังสินค้า</h1>
                <p className="text-muted-foreground mt-1">
                  จัดการวัตถุดิบและติดตามปริมาณคงเหลือ
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-[#FFB8DA] hover:bg-[#fcc6e0] text-black"
                  onClick={handleOpenModal}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  เพิ่มวัตถุดิบใหม่
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  จำนวนวัตถุดิบทั้งหมด
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stockStats.total} รายการ
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  วัตถุดิบที่เหลือน้อย
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {stockStats.lowStock} รายการ
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  วัตถุดิบคงเหลือปกติ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {stockStats.normal} รายการ
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter and Search */}
          <div className="p-6 pt-0">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <Tabs
                value={selectedFilter}
                onValueChange={setSelectedFilter}
                className="w-full md:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                  <TabsTrigger value="low-stock" className="flex items-center">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    เหลือน้อย
                  </TabsTrigger>
                  <TabsTrigger value="normal" className="flex items-center">
                    <Check className="mr-1 h-3 w-3" />
                    ปกติ
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ค้นหาสินค้า..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Grid View with Card */}
          <div className="p-6 pt-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-[#FFB8DA] border-t-transparent rounded-full"></div>
                <span className="ml-3 text-muted-foreground">
                  กำลังโหลดข้อมูล...
                </span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border rounded-md bg-gray-50">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">ไม่พบข้อมูลสินค้า</h3>
                <p className="text-muted-foreground mt-1">
                  ลองเปลี่ยนคำค้นหาหรือเพิ่มวัตถุดิบใหม่
                </p>
                <Button
                  className="mt-4 bg-[#FFB8DA] hover:bg-[#fcc6e0]"
                  onClick={handleOpenModal}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  เพิ่มวัตถุดิบใหม่
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const status =
                    product.Quantity <= product.minQuantity
                      ? "เหลือน้อย"
                      : "ปกติ";
                  const isLowStock = status === "เหลือน้อย";

                  // คำนวณเปอร์เซ็นต์คงเหลือเทียบกับขั้นต่ำ
                  const minQuantity = product.minQuantity || 1; // ป้องกันกรณีที่ minQuantity เป็น 0
                  const stockPercentage = Math.min(
                    Math.max((product.Quantity / (minQuantity * 2)) * 100, 0),
                    100
                  );

                  return (
                    <Card
                      key={product.stockID}
                      className="overflow-hidden transition-all hover:shadow-md"
                    >
                      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                          <div className="relative group w-full h-full">
                            <img
                              src={product.imageUrl}
                              alt={product.ingredientName}
                              className="h-full w-full object-cover"
                            />
                            {/* เพิ่มปุ่มแก้ไขรูปภาพเมื่อโฮเวอร์ */}
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <Button
                                variant="secondary"
                                className="bg-white hover:bg-gray-100"
                                onClick={() =>
                                  handleUploadImage(product.stockID)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                เปลี่ยนรูปภาพ
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Package className="h-16 w-16 text-gray-300" />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUploadImage(product.stockID)}
                            >
                              <Upload className="h-3 w-3 mr-2" />
                              อัพโหลดรูปภาพ
                            </Button>
                          </div>
                        )}

                        {isLowStock && (
                          <Badge
                            variant="destructive"
                            className="absolute top-2 right-2 font-medium"
                          >
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            เหลือน้อย
                          </Badge>
                        )}
                      </div>

                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base font-medium">
                              {product.ingredientName}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              ID: {product.stockID}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(product.stockID)}>
                                <Edit className="mr-2 h-4 w-4" />
                                แก้ไข
                              </DropdownMenuItem>
                              {!product.imageUrl && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUploadImage(product.stockID)
                                  }
                                >
                                  <Image className="mr-2 h-4 w-4" />
                                  {product.imageUrl
                                    ? "เปลี่ยนรูปภาพ"
                                    : "อัพโหลดรูปภาพ"}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(product.stockID)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                ลบ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">
                                คงเหลือ
                              </div>
                              <div className="font-medium">
                                {product.Quantity} {product.Unit}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">
                                ขั้นต่ำ
                              </div>
                              <div className="font-medium">
                                {product.minQuantity} {product.Unit}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>สถานะคงเหลือ</span>
                              <span
                                className={
                                  isLowStock ? "text-red-500" : "text-green-500"
                                }
                              >
                                {isLowStock ? "เหลือน้อย" : "ปกติ"}
                              </span>
                            </div>

                            {/* ใช้คอมโพเนนต์หลอดความคืบหน้าที่กำหนดเอง */}
                            <CustomProgressBar
                              percentage={stockPercentage}
                              isLowStock={isLowStock}
                            />
                          </div>

                          <div className="text-xs text-muted-foreground">
                            อัปเดตล่าสุด:{" "}
                            {new Date(product.LastUpdated).toLocaleString(
                              "th-TH"
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal เพิ่มวัตถุดิบ (ปรับปรุงแล้ว) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
          ></div>
          <div className="relative z-10 w-full max-w-3xl mx-auto transform transition-all duration-300 scale-100 opacity-100">
            <ModalAddIngre closemodal={handleCloseModal} />
          </div>
        </div>
      )}

      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-3xl mx-auto">
            <ModalEditIngre
              closemodal={() => {
                setIsEditModalOpen(false);
                fetchProducts();
              }}
              product={selectedProduct}
            />
          </div>
        </div>
      )}
      {/* Dialog อัพโหลดรูปภาพ */}
      <Dialog
        open={isImageUploadOpen}
        onOpenChange={(open) => {
          setIsImageUploadOpen(open);
          if (!open && fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>อัพโหลดรูปภาพวัตถุดิบ</DialogTitle>
            <DialogDescription>
              เลือกรูปภาพสำหรับวัตถุดิบของคุณ รองรับไฟล์ .jpg, .jpeg, .png
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitImage}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="picture">รูปภาพ</Label>
                <Input
                  id="picture"
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/jpg"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImageUploadOpen(false)}
                disabled={uploadingImage}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                disabled={uploadingImage}
                className="bg-[#FFB8DA] hover:bg-[#fcc6e0] text-black"
              >
                {uploadingImage ? "กำลังอัพโหลด..." : "อัพโหลด"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Admintemplate>
  );
}

export default Stockpage;
