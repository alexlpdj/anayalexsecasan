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
        Schema::table('faqs', function (Blueprint $table) {
            $table->json('translations')->nullable()->after('is_active');
            // true = content changed, translations are stale
            $table->boolean('needs_translation')->default(true)->after('translations');
        });

        Schema::table('wedding_settings', function (Blueprint $table) {
            $table->json('schedule_translations')->nullable()->after('schedule');
            $table->boolean('schedule_needs_translation')->default(true)->after('schedule_translations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->dropColumn(['translations', 'needs_translation']);
        });

        Schema::table('wedding_settings', function (Blueprint $table) {
            $table->dropColumn(['schedule_translations', 'schedule_needs_translation']);
        });
    }
};
