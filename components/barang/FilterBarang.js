export default function FilterBarang({
  kategoriList,
  kategoriAktif,
  onKategoriChange,
  keyword,
  onKeywordChange,
}) {
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-[1fr_220px]">
      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="Cari nama barang..."
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />

      <select
        value={kategoriAktif}
        onChange={(e) => onKategoriChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      >
        {kategoriList.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
    </div>
  );
}