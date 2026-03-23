export default function AboutView() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary">About Ebbi</h1>

      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Ebbi helps you log the ebb and flow of your symptoms easily and regularly.
        </p>
        <p>
          No pressure — on your better days Ebbi helps you catch up after a period of worse days.
        </p>
        <p>
          Easy, convenient, tailored to your needs.
        </p>
        <p>
          All data is stored locally in your browser. Nothing is sent to external servers
          without your consent. No AI processes your information. You are in full control.
        </p>
        <p>
          This is a Minimum Viable Product version of a bigger vision, built during{' '}
          <a
            href="https://shebuilds.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-80"
          >
            She Builds
          </a>{' '}
          on March 8 by UX designer{' '}
          <a
            href="https://designingtara.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-80"
          >
            Tara Lejermalm
          </a>
          .
        </p>
      </div>
    </div>
  );
}
