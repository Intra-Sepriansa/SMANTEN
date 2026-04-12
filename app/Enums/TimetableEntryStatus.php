<?php

namespace App\Enums;

enum TimetableEntryStatus: string
{
    case Scheduled = 'scheduled';
    case Substituted = 'substituted';
    case Cancelled = 'cancelled';
}
