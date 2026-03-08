import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function OnboardingDialog() {
  const [seen, setSeen] = useLocalStorage('ebbi-onboarding-seen', false);
  const [open, setOpen] = useState(!seen);

  const handleDismiss = () => {
    setOpen(false);
    setSeen(true);
  };

  if (seen) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); }}>
      <DialogContent className="max-w-sm text-center" aria-describedby="onboarding-desc">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome to Ebbi</DialogTitle>
          <DialogDescription id="onboarding-desc" className="text-sm text-foreground mt-3 leading-relaxed">
            Ebbi helps you track how you feel, on your terms. No pressure to log every day
            — even occasional entries help you see patterns.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-1">
          Start by logging how you feel right now.
        </p>
        <Button
          onClick={handleDismiss}
          className="w-full min-h-[44px] bg-accent hover:bg-accent/80 text-foreground font-semibold mt-2"
        >
          Get started
        </Button>
      </DialogContent>
    </Dialog>
  );
}
