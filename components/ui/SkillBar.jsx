export default function SkillBar({ name, level }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">{name}</span>
        <span className="font-mono text-[10px] text-em">{level}%</span>
      </div>
      <div className="h-px bg-white/[0.07] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-em to-cyan transition-all duration-1000"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}
