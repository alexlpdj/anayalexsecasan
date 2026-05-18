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
        Schema::table('song_suggestions', function (Blueprint $table) {
            $table->string('source')->default('guest')->after('id'); // 'guest' | 'youtube'
            $table->string('youtube_video_id')->nullable()->after('itunes_track_id');
            $table->foreignId('invitation_group_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('song_suggestions', function (Blueprint $table) {
            $table->dropColumn(['source', 'youtube_video_id']);
            $table->foreignId('invitation_group_id')->nullable(false)->change();
        });
    }
};
