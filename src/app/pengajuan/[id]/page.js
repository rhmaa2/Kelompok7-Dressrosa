'use client';

import { useState } from 'react';
import { dataAlat } from '../../../../library/dataAlat';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DetailBarangPage() {
  const params = useParams();
  const { id } = params;
  
  const [pesan, setPesan] = useState(false);

  const alat = dataAlat.find((item) => item.id === id);
  
  if (!alat) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Maaf, Barang Tidak Ditemukan</h2>
        <Link href="/pengajuan" className="text-blue-600 underline hover:text-blue-800">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const handleTambahKeKeranjang = () => {
    const keranjangLama = JSON.parse(localStorage.getItem("keranjangSewa")) || [];
    const indexAda = keranjangLama.findIndex((item) => item.id === alat.id);
    
    if (indexAda > -1) {
      keranjangLama[indexAda].quantity += 1;
    } else {
      keranjangLama.push({ ...alat, quantity: 1 });
    }
    
    localStorage.setItem("keranjangSewa", JSON.stringify(keranjangLama));
    
    setPesan(true);
    setTimeout(() => setPesan(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/pengajuan" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        &larr; Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div>
          <img 
            src={alat.foto} 
            alt={alat.nama_barang} 
            className="w-full h-80 object-cover rounded-lg border border-gray-100" 
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">
              {alat.kategori}
            </span>
            <h1 className="text-2xl font-bold text-gray-800 mt-3">{alat.nama_barang}</h1>
            
            <p className="text-2xl font-extrabold text-blue-600 mt-2">
              Rp {alat.harga_sewa_per_hari.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ hari</span>
            </p>

            <div className="mt-4 border-t border-b border-gray-100 py-3 space-y-2 text-sm text-gray-600">
              <p><strong className="text-gray-700">Biaya Jaminan:</strong> Rp {alat.harga_jaminan.toLocaleString()}</p>
              <p><strong className="text-gray-700">Stok Tersedia:</strong> <span className="text-green-600 font-semibold">{alat.stok_tersedia} unit</span></p>
              <p><strong className="text-gray-700">Kondisi:</strong> <span className="capitalize">{alat.kondisi}</span></p>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-1">Deskripsi Barang:</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{alat.deskripsi}</p>
                {alat.ciri_ciri && (
                    <div className="mt-3">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                            {alat.ciri_ciri.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                 )}
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={handleTambahKeKeranjang}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Tambah ke Keranjang
            </button>
            {pesan && (
              <p className="text-green-600 text-sm mt-2 text-center font-medium">
                Berhasil ditambahkan ke keranjang!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}