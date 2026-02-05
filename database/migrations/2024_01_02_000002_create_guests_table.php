<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_group_id')
                ->constrained('invitation_groups')
                ->onDelete('cascade'); // Si se borra el grupo, se borran sus invitados
            
            $table->string('name');
            $table->enum('gender', ['HOMBRE', 'MUJER'])->nullable();
            
            // Confirmación individual
            $table->boolean('attending')->nullable(); // null = no ha respondido, true/false = sí/no
            
            // Alergias individuales
            $table->text('allergies')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
