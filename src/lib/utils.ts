import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2
  }).format(price)
}