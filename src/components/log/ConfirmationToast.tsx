import { cn } from '@/lib/utils';

interface Props {
  visible: boolean;
}

export default function ConfirmationToast({ visible }: Props) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-20 mx-auto max-w-sm z-50',
        'bg-accent-sage text-foreground px-6 py-4 rounded-xl shadow-lg',
        'text-center text-sm font-medium',
        'animate-in fade-in slide-in-from-top-2 duration-300'
      )}
      role="status"
      aria-live="polite"
    >
      Logged. Take care of yourself. 💚
    </div>
  );
}
