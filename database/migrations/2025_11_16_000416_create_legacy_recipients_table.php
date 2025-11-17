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
        Schema::create('legacy_recipients', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('legacy_message_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('channel_preference')->default('email'); // email, whatsapp, sms
            $table->string('verification_code')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->string('delivery_channel')->nullable();
            $table->string('delivery_status')->default('pending'); // pending, sent, failed
            $table->text('delivery_error')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legacy_recipients');
    }
};
