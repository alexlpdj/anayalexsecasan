<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invitation_groups', function (Blueprint $table) {
            $table->timestamp('invitation_sent_at')->nullable()->after('contact_email');
            $table->timestamp('reminder_sent_at')->nullable()->after('invitation_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('invitation_groups', function (Blueprint $table) {
            $table->dropColumn(['invitation_sent_at', 'reminder_sent_at']);
        });
    }
};
