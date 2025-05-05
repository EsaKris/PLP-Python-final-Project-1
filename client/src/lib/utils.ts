import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, optimized for Tailwind CSS
 * 
 * @param inputs - Class names to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 * 
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
) {
  const d = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  return d.toLocaleDateString("en-US", options);
}

/**
 * Truncate a string to a specified length and add ellipsis
 * 
 * @param str - String to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string
 */
export function truncateString(str: string, length: number = 100): string {
  if (str && str.length > length) {
    return str.substring(0, length) + "...";
  }
  return str;
}

/**
 * Format a number as currency
 * 
 * @param amount - Amount to format
 * @param currency - Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Generate a random avatar image URL
 * 
 * @param seed - Seed for the avatar generator
 * @returns Avatar URL
 */
export function getAvatarUrl(seed: string): string {
  return `https://avatars.dicebear.com/api/initials/${encodeURIComponent(seed)}.svg`;
}