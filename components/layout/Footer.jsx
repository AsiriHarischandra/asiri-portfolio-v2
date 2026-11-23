import VisitorCounter from '@/components/ui/VisitorCounter';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">

        <span className="font-display font-black text-xs tracking-widest2 uppercase text-white/20">
          A<span className="text-cyan/40">H</span>
        </span>

        <p className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
          © {new Date().getFullYear()} Asiri Harischandra — Built with Next.js
        </p>

        <div className="flex items-center gap-4">
          <VisitorCounter />
          <div className="flex items-center gap-1 font-mono text-[10px] text-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-em animate-pulse-dot" />
            <span className="tracking-widest uppercase">Available</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
