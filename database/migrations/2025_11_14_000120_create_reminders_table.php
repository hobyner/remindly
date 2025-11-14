<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reminder_template_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('channel')->default('whatsapp');
            $table->string('type')->default('custom');
            $table->timestamp('send_at');
            $table->string('timezone')->default('UTC');
            $table->string('repeat_type')->default('none');
            $table->unsignedInteger('repeat_interval')->default(0);
            $table->json('repeat_weekdays')->nullable();
            $table->unsignedTinyInteger('repeat_day_of_month')->nullable();
            $table->string('status')->default('draft')->index();
            $table->timestamp('last_run_at')->nullable();
            $table->timestamp('next_run_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'send_at']);
            $table->index(['status', 'next_run_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
