<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('music_moments', function (Blueprint $table) {
            $table->id();
            $table->string('section')->index();
            $table->string('name');
            $table->string('playlist_url')->nullable();
            $table->text('notes')->nullable();
            $table->string('estimated_duration')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('music_moments');
    }
};
