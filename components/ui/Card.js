export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_1px_2px_rgba(15,18,34,0.04),0_10px_30px_-14px_rgba(76,29,149,0.18)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}