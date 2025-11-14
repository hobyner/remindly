<?php

namespace App\Enums;

enum ReminderChannel: string
{
    case WhatsApp = 'whatsapp';
    case Email = 'email';
}
