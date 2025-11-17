<?php

namespace App\Support;

use App\Models\LegacyMessage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LegacyAttachmentManager
{
    public static function handleUploads(?UploadedFile $file, ?UploadedFile $voiceNote, LegacyMessage $message): void
    {
        if ($file) {
            self::deleteCurrent($message, 'file');
            $meta = self::storeEncrypted($file, $message, 'attachments');
            $message->fill([
                'file_path' => $meta['path'],
                'file_disk' => $meta['disk'],
                'file_original_name' => $meta['name'],
                'file_mime_type' => $meta['mime'],
            ]);
        }

        if ($voiceNote) {
            self::deleteCurrent($message, 'voice');
            $meta = self::storeEncrypted($voiceNote, $message, 'voice');
            $message->fill([
                'voice_note_path' => $meta['path'],
                'voice_note_disk' => $meta['disk'],
                'voice_note_original_name' => $meta['name'],
                'voice_note_mime_type' => $meta['mime'],
            ]);
        }
    }

    public static function streamAttachment(LegacyMessage $message, string $type): ?array
    {
        $fields = $type === 'file'
            ? ['path' => $message->file_path, 'disk' => $message->file_disk, 'mime' => $message->file_mime_type, 'name' => $message->file_original_name]
            : ['path' => $message->voice_note_path, 'disk' => $message->voice_note_disk, 'mime' => $message->voice_note_mime_type, 'name' => $message->voice_note_original_name];

        if (! $fields['path']) {
            return null;
        }

        $disk = $fields['disk'] ?: config('filesystems.default');
        $payload = Storage::disk($disk)->get($fields['path']);

        $iv = substr($payload, 0, 12);
        $tag = substr($payload, 12, 16);
        $ciphertext = substr($payload, 28);
        $key = base64_decode(LegacyEncryption::unwrapKey($message->encryption_key_id));
        $plain = openssl_decrypt($ciphertext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);

        if ($plain === false) {
            return null;
        }

        return [
            'contents' => $plain,
            'mime' => $fields['mime'] ?? 'application/octet-stream',
            'name' => $fields['name'] ?? Str::random(8).'.bin',
        ];
    }

    protected static function storeEncrypted(UploadedFile $file, LegacyMessage $message, string $folder): array
    {
        $disk = config('filesystems.default');
        $contents = file_get_contents($file->getRealPath());
        $key = base64_decode(LegacyEncryption::unwrapKey($message->encryption_key_id));
        $iv = random_bytes(12);
        $tag = '';
        $ciphertext = openssl_encrypt($contents, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag, '', 16);

        $path = 'legacy/'.$message->user_id.'/'.$folder.'/'.Str::uuid().'.bin';
        Storage::disk($disk)->put($path, $iv.$tag.$ciphertext);

        return [
            'path' => $path,
            'disk' => $disk,
            'name' => $file->getClientOriginalName(),
            'mime' => $file->getMimeType(),
        ];
    }

    protected static function deleteCurrent(LegacyMessage $message, string $type): void
    {
        $path = $type === 'file' ? $message->file_path : $message->voice_note_path;
        $disk = $type === 'file' ? $message->file_disk : $message->voice_note_disk;
        if ($path) {
            Storage::disk($disk ?: config('filesystems.default'))->delete($path);
        }
    }
}
