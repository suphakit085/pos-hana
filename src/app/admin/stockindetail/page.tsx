import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockInDetailAdd from "@/components/stockindetail/StockInDetailAdd2";
import AdminNavbar from "@/components/AdminNavbar";
import Admintemplate from "@/components/Admintemplate";

export default function StockInDetailPage() {
  return (
    <div>
      <Admintemplate>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              นำเข้าสินค้า
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StockInDetailAdd />
          </CardContent>
        </Card>
      </Admintemplate>
    </div>
  );
}
