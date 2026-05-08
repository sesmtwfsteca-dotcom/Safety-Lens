import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCriticidadeColor(criticidade: string) {
  switch (criticidade) {
    case 'ALTO': return 'bg-wfs-red text-white';
    case 'MEDIO': return 'bg-criticality-medium text-wfs-text';
    case 'NORMAL': return 'bg-criticality-normal text-white';
    default: return 'bg-wfs-gray text-white';
  }
}

export function getCriticidadePeso(criticidade: string) {
  switch (criticidade) {
    case 'ALTO': return 3;
    case 'MEDIO': return 2;
    case 'NORMAL': return 1;
    default: return 1;
  }
}
