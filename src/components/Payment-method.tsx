import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Banknote, QrCode } from "lucide-react"

interface PaymentMethodProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

export function PaymentMethod({ selectedMethod, onSelectMethod }: PaymentMethodProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">เลือกวิธีชำระเงิน</h3>
      
      <RadioGroup 
        defaultValue={selectedMethod} 
        onValueChange={onSelectMethod}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className={`flex items-center space-x-2 border rounded-lg p-4 ${selectedMethod === 'cash' ? 'bg-slate-100 border-primary' : ''}`}>
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
            <Banknote className="h-5 w-5" />
            <span>เงินสด</span>
          </Label>
        </div>
        
        <div className={`flex items-center space-x-2 border rounded-lg p-4 ${selectedMethod === 'promptpay' ? 'bg-slate-100 border-primary' : ''}`}>
          <RadioGroupItem value="promptpay" id="promptpay" />
          <Label htmlFor="promptpay" className="flex items-center gap-2 cursor-pointer">
            <QrCode className="h-5 w-5" />
            <span>พร้อมเพย์</span>
          </Label>
        </div>
        
        
      </RadioGroup>
    </div>
  )
}