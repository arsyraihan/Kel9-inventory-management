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
        Schema::create('pengadaan_po', function (Blueprint $table) {
            $table->id('id_po');
            $table->unsignedBigInteger('id_pemasok');
            $table->date('tanggal_po')->default(DB::raw('CURRENT_DATE'));
            $table->decimal('total_harga', 15, 2)->default(0);
            $table->string('status', 50)->default('Draft');
            $table->timestamps();

            // Foreign key ke tabel pemasok
            $table->foreign('id_pemasok')->references('id_pemasok')->on('pemasok')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengadaan_po');
    }
};