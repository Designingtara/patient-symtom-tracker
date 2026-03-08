import { Card, CardContent } from '@/components/ui/card';

export default function AboutView() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">About Ebbi</h1>

      {/* Illustration placeholder */}
      <Card className="shadow-sm">
        <CardContent className="pt-6 flex items-center justify-center min-h-[160px] bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground italic">Illustration coming soon</p>
        </CardContent>
      </Card>

      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Ebbi helps you log the ebb and flow of your symptoms easily and regularly.
          No pressure — on your better days Ebbi helps you catch up after a period of worse days.
          Easy, convenient, tailored to your needs.
        </p>
        <p>
          All data is stored locally in your browser. Nothing is sent to external servers
          without your consent. No AI processes your information. You are in full control.
        </p>
      </div>
    </div>
  );
}
