import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isHexColor(color: string): boolean {
    return color.startsWith('#');
}

export function getGroupColorStyle(color: string) {
    if (isHexColor(color)) {
        return { backgroundColor: color };
    }
    return {};
}

export function getGroupColorClass(color: string, defaultClass = '') {
    if (isHexColor(color)) {
        return defaultClass;
    }
    return color;
}
