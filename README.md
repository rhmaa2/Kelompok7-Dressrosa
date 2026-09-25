# EVENTRA

### Platform Peminjaman Perlengkapan Pesta & Acara

## 📌 Deskripsi

EVENTRA adalah sistem untuk mengelola proses peminjaman perlengkapan pesta dan acara (meja, kursi, tenda, sound system, dll).

## 👥 Role Pengguna

| Role                             | Deskripsi Singkat                                                                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Penyewa (User)**               | Pelanggan melakukan pendaftaran dan melakukan login pengguna, mencari barang, mengajukan peminjaman, dan melakukan pembayaran.           |
| **Admin**                        | Mengelola data barang, memverifikasi pengajuan peminjaman & pembayaran, mengelola user, melihat laporan.                                 |
| **Petugas Perlengkapan (Staff)** | Menyiapkan & mengecek kondisi barang sebelum dikirim/diambil dan setelah dikembalikan, memproses pengembalian barang, update stok fisik. |

---

## 🔄 Alur Sistem

1. Melakukan registrasi / login
2. Melihat & mencari barang (katalog, filter kategori, cek stok tersedia)
3. Menambahkan barang ke "keranjang"
4. Checkout:

   * pilih tanggal mulai & selesai sewa
   * pilih metode ambil sendiri / diantar
   * isi alamat (jika diantar)
   * sistem hitung otomatis: total biaya sewa + jaminan
5. Pengajuan masuk ke Admin dengan status `PENDING`
6. Admin memeriksa & memverifikasi pengajuan → `APPROVED` / `REJECTED`

   * User juga dapat melakukan `CANCELLED` sebelum diproses
7. Jika `APPROVED` → user melakukan pembayaran (DP atau lunas) & upload bukti bayar
8. Admin/sistem verifikasi pembayaran → status berubah menjadi `DIPROSES`
9. Petugas Perlengkapan menyiapkan barang & mengecek kondisi awal → `SIAP_DIAMBIL` / `SIAP_DIKIRIM`
10. Barang diambil/diantar → status `SEDANG_DI_SEWA`
11. Setelah acara selesai, barang dikembalikan
12. Petugas Perlengkapan mengecek kondisi barang saat kembali (baik/rusak/hilang)
13. Jaminan dikembalikan sesuai kondisi barang → status `COMPLETED`
14. Riwayat transaksi tersimpan di halaman "Riwayat Peminjaman"

---

## Aktor

* **Penyewa (User)**
* **Admin**
* **Petugas Perlengkapan**

---

## Fitur

### USER (Penyewa)

* Daftar (nama, email, no. HP, alamat, password)
* Login (email & password)
* Melihat daftar barang yang tersedia + filter kategori & pencarian
* Melihat detail barang (foto, harga sewa/hari, stok)
* Tambah barang ke keranjang sewa
* Checkout pengajuan peminjaman (tanggal, metode ambil/antar, jaminan, alamat)
* Upload bukti pembayaran (DP/lunas)
* Pemantauan status peminjaman (timeline `PENDING → ... → COMPLETED`)
* Riwayat peminjaman yang sudah selesai/dibatalkan/ditolak

### ADMIN

* Login
* Dashboard ringkasan (jumlah pengajuan, pendapatan, barang paling sering disewa)
* Melihat & memverifikasi pengajuan peminjaman user (approve/reject)
* Memverifikasi bukti pembayaran
* Mengelola data barang (CRUD): nama, kategori, harga sewa, stok, foto
* Mengelola data user
* Melihat laporan transaksi

### PETUGAS PERLENGKAPAN

* Daftar / Login
* Melihat daftar pengajuan yang sudah di-approve & dibayar (siap diproses)
* Mengecek & mencatat kondisi barang sebelum dikirim/diambil
* Update status pengiriman/pengambilan barang
* Menerima pengembalian barang & mengecek kondisi akhir
* Melaporkan kerusakan/kehilangan barang ke admin (mempengaruhi potongan jaminan)
* Update stok barang setelah pengecekan

---
