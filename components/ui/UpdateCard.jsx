const BORDER_COLORS = {
  progress:    'border-l-em',
  learning:    'border-l-lime',
  upcoming:    'border-l-blue-400',
  achievement: 'border-l-amber-300',
};

const LABEL_COLORS = {
  progress:    'text-em',
  learning:    'text-lime',
  upcoming:    'text-blue-400',
  achievement: 'text-amber-300',
};

export default function UpdateCard({ update }) {
  const u = update;

  return (
    <div
      className={`bg-white/[0.04] border border-em/20 border-l-2 ${BORDER_COLORS[u.type] || 'border-l-em'} rounded-r-xl p-4`}
    >
      <span className={`font-mono text-[10px] tracking-widest uppercase ${LABEL_COLORS[u.type] || 'text-em'}`}>
        {u.type}
      </span>
      <div className="text-sm font-medium mt-1.5">{u.title}</div>
      <div className="text-xs text-gray-500 mt-1">{u.description}</div>
      <div className="font-mono text-[10px] text-green-300/60 mt-2">{u.date}</div>
    </div>
  );
}
