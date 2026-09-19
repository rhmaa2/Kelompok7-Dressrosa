import "./globals.css";

export const metadata = {
  title: "EVENTRA",
  description: "Peminjaman perlengkapan pesta dan acara",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}