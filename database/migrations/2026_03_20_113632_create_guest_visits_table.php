<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guest_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('invitation_groups')->cascadeOnDelete();
            $table->string('device', 10)->default('unknown');   // mobile | desktop | unknown
            $table->string('browser', 30)->default('unknown');  // Chrome | Safari | Firefox | Edge | …
            $table->string('os', 20)->default('unknown');       // iOS | Android | Windows | macOS | …
            $table->timestamp('created_at')->useCurrent();

            $table->index('group_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guest_visits');
    }
};
