<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('channel_credentials', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('channel');
            $table->json('settings')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->string('status')->default('inactive');
            $table->timestamps();

            $table->unique(['user_id', 'channel']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('channel_credentials');
    }
};
