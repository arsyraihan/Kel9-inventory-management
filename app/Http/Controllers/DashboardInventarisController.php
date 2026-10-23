<?php
// app/Http/Controllers/DashboardInventarisController.php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardInventarisController extends Controller
{
    public function index()
    {
        // TODO: ganti dengan query Eloquent setelah migrasi dibuat
        $sku = collect([
            ['kode' => 'KMJ-PTH-M',  'model' => 'Kemeja Oxford',     'ukuran' => 'M',  'warna' => 'Putih', 'stok' => 14,  'min' => 30, 'kategori' => 'Kemeja'],
            ['kode' => 'KOS-HTM-L',  'model' => 'Kaos Polos Cotton', 'ukuran' => 'L',  'warna' => 'Hitam', 'stok' => 8,   'min' => 40, 'kategori' => 'Kaos'],
            ['kode' => 'JKT-NVY-XL', 'model' => 'Jaket Bomber',      'ukuran' => 'XL', 'warna' => 'Navy',  'stok' => 5,   'min' => 15, 'kategori' => 'Jaket'],
            ['kode' => 'CLN-KHK-32', 'model' => 'Celana Chino',      'ukuran' => '32', 'warna' => 'Khaki', 'stok' => 22,  'min' => 20, 'kategori' => 'Celana'],
            ['kode' => 'KOS-PTH-M',  'model' => 'Kaos Polos Cotton', 'ukuran' => 'M',  'warna' => 'Putih', 'stok' => 120, 'min' => 40, 'kategori' => 'Kaos'],
            ['kode' => 'KMJ-BRU-L',  'model' => 'Kemeja Flanel',     'ukuran' => 'L',  'warna' => 'Biru',  'stok' => 64,  'min' => 25, 'kategori' => 'Kemeja'],
        ]);

        return Inertia::render('Inventaris/Dashboard', [
            'ringkasan' => [
                'totalStok'     => $sku->sum('stok'),
                'jumlahSku'     => $sku->count(),
                'stokMinimum'   => $sku->filter(fn ($s) => $s['stok'] < $s['min'])->count(),
                'poMenunggu'    => 3,
            ],
            'stokRendah' => $sku->filter(fn ($s) => $s['stok'] < $s['min'])->values(),
            'perKategori' => $sku->groupBy('kategori')->map->sum('stok'),
            'pipeline' => ['Siap Diproses' => 1, 'Picking' => 1, 'Packing' => 1, 'Dikirim' => 1],
            'pesanan' => [
                ['no' => 'SO-0412', 'pelanggan' => 'Toko Maju Jaya', 'item' => 36, 'status' => 'Siap Diproses', 'resi' => null],
                ['no' => 'SO-0411', 'pelanggan' => 'Butik Lestari',  'item' => 12, 'status' => 'Picking',       'resi' => null],
                ['no' => 'SO-0410', 'pelanggan' => 'Reseller Andi',  'item' => 60, 'status' => 'Packing',       'resi' => null],
                ['no' => 'SO-0409', 'pelanggan' => 'Toko Sinar Baru','item' => 24, 'status' => 'Dikirim',       'resi' => 'JNE JN0098123'],
            ],
            'mutasi' => [
                ['waktu' => '09:41', 'jenis' => 'Masuk',  'sku' => 'KOS-PTH-M', 'jumlah' => '+60', 'ref' => 'PO-0087'],
                ['waktu' => '09:12', 'jenis' => 'Keluar', 'sku' => 'KMJ-BRU-L', 'jumlah' => '-12', 'ref' => 'SO-0411'],
                ['waktu' => '08:50', 'jenis' => 'Retur',  'sku' => 'JKT-HTM-L', 'jumlah' => '-6',  'ref' => 'RT-0009'],
            ],
        ]);
    }
}