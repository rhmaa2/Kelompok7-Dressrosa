"use client";
const KEY = "eventra_cart";

function read() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function write(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  // Beri tahu bagian lain dari aplikasi (mis. ikon keranjang di Navbar)
  // bahwa isi keranjang baru saja berubah, supaya langsung terupdate
  // tanpa perlu reload halaman.
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: items }));
}

export function getCart() { return read(); }

export function addToCart(barang, qty = 1) {
  const cart = read();
  const idx = cart.findIndex((x) => x.barangId === barang.id);
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ barangId: barang.id, nama: barang.nama, gambar: barang.gambar, hargaSewa: barang.hargaSewa, jaminan: barang.jaminan, qty });
  write(cart);
  return cart;
}

export function updateQty(barangId, qty) {
  const cart = read().map((x) => (x.barangId === barangId ? { ...x, qty } : x));
  write(cart);
  return cart;
}

export function removeFromCart(barangId) {
  const cart = read().filter((x) => x.barangId !== barangId);
  write(cart);
  return cart;
}

export function clearCart() { write([]); }