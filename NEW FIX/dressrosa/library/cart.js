"use client";

import { getCurrentUser } from "./api";
import { resolveFotoBarang } from "./foto";

const LEGACY_KEY = "eventra_cart";

function getKey() {
  const user = getCurrentUser();
  return user?.id ? `eventra_cart_user_${user.id}` : "eventra_cart_guest";
}

function read() {
  if (typeof window === "undefined") return [];
  try {
    // Never migrate the old global cart: doing so could expose one user's
    // items to another account after login.
    if (localStorage.getItem(LEGACY_KEY)) localStorage.removeItem(LEGACY_KEY);
    return JSON.parse(localStorage.getItem(getKey())) || [];
  } catch {
    return [];
  }
}

function write(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getKey(), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: items }));
}

export function getCart() {
  return read().map((item) => ({
    ...item,
    foto: resolveFotoBarang({ foto: item.foto, nama: item.nama, kategori: item.kategori }),
    hargaSewa: Number(item.hargaSewa ?? item.harga_sewa_per_hari ?? item.harga_sewa ?? 0),
    qty: Number(item.qty || 0),
  }));
}

export function addToCart(barang, qty = 1) {
  const cart = read();
  const idx = cart.findIndex((x) => String(x.barangId) === String(barang.id));
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({
    barangId: barang.id,
    nama: barang.nama,
    kategori: barang.kategori,
    hargaSewa: Number(barang.hargaSewa ?? barang.harga_sewa_per_hari ?? barang.harga_sewa ?? 0),
    foto: barang.foto || null,
    qty,
  });
  write(cart);
  return cart;
}

export function updateQty(barangId, qty) {
  const cart = read().map((x) =>
    String(x.barangId) === String(barangId) ? { ...x, qty } : x
  );
  write(cart);
  return cart;
}

export function removeFromCart(barangId) {
  const cart = read().filter((x) => String(x.barangId) !== String(barangId));
  write(cart);
  return cart;
}

export function clearCart() { write([]); }