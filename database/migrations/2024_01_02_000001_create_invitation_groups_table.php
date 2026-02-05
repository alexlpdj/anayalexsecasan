<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invitation_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // "Familia García", "Carlos y María"
            $table->string('code')->unique(); // K7HM2 - alfanumérico único
            $table->enum('type', ['FAMILIAR', 'AMIGO'])->default('AMIGO');
            
            // Confirmación del grupo
            $table->timestamp('submitted_at')->nullable();
            
            // Transporte (a nivel de grupo)
            $table->enum('transport', ['AUTOBUS', 'COCHE', 'NO_CONFIRMADO'])->default('NO_CONFIRMADO');
            $table->boolean('bus_onda_ida')->default(false);
            $table->boolean('bus_onda_vuelta')->default(false);
            $table->boolean('bus_cs')->default(false);
            
            // Contacto (a nivel de grupo)
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            
            // Notas de administración
            $table->text('notes')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitation_groups');
    }
};
