<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add section_id FK (nullable during migration)
        Schema::table('music_moments', function (Blueprint $table) {
            $table->foreignId('section_id')->nullable()->constrained('music_sections')->cascadeOnDelete()->after('id');
        });

        // Map old enum values to new section IDs
        $sectionMap = DB::table('music_sections')->pluck('id', 'name')->mapWithKeys(
            fn ($id, $name) => [strtolower($name) => $id]
        );

        DB::table('music_moments')->orderBy('id')->each(function ($row) use ($sectionMap) {
            DB::table('music_moments')->where('id', $row->id)->update([
                'section_id' => $sectionMap[$row->section] ?? $sectionMap->first(),
            ]);
        });

        // Make section_id NOT NULL and drop old column
        Schema::table('music_moments', function (Blueprint $table) {
            $table->foreignId('section_id')->nullable(false)->change();
            $table->dropIndex(['section']);
            $table->dropColumn('section');
        });
    }

    public function down(): void
    {
        Schema::table('music_moments', function (Blueprint $table) {
            $table->string('section')->default('cena')->after('id');
        });

        DB::table('music_moments')->each(function ($row) {
            $sectionName = strtolower(DB::table('music_sections')->where('id', $row->section_id)->value('name') ?? 'cena');
            DB::table('music_moments')->where('id', $row->id)->update(['section' => $sectionName]);
        });

        Schema::table('music_moments', function (Blueprint $table) {
            $table->dropForeign(['section_id']);
            $table->dropColumn('section_id');
        });
    }
};
