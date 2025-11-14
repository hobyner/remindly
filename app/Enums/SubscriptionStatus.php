<?php

namespace App\Enums;

enum SubscriptionStatus: string
{
    case Inactive = 'inactive';
    case Active = 'active';
    case PastDue = 'past_due';
    case Cancelled = 'cancelled';
}
