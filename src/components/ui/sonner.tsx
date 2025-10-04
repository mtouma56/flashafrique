import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
export const toast = sonnerToast;
export function Toaster() {
  return <SonnerToaster position="top-right" richColors closeButton />;
}
