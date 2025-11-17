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
        Schema::create('legacy_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('voice_note_path')->nullable();
            $table->string('file_path')->nullable();
            $table->string('encryption_key_id')->nullable();
            $table->string('status')->default('draft'); // draft, armed, delivering, delivered, cancelled
            $table->string('check_in_frequency_unit')->default('day'); // minute/hour/day/week/month
            $table->unsignedInteger('check_in_frequency_value')->default(1);
            $table->unsignedInteger('grace_period_minutes')->default(1440);
            $table->timestamp('deliver_at')->nullable();
            $table->timestamp('armed_at')->nullable();
            $table->timestamp('last_check_in_at')->nullable();
            $table->timestamp('next_check_in_due_at')->nullable();
            $table->timestamp('delivery_started_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->string('heartbeat_token')->nullable()->unique();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legacy_messages');
    }
};
