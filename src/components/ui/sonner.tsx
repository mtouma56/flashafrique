// src/components/ui/sonner.tsx
// Shim compatible avec les imports type shadcn : import { Toaster, toast } from '@/components/ui/sonner'
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

export const toast = sonnerToast;

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      // duration={4000} // décommente si tu veux surcharger
    />
  );
}
