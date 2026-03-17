<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('song_suggestions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_group_id')->constrained()->cascadeOnDelete();
            $table->string('track_title');
            $table->string('artist_name');
            $table->string('album_name')->nullable();
            $table->string('artwork_url', 500)->nullable();
            $table->string('itunes_track_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('song_suggestions');
    }
};
