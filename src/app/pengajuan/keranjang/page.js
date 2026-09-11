"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function KeranjangPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("keranjangSewa")) || [];
    setCartItems(savedCart);
  }, []);

  const handleUpdateQuantity = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);

    setCartItems(updatedCart);
    localStorage.setItem("keranjangSewa", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("keranjangSewa", JSON.stringify(updatedCart));
  };

  const totalHargaPerHari = cartItems.reduce(
    (total, item) => total + item.harga_sewa_per_hari * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/pengajuan" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        &larr; Kembali
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Keranjang Sewa</h1>

      {cartItems.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.foto} alt={item.nama_barang} className="w-16 h-16 object-cover rounded-md border" />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{item.nama_barang}</h3>
                    <p className="text-xs text-blue-600 font-bold mt-1">
                      Rp {item.harga_sewa_per_hari.toLocaleString()} / hari
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <span className="font-bold text-gray-700">Total Sewa / Hari:</span>
            <span className="text-xl font-extrabold text-blue-600">
              Rp {totalHargaPerHari.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => router.push("/pengajuan/checkout")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-sm"
          >
            Lanjut ke Form Checkout &rarr;
          </button>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm mb-4">Keranjang kamu masih kosong, nih.</p>
          <Link
            href="/pengajuan"
            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Pilih Alat Sekarang
          </Link>
        </div>
      )}
    </div>
  );
}