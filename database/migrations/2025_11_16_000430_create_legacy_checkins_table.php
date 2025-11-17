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
        Schema::create('legacy_checkins', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('legacy_message_id')->constrained()->cascadeOnDelete();
            $table->timestamp('requested_at');
            $table->timestamp('responded_at')->nullable();
            $table->string('response_token')->nullable();
            $table->string('status')->default('pending'); // pending, confirmed, missed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legacy_checkins');
    }
};
