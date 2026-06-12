import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Hàm cn viết bằng JavaScript
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}