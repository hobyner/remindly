<?php

namespace App\Support;

use App\Models\LegacyMessage;
use Illuminate\Support\Facades\Crypt;

class LegacyEncryption
{
    protected const CIPHER = 'aes-256-gcm';
    protected const IV_LENGTH = 12;
    protected const TAG_LENGTH = 16;

    public static function generateKey(): string
    {
        return base64_encode(random_bytes(32));
    }

    public static function wrapKey(string $key): string
    {
        return Crypt::encryptString($key);
    }

    public static function unwrapKey(string $cipher): string
    {
        return Crypt::decryptString($cipher);
    }

    public static function encryptText(LegacyMessage $message, ?string $plain): ?string
    {
        if ($plain === null || $plain === '') {
            return null;
        }

        $key = base64_decode(self::unwrapKey($message->encryption_key_id));
        $iv = random_bytes(self::IV_LENGTH);
        $tag = '';
        $ciphertext = openssl_encrypt($plain, self::CIPHER, $key, OPENSSL_RAW_DATA, $iv, $tag, '', self::TAG_LENGTH);

        if ($ciphertext === false) {
            throw new \RuntimeException('Unable to encrypt legacy payload.');
        }

        return base64_encode($iv.$tag.$ciphertext);
    }

    public static function decryptText(LegacyMessage $message, ?string $cipher): ?string
    {
        if ($cipher === null || $cipher === '') {
            return null;
        }

        $payload = base64_decode($cipher, true);

        if ($payload === false || strlen($payload) < self::IV_LENGTH + self::TAG_LENGTH) {
            return null;
        }

        $iv = substr($payload, 0, self::IV_LENGTH);
        $tag = substr($payload, self::IV_LENGTH, self::TAG_LENGTH);
        $ciphertext = substr($payload, self::IV_LENGTH + self::TAG_LENGTH);

        $key = base64_decode(self::unwrapKey($message->encryption_key_id));
        $plain = openssl_decrypt($ciphertext, self::CIPHER, $key, OPENSSL_RAW_DATA, $iv, $tag);

        return $plain === false ? null : $plain;
    }
}
