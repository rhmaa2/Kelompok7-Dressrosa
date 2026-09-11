"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  
  const [formData, setFormData] = useState({
    namaPeminjam: "",
    namaAcara: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    catatan: "",
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("keranjangSewa")) || [];
    setCartItems(savedCart);
  }, []);

  const totalHargaPerHari = cartItems.reduce(
    (total, item) => total + item.harga_sewa_per_hari * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitPengajuan = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    alert(`Pengajuan berhasil dikirim atas nama ${formData.namaPeminjam}!`);
  
    localStorage.removeItem("keranjangSewa");
    router.push("/pengajuan");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/pengajuan" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        &larr; Kembali ke Katalog
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout Pengajuan Alat</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Alat Disewa</h2>
          
          {cartItems.length > 0 ? (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-medium text-sm text-gray-800">{item.nama_barang}</h3>
                    <p className="text-xs text-gray-500">Jumlah: {item.quantity} unit</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">
                    Rp {(item.harga_sewa_per_hari * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-4">Belum ada barang di keranjang.</p>
          )}

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="font-bold text-gray-700">Total / Hari:</span>
            <span className="text-lg font-extrabold text-blue-600">
              Rp {totalHargaPerHari.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Formulir Peminjaman</h2>
          
          <form onSubmit={handleSubmitPengajuan} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Pemohon / Organisasi</label>
              <input
                type="text"
                name="namaPeminjam"
                required
                value={formData.namaPeminjam}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Acara</label>
              <input
                type="text"
                name="namaAcara"
                required
                value={formData.namaAcara}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Pensi Sekolah / Resepsi"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  name="tanggalMulai"
                  required
                  value={formData.tanggalMulai}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  required
                  value={formData.tanggalSelesai}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
              <textarea
                name="catatan"
                rows="2"
                value={formData.catatan}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Keterangan lain..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-sm"
            >
              Kirim Pengajuan Sewa
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}