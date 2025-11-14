<?php

namespace App\Enums;

enum ReminderType: string
{
    case Birthday = 'birthday';
    case Bill = 'bill';
    case Meeting = 'meeting';
    case Promotion = 'promotion';
    case Custom = 'custom';
}
