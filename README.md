# EVENTRA
Platform Peminjaman Perlengkapan Pesta & Acara

---

## 📌 Deskripsi

EVENTRA adalah sistem untuk mengelola proses peminjaman perlengkapan pesta dan acara (meja, kursi, tenda, sound system, dll).

---

## Alur Sistem

melakukan pendaftaran/login -> user melihat dan mencari barang yang dibutuhkan -> memastikan stok barang yang tersedia -> mengisi form pengajuan -> admin memeriksa dan mengkonfirmasi peminjaman -> status peminjaman di setujui/di tolak -> melihat progres peminjaman -> selesai.

---

## ✨ Fitur

### USER

- Daftar (nama, email, no.hp, alamat, password)
- Login (email & password)
- Melihat daftar barang yang tersedia
- Pencarian barang
- Pengajuan peminjaman
- Pemantauan status peminjaman
  - PENDING

    ├── APPROVED  (admin menyetujui pengajuan) -> COMPLETED  (barang telah di kembalikan)

    ├── REJECTED  (admin menolak pengajuan)

    └── CANCELLED (user membatalkan pengajuan)
- Halaman riwayat peminjaman yang sudah selesai/completed

### ADMIN

- Login
- Melihat pengajuan peminjaman user
- Menyetujui atau menolak pengajuan
- Mengelola data barang (CRUD)

---
