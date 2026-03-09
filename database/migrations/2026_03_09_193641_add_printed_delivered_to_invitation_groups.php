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
        Schema::table('invitation_groups', function (Blueprint $table) {
            $table->timestamp('printed_at')->nullable()->after('reminder_sent_at');
            $table->timestamp('delivered_at')->nullable()->after('printed_at');
        });
    }

    public function down(): void
    {
        Schema::table('invitation_groups', function (Blueprint $table) {
            $table->dropColumn(['printed_at', 'delivered_at']);
        });
    }
};
