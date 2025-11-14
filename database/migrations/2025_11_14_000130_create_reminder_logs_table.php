<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reminder_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('reminder_id')->constrained()->cascadeOnDelete();
            $table->string('channel');
            $table->string('status')->default('queued');
            $table->json('payload')->nullable();
            $table->json('response')->nullable();
            $table->string('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminder_logs');
    }
};
