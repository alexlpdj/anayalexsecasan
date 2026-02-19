<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('push_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_group_id')
                ->nullable()
                ->constrained('invitation_groups')
                ->nullOnDelete();
            $table->text('endpoint');
            $table->text('p256dh');
            $table->text('auth');
            $table->timestamps();

            $table->unique('endpoint', 'push_subscriptions_endpoint_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('push_subscriptions');
    }
};
