<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->unsignedInteger('value')->default(0);
            $table->unsignedInteger('max')->default(10000);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('budget_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('target')->default(30000);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_settings');
        Schema::dropIfExists('budget_items');
    }
};
