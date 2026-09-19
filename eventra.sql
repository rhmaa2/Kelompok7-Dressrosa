CREATE DATABASE IF NOT EXISTS eventra_db;
USE eventra_db;

-- ---------------------------------------------------------
-- 1. USERS
-- Menyimpan semua akun: penyewa, admin, dan petugas perlengkapan
-- ---------------------------------------------------------
CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nama            VARCHAR(100)        NOT NULL,
    email           VARCHAR(100)        NOT NULL UNIQUE,
    no_hp           VARCHAR(20)         NOT NULL,
    alamat          TEXT,
    password        VARCHAR(255)        NOT NULL,
    role            ENUM('penyewa', 'admin', 'petugas') NOT NULL DEFAULT 'penyewa',
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 2. KATEGORI_BARANG
-- Kategori perlengkapan (tenda, sound system, meja-kursi, dll)
-- ---------------------------------------------------------
CREATE TABLE kategori_barang (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori   VARCHAR(50)         NOT NULL UNIQUE
);

-- ---------------------------------------------------------
-- 3. BARANG
-- Master data perlengkapan yang bisa disewa
-- ---------------------------------------------------------
CREATE TABLE barang (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    kategori_id             INT                 NOT NULL,
    nama_barang             VARCHAR(150)        NOT NULL,
    deskripsi               TEXT,
    foto                    VARCHAR(255),
    harga_sewa_per_hari     INT UNSIGNED        NOT NULL,
    harga_jaminan           INT UNSIGNED        NOT NULL DEFAULT 0,
    stok_total              INT UNSIGNED        NOT NULL DEFAULT 0,
    stok_tersedia           INT UNSIGNED        NOT NULL DEFAULT 0,
    kondisi                 VARCHAR(50)         DEFAULT 'baik',
    created_at              TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_barang_kategori
        FOREIGN KEY (kategori_id) REFERENCES kategori_barang(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ---------------------------------------------------------
-- 4. PEMINJAMAN
-- "Header" transaksi -> 1 baris = 1 pengajuan peminjaman
-- ---------------------------------------------------------
CREATE TABLE peminjaman (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    kode_pesanan            VARCHAR(30)         NOT NULL UNIQUE,
    user_id                 INT                 NOT NULL,
    tanggal_mulai_sewa      DATE                NOT NULL,
    tanggal_selesai_sewa    DATE                NOT NULL,
    metode                  ENUM('ambil', 'antar') NOT NULL DEFAULT 'ambil',
    alamat_pengiriman       TEXT,
    status                  ENUM(
                                'PENDING',
                                'APPROVED',
                                'REJECTED',
                                'CANCELLED',
                                'DIPROSES',
                                'SIAP_DIAMBIL',
                                'SIAP_DIKIRIM',
                                'SEDANG_DI_SEWA',
                                'DIKEMBALIKAN',
                                'COMPLETED'
                            )                   NOT NULL DEFAULT 'PENDING',
    total_biaya_sewa        INT UNSIGNED        NOT NULL DEFAULT 0,
    total_jaminan           INT UNSIGNED        NOT NULL DEFAULT 0,
    catatan                 TEXT,
    created_at              TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_peminjaman_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ---------------------------------------------------------
-- 5. DETAIL_PEMINJAMAN
-- "Isi keranjang" -> barang & jumlah dalam 1 peminjaman
-- ---------------------------------------------------------
CREATE TABLE detail_peminjaman (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    peminjaman_id       INT                 NOT NULL,
    barang_id           INT                 NOT NULL,
    jumlah              INT UNSIGNED        NOT NULL DEFAULT 1,
    harga_satuan        INT UNSIGNED        NOT NULL,
    subtotal            INT UNSIGNED        NOT NULL,

    CONSTRAINT fk_detail_peminjaman
        FOREIGN KEY (peminjaman_id) REFERENCES peminjaman(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detail_barang
        FOREIGN KEY (barang_id) REFERENCES barang(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ---------------------------------------------------------
-- 6. PEMBAYARAN
-- Bukti transfer DP / lunas / refund jaminan
-- ---------------------------------------------------------
CREATE TABLE pembayaran (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    peminjaman_id       INT                 NOT NULL,
    jenis               ENUM('DP', 'lunas', 'refund_jaminan') NOT NULL,
    jumlah              INT UNSIGNED        NOT NULL,
    bukti_bayar         VARCHAR(255),
    status_verifikasi   ENUM('pending', 'diverifikasi', 'ditolak') NOT NULL DEFAULT 'pending',
    tanggal_bayar       TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    verified_by         INT                 NULL,

    CONSTRAINT fk_pembayaran_peminjaman
        FOREIGN KEY (peminjaman_id) REFERENCES peminjaman(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pembayaran_verifikator
        FOREIGN KEY (verified_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ---------------------------------------------------------
-- 7. PENGECEKAN_BARANG
-- Catatan kondisi barang oleh petugas (sebelum kirim & saat kembali)
-- ---------------------------------------------------------
CREATE TABLE pengecekan_barang (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    peminjaman_id       INT                 NOT NULL,
    petugas_id          INT                 NOT NULL,
    tipe                ENUM('sebelum_kirim', 'saat_kembali') NOT NULL,
    kondisi             VARCHAR(50)         NOT NULL DEFAULT 'baik',
    catatan_kerusakan   TEXT,
    foto                VARCHAR(255),
    tanggal_cek         TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pengecekan_peminjaman
        FOREIGN KEY (peminjaman_id) REFERENCES peminjaman(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pengecekan_petugas
        FOREIGN KEY (petugas_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ---------------------------------------------------------
-- 8. RIWAYAT_STATUS
-- Log setiap perubahan status -> untuk timeline di halaman status
-- ---------------------------------------------------------
CREATE TABLE riwayat_status (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    peminjaman_id       INT                 NOT NULL,
    status              VARCHAR(30)         NOT NULL,
    changed_by          INT                 NULL,
    changed_at          TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    keterangan          TEXT,

    CONSTRAINT fk_riwayat_peminjaman
        FOREIGN KEY (peminjaman_id) REFERENCES peminjaman(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_riwayat_user
        FOREIGN KEY (changed_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ---------------------------------------------------------
-- 9. ULASAN
-- Rating & komentar barang setelah selesai sewa (opsional)
-- ---------------------------------------------------------
CREATE TABLE ulasan (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT                 NOT NULL,
    barang_id           INT                 NOT NULL,
    rating              TINYINT UNSIGNED    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    komentar            TEXT,
    created_at          TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ulasan_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ulasan_barang
        FOREIGN KEY (barang_id) REFERENCES barang(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- =========================================================
-- INDEX TAMBAHAN
-- =========================================================
CREATE INDEX idx_barang_kategori       ON barang(kategori_id);
CREATE INDEX idx_peminjaman_user       ON peminjaman(user_id);
CREATE INDEX idx_peminjaman_status     ON peminjaman(status);
CREATE INDEX idx_detail_peminjaman     ON detail_peminjaman(peminjaman_id);
CREATE INDEX idx_pembayaran_peminjaman ON pembayaran(peminjaman_id);
CREATE INDEX idx_pengecekan_peminjaman ON pengecekan_barang(peminjaman_id);
CREATE INDEX idx_riwayat_peminjaman    ON riwayat_status(peminjaman_id);

-- =========================================================
-- CONTOH DATA AWAL
-- =========================================================
INSERT INTO kategori_barang (nama_kategori) VALUES
    ('Tenda'), ('Sound System'), ('Meja & Kursi'), ('Dekorasi'), ('Lighting');

INSERT INTO users (nama, email, no_hp, alamat, password, role) VALUES
    ('Admin Eventra', 'admin@eventra.com', '081234567890', 'Mataram, NTB', 'hashed_password', 'admin'),
    ('Budi Petugas', 'budi.petugas@eventra.com', '081234567891', 'Mataram, NTB', 'hashed_password', 'petugas'),
    ('Siti Penyewa', 'siti@example.com', '081234567892', 'Mataram, NTB', 'hashed_password', 'penyewa');

INSERT INTO barang (kategori_id, nama_barang, deskripsi, foto, harga_sewa_per_hari, harga_jaminan, stok_total, stok_tersedia) VALUES
    (1, 'Tenda Sarnavil 4x6', 'Tenda untuk acara outdoor kapasitas 50 orang', '/images/tenda-1.jpg', 150000, 300000, 5, 5),
    (2, 'Sound System Portable 15 inch', 'Speaker aktif cocok untuk acara indoor/outdoor', '/images/sound-1.jpg', 200000, 500000, 3, 3),
    (3, 'Paket Meja + 10 Kursi', 'Meja lipat dan 10 kursi plastik', '/images/meja-1.jpg', 100000, 150000, 10, 10);