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
        Schema::create('wedding_settings', function (Blueprint $table) {
            $table->id();

            // Couple information
            $table->string('bride', 100);
            $table->string('groom', 100);

            // Dates
            $table->date('wedding_date');
            $table->date('civil_ceremony_date')->nullable();

            // Venue information
            $table->string('venue_name', 255);
            $table->text('venue_address');
            $table->string('venue_url')->nullable();
            $table->text('venue_parking_info')->nullable();

            // Schedule (JSON array of events)
            $table->json('schedule');

            // Transport information
            $table->boolean('buses_available')->default(true);
            $table->text('buses_info')->nullable();
            $table->boolean('parking_available')->default(true);

            // Status flag for future versioning
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wedding_settings');
    }
};
