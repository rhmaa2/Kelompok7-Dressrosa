import Link from "next/link";

const app = "CampRent";
const desc = "Peminjaman Alat Camping & Pendakian";

export default function Home() {
    return (
    <div>
        <h1>{app}</h1>
        <p>{desc}</p>

        <nav>
            <Link href="/login">LOGIN</Link>{"   |"}
            <Link href="/pengajuan">PENGAJUAN</Link>{"   |"}
            <Link href="/status">STATUS</Link>{"   |   "}
            <Link href="/approval">APPROVAL</Link>
        </nav>

    </div>
    )
}