import { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

interface Props {
  notes: string;
  onChange: (v: string) => void;
  voiceEnabled: boolean;
}

export default function NotesField({ notes, onChange, voiceEnabled }: Props) {
  const [consentGiven, setConsentGiven] = useLocalStorage('ebbi-voice-consent', false);
  const [showConsent, setShowConsent] = useState(false);
  const { start, stop, listening, transcript, supported, reset } = useSpeechRecognition();

  const canUseVoice = voiceEnabled && supported;

  const handleMicClick = () => {
    if (listening) {
      stop();
      return;
    }

    if (!consentGiven) {
      setShowConsent(true);
      return;
    }

    reset();
    start();
  };

  const handleConsent = (accepted: boolean) => {
    setShowConsent(false);
    if (accepted) {
      setConsentGiven(true);
      reset();
      start();
    }
  };

  // Append transcript to notes
  useEffect(() => {
    if (transcript) {
      onChange(notes ? `${notes} ${transcript}` : transcript);
    }
    // Only run when transcript changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
        {canUseVoice && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleMicClick}
            className="min-h-[44px] min-w-[44px]"
            aria-label={listening ? 'Stop voice input' : 'Start voice input'}
            aria-pressed={listening}
          >
            {listening ? (
              <MicOff className="h-5 w-5 text-destructive" />
            ) : (
              <Mic className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Anything you want to remember about today…"
        className="min-h-[80px] text-sm"
        aria-label="Notes"
      />
      {listening && (
        <p className="text-xs text-muted-foreground mt-1 animate-pulse" aria-live="polite">
          Listening…
        </p>
      )}

      {/* Consent dialog */}
      <Dialog open={showConsent} onOpenChange={(v) => { if (!v) setShowConsent(false); }}>
        <DialogContent className="max-w-sm" aria-describedby="voice-consent-desc">
          <DialogHeader>
            <DialogTitle>Voice input notice</DialogTitle>
            <DialogDescription id="voice-consent-desc" className="text-sm leading-relaxed mt-2">
              Voice input uses your browser's speech recognition. Depending on your browser,
              audio may be processed externally. Use text input if this concerns you.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => handleConsent(true)}
              className="flex-1 min-h-[44px] bg-accent hover:bg-accent/80 text-foreground font-semibold"
            >
              I understand
            </Button>
            <Button
              variant="outline"
              onClick={() => handleConsent(false)}
              className="flex-1 min-h-[44px]"
            >
              No thanks
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
