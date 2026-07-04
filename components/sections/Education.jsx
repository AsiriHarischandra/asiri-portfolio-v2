export default function Education() {
  return (
    <section id="education" className="py-28 bg-bg2/80">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <span className="font-mono text-xs text-em/80">{'// education'}</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-14">
          Background
        </h2>

        <div className="relative pt-8">
          {/* Trace line */}
          <div className="absolute top-8 left-[8%] right-[8%] h-px bg-em/30" />

          <div className="flex justify-between">
            {/* Diploma */}
            <div className="w-[45%] relative">
              <span className="absolute -top-[22px] left-0 w-3 h-3 rounded-full bg-em shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <div className="font-mono text-[10px] text-green-300 mb-1">2022 — 2024</div>
              <div className="text-sm font-medium">Diploma in Software Engineering</div>
              <div className="text-xs text-gray-500 mt-1">Professional certification</div>
            </div>

            {/* BSc */}
            <div className="w-[45%] relative text-right">
              <span className="absolute -top-[22px] right-0 w-3 h-3 rounded-full bg-lime shadow-[0_0_10px_rgba(163,230,53,0.8)] animate-pulse-dot" />
              <div className="font-mono text-[10px] text-green-300 mb-1">2024 — present</div>
              <div className="text-sm font-medium">BSc (Hons) Computer Science</div>
              <div className="text-xs text-gray-500 mt-1">University of Moratuwa</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
