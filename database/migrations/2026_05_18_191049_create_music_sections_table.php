<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('music_sections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('emoji')->default('🎵');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Default sections migrated from the old enum
        DB::table('music_sections')->insert([
            ['name' => 'Cena',   'emoji' => '🍽️', 'sort_order' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Fiesta', 'emoji' => '🎉', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('music_sections');
    }
};
