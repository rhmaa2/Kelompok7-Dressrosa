export default function Tombol({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary:
      "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:brightness-105 active:brightness-95",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-500/25 hover:brightness-105",
    ghost:
      "bg-transparent text-slate-500 hover:bg-slate-100",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}