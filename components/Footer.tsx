export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center gap-3 py-10 px-4 text-center">
      <p className="text-xs text-stone-400 tracking-widest uppercase">
        This altar is free, always.
      </p>
      <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
        If this space brought you peace, consider leaving an offering to keep
        the light burning.
      </p>
      <a
        href="https://www.paypal.me/AnesuEmmanuel44"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/25 bg-white/15 backdrop-blur-sm text-sm font-medium text-stone-600 hover:bg-white/30 transition-all"
      >
        <span>🕯️</span>
        <span>Leave an Offering</span>
      </a>
      <p className="text-[10px] text-stone-400 mt-2">
        Digital Altar · A non-profit space for reflection
      </p>
    </footer>
  );
}
