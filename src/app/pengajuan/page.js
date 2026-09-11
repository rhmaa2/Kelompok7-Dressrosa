"use client";
import { useState, useEffect } from "react";
import { dataAlat } from '../../../library/dataAlat';
import BarangCard from '../../../components/barangCard';
import Link from 'next/link';

export default function KatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("keranjangSewa")) || [];
    const totalItems = savedCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  const filteredAlat = dataAlat.filter((alat) => {
    const matchesSearch = alat.nama_barang
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());
    
    const kategoriAlat = alat.kategori.toLowerCase();
    
    const matchesKategori =
      selectedKategori === "Semua" || 
      kategoriAlat.includes(selectedKategori.toLowerCase());
    
    if (searchTerm.trim() !== "") {
      return matchesSearch;
    }
    
    return matchesKategori;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Link href="/" className="inline-block mb-2 text-xs text-blue-600 hover:underline font-semibold">
            &larr; Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Katalog Perlengkapan Acara/Pesta</h1>
        </div>
        
        <Link
          href="/pengajuan/keranjang"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition flex items-center gap-2"
        >
          <span>🛒 Lihat Keranjang</span>
          {cartCount > 0 && (
            <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari nama alat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedKategori}
          onChange={(e) => setSelectedKategori(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Lighting">Lighting</option>
          <option value="Sound System">Sound System</option>
          <option value="Meja">Meja</option>
          <option value="Kursi">Kursi</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredAlat.length > 0 ? (
          filteredAlat.map((alat) => (
            <div key={alat.id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
              <BarangCard alat={alat} />
              
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-8">Alat yang kamu cari tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
}