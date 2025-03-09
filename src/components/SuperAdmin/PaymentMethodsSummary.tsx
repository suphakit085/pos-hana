// src/components/SuperAdmin/PaymentMethodsSummary.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  BanknoteIcon, 
  Smartphone, 
  CircleDollarSign, 
  ReceiptIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';

interface PaymentMethod {
  type: string;
  amount: number;
  count: number;
  display: string;
}

interface PaymentMethodsProps {
  timeRange?: string;
}

const PaymentMethodsSummary: React.FC<PaymentMethodsProps> = ({ timeRange = '30days' }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalBills, setTotalBills] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/superadmin/payment-methods?timeRange=${timeRange}`);
        
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลวิธีการชำระเงินได้');
        }
        
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
        setTotalAmount(data.totalAmount || 0);
        setTotalBills(data.totalBills || 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError('ไม่สามารถโหลดข้อมูลวิธีการชำระเงินได้');
        
        // ใช้ข้อมูลตัวอย่างในกรณีที่เกิดข้อผิดพลาด
        setPaymentMethods([
          { type: 'cash', amount: 12500, count: 8, display: 'เงินสด' },
          { type: 'promptpay', amount: 9800, count: 5, display: 'พร้อมเพย์' },
          { type: 'credit', amount: 6200, count: 2, display: 'บัตรเครดิต' }
        ]);
        setTotalAmount(28500);
        setTotalBills(15);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [timeRange]);

  // รูปแบบของเงินบาท
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('฿', '');
  };

  // เลือกไอคอนตามประเภทการชำระเงิน
  const getPaymentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cash':
        return <BanknoteIcon className="h-5 w-5 text-green-500" />;
      case 'credit':
      case 'debit':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'promptpay':
      case 'qrcode':
        return <Smartphone className="h-5 w-5 text-purple-500" />;
      case 'transfer':
        return <CircleDollarSign className="h-5 w-5 text-teal-500" />;
      default:
        return <ReceiptIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-green-500" />
          วิธีชำระเงิน
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-gray-500">{error}</div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-4 text-gray-500">ไม่พบข้อมูลการชำระเงิน</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">ยอดชำระทั้งหมด</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)} บาท</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">จำนวนบิล</p>
                <p className="text-2xl font-bold">{totalBills}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              {paymentMethods.map((method, index) => (
                <div key={method.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(method.type)}
                    <span className="text-sm font-medium">{method.display}</span>
                  </div>
                  <div>
                    <p className="text-right font-medium">{formatCurrency(method.amount)} บาท</p>
                    <p className="text-xs text-gray-500 text-right">{method.count} บิล</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">เฉลี่ยต่อบิล</span>
                </div>
                <div>
                  <p className="text-right font-medium">
                    {formatCurrency(totalBills > 0 ? totalAmount / totalBills : 0)} บาท
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsSummary;