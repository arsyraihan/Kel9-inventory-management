import { Head } from '@inertiajs/react';

const tahap = ['Dashboard', 'Pengadaan', 'Penerimaan', 'Penyimpanan', 'Pemantauan Stok', 'Picking', 'Packing', 'Pengiriman'];

const warnaStatus = {
    'Siap Diproses': 'bg-amber-100 text-amber-800',
    Picking: 'bg-amber-100 text-amber-800',
    Packing: 'bg-amber-100 text-amber-800',
    Dikirim: 'bg-green-100 text-green-800',
    Diterima: 'bg-green-100 text-green-800',
};
const warnaJenis = { Masuk: 'bg-green-100 text-green-800', Keluar: 'bg-amber-100 text-amber-800', Retur: 'bg-red-100 text-red-800' };

function Tag({ className, children }) {
    return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>;
}

function Kartu({ judul, children, className = '' }) {
    return (
        <section className={`rounded-xl border border-gray-200 bg-white p-4 ${className}`}>
            {judul && <h3 className="mb-3 font-semibold text-gray-900">{judul}</h3>}
            {children}
        </section>
    );
}

function Tabel({ kepala, children }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                    <tr className="border-b text-xs text-gray-500">
                        {kepala.map((k) => <th key={k} className="px-2 py-2 font-semibold">{k}</th>)}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

export default function Dashboard({ ringkasan, stokRendah, perKategori, pipeline, pesanan, mutasi }) {
    const maks = Math.max(...Object.values(perKategori));
    const kpi = [
        ['Total stok (pcs)', ringkasan.totalStok.toLocaleString('id-ID'), false],
        ['SKU aktif', ringkasan.jumlahSku, false],
        ['SKU di bawah minimum', ringkasan.stokMinimum, true],
        ['PO menunggu persetujuan', ringkasan.poMenunggu, false],
    ];

    return (
        <>
            <Head title="Dashboard Inventaris" />
            <div className="flex min-h-screen flex-col bg-slate-100 text-gray-800 md:flex-row">
                <aside className="shrink-0 bg-slate-800 p-3 text-slate-300 md:w-56">
                    <h1 className="px-2 pb-3 font-bold text-white">Inventaris Pakaian</h1>
                    <nav className="flex gap-1 overflow-x-auto md:flex-col">
                        {tahap.map((t, i) => (
                            <a key={t} href="#" className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${i === 0 ? 'bg-teal-600 font-semibold text-white' : 'hover:bg-white/10'}`}>
                                {t}
                            </a>
                        ))}
                    </nav>
                </aside>

                <main className="min-w-0 flex-1 space-y-4 p-4 md:p-6">
                    <h2 className="text-2xl font-bold">Ringkasan Gudang</h2>

                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {kpi.map(([label, nilai, bahaya]) => (
                            <Kartu key={label}>
                                <div className={`text-2xl font-bold ${bahaya ? 'text-red-600' : ''}`}>{nilai}</div>
                                <div className="text-sm text-gray-500">{label}</div>
                            </Kartu>
                        ))}
                    </div>

                    <Kartu judul="Alur pesanan pelanggan">
                        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {Object.entries(pipeline).map(([s, n]) => (
                                <div key={s} className="rounded-lg bg-slate-100 p-2 text-center">
                                    <div className="text-xl font-bold">{n}</div>
                                    <div className="text-xs text-gray-500">{s}</div>
                                </div>
                            ))}
                        </div>
                        <Tabel kepala={['No. Pesanan', 'Pelanggan', 'Item', 'Status', 'Resi']}>
                            {pesanan.map((p) => (
                                <tr key={p.no} className="border-b">
                                    <td className="px-2 py-2">{p.no}</td>
                                    <td className="px-2 py-2">{p.pelanggan}</td>
                                    <td className="px-2 py-2">{p.item} pcs</td>
                                    <td className="px-2 py-2"><Tag className={warnaStatus[p.status]}>{p.status}</Tag></td>
                                    <td className="px-2 py-2">{p.resi ?? '–'}</td>
                                </tr>
                            ))}
                        </Tabel>
                    </Kartu>

                    <div className="grid gap-4 lg:grid-cols-5">
                        <Kartu judul="SKU di bawah stok minimum" className="lg:col-span-3">
                            <Tabel kepala={['SKU', 'Model', 'Ukuran/Warna', 'Stok', 'Min.', '']}>
                                {stokRendah.map((s) => (
                                    <tr key={s.kode} className="border-b">
                                        <td className="px-2 py-2">{s.kode}</td>
                                        <td className="px-2 py-2">{s.model}</td>
                                        <td className="px-2 py-2">{s.ukuran} / {s.warna}</td>
                                        <td className="px-2 py-2"><Tag className={s.stok < s.min / 2 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}>{s.stok}</Tag></td>
                                        <td className="px-2 py-2">{s.min}</td>
                                        <td className="px-2 py-2">
                                            {/* TODO: arahkan ke form pembuatan PO */}
                                            <button className="rounded-lg bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">Buat PO</button>
                                        </td>
                                    </tr>
                                ))}
                            </Tabel>
                        </Kartu>

                        <Kartu judul="Stok per kategori" className="lg:col-span-2">
                            {Object.entries(perKategori).map(([k, v]) => (
                                <div key={k} className="my-3 flex items-center gap-2 text-sm">
                                    <span className="w-20 text-gray-500">{k}</span>
                                    <div className="h-2.5 flex-1 overflow-hidden rounded bg-slate-100">
                                        <div className="h-full bg-teal-600" style={{ width: `${(v / maks) * 100}%` }} />
                                    </div>
                                    <b className="w-10 text-right">{v}</b>
                                </div>
                            ))}
                        </Kartu>
                    </div>

                    <Kartu judul="Mutasi stok terbaru">
                        <Tabel kepala={['Waktu', 'Jenis', 'SKU', 'Jumlah', 'Referensi']}>
                            {mutasi.map((m, i) => (
                                <tr key={i} className="border-b">
                                    <td className="px-2 py-2">{m.waktu}</td>
                                    <td className="px-2 py-2"><Tag className={warnaJenis[m.jenis]}>{m.jenis}</Tag></td>
                                    <td className="px-2 py-2">{m.sku}</td>
                                    <td className="px-2 py-2">{m.jumlah}</td>
                                    <td className="px-2 py-2">{m.ref}</td>
                                </tr>
                            ))}
                        </Tabel>
                    </Kartu>
                </main>
            </div>
        </>
    );
}