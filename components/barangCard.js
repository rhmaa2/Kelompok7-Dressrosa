import Link from 'next/link';

export default function BarangCard({ alat }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <img src={alat.foto} alt={alat.nama_barang} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
          {alat.kategori}
        </span>
        <h3 className="text-lg font-bold mt-2 text-gray-800">{alat.nama_barang}</h3>
        <p className="text-gray-600 text-sm mt-1">Rp {alat.harga_sewa_per_hari.toLocaleString()} / hari</p>
        <p className="text-gray-500 text-xs mt-1">Stok: {alat.stok_tersedia}</p>
        
        <Link 
          href={`/pengajuan/${alat.id}`}
          className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}