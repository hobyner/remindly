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
        Schema::table('legacy_messages', function (Blueprint $table): void {
            $table->string('file_disk')->nullable()->after('file_path');
            $table->string('file_original_name')->nullable()->after('file_disk');
            $table->string('file_mime_type')->nullable()->after('file_original_name');
            $table->string('voice_note_disk')->nullable()->after('voice_note_path');
            $table->string('voice_note_original_name')->nullable()->after('voice_note_disk');
            $table->string('voice_note_mime_type')->nullable()->after('voice_note_original_name');
        });

        Schema::table('legacy_recipients', function (Blueprint $table): void {
            $table->string('secondary_code')->nullable()->after('verification_code');
            $table->timestamp('secondary_verified_at')->nullable()->after('secondary_code');
            $table->timestamp('last_viewed_at')->nullable()->after('delivered_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('legacy_messages', function (Blueprint $table): void {
            $table->dropColumn([
                'file_disk',
                'file_original_name',
                'file_mime_type',
                'voice_note_disk',
                'voice_note_original_name',
                'voice_note_mime_type',
            ]);
        });

        Schema::table('legacy_recipients', function (Blueprint $table): void {
            $table->dropColumn(['secondary_code', 'secondary_verified_at', 'last_viewed_at']);
        });
    }
};
