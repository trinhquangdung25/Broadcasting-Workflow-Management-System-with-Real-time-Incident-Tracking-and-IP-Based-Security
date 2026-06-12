import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Hàm gộp và tối ưu hóa class Tailwind CSS viết bằng TypeScript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// THÊM DÒNG NÀY VÀO CUỐI FILE ĐỂ DIỆT TẬN GỐC LỖI STAR EXPORT:
export default cn;