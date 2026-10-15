<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pesanan_pelanggan', function (Blueprint $table) {
            $table->id('id_pesanan');
            $table->date('tanggal')->default(DB::raw('CURRENT_DATE'));
            $table->string('pelanggan');
            $table->string('status', 50)->default('Baru');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan_pelanggan');
    }
};