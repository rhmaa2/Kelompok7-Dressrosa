import Link from "next/link";

const app = "EVENTRA";
const desc = "Peminjaman Perlengkapan Pesta & Acara";

export default function Home() {
    return (
    <div>
        <h1>{app}</h1>
        <p>{desc}</p>

        <nav>
            <Link href="/login">LOGIN</Link>{"   |"}
            <Link href="/pengajuan">PENGAJUAN PEMINJAMAN</Link>{"   |"}
            <Link href="/status">STATUS PEMINJAMAN</Link>{"   |   "}
            <Link href="/approval">APPROVAL</Link>
        </nav>

    </div>
    )
}