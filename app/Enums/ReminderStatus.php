<?php

namespace App\Enums;

enum ReminderStatus: string
{
    case Draft = 'draft';
    case Scheduled = 'scheduled';
    case Queued = 'queued';
    case Sent = 'sent';
    case Failed = 'failed';
    case Cancelled = 'cancelled';
}
