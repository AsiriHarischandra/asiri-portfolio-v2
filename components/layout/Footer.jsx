export default function Footer({ settings }) {
  const s = settings || {};
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-em/10 py-5">
      <div className="max-w-5xl mx-auto px-6 md:px-8 flex items-center justify-between font-mono text-[10px] text-gray-600">
        <span className="text-green-300/70">{'// never give up'}</span>
        <span>built with next.js · © {s.name?.split(' ')[0]?.toLowerCase() || 'asiri'} {year}</span>
      </div>
    </footer>
  );
}
