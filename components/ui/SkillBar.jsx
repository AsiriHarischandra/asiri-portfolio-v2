export default function SkillBar({ name, level }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-300">{name}</span>
        <span className="font-mono text-xs text-em">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-em transition-all duration-1000"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}
