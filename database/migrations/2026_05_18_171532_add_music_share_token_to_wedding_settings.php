<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('wedding_settings', 'music_share_token')) {
            Schema::table('wedding_settings', function (Blueprint $table) {
                $table->string('music_share_token', 64)->nullable()->unique()->after('is_active');
            });
        }

        DB::table('wedding_settings')->whereNull('music_share_token')->orderBy('id')->each(function ($row) {
            DB::table('wedding_settings')
                ->where('id', $row->id)
                ->update(['music_share_token' => Str::random(48)]);
        });
    }

    public function down(): void
    {
        Schema::table('wedding_settings', function (Blueprint $table) {
            $table->dropColumn('music_share_token');
        });
    }
};
